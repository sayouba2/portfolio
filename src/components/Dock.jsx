import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { site, ui } from "../data/content.js"

const SECTIONS = ["accueil", "competences", "experience", "projets", "parcours", "contact"]

/**
 * Le dock : la pièce de verre qui suit la lecture.
 * Il annonce la section où l'on se trouve, montre l'avancement,
 * et s'efface quand on descend vite pour laisser voir la page.
 */
export default function Dock() {
    const L = useL()
    const { pathname } = useLocation()
    const onHome = pathname === "/"

    const dockRef = useRef(null)
    const barRef = useRef(null)
    const [section, setSection] = useState("accueil")
    const [swapping, setSwapping] = useState(false)
    // Le libellé visé se calcule au rendu ; `label` est celui affiché en ce moment.
    const target = onHome ? L(ui.dock[section] ?? ui.dock.accueil) : L(site.role)
    const [label, setLabel] = useState(target)

    // Avancement de lecture + effacement au défilement vers le bas.
    useEffect(() => {
        let raf = 0
        let last = window.scrollY
        const update = () => {
            raf = 0
            const doc = document.documentElement
            const max = doc.scrollHeight - window.innerHeight
            const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0
            if (barRef.current) barRef.current.style.width = `${p * 100}%`
            if (dockRef.current) {
                const goingDown = window.scrollY > last + 6
                dockRef.current.style.setProperty("--dy", goingDown ? "130%" : "0")
            }
            last = window.scrollY
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

    // Scroll-spy : quelle section est en train d'être lue.
    useEffect(() => {
        if (!onHome) return
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setSection(entry.target.id)
                }
            },
            { rootMargin: "-45% 0px -50% 0px" }
        )
        SECTIONS.forEach((id) => {
            const el = document.getElementById(id)
            if (el) observer.observe(el)
        })
        return () => observer.disconnect()
    }, [onHome])

    // Le libellé ne change pas d'un coup : il s'efface, puis revient.
    // L'effet compare la cible à l'affiché, sans état intermédiaire : il reste
    // donc juste même quand React le rejoue (mode strict, double invocation).
    useEffect(() => {
        if (target === label) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setLabel(target)
            return
        }
        setSwapping(true)
        const t = setTimeout(() => {
            setLabel(target)
            setSwapping(false)
        }, 260)
        return () => clearTimeout(t)
    }, [target, label])

    return (
        <div className="dock glass" ref={dockRef}>
            <span className={`dock-label ${swapping ? "swap" : ""}`}>{label}</span>
            <span className="dock-sep" aria-hidden="true" />
            <span className="dock-bar" aria-hidden="true"><i ref={barRef} /></span>
            <a
                className="dock-cta"
                href="/#contact"
                onClick={(e) => {
                    if (!onHome) return
                    e.preventDefault()
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }}
            >
                {L(ui.dock.cta)}
            </a>
        </div>
    )
}
