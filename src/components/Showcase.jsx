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
    const stageRef = useRef(null)
    const touchRef = useRef(null)
    const swipedRef = useRef(false)
    const shot = shots[index]
    const name = `${title} — ${L(ui.viewer.shot)} ${index + 1}`

    useOverlay(onClose, closeRef)
    useEffect(() => {
        const onKey = (e) => {
            if (real || (e.key !== "ArrowLeft" && e.key !== "ArrowRight")) return
            e.preventDefault()
            onMove(e.key === "ArrowLeft" ? -1 : 1)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onMove, real])

    useEffect(() => {
        stageRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }, [index, real])

    const onTouchStart = (event) => {
        swipedRef.current = false
        touchRef.current = !real && event.touches.length === 1
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
            : null
    }
    const onTouchEnd = (event) => {
        const start = touchRef.current
        touchRef.current = null
        if (!start || real || !event.changedTouches.length) return
        const dx = event.changedTouches[0].clientX - start.x
        const dy = event.changedTouches[0].clientY - start.y
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            swipedRef.current = true
            if (shots.length > 1) onMove(dx < 0 ? 1 : -1)
        }
    }

    return createPortal(
        <div className="sc-lb" role="dialog" aria-modal="true" aria-label={name}>
            <div className="sc-lb-top">
                <span className="sc-lb-count">{title}</span>
                <button className={`sc-lb-toggle ${real ? "on" : ""}`} onClick={() => setReal((v) => !v)} aria-pressed={real}>
                    {real ? L(ui.viewer.fit) : L(ui.viewer.actualSize)}
                </button>
                <button ref={closeRef} className="sc-lb-close" onClick={onClose} aria-label={L(ui.viewer.close)}>✕</button>
            </div>
            <div
                ref={stageRef}
                className={`sc-lb-stage ${real ? "real" : ""}`}
                onTouchStart={onTouchStart}
                onTouchMove={(event) => { if (event.touches.length !== 1) touchRef.current = null }}
                onTouchEnd={onTouchEnd}
                onTouchCancel={() => { touchRef.current = null }}
                onClick={(event) => {
                    if (swipedRef.current) { swipedRef.current = false; return }
                    if (!real && event.target === event.currentTarget) onClose()
                }}
                tabIndex={real ? 0 : undefined}
                role={real ? "region" : undefined}
                aria-label={real ? L(ui.viewer.pan) : undefined}
            >
                <img key={shot.full} src={asset(shot.full)} width={shot.w} height={shot.h} alt={name} draggable="false" />
            </div>
            <div className="sc-lb-controls">
                {shots.length > 1 && <button className="sc-lb-arrow prev" onClick={() => onMove(-1)} aria-label={L(ui.viewer.prev)}>‹</button>}
                <p className="sc-lb-position" aria-live="polite" aria-atomic="true">
                    <span>{index + 1} / {shots.length}</span>
                    <small>{real ? L(ui.viewer.pan) : L(ui.viewer.swipe)}</small>
                </p>
                {shots.length > 1 && <button className="sc-lb-arrow next" onClick={() => onMove(1)} aria-label={L(ui.viewer.next)}>›</button>}
            </div>
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
