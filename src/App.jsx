import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useCallback, useEffect, useState } from "react"
import { LanguageProvider, useL } from "./i18n.jsx"
import { ui } from "./data/content.js"
import Nav from "./components/Nav.jsx"
import Footer from "./components/Footer.jsx"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Work from "./pages/Work.jsx"
import ProjectPage from "./pages/ProjectPage.jsx"
import ContactPanel from "./components/ContactPanel.jsx"
import PortfolioGuide from "./components/PortfolioGuide.jsx"
import Preloader from "./components/Preloader.jsx"
import PageTransition from "./components/PageTransition.jsx"
import { useScrollReveal } from "./components/useScrollReveal.js"

function Portfolio() {
    const L = useL()
    const { pathname, hash } = useLocation()
    const [contact, setContact] = useState(false)
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "dark")
    const openContact = useCallback(() => setContact(true), [])
    const closeContact = useCallback(() => setContact(false), [])
    useScrollReveal(pathname)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.colorScheme = theme
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#f5f5f5")
        try { localStorage.setItem("portfolio-theme", theme) } catch { /* Storage can be disabled. */ }
    }, [theme])

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
            if (target) target.scrollIntoView({ behavior: "instant" })
            else window.scrollTo({ top: 0, behavior: "instant" })
            document.getElementById("main")?.focus({ preventScroll: true })
        })
        return () => cancelAnimationFrame(frame)
    }, [pathname, hash])

    return <>
        <a className="skip-link" href="#main">{L(ui.a11y.skip)}</a>
        <Nav theme={theme} onTheme={() => setTheme(t => t === "dark" ? "light" : "dark")} onContact={openContact} />
        <main id="main" key={pathname} className="page-enter" tabIndex={-1}>
            <Routes>
                <Route path="/" element={<Home onContact={openContact} />} />
                <Route path="/about" element={<About onContact={openContact} />} />
                <Route path="/work" element={<Work />} />
                <Route path="/projets/spheralis" element={<Navigate to="/projets/harmonai" replace />} />
                <Route path="/projets/:slug" element={<ProjectPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </main>
        <Footer onContact={openContact} />
        <PortfolioGuide />
        {contact && <ContactPanel onClose={closeContact} />}
        <Preloader />
        <PageTransition />
    </>
}

export default function App() {
    return <LanguageProvider><BrowserRouter><Portfolio /></BrowserRouter></LanguageProvider>
}
