import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { NavLink, Link, useLocation } from "react-router-dom"
import { useLang, useL } from "../i18n.jsx"
import { site } from "../data/content.js"
import { useOverlay } from "./Modal.jsx"
import { SocialLinks } from "./SocialLinks.jsx"

const links = [
    { to: "/", label: { fr: "Accueil", en: "Home" } },
    { to: "/about", label: { fr: "À propos", en: "About" } },
    { to: "/work", label: { fr: "Projets", en: "Work" } },
]

export function Monogram() {
    return <svg viewBox="0 0 56 44" fill="none" aria-hidden="true"><path d="M25 6H10L4 17l19 10-6 11H2M35 6h17v32H28V17L35 6Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="miter" /></svg>
}

function ThemeButton({ theme, onTheme }) {
    const L = useL()
    return <button className="theme-toggle" onClick={onTheme} aria-label={L(theme === "dark" ? { fr: "Activer le thème clair", en: "Switch to light theme" } : { fr: "Activer le thème sombre", en: "Switch to dark theme" })}>
        {theme === "dark" ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.3A8.7 8.7 0 0 1 9.7 3.5a8.8 8.8 0 1 0 10.8 10.8Z"/><path d="m17 2 .6 1.8 1.9.1-1.5 1.2.5 1.9L17 5.9 15.4 7l.5-1.9-1.5-1.2 1.9-.1Z"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4.2 4.2l1.5 1.5m12.6 12.6 1.5 1.5M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5"/></svg>}
    </button>
}

function FullMenu({ onClose, onContact, theme, onTheme }) {
    const L = useL()
    const closeRef = useRef(null)
    useOverlay(onClose, closeRef)
    return createPortal(<div className="full-menu" role="dialog" aria-modal="true" aria-label={L({ fr: "Navigation", en: "Navigation" })}>
        <div className="menu-top"><Link to="/" className="brand" onClick={onClose} aria-label={L({ fr: "Accueil", en: "Home" })}><Monogram /></Link><div className="nav-controls"><ThemeButton theme={theme} onTheme={onTheme} /><button ref={closeRef} className="menu-toggle is-open" aria-label={L({ fr: "Fermer le menu", en: "Close menu" })} onClick={onClose}><span/><span/></button></div></div>
        <nav className="full-menu-links" aria-label={L({ fr: "Navigation principale", en: "Main navigation" })}>
            {links.map(link => <NavLink key={link.to} to={link.to} end onClick={onClose}><span>{L(link.label)}</span><span aria-hidden="true">{L(link.label)}</span></NavLink>)}
            <button onClick={() => { onClose(); onContact() }}><span>Contact</span><span aria-hidden="true">Contact</span></button>
        </nav>
        <div className="menu-bottom"><a href={`mailto:${site.email}`}>{site.email} ↗</a><SocialLinks /></div>
    </div>, document.body)
}

export default function Nav({ theme, onTheme, onContact }) {
    const L = useL()
    const { lang, setLang } = useLang()
    const { pathname } = useLocation()
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 40)
        update()
        window.addEventListener("scroll", update, { passive: true })
        return () => window.removeEventListener("scroll", update)
    }, [])
    return <>
        <header className={`site-header${scrolled ? " is-scrolled" : ""}${pathname === "/about" && !scrolled ? " over-portrait" : ""}`}>
            <Link to="/" className="brand" aria-label={L({ fr: "Accueil — Sayouba Ouedraogo", en: "Home — Sayouba Ouedraogo" })}><Monogram /></Link>
            <nav className="desktop-nav" aria-label={L({ fr: "Navigation principale", en: "Main navigation" })}>
                {links.map(link => <NavLink key={link.to} to={link.to} end>{L(link.label)}</NavLink>)}
                <button onClick={onContact}>Contact</button>
            </nav>
            <div className="nav-controls">
                <button className="language-toggle" onClick={() => setLang(lang === "fr" ? "en" : "fr")} aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}>{lang === "fr" ? "EN" : "FR"}</button>
                <ThemeButton theme={theme} onTheme={onTheme} />
                <button className="menu-toggle" aria-label={L({ fr: "Ouvrir le menu", en: "Open menu" })} aria-expanded={open} onClick={() => setOpen(true)}><span/><span/></button>
            </div>
        </header>
        {open && <FullMenu onClose={() => setOpen(false)} onContact={onContact} theme={theme} onTheme={onTheme} />}
    </>
}
