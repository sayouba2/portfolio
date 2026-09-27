import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useL } from "../i18n.jsx"
import { ui, asset } from "../data/content.js"
import { useOverlay } from "./Modal.jsx"

const MAX_TILT = 1.4

function useReducedMotion() {
    const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)

    useEffect(() => {
        const media = window.matchMedia("(prefers-reduced-motion: reduce)")
        const update = () => setReduced(media.matches)
        update()
        if (media.addEventListener) media.addEventListener("change", update)
        else media.addListener(update)
        return () => {
            if (media.removeEventListener) media.removeEventListener("change", update)
            else media.removeListener(update)
        }
    }, [])

    return reduced
}

/** Une capture dans un cadre de navigateur, à ses proportions exactes — jamais recadrée. */
function Framed({ shot, label, onOpen, priority }) {
    const L = useL()
    const reduced = useReducedMotion()
    const buttonRef = useRef(null)
    const frameRef = useRef(0)
    const pointerRef = useRef({ x: 0, y: 0 })

    const resetTilt = useCallback(() => {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = 0
        const button = buttonRef.current
        button?.style.setProperty("--rx", "0deg")
        button?.style.setProperty("--ry", "0deg")
    }, [])

    useEffect(() => {
        if (reduced) resetTilt()
        return () => cancelAnimationFrame(frameRef.current)
    }, [reduced, resetTilt])

    const onPointerMove = useCallback((e) => {
        if (reduced || e.pointerType === "touch") return
        pointerRef.current = { x: e.clientX, y: e.clientY }

        if (frameRef.current) return
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = 0
            const button = buttonRef.current
            if (!button) return
            const rect = button.getBoundingClientRect()
            const x = ((pointerRef.current.x - rect.left) / rect.width - 0.5) * 2
            const y = ((pointerRef.current.y - rect.top) / rect.height - 0.5) * 2
            const rx = Math.max(-1, Math.min(1, -y)) * MAX_TILT
            const ry = Math.max(-1, Math.min(1, x)) * MAX_TILT
            button.style.setProperty("--rx", `${rx.toFixed(2)}deg`)
            button.style.setProperty("--ry", `${ry.toFixed(2)}deg`)
        })
    }, [reduced])

    return (
        <button
            ref={buttonRef}
            className="sc-frame"
            onClick={onOpen}
            onPointerMove={onPointerMove}
            onPointerLeave={resetTilt}
            onPointerCancel={resetTilt}
            onBlur={resetTilt}
            aria-label={`${L(ui.viewer.enlarge)} — ${label}`}
        >
            <span className="sc-bar" aria-hidden="true">
                <i /><i /><i />
                <span className="sc-url">{label}</span>
            </span>
            <img
                src={asset(shot.page)}
                srcSet={`${asset(shot.page)} 1200w, ${asset(shot.full)} ${shot.w}w`}
                sizes="(max-width: 1180px) 92vw, 1100px"
                width={shot.w}
                height={shot.h}
                alt={label}
                loading={priority ? "eager" : "lazy"}
                fetchPriority={priority ? "high" : "auto"}
                decoding="async"
            />
        </button>
    )
}

/**
 * La visionneuse. Par défaut la capture tient dans l'écran ; « Taille réelle »
 * l'affiche pixel pour pixel, dans une zone qu'on fait défiler — c'est la
 * seule façon de lire une interface de 1917 px sur un écran plus petit.
 */
function Lightbox({ shots, index, title, onClose, onMove }) {
    const L = useL()
    const [real, setReal] = useState(false)
    const closeRef = useRef(null)
    const shot = shots[index]
    const name = `${title} — ${L(ui.viewer.shot)} ${index + 1}`

    useOverlay(onClose, closeRef)
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") onMove(-1)
            if (e.key === "ArrowRight") onMove(1)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onMove])

    return createPortal(
        <div className="sc-lb" role="dialog" aria-modal="true" aria-label={name}>
            <div className="sc-lb-top">
                <span className="sc-lb-count" aria-live="polite" aria-atomic="true">{title} · {index + 1} / {shots.length} · {shot.w}×{shot.h}</span>
                <button className={`sc-lb-toggle ${real ? "on" : ""}`} onClick={() => setReal((v) => !v)} aria-pressed={real}>
                    {real ? L(ui.viewer.fit) : L(ui.viewer.actualSize)}
                </button>
                <button ref={closeRef} className="sc-lb-close" onClick={onClose} aria-label={L(ui.viewer.close)}>✕</button>
            </div>
            <div className={`sc-lb-stage ${real ? "real" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
                <img src={asset(shot.full)} width={shot.w} height={shot.h} alt={name} />
            </div>
            {shots.length > 1 && (
                <>
                    <button className="sc-lb-arrow prev" onClick={() => onMove(-1)} aria-label={L(ui.viewer.prev)}>‹</button>
                    <button className="sc-lb-arrow next" onClick={() => onMove(1)} aria-label={L(ui.viewer.next)}>›</button>
                </>
            )}
        </div>,
        document.body
    )
}

/**
 * Un projet présenté par ses vraies captures : la plus parlante en grand, les
 * autres en bandeau. Aucune n'est recadrée ; toutes s'ouvrent en grand.
 */
export default function Showcase({ title, shots, priority = false }) {
    const L = useL()
    const [open, setOpen] = useState(null)
    const move = useCallback((dir) => setOpen((i) => (i + dir + shots.length) % shots.length), [shots.length])
    const close = useCallback(() => setOpen(null), [])
    if (!shots.length) return null
    const [hero, ...rest] = shots

    return (
        <div className="sc">
            <Framed shot={hero} label={title} onOpen={() => setOpen(0)} priority={priority} />
            {rest.length > 0 && (
                <ul className="sc-strip" aria-label={`${L(ui.viewer.more)} ${title}`}>
                    {rest.map((s, i) => (
                        <li key={s.n}>
                            <button className="sc-thumb" onClick={() => setOpen(i + 1)} aria-label={`${L(ui.viewer.enlarge)} — ${L(ui.viewer.shot)} ${i + 2}`}>
                                <img src={asset(s.page)} width={s.w} height={s.h} alt="" loading="lazy" decoding="async" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {open !== null && <Lightbox shots={shots} index={open} title={title} onClose={close} onMove={move} />}
        </div>
    )
}
