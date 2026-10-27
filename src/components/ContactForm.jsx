import { useState } from "react"
import emailjs from "@emailjs/browser"
import { useL } from "../i18n.jsx"
import { ui, emailJs } from "../data/content.js"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMPTY = { name: "", email: "", message: "" }

const isValid = (values, consent) => values.name.trim() && values.message.trim() && EMAIL_RE.test(values.email) && consent

/** Formulaire du panneau de contact ; signale invalid | success | error via onStatus. */
export default function ContactForm({ onStatus }) {
    const L = useL()
    const [fields, setFields] = useState(EMPTY)
    const [consent, setConsent] = useState(false)
    const [invalid, setInvalid] = useState(false)
    const [sending, setSending] = useState(false)

    const set = (key) => (e) => {
        const next = { ...fields, [key]: e.target.value }
        setFields(next)
        if (invalid && isValid(next, consent)) setInvalid(false)
    }

    const fieldInvalid = {
        name: invalid && !fields.name.trim(),
        email: invalid && !EMAIL_RE.test(fields.email),
        message: invalid && !fields.message.trim(),
        consent: invalid && !consent,
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const { name, email, message } = fields
        if (!isValid(fields, consent)) {
            setInvalid(true)
            onStatus("invalid")
            return
        }
        setSending(true)
        onStatus(null)
        try {
            emailjs.init(emailJs.publicKey)
            // Mêmes noms de variables que le template EmailJS existant
            const result = await emailjs.send(emailJs.serviceId, emailJs.templateId, {
                name,
                from_name: name,
                email,
                from_email: email,
                custom_subject: L(ui.form.subject),
                message,
                custom_source: window.location.href,
                custom_source_name: "Portfolio",
            })
            if (result.status === 200) {
                setFields(EMPTY)
                setConsent(false)
                onStatus("success")
            } else {
                onStatus("error")
            }
        } catch {
            onStatus("error")
        } finally {
            setSending(false)
        }
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
                <div className="cf-field">
                    <input id="cf-name" type="text" placeholder=" " value={fields.name} onChange={set("name")} disabled={sending} required aria-invalid={fieldInvalid.name} />
                    <label htmlFor="cf-name">{L(ui.form.name)}</label>
                </div>
                <div className="cf-field">
                    <input id="cf-email" type="email" placeholder=" " value={fields.email} onChange={set("email")} disabled={sending} required aria-invalid={fieldInvalid.email} />
                    <label htmlFor="cf-email">{L(ui.form.email)}</label>
                </div>
            </div>
            <div className="cf-field">
                <textarea id="cf-message" placeholder=" " rows="5" value={fields.message} onChange={set("message")} disabled={sending} required aria-invalid={fieldInvalid.message} />
                <label htmlFor="cf-message">{L(ui.form.message)}</label>
            </div>
            <label className="contact-consent">
                <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); if (invalid && isValid(fields, e.target.checked)) setInvalid(false) }} required aria-invalid={fieldInvalid.consent} />
                <span className="consent-box" aria-hidden="true" />
                <span>{L(ui.form.consent)} *</span>
            </label>
            <div className="contact-submit">
                <button type="submit" disabled={sending}>{sending ? L(ui.form.sending) : L(ui.form.send)}</button>
            </div>
        </form>
    )
}
