import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLang, useL } from "../i18n.jsx"
import { site, ui, asset } from "../data/content.js"

const LINKS = [
    { id: "competences", label: ui.nav.skills },
    { id: "experience", label: ui.nav.experience },
    { id: "projets", label: ui.nav.projects },
    { id: "parcours", label: ui.nav.journey },
    { id: "contact", label: ui.nav.contact },
]

// Barre de lecture au motif tissé : révèle la bande au fil du défilement.
function ScrollProgress() {
    const ref = useRef(null)

    useEffect(() => {
        let raf = 0
        const update = () => {
            raf = 0
            const doc = document.documentElement
            const max = doc.scrollHeight - window.innerHeight
            const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
            if (ref.current) ref.current.style.clipPath = `inset(0 ${100 - p * 100}% 0 0)`
        }
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [])

    return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}

export default function Nav() {
    const L = useL()
    const { lang, setLang } = useLang()
    const { pathname } = useLocation()
    const [active, setActive] = useState("")
    const [open, setOpen] = useState(false)
    const onHome = pathname === "/"

    // Scroll-spy : met en évidence le lien de la section visible.
    useEffect(() => {
        if (!onHome) {
            setActive("")
            return
        }
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id)
                }
            },
            { rootMargin: "-40% 0px -55% 0px" }
        )
        LINKS.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [onHome])

    useEffect(() => setOpen(false), [pathname])

    return (
        <header className="nav">
            <ScrollProgress />
            <div className="nav-inner">
                <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
                    <span className="bracket">&lt;</span>
                    <span className="script">Sayouba</span>
                    <span className="bracket">/&gt;</span>
                </Link>

                <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Navigation principale">
                    {LINKS.map(({ id, label }) => (
                        <a
                            key={id}
                            href={`/#${id}`}
                            className={active === id ? "active" : ""}
                            onClick={(e) => {
                                setOpen(false)
                                if (onHome) {
                                    e.preventDefault()
                                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                                    history.replaceState(null, "", `#${id}`)
                                }
                            }}
                        >
                            {L(label)}
                        </a>
                    ))}
                </nav>

                <div className="nav-actions">
                    <button
                        className="lang-toggle"
                        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                        aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
                    >
                        {lang === "fr" ? "EN" : "FR"}
                    </button>
                    <a className="nav-cv" href={asset(site.cvUrl)} target="_blank" rel="noreferrer">
                        {L(ui.nav.cv)}
                    </a>
                    <button
                        className={`nav-burger ${open ? "open" : ""}`}
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        aria-expanded={open}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>
        </header>
    )
}
