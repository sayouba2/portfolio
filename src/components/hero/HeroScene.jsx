import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { GLSL_CORE, hexToLinear } from "./shaderCore.js"
import { makeCodeTexture } from "./codeTexture.js"
import { asset } from "../../data/content.js"

// Palette du site : les abysses, une lueur verre-de-mer, une lanterne.
const SEA = { base: "#050B0D", colors: ["#081C1F", "#114743", "#2F8B7C"] }
const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
const CODE_PX = 0.42      // glyphes à l'écran : 26 px de texture × 0,42 ≈ 11 px — un motif, pas un texte à lire

/**
 * Le fond : du code qui affleure dans les abysses. À peine visible partout, il
 * s'allume là où passe le courant du shader.
 */
function CodeAbyss() {
    const viewport = useThree((s) => s.viewport)
    const camera = useThree((s) => s.camera)
    const px = useThree((s) => s.size)
    const size = viewport.getCurrentViewport(camera, [0, 0, -1.6])

    const material = useMemo(() => new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 7.3 },
            uAspect: { value: 1 },
            uCode: { value: null },
            uHasCode: { value: 0 },
            uRepeat: { value: new THREE.Vector2(1, 1) },
            uBase: { value: new THREE.Vector3(...hexToLinear(SEA.base)) },
            uC0: { value: new THREE.Vector3(...hexToLinear(SEA.colors[0])) },
            uC1: { value: new THREE.Vector3(...hexToLinear(SEA.colors[1])) },
            uC2: { value: new THREE.Vector3(...hexToLinear(SEA.colors[2])) },
            uScale: { value: 0.62 },
            uWarp: { value: 1.35 },
            uOctaves: { value: 3 },
            uSpeed: { value: 0.5 },
            uAmount: { value: 0.72 },
        },
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: /* glsl */ `
            uniform float uTime;
            uniform float uAspect;
            uniform sampler2D uCode;
            uniform float uHasCode;
            uniform vec2 uRepeat;
            varying vec2 vUv;
            ${GLSL_CORE}
            void main() {
                vec2 uv = vUv * 2.0 - 1.0;
                uv.x *= uAspect;
                if (uAspect < 1.0) uv /= uAspect;

                // Un seul calcul du champ, partagé par le fond et par la lueur du code.
                vec2 q, r;
                float f = warpedFbm(uv * uScale, uTime * uSpeed, uWarp, uOctaves, q, r);
                float v = f + 0.15 * length(q);
                vec3 tint = customPalette(v + 0.08 * length(r), uC0, uC1, uC2);
                // La base domine ; la couleur ne perce que là où le flux est fort.
                vec3 back = mix(uBase, tint, pow(smoothstep(0.12, 0.85, v), 1.7) * uAmount);
                // Vignette bornée : non bornée, les coins d'un cadre large virent au noir.
                float vig = clamp(1.0 - 0.3 * dot(uv, uv), 0.35, 1.0);

                // Le code défile lentement vers le haut, comme un journal qui s'écrit.
                vec4 code = texture2D(uCode, vec2(vUv.x * uRepeat.x, vUv.y * uRepeat.y - uTime * 0.004)) * uHasCode;
                float glow = pow(smoothstep(0.3, 0.86, v), 1.9);
                vec3 col = (back + code.rgb * code.a * (0.035 + 0.62 * glow)) * vig;

                gl_FragColor = vec4(col, 1.0);
                #include <tonemapping_fragment>
                #include <colorspace_fragment>
            }`,
    }), [])

    useEffect(() => {
        let alive = true
        makeCodeTexture().then((t) => {
            if (!alive) { t.dispose(); return }
            material.uniforms.uCode.value = t
            material.uniforms.uHasCode.value = 1
        })
        return () => { alive = false; material.uniforms.uCode.value?.dispose(); material.dispose() }
    }, [material])

    useFrame((_, delta) => {
        const u = material.uniforms
        u.uAspect.value = size.width / size.height
        // Répétition calculée en pixels : les glyphes gardent la même taille à l'écran.
        u.uRepeat.value.set(px.width / (2048 * CODE_PX), px.height / (2048 * CODE_PX))
        if (!REDUCED) u.uTime.value = (u.uTime.value + Math.min(delta, 1 / 30)) % 3600
    })

    return (
        <mesh position={[0, 0, -1.6]} scale={[size.width * 1.02, size.height * 1.02, 1]}>
            <planeGeometry args={[1, 1]} />
            <primitive object={material} attach="material" />
        </mesh>
    )
}

