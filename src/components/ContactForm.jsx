import { useState } from "react"
import emailjs from "@emailjs/browser"
import { useL } from "../i18n.jsx"
import { ui, emailJs } from "../data/content.js"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactForm() {
    const L = useL()
    const [fields, setFields] = useState({ name: "", email: "", subject: "", message: "" })
    const [status, setStatus] = useState("idle") // idle | invalid | sending | success | error

    const set = (key) => (e) => {
        const next = { ...fields, [key]: e.target.value }
        setFields(next)
        if (status === "error" || (status === "invalid" && isValid(next))) setStatus("idle")
    }

    const invalid = status === "invalid"
    const fieldInvalid = {
        name: invalid && !fields.name.trim(),
        email: invalid && !EMAIL_RE.test(fields.email),
        subject: invalid && !fields.subject.trim(),
        message: invalid && !fields.message.trim(),
    }

    function isValid(values) {
        return values.name.trim()
            && values.subject.trim()
            && values.message.trim()
            && EMAIL_RE.test(values.email)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const { name, email, subject, message } = fields
        if (!isValid({ name, email, subject, message })) {
            setStatus("invalid")
            return
        }
        setStatus("sending")
        try {
            emailjs.init(emailJs.publicKey)
            // Mêmes noms de variables que le template EmailJS existant
            const result = await emailjs.send(emailJs.serviceId, emailJs.templateId, {
                name,
                from_name: name,
                email,
                from_email: email,
                custom_subject: subject,
                message,
                custom_source: window.location.href,
                custom_source_name: "Portfolio",
            })
            if (result.status === 200) {
                setStatus("success")
                setFields({ name: "", email: "", subject: "", message: "" })
            } else {
                setStatus("error")
            }
        } catch {
            setStatus("error")
        }
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-row">
                <label>
                    {L(ui.form.name)}
                    <input type="text" value={fields.name} onChange={set("name")} required aria-invalid={fieldInvalid.name} aria-describedby={fieldInvalid.name ? "contact-status" : undefined} />
                </label>
                <label>
                    {L(ui.form.email)}
                    <input type="email" value={fields.email} onChange={set("email")} required aria-invalid={fieldInvalid.email} aria-describedby={fieldInvalid.email ? "contact-status" : undefined} />
                </label>
            </div>
            <label>
                {L(ui.form.subject)}
                <input type="text" value={fields.subject} onChange={set("subject")} required aria-invalid={fieldInvalid.subject} aria-describedby={fieldInvalid.subject ? "contact-status" : undefined} />
            </label>
            <label>
                {L(ui.form.message)}
                <textarea rows="5" value={fields.message} onChange={set("message")} required aria-invalid={fieldInvalid.message} aria-describedby={fieldInvalid.message ? "contact-status" : undefined} />
            </label>

            <div id="contact-status" className="form-status" aria-live="polite" aria-atomic="true">
                {status === "invalid" && <p className="form-note error" role="alert">{L(ui.form.invalid)}</p>}
                {status === "error" && <p className="form-note error" role="alert">{L(ui.form.error)}</p>}
                {status === "success" && <p className="form-note success">{L(ui.form.success)}</p>}
            </div>

            <button type="submit" className="btn" disabled={status === "sending"}>
                {status === "sending" ? L(ui.form.sending) : L(ui.form.send)}
            </button>
        </form>
    )
}
