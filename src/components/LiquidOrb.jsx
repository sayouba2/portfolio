import { useEffect, useRef } from "react"
import { useL } from "../i18n.jsx"
import { site } from "../data/content.js"
import "./liquid-orb.css"

// Gouttes en unités où la hauteur du canevas vaut SIZE ; une goutte plus claire tourne au centre ou suit le pointeur.
const BALLS = 10
const SIZE = 18
const SPEED = 0.4
const CLUMP = 0.7
const CURSOR_RADIUS = 2

const VERTEX = `#version 300 es
in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform vec3 u_color;
uniform vec3 u_cursorColor;
uniform vec3 u_balls[${BALLS}];
uniform vec3 u_cursor;
out vec4 outColor;

float ball(vec3 b, vec2 p) {
    vec2 d = p - b.xy;
    return b.z * b.z / max(dot(d, d), 1e-4);
}

void main() {
    vec2 p = (gl_FragCoord.xy - u_resolution * 0.5) * (${SIZE.toFixed(1)} / u_resolution.y);
    float balls = 0.0;
    for (int i = 0; i < ${BALLS}; i++) balls += ball(u_balls[i], p);
    float cursor = ball(u_cursor, p);
    float total = balls + cursor;
    float alpha = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
    alpha *= step(length(gl_FragCoord.xy / u_resolution * 2.0 - 1.0), 0.9);
    vec3 color = (u_color * balls + u_cursorColor * cursor) / max(total, 1e-4);
    // Prémultiplié : hors des gouttes, la couleur ne s'ajoute pas au fond sombre.
    outColor = vec4(color * alpha, alpha);
}`

const random = (n) => {
    const x = Math.sin(n * 12.9898) * 43758.5453
    return x - Math.floor(x)
}
// Chaque goutte suit sa propre boucle : les plus amples vont aussi le plus vite.
const PATHS = Array.from({ length: BALLS }, (_, i) => {
    const spread = random(i + 21)
    return {
        start: random(i + 1) * 2 * Math.PI,
        pace: Math.PI * (0.1 + 0.3 * spread),
        reach: (5 + 5 * spread) * CLUMP,
        twist: Math.floor(2 * random(i + 31)),
        radius: 0.5 + 1.5 * random(i + 41),
    }
})

const channels = (value) => value.match(/[\d.]+/g)?.slice(0, 3).map(v => Number(v) / 255)