// Repères de mise en page, en pixels CSS sauf mention contraire.
const COPY_GAP = 14             // entre le bas du nom et le texte d'accroche
const NAV_BOTTOM = 66           // bas de la pastille de nav (top 16 + 50)
const NAME_TOP_GAP = 18         // sur téléphone, entre la nav et le haut de SAYOUBA
const CHIN_GAP = 16             // entre le menton et le haut de OUEDRAOGO
const HAIR_OVERLAP = 0.35       // part de la hauteur des lettres de SAYOUBA cachée par les cheveux
const PHOTO_Z = -0.4            // profondeur du portrait dans la scène
// Capitales dans la texture d'une ligne du nom (2400 × 600, cf. NamePlate).
const GLYPH = { top: 157 / 600, height: 403 / 600 }
// Dans portrait.webp, en fraction de la hauteur depuis le haut : le sommet de
// la tête et le menton. Mesurés sur l'image ; à revoir si elle change.
const FACE = { head: 0.025, chin: 0.295 }

/** Un rectangle posé en pixels (depuis le coin haut gauche), converti en unités de scène. */
function place(view, H, left, top, w, h) {
    const k = view.height / H
    return { w: w * k, h: h * k, x: -view.width / 2 + (left + w / 2) * k, y: view.height / 2 - (top + h / 2) * k }
}

/**
 * Où poser les deux lignes du nom et le portrait, en unités de scène.
 * `copyTop` est le haut du texte d'accroche, mesuré dans la page (cf. Home.jsx) :
 * sa hauteur varie avec la langue, la largeur et la hauteur visible de l'écran.
 * `photoView` est la taille de la vue à la profondeur du portrait.
 */
function heroLayout(viewport, photoView, size, copyTop, aspect = 1) {
    const W = size.width
    const H = size.height
    const floor = (copyTop ?? H - 318) - COPY_GAP

    // Chaque ligne est une texture 4:1 ; les deux ensemble ne dépassent jamais 92 % de la largeur.
    let nameH = Math.max(150, H * 0.87 - 300)
    if (W >= H) nameH = Math.max(150, Math.min(nameH, floor - H * 0.13))
    nameH = Math.min(nameH, W * 0.46)
    const lineH = nameH / 2
    const lineW = nameH * 2
    const left = W * 0.04

    // Écran large : le nom en haut à gauche, le portrait à droite, ancré en bas.
    if (W >= H) {
        const top = H * 0.13
        const h = viewport.height * 0.95
        const w = h * aspect
        return {
            back: place(viewport, H, left, top, lineW, lineH),
            front: place(viewport, H, left, top + lineH, lineW, lineH),
            photo: { w, h, x: viewport.width / 2 - w / 2 - viewport.width * 0.03, y: -viewport.height / 2 + h / 2 },
        }
    }

    // Téléphone : une couverture de magazine. SAYOUBA en haut, derrière le
    // sommet de la tête ; le visage dessous ; OUEDRAOGO devant le buste, juste
    // au-dessus du texte d'accroche.
    const capsH = GLYPH.height * lineH
    const frontTop = floor - lineH
    const chinY = frontTop + GLYPH.top * lineH - CHIN_GAP
    const headTarget = NAV_BOTTOM + NAME_TOP_GAP + capsH * (1 - HAIR_OVERLAP)
    const pH = Math.min(H * 0.85, Math.max(H * 0.45, (chinY - headTarget) / (FACE.chin - FACE.head)))
    const pTop = chinY - FACE.chin * pH
    // Si le portrait a dû être borné, SAYOUBA suit la tête plutôt que la nav.
    const backCapsTop = pTop + FACE.head * pH - capsH * (1 - HAIR_OVERLAP)
    const k = photoView.height / H
    return {
        back: place(viewport, H, left, backCapsTop - GLYPH.top * lineH, lineW, lineH),
        front: place(viewport, H, left, frontTop, lineW, lineH),
        photo: { w: pH * aspect * k, h: pH * k, x: W * 0.08 * k, y: photoView.height / 2 - (pTop + pH / 2) * k },
    }
}

function useHeroLayout(copyTop, aspect) {
    const viewport = useThree((s) => s.viewport)
    const camera = useThree((s) => s.camera)
    const size = useThree((s) => s.size)
    const photoView = viewport.getCurrentViewport(camera, [0, 0, PHOTO_Z])
    return heroLayout(viewport, photoView, size, copyTop, aspect)
}

// Ordre de dessin : SAYOUBA, puis le portrait, puis OUEDRAOGO. Aucun des trois
// n'écrit dans le tampon de profondeur, donc c'est cet ordre seul qui décide
// de ce qui passe devant.
const ORDER = { back: 1, photo: 2, front: 3 }

/**
 * Le nom, une texture par ligne : SAYOUBA passe derrière le portrait,
 * OUEDRAOGO devant.
 */
