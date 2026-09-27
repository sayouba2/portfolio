import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LiquidGlass } from "@liquidglassjs/react"
import { useLang, useL } from "../i18n.jsx"
import { site, ui, asset } from "../data/content.js"

const LINKS = [
    { id: "projets", label: ui.nav.projects },
    { id: "parcours", label: ui.nav.journey },
    { id: "hackathons", label: ui.competitions.title },
    { id: "contact", label: ui.nav.contact },
]

/** Une pastille de vrai verre : elle réfracte la page qui défile dessous. */
export default function Nav() {
    const L = useL()
    const { lang, setLang } = useLang()
    const { pathname } = useLocation()
    const onHome = pathname === "/"
    const [scrolled, setScrolled] = useState(false)
    const [activeSection, setActiveSection] = useState(null)

    // La progression reste une variable CSS pour ne pas provoquer un rendu
    // React à chaque pixel parcouru. Le même passage mesure aussi l'état
    // compact de la navigation et est limité à une fois par image.
    useEffect(() => {
        const root = document.documentElement
        let frame = 0

        const update = () => {
            frame = 0
            const y = Math.max(0, window.scrollY)
            const available = root.scrollHeight - window.innerHeight
            const progress = available > 0 ? Math.min(1, y / available) : 0
            root.style.setProperty("--page-progress", progress.toFixed(4))
            setScrolled(y > 24)
        }
        const requestUpdate = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }

        update()
        window.addEventListener("scroll", requestUpdate, { passive: true })
        window.addEventListener("resize", requestUpdate)
        const resizeObserver = new ResizeObserver(requestUpdate)
        resizeObserver.observe(document.body)

        return () => {
            window.removeEventListener("scroll", requestUpdate)
            window.removeEventListener("resize", requestUpdate)
            resizeObserver.disconnect()
            cancelAnimationFrame(frame)
            root.style.removeProperty("--page-progress")
        }
    }, [])

    // Une fine bande dans le premier tiers de l'écran désigne la section en
    // cours. IntersectionObserver évite de recalculer tous les rectangles à
    // chaque scroll et fonctionne aussi avec les sections très longues.
    useEffect(() => {
        if (!onHome) {
            setActiveSection(null)
            return undefined
        }

        const sections = LINKS.map(({ id }) => document.getElementById(id)).filter(Boolean)
        const visible = new Set()
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target.id)
                else visible.delete(entry.target.id)
            })

            const current = LINKS.find(({ id }) => visible.has(id))
            setActiveSection(current?.id ?? null)
        }, { rootMargin: "-22% 0px -68% 0px", threshold: 0 })

        sections.forEach((section) => observer.observe(section))
        return () => observer.disconnect()
    }, [onHome])

    // Sur l'accueil, on défile jusqu'à la section sans repasser par le routeur ;
    // ailleurs, le lien ramène à l'accueil et ScrollManager fait le reste.
    const scrollTo = (id) => (e) => {
        if (!onHome) return
        e.preventDefault()
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        if (id) {
            document.getElementById(id)?.scrollIntoView({ behavior })
            window.history.replaceState(null, "", `#${id}`)
            setActiveSection(id)
        } else {
            window.scrollTo({ top: 0, behavior })
            window.history.replaceState(null, "", import.meta.env.BASE_URL)
            setActiveSection(null)
        }
    }

    const sectionLinks = (className, withLabel = false) => LINKS.map(({ id, label }) => {
        const active = activeSection === id
        return (
            <Link
                key={id}
                to={`/#${id}`}
                className={`${className}${active ? " active" : ""}`}
                onClick={scrollTo(id)}
                aria-current={active ? "location" : undefined}
                data-section={id}
            >
                {withLabel && <i aria-hidden="true" />}
                <span>{L(label)}</span>
            </Link>
        )
    })

    return (
        <>
            <LiquidGlass
                className={`nav${scrolled ? " scrolled" : ""}`}
                data-scrolled={scrolled ? "true" : undefined}
                radius={999}
                profile="circle"
                strength={14}
                chroma={0.25}
                behind="#main"
            >
                {/* Liquid Glass empile ses couches (surface, teinte, liseré) en
                    position absolue : le contenu doit vivre dans ps-glass__content,
                    sinon il est peint dessous. */}
                <div className="ps-glass__content nav-inner">
                    <Link to="/" className="nav-brand" onClick={scrollTo(null)} aria-label={L(ui.nav.home)}>S<span>·</span>O</Link>
                    <nav className="nav-links" aria-label={L(ui.nav.sections)}>
                        {sectionLinks("nav-link")}
                    </nav>
                    <button
                        className="nav-lang"
                        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                        aria-label={lang === "fr" ? "Switch to English" : "Passer en français"}
                    >
                        {lang === "fr" ? "EN" : "FR"}
                    </button>
                    <a className="nav-cv" href={asset(L(site.cvUrl))} target="_blank" rel="noreferrer">{L(ui.nav.cv)}</a>
                </div>
            </LiquidGlass>

            <nav
                className="nav-dock"
                aria-label={lang === "fr" ? "Navigation mobile" : "Mobile navigation"}
                aria-hidden={!scrolled}
            >
                {sectionLinks("nav-dock-link", true)}
            </nav>
        </>
    )
}
