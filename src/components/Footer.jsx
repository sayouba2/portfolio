import { useL } from "../i18n.jsx"
import { site, ui } from "../data/content.js"

export default function Footer() {
    const L = useL()
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <span className="meta">© 2026 — {L(ui.footer.credit)}</span>
                <div className="footer-links">
                    <a className="meta" href={site.github} target="_blank" rel="noreferrer">GitHub</a>
                    <a className="meta" href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a className="meta" href={`mailto:${site.email}`}>{site.email}</a>
                </div>
            </div>
        </footer>
    )
}
