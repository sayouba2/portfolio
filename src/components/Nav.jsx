import { Link, useLocation } from "react-router-dom"
import { LiquidGlass } from "@liquidglassjs/react"
import { useLang, useL } from "../i18n.jsx"
import { site, ui, asset } from "../data/content.js"

const LINKS = [
    { id: "parcours", label: ui.nav.journey },
    { id: "projets", label: ui.nav.projects },
    { id: "contact", label: ui.nav.contact },
]

/** Une pastille de vrai verre : elle réfracte la page qui défile dessous. */
export default function Nav() {
    const L = useL()
    const { lang, setLang } = useLang()
    const { pathname } = useLocation()
    const onHome = pathname === "/"

    // Sur l'accueil, on défile jusqu'à la section sans repasser par le routeur ;
    // ailleurs, le lien ramène à l'accueil et ScrollManager fait le reste.
    const scrollTo = (id) => (e) => {
        if (!onHome) return
        e.preventDefault()
        if (id) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
            history.replaceState(null, "", `#${id}`)
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" })
            history.replaceState(null, "", import.meta.env.BASE_URL)
        }
    }

    return (
        <LiquidGlass className="nav" radius={999} profile="circle" strength={14} chroma={0.25} behind="#main">
            {/* Liquid Glass empile ses couches (surface, teinte, liseré) en
                position absolue : le contenu doit vivre dans ps-glass__content,
                sinon il est peint dessous. */}
            <div className="ps-glass__content nav-inner">
                <Link to="/" className="nav-brand" onClick={scrollTo(null)} aria-label={L(ui.nav.home)}>S<span>·</span>O</Link>
                <nav className="nav-links" aria-label={L(ui.nav.sections)}>
                    {LINKS.map(({ id, label }) => (
                        <Link key={id} to={`/#${id}`} onClick={scrollTo(id)}>{L(label)}</Link>
                    ))}
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
    )
}
