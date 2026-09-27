import { useEffect } from "react"

// Le portrait accompagne le scroll natif. La boucle ne travaille que lorsque
// le hero est visible ; les autres sections utilisent les apparitions.
export function useScrollMotion(key) {
    useEffect(() => {
        const hero = document.querySelector('[data-scroll="hero"]')
        if (!hero) return

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frame = 0
        let visible = true

        const paint = () => {
            frame = 0
            const bounds = hero.getBoundingClientRect()
            const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height)))
            hero.style.setProperty("--hero-scroll", progress.toFixed(4))
        }
        const schedule = () => {
            if (!frame && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(paint)
        }
        const sync = () => {
            cancelAnimationFrame(frame)
            frame = 0
            if (reduced.matches) hero.style.removeProperty("--hero-scroll")
            else schedule()
        }
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (!visible) { cancelAnimationFrame(frame); frame = 0 }
            else schedule()
        }, { rootMargin: "15% 0px" })
        observer.observe(hero)
        window.addEventListener("scroll", schedule, { passive: true })
        window.addEventListener("resize", schedule)
        document.addEventListener("visibilitychange", sync)
        reduced.addEventListener("change", sync)
        sync()
        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            document.removeEventListener("visibilitychange", sync)
            reduced.removeEventListener("change", sync)
            hero.style.removeProperty("--hero-scroll")
        }
    }, [key])
}
