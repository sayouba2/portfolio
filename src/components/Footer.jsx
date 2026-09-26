import { useL } from "../i18n.jsx"
import { site, ui } from "../data/content.js"

export default function Footer() {
    const L = useL()
    return (
        <footer className="footer">
            <div className="footer-inner">
                <span>© 2026 — {L(ui.footer.credit)}</span>
                <span className="footer-links">
                    <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
                    <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                </span>
            </div>
        </footer>
    )
}
