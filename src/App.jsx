import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { LanguageProvider } from "./i18n.jsx"
import Cloth from "./components/Cloth.jsx"
import Dock from "./components/Dock.jsx"
import Nav from "./components/Nav.jsx"
import Footer from "./components/Footer.jsx"
import Home from "./pages/Home.jsx"
import ProjectPage from "./pages/ProjectPage.jsx"

// Fait défiler vers l'ancre (#section) sur la home, sinon remonte en haut à chaque navigation.
// Le key sur <main> relance l'animation d'entrée à chaque changement de page.
function PageShell({ children }) {
    const { pathname } = useLocation()
    return <main key={pathname} className="page-enter">{children}</main>
}

/**
 * Publie dans --vw la largeur réellement disponible (barre de défilement exclue).
 * Un élément `fixed` centré par `left: 50%` se cale sur le viewport barre
 * comprise, alors que .container se centre sans elle : la nav et le dock
 * ressortaient décalés d'une demi-barre. On les centre donc sur --vw.
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
        window.scrollTo({ top: 0 })
    }, [pathname, hash])

    return null
}

export default function App() {
    return (
        <LanguageProvider>
            <BrowserRouter>
                <ScrollManager />
                <ViewportVars />
                <Cloth />
                <Nav />
                <PageShell>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projets/:slug" element={<ProjectPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </PageShell>
                <Footer />
                <Dock />
            </BrowserRouter>
        </LanguageProvider>
    )
}
