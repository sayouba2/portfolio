import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useL } from "../i18n.jsx"
import { ui } from "../data/content.js"

/**
 * Fermeture à Échap, défilement de la page bloqué, focus posé sur le bouton
 * Fermer puis rendu à l'élément qui avait ouvert la couche.
 */
export function useOverlay(onClose, closeRef) {
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = prev
        }
    }, [onClose])

    useEffect(() => {
        const opener = document.activeElement
        closeRef.current?.focus({ preventScroll: true })
        return () => opener?.focus?.({ preventScroll: true })
    }, [closeRef])
}

/**
 * Modale rendue par portail sur <body> — un ancêtre animé ferait sinon de lui
 * le référent de `position: fixed`. Centrée, plafonnée en hauteur, elle grandit
 * depuis le point cliqué.
 */
export default function Modal({ origin, onClose, label, children }) {
    const L = useL()
    const closeRef = useRef(null)
    useOverlay(onClose, closeRef)

    const style = origin ? {
        "--from-x": `${origin.x - window.innerWidth / 2}px`,
        "--from-y": `${origin.y - window.innerHeight / 2}px`,
    } : undefined

    return createPortal(
        <div className="modal" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
            <div className="modal-panel" style={style} onClick={(e) => e.stopPropagation()}>
                <button ref={closeRef} className="modal-close" onClick={onClose} aria-label={L(ui.viewer.close)}>✕</button>
                {children}
            </div>
        </div>,
        document.body
    )
}
