import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { useL } from "../i18n.jsx"
import { ui } from "../data/content.js"

const FOCUSABLE = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "summary",
    "[contenteditable]:not([contenteditable='false'])",
    "[tabindex]:not([tabindex='-1'])",
].join(",")

const overlayStack = []

function focusableIn(dialog) {
    if (!dialog) return []
    return [...dialog.querySelectorAll(FOCUSABLE)].filter((el) => {
        if (el.closest("[inert]") || el.getAttribute("aria-hidden") === "true") return false
        const style = window.getComputedStyle(el)
        return style.display !== "none" && style.visibility !== "hidden" && el.getClientRects().length > 0
    })
}

function portalRoot(dialog) {
    let root = dialog
    while (root?.parentElement && root.parentElement !== document.body) root = root.parentElement
    return root?.parentElement === document.body ? root : null
}

/**
 * Fermeture à Échap, focus cyclique, arrière-plan rendu inerte, défilement de la
 * page bloqué, focus posé sur Fermer puis rendu à l'élément déclencheur.
 */
export function useOverlay(onClose, closeRef) {
    const onCloseRef = useRef(onClose)

    useEffect(() => {
        onCloseRef.current = onClose
    }, [onClose])

    useEffect(() => {
        const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
        const dialog = closeRef.current?.closest('[role="dialog"]')
        const entry = { dialog }
        overlayStack.push(entry)

        closeRef.current?.focus({ preventScroll: true })

        const topRoot = portalRoot(dialog)
        const canInert = "inert" in HTMLElement.prototype
        const background = topRoot
            ? [...document.body.children]
                .filter((el) => el !== topRoot && el instanceof HTMLElement && !["SCRIPT", "STYLE"].includes(el.tagName))
                .map((el) => ({ el, inert: el.inert, ariaHidden: el.getAttribute("aria-hidden") }))
            : []

        background.forEach(({ el }) => {
            if (canInert) el.inert = true
            else el.setAttribute("aria-hidden", "true")
        })

        const onKey = (e) => {
            if (overlayStack.at(-1) !== entry) return

            if (e.key === "Escape") {
                e.preventDefault()
                onCloseRef.current()
                return
            }

            if (e.key !== "Tab") return
            const focusable = focusableIn(dialog)
            if (!focusable.length) {
                e.preventDefault()
                closeRef.current?.focus({ preventScroll: true })
                return
            }

            const first = focusable[0]
            const last = focusable[focusable.length - 1]
            const active = document.activeElement
            if (e.shiftKey && (active === first || !dialog?.contains(active))) {
                e.preventDefault()
                last.focus()
            } else if (!e.shiftKey && (active === last || !dialog?.contains(active))) {
                e.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", onKey)
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = prev

            const index = overlayStack.indexOf(entry)
            if (index !== -1) overlayStack.splice(index, 1)

            background.forEach(({ el, inert, ariaHidden }) => {
                if (canInert) el.inert = inert
                else if (ariaHidden === null) el.removeAttribute("aria-hidden")
                else el.setAttribute("aria-hidden", ariaHidden)
            })

            if (opener?.isConnected) opener.focus({ preventScroll: true })
        }
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
