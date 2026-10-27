import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./page-transition.css"

const COVER_MS = 650
const REVEAL_MS = 1200

/**
 * Entre deux pages : un volet couleur d'accent balaie l'écran, la page change
 * dessous, puis trois volets (accent, sombre, clair) se retirent vers la gauche.
 * Intercepte tous les liens internes du site, en phase de capture : le Link de
 * React Router voit le clic déjà « empêché » et laisse faire.
 */
export default function PageTransition() {
    const navigate = useNavigate()
    const [phase, setPhase] = useState(null)
    // navigate change d'identité à chaque changement de page : sans cette ref,
    // l'effet se relancerait en pleine transition et annulerait ses minuteurs.
    const navigateRef = useRef(navigate)
    useEffect(() => { navigateRef.current = navigate }, [navigate])

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        const timers = []
        const onClick = (event) => {
            const link = event.target.closest?.("a[href]")
            if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
            if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return
            const url = new URL(link.href)
            if (url.origin !== window.location.origin || url.pathname === window.location.pathname || reduced.matches) return
            event.preventDefault()
            if (timers.length) return
            setPhase("cover")
            timers.push(setTimeout(() => { navigateRef.current(url.pathname + url.search + url.hash); setPhase("reveal") }, COVER_MS))
            timers.push(setTimeout(() => { setPhase(null); timers.length = 0 }, COVER_MS + REVEAL_MS))
        }
        document.addEventListener("click", onClick, true)
        return () => {
            document.removeEventListener("click", onClick, true)
            timers.forEach(clearTimeout)
        }
    }, [])

    if (!phase) return null
    return <div className="page-transition" aria-hidden="true">
        {phase === "cover"
            ? <span className="page-transition-cover" />
            : <><span className="page-transition-layer" /><span className="page-transition-layer" /><span className="page-transition-layer" /></>}
    </div>
}
