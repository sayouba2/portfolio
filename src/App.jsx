import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"
import { LanguageProvider, useL } from "./i18n.jsx"
import { ui } from "./data/content.js"
import Nav from "./components/Nav.jsx"
import Footer from "./components/Footer.jsx"
import Home from "./pages/Home.jsx"
import ProjectPage from "./pages/ProjectPage.jsx"
import { useScrollReveal } from "./components/useScrollReveal.js"

// Le key sur <main> relance le fondu d'entrée à chaque changement de page.
// L'id sert de décor à la nav en verre (cf. `behind` dans Nav.jsx).
function PageShell({ children }) {
    const { pathname } = useLocation()
    useScrollReveal(pathname)
    return <main id="main" key={pathname} className="page-enter" tabIndex="-1">{children}</main>
}

function SkipLink() {
    const L = useL()
    return <a className="skip-link" href="#main">{L(ui.a11y.skip)}</a>
}

/** Une lumière très discrète suit le pointeur derrière les sections. */
function AmbientBackdrop() {
    useEffect(() => {
        const root = document.documentElement
        const fine = window.matchMedia("(pointer: fine)")
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

        let frame = 0
        let active = false
        let x = window.innerWidth * .5
        let y = window.innerHeight * .3
        const paint = () => {
            frame = 0
            root.style.setProperty("--pointer-x", `${x}px`)
            root.style.setProperty("--pointer-y", `${y}px`)
        }
        const move = (event) => {
            x = event.clientX
            y = event.clientY
            if (!frame) frame = requestAnimationFrame(paint)
        }
        const stop = () => {
            if (!active) return
            active = false
            window.removeEventListener("pointermove", move)
            cancelAnimationFrame(frame)
            frame = 0
            root.style.removeProperty("--pointer-x")
            root.style.removeProperty("--pointer-y")
        }
        const sync = () => {
            stop()
            if (!fine.matches || reduced.matches) return
            active = true
            paint()
            window.addEventListener("pointermove", move, { passive: true })
        }

        sync()
        fine.addEventListener("change", sync)
        reduced.addEventListener("change", sync)
        return () => {
            stop()
            fine.removeEventListener("change", sync)
            reduced.removeEventListener("change", sync)
        }
    }, [])

    return <div className="site-ambient" aria-hidden="true"><i /><i /></div>
}

/**
 * Publie dans --vw la largeur réellement disponible (barre de défilement exclue).
 * Un élément `fixed` centré par `left: 50%` se cale sur le viewport barre
 * comprise, alors que le contenu se centre sans elle : la nav ressortait
 * décalée d'une demi-barre. On la centre donc sur --vw.
 * Le ResizeObserver couvre aussi les cas où la barre apparaît ou disparaît
 * sans qu'aucun redimensionnement de fenêtre ne se produise.
 */
function ViewportVars() {
    useEffect(() => {
        const root = document.documentElement
        const update = () => root.style.setProperty("--vw", `${root.clientWidth}px`)
        update()
        const observer = new ResizeObserver(update)
        observer.observe(root)
        window.addEventListener("resize", update)
        return () => {
            observer.disconnect()
            window.removeEventListener("resize", update)
        }
    }, [])
    return null
}

// Fait défiler vers l'ancre (#section) sur l'accueil, sinon remonte en haut à
// chaque navigation — d'un coup : un défilement animé depuis le bas d'une page
// longue ferait défiler toute la page précédente à l'écran.
function ScrollManager() {
    const { pathname, hash } = useLocation()
    const previousPath = useRef(pathname)

    useEffect(() => {
        const pathChanged = previousPath.current !== pathname
        previousPath.current = pathname

        if (hash) {
            const el = document.querySelector(hash)
            if (el) {
                const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
                el.scrollIntoView({ behavior, block: "start" })
            }
        } else {
            window.scrollTo({ top: 0, behavior: "auto" })
        }

        // Une nouvelle route remplace tout le contenu principal. Le focus suit
        // ce changement sans perturber les simples ancres de la page d'accueil.
        if (pathChanged) {
            requestAnimationFrame(() => document.getElementById("main")?.focus({ preventScroll: true }))
        }
    }, [pathname, hash])

    return null
}

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <ScrollManager />
                <ViewportVars />
                <SkipLink />
                <AmbientBackdrop />
                <Nav />
                <PageShell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projets/:slug" element={<ProjectPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </PageShell>
                <Footer />
            </BrowserRouter>
        </LanguageProvider>
    )
}