function NamePlate({ lines, copyTop }) {
    const [textures, setTextures] = useState(null)
    const { back, front } = useHeroLayout(copyTop)

    useEffect(() => {
        let alive = true
        let made = []
        document.fonts.load('900 300px "Big Shoulders Display"').then(() => {
            if (!alive) return
            // Lignes de base d'origine (560 et 1130 sur une texture de 1200 px de haut).
            made = lines.map((line, i) => {
                const c = document.createElement("canvas")
                c.width = 2400
                c.height = 600
                const g = c.getContext("2d")
                g.fillStyle = "#E6EFEC"
                g.font = '900 560px "Big Shoulders Display", Impact, sans-serif'
                g.fillText(line.toUpperCase(), 40, i === 0 ? 560 : 530)
                const t = new THREE.CanvasTexture(c)
                t.colorSpace = THREE.SRGBColorSpace
                t.anisotropy = 8
                return t
            })
            setTextures(made)
        })
        return () => { alive = false; made.forEach((t) => t.dispose()) }
    }, [lines])

    if (!textures) return null
    return [back, front].map((r, i) => (
        <mesh key={i} position={[r.x, r.y, 0]} renderOrder={i === 0 ? ORDER.back : ORDER.front}>
            <planeGeometry args={[r.w, r.h]} />
            <meshBasicMaterial map={textures[i]} transparent depthWrite={false} toneMapped={false} />
        </mesh>
    ))
}

/**
 * Le portrait détouré, étalonné pour la scène : ombres un peu refroidies vers
 * la palette, un liseré de lumière verre-de-mer sur les contours, et un fondu
 * vers le bas pour que le buste se perde dans les abysses au lieu d'être coupé.
 */
function Portrait({ src, copyTop }) {
    const [tex, setTex] = useState(null)
    const { photo } = useHeroLayout(copyTop, tex ? tex.image.width / tex.image.height : 1)

    useEffect(() => {
        let alive = true
        let loaded = null
        new THREE.TextureLoader().load(src, (t) => {
            if (!alive) { t.dispose(); return }
            t.colorSpace = THREE.SRGBColorSpace
            t.anisotropy = 8
            loaded = t
            setTex(t)
        })
        return () => { alive = false; loaded?.dispose() }
    }, [src])

    const material = useMemo(() => tex && new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
            uMap: { value: tex },
            uTexel: { value: new THREE.Vector2(1 / tex.image.width, 1 / tex.image.height) },
            uRim: { value: new THREE.Color("#86E3CE") },
        },
        vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
            uniform sampler2D uMap;
            uniform vec2 uTexel;
            uniform vec3 uRim;
            varying vec2 vUv;
            void main() {
                vec4 c = texture2D(uMap, vUv);
                // Liseré : là où l'alpha chute juste à côté, la lumière rase le contour.
                float around = 0.0;
                for (int i = 0; i < 8; i++) {
                    float a = float(i) * 0.7853981;
                    around += texture2D(uMap, vUv + vec2(cos(a), sin(a)) * uTexel * 6.0).a;
                }
                float rim = clamp(c.a - around / 8.0, 0.0, 1.0);
                // Étalonnage : ombres refroidies, saturation légèrement retenue.
                float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
                vec3 graded = mix(c.rgb, c.rgb * vec3(0.9, 1.0, 1.05), smoothstep(0.55, 0.0, l));
                // Le polo jaune pâle tirait l'œil : saturation et luminosité un cran en dessous.
                graded = mix(vec3(l), graded, 0.8) * 0.9;
                vec3 col = graded + uRim * rim * 1.4;
                // Fondu vers le bas : le buste se perd dans les abysses.
                float fade = smoothstep(0.0, 0.32, vUv.y);
                gl_FragColor = vec4(col, c.a * fade);
                #include <colorspace_fragment>
            }`,
    }), [tex])
    useEffect(() => () => material?.dispose(), [material])

    if (!tex || !material) return null
    return (
        <mesh position={[photo.x, photo.y, PHOTO_Z]} renderOrder={ORDER.photo}>
            <planeGeometry args={[photo.w, photo.h]} />
            <primitive object={material} attach="material" />
        </mesh>
    )
}

/**
 * L'ouverture du site, « sous la surface » : du code qui affleure dans les
 * abysses, le portrait, et le nom en deux plans — SAYOUBA derrière, OUEDRAOGO devant.
 */
export default function HeroScene({ name, portraitSrc, copyTop }) {
    const wrap = useRef(null)
    const [on, setOn] = useState(true)
    const lines = useMemo(() => {
        const [first, ...rest] = name.split(" ")
        return [first, rest.join(" ")]
    }, [name])

    // Hors écran, la scène s'arrête : inutile d'animer le fond pour personne.
    useEffect(() => {
        const el = wrap.current
        if (!el) return
        const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "100px" })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <div className="hero-canvas" ref={wrap} aria-hidden="true">
            <Canvas
                flat
                frameloop={on ? "always" : "never"}
                dpr={[1, 2]}
                camera={{ position: [0, 0, 6], fov: 35 }}
                gl={{ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: import.meta.env.DEV }}
            >
                <color attach="background" args={[SEA.base]} />
                <CodeAbyss />
                {portraitSrc && <Portrait src={asset(portraitSrc)} copyTop={copyTop} />}
                <NamePlate lines={lines} copyTop={copyTop} />
            </Canvas>
        </div>
    )
}