/** The animated lava sphere shared by both colour themes. */
export default function LiquidOrb({ className = "" }) {
    const L = useL()
    const rootRef = useRef(null)
    const canvasRef = useRef(null)

    useEffect(() => {
        const root = rootRef.current
        const canvas = canvasRef.current
        let gl
        try {
            gl = canvas.getContext("webgl2", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" })
        } catch {
            return undefined
        }
        if (!gl) return undefined

        const shaders = []
        let program
        let buffer
        const dispose = () => {
            if (buffer) gl.deleteBuffer(buffer)
            if (program) gl.deleteProgram(program)
            shaders.forEach(shader => gl.deleteShader(shader))
        }
        const compile = (type, source) => {
            const shader = gl.createShader(type)
            if (!shader) throw new Error("Shader unavailable")
            shaders.push(shader)
            gl.shaderSource(shader, source)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Shader unavailable")
            return shader
        }

        try {
            program = gl.createProgram()
            if (!program) throw new Error("WebGL program unavailable")
            gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX))
            gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT))
            gl.linkProgram(program)
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("WebGL program unavailable")
            gl.useProgram(program)
            buffer = gl.createBuffer()
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
            const position = gl.getAttribLocation(program, "a_position")
            gl.enableVertexAttribArray(position)
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
        } catch {
            dispose()
            return undefined
        }

        const uniform = (name) => gl.getUniformLocation(program, name)
        const ballsLocation = uniform("u_balls")
        const cursorLocation = uniform("u_cursor")
        const colorLocation = uniform("u_color")
        const cursorColorLocation = uniform("u_cursorColor")
        const resolutionLocation = uniform("u_resolution")
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        const balls = new Float32Array(BALLS * 3)
        const cursor = [0, 0]
        let pointer = null
        let frame = 0
        let visible = true
        let lost = false
        let lastStamp = 0
        let elapsed = 0

        const draw = () => {
            if (lost) return
            PATHS.forEach((path, i) => {
                const s = elapsed * SPEED * path.pace
                balls[i * 3] = Math.cos(path.start + s) * path.reach
                balls[i * 3 + 1] = Math.sin(path.start + s + s * path.twist) * path.reach
                balls[i * 3 + 2] = path.radius
            })
            const target = pointer ?? [Math.cos(elapsed * SPEED) * 0.15 * SIZE, Math.sin(elapsed * SPEED) * 0.15 * SIZE]
            cursor[0] += (target[0] - cursor[0]) * 0.19
            cursor[1] += (target[1] - cursor[1]) * 0.19
            gl.uniform3fv(ballsLocation, balls)
            gl.uniform3f(cursorLocation, cursor[0], cursor[1], CURSOR_RADIUS)
            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }
        const animate = (stamp) => {
            frame = 0
            if (!visible || document.hidden || reducedMotion.matches || lost) return
            if (!lastStamp) lastStamp = stamp
            // Thirty frames per second is ample for these deliberately slow forms.
            if (stamp - lastStamp >= 1000 / 30) {
                elapsed += Math.min(stamp - lastStamp, 100) / 1000
                lastStamp = stamp
                draw()
            }
            frame = requestAnimationFrame(animate)
        }
        const syncAnimation = () => {
            cancelAnimationFrame(frame)
            frame = 0
            lastStamp = 0
            if (!visible || document.hidden || lost) return
            draw()
            if (!reducedMotion.matches) frame = requestAnimationFrame(animate)
        }
        const syncTheme = () => {
            const style = getComputedStyle(canvas)
            const main = channels(style.color) ?? [0.345, 0.902, 0.851]
            const light = channels(style.getPropertyValue("--orb-cursor")) ?? main
            if (!lost) {
                gl.uniform3f(colorLocation, ...main)
                gl.uniform3f(cursorColorLocation, ...light)
            }
            draw()
        }
        const resize = () => {
            const width = root.getBoundingClientRect().width
            const resolution = Math.max(1, Math.min(600, Math.round(width * Math.min(window.devicePixelRatio || 1, 1.5))))
            canvas.width = resolution
            canvas.height = resolution
            gl.viewport(0, 0, resolution, resolution)
            gl.uniform2f(resolutionLocation, resolution, resolution)
            draw()
        }
        const follow = (event) => {
            const box = root.getBoundingClientRect()
            pointer = [((event.clientX - box.left) / box.width - 0.5) * SIZE, (0.5 - (event.clientY - box.top) / box.height) * SIZE]
        }
        const release = () => { pointer = null }
        const contextLost = (event) => {
            event.preventDefault()
            lost = true
            cancelAnimationFrame(frame)
            root.removeAttribute("data-renderer")
        }

        cursor[0] = 0.15 * SIZE
        syncTheme()
        resize()
        root.dataset.renderer = "webgl"
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(root)
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            syncAnimation()
        }, { rootMargin: "60px" })
        intersectionObserver.observe(root)
        const themeObserver = new MutationObserver(syncTheme)
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] })
        themeObserver.observe(document.body, { attributes: true, attributeFilter: ["class", "style", "data-theme"] })
        canvas.addEventListener("webglcontextlost", contextLost)
        root.addEventListener("pointermove", follow)
        root.addEventListener("pointerleave", release)
        document.addEventListener("visibilitychange", syncAnimation)
        reducedMotion.addEventListener("change", syncAnimation)
        syncAnimation()

        return () => {
            cancelAnimationFrame(frame)
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            themeObserver.disconnect()
            canvas.removeEventListener("webglcontextlost", contextLost)
            root.removeEventListener("pointermove", follow)
            root.removeEventListener("pointerleave", release)
            document.removeEventListener("visibilitychange", syncAnimation)
            reducedMotion.removeEventListener("change", syncAnimation)
            root.removeAttribute("data-renderer")
            dispose()
        }
    }, [])

    return (
        <div className={`liquid-orb ${className}`} ref={rootRef}>
            <div className="liquid-orb-fallback" aria-hidden="true"><i /><i /><i /><i /></div>
            <canvas className="liquid-orb-canvas" ref={canvasRef} aria-hidden="true" />
            <div className="liquid-orb-label">
                <span className="liquid-orb-monogram">SO</span>
                <span className="liquid-orb-role">{L(site.role)}</span>
            </div>
        </div>
    )
}
