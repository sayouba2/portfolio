import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { LanguageProvider } from "./i18n.jsx"
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
