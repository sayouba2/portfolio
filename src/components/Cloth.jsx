import { useEffect, useRef } from "react"

// Période verticale du tissage : une bande complète (cf. .cloth::before).
// Ramener la dérive modulo cette valeur rend le motif infini — la bande se
// réaligne exactement à chaque bouclage, donc le raccord ne se voit pas.
const PERIOD = 356

/**
 * Le tissage Faso Dan Fani, posé au fond de toutes les pages.
 * Il dérive plus lentement que la page : c'est ce décalage qui fait
 * bouger la réfraction dans les panneaux de verre posés par-dessus.
 * Le motif lui-même vit dans .cloth (styles.css).
 */
export default function Cloth() {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        let raf = 0
        const update = () => {
            raf = 0
            el.style.setProperty("--drift", `${(-window.scrollY * 0.08) % PERIOD}px`)
        }
        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            if (raf) cancelAnimationFrame(raf)
        }
    }, [])

    return <div className="cloth" ref={ref} aria-hidden="true" />
}
