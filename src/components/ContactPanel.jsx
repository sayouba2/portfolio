import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useL } from "../i18n.jsx"
import { site, ui } from "../data/content.js"
import { useOverlay } from "./Modal.jsx"
import ContactForm from "./ContactForm.jsx"
import { SocialLinks } from "./SocialLinks.jsx"
import "./contact-panel.css"

// Durée de la sortie animée (contact-panel.css) : les volets repartent à 0,93 s pour 1 s.
const CLOSE_MS = 1950
const TOASTS = {
    success: [ui.form.sentTitle, ui.form.success],
    error: [ui.form.failTitle, ui.form.error],
    invalid: [ui.form.invalidTitle, ui.form.invalid],
}
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export default function ContactPanel({ onClose }) {
    const L = useL()
    const closeRef = useRef(null)
    const closingRef = useRef(false)
    const timers = useRef([])
    const [closing, setClosing] = useState(false)
    const [toast, setToast] = useState(null)

    useEffect(() => () => timers.current.forEach(clearTimeout), [])

    const close = () => {
        if (closingRef.current) return
        closingRef.current = true
        if (reduced()) return onClose()
        setClosing(true)
        timers.current.push(setTimeout(onClose, CLOSE_MS))
    }
    useOverlay(close, closeRef)

    const hideToast = () => reduced() ? setToast(null) : setToast(t => t && { ...t, leaving: true })
    const onStatus = (type) => {
        setToast(type && { type })
        // Comme la référence : le message reste 3 s, puis le panneau se referme.
        if (type === "success") timers.current.push(setTimeout(() => {
            hideToast()
            timers.current.push(setTimeout(close, 400))
        }, 3000))
    }

    return createPortal(<div className={closing ? "contact-overlay is-closing" : "contact-overlay"} role="dialog" aria-modal="true" aria-labelledby="contact-panel-title" onClick={close}>
        <div className="contact-panel" onClick={e => e.stopPropagation()}>
            <button type="button" className="panel-close" ref={closeRef} onClick={close} aria-label={L({ fr: "Fermer le formulaire", en: "Close form" })}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
            <div className="contact-panel-form">
                <h2 id="contact-panel-title" className="contact-title"><span>{L({ fr: "PARLONS", en: "GET IN" })}</span> <span>{L({ fr: "Ensemble", en: "Touch" })}</span></h2>
                <ContactForm onStatus={onStatus} />
            </div>
            <div className="contact-panel-aside">
                <span className="contact-signature" aria-hidden="true">Sayouba</span>
                <div className="contact-reach">
                    <SocialLinks />
                    <div className="contact-reach-text">
                        <p>{L({ fr: "Vous pouvez aussi me joindre à", en: "You can also contact me at" })}</p>
                        <a className="contact-email" href={`mailto:${site.email}`}>{site.email}</a>
                        <a className="contact-phone" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
                    </div>
                </div>
            </div>
        </div>
        {toast && <div className="contact-toast" onClick={e => e.stopPropagation()}>
            <div className={toast.leaving ? "contact-toast-card is-leaving" : "contact-toast-card"} role={toast.type === "success" ? "status" : "alert"} onAnimationEnd={() => toast.leaving && setToast(null)}>
                <div>
                    <h3 className={toast.type === "success" ? undefined : "is-error"}>{L(TOASTS[toast.type][0])}</h3>
                    <p>{L(TOASTS[toast.type][1])}</p>
                </div>
                <button type="button" onClick={hideToast} aria-label={L({ fr: "Masquer le message", en: "Dismiss message" })}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>}
    </div>, document.body)
}
