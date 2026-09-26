import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { LanguageProvider } from "./i18n.jsx"
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
    return <main id="main" key={pathname} className="page-enter">{children}</main>
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

    useEffect(() => {
        if (hash) {
            const el = document.querySelector(hash)
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" })
                return
            }
        }
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [pathname, hash])

    return null
}

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <ScrollManager />
                <ViewportVars />
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
