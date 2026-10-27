import { useEffect, useRef } from "react"
import { useL } from "../i18n.jsx"
import { site } from "../data/content.js"
import "./liquid-orb.css"

const VERTEX = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAGMENT = `
precision mediump float;
varying vec2 v_uv;
uniform float u_time;
uniform vec3 u_color;
uniform float u_resolution;

float ball(vec2 p, vec2 center, float radius) {
    vec2 delta = p - center;
    return radius * radius / max(dot(delta, delta), 0.0001);
}

void main() {
    float t = u_time;
    vec2 p = v_uv;
    // A small distortion keeps the edges organic as the droplets merge.
    p += 0.025 * vec2(sin(p.y * 7.0 + t * 1.3), cos(p.x * 6.0 - t));
    float field = 0.0;
    field += ball(p, vec2(-0.35 + 0.17 * sin(t * 0.79), -0.16 + 0.35 * cos(t * 0.63)), 0.245);
    field += ball(p, vec2(-0.19 + 0.26 * cos(t * 0.51 + 1.8), -0.36 + 0.22 * sin(t * 0.91)), 0.235);
    field += ball(p, vec2(0.37 + 0.18 * sin(t * 0.64 + 1.1), 0.34 + 0.23 * cos(t * 0.82)), 0.20);
    field += ball(p, vec2(0.32 + 0.23 * cos(t * 0.89), -0.44 + 0.12 * sin(t * 0.71)), 0.13);
    field += ball(p, vec2(-0.42 + 0.21 * cos(t * 0.72), 0.57 + 0.10 * sin(t * 0.93)), 0.10);

    float edge = 3.0 / u_resolution;
    float mask = smoothstep(1.0 - edge, 1.0 + edge, field);
    mask *= 1.0 - smoothstep(0.98, 1.0, length(v_uv));
    float sheen = 0.04 * sin(p.x * 3.4 + p.y * 1.8 + t * 0.6);
    vec3 color = clamp(u_color + sheen, 0.0, 1.0);
    gl_FragColor = vec4(color, mask);
}`

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
            gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, powerPreference: "low-power" })
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

        const timeLocation = gl.getUniformLocation(program, "u_time")
        const colorLocation = gl.getUniformLocation(program, "u_color")
        const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frame = 0
        let visible = true
        let lost = false
        let lastStamp = 0
        let elapsed = 1.4

        const draw = () => {
            if (lost) return
            gl.uniform1f(timeLocation, elapsed)
            gl.drawArrays(gl.TRIANGLES, 0, 6)
        }
        const animate = (stamp) => {
            frame = 0
            if (!visible || document.hidden || reducedMotion.matches || lost) return
            if (!lastStamp) lastStamp = stamp
            // Thirty frames per second is ample for these deliberately slow forms.
            if (stamp - lastStamp >= 1000 / 30) {
                elapsed += Math.min(stamp - lastStamp, 100) * 0.00045
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
            const channels = getComputedStyle(canvas).color.match(/[\d.]+/g)
            const rgb = channels?.length >= 3 ? channels.slice(0, 3).map(value => Number(value) / 255) : [0.345, 0.902, 0.851]
            if (!lost) gl.uniform3f(colorLocation, ...rgb)
            draw()
        }
        const resize = () => {
            const width = root.getBoundingClientRect().width
            const resolution = Math.max(1, Math.min(600, Math.round(width * Math.min(window.devicePixelRatio || 1, 1.5))))
            canvas.width = resolution
            canvas.height = resolution
            gl.viewport(0, 0, resolution, resolution)
            gl.uniform1f(resolutionLocation, resolution)
            draw()
        }
        const contextLost = (event) => {
            event.preventDefault()
            lost = true
            cancelAnimationFrame(frame)
            root.removeAttribute("data-renderer")
        }

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
        document.addEventListener("visibilitychange", syncAnimation)
        reducedMotion.addEventListener("change", syncAnimation)
        syncAnimation()

        return () => {
            cancelAnimationFrame(frame)
            resizeObserver.disconnect()
            intersectionObserver.disconnect()
            themeObserver.disconnect()
            canvas.removeEventListener("webglcontextlost", contextLost)
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
