import { useEffect } from "react"

const STEP_MS = 90   // décalage entre deux éléments qui entrent ensemble
const MAX_STEPS = 6  // au-delà, la cascade traînerait

/**
 * Fait « remonter à la surface » les éléments marqués `data-reveal` chaque fois
 * qu'ils entrent dans l'écran, en descendant comme en remontant (cf. styles.css).
 *
 * Deux observateurs, pour ne jamais faire clignoter un élément au bord :
 * - l'entrée se déclenche quand l'élément a franchi 8 % de l'écran ;
 * - la sortie, seulement quand il en est complètement sorti. On note alors par
 *   où il est parti (`data-side`) : il reviendra du même côté.
 * Ceux qui entrent dans le même mouvement apparaissent en cascade.
 *
 * Les éléments ne sont masqués que sous `html.reveal-on`, posé ici : sans
 * script, ou si l'utilisateur a demandé moins d'animations, tout reste visible.
 * `key` relance l'observation à chaque changement de page.
 */
export function useScrollReveal(key) {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        document.documentElement.classList.add("reveal-on")

        const enter = new IntersectionObserver((entries) => {
            const entering = entries
                .filter((e) => e.isIntersecting && !e.target.classList.contains("is-in"))
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
            // En remontant, la lecture se fait du bas vers le haut : la cascade aussi.
            if (entering.length && entering[0].target.dataset.side === "above") entering.reverse()
            entering.forEach((e, i) => {
                e.target.style.setProperty("--d", `${Math.min(i, MAX_STEPS) * STEP_MS}ms`)
                e.target.classList.add("is-in")
            })
        }, { rootMargin: "-8% 0px -8% 0px" })

        const exit = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) continue
                e.target.dataset.side = e.boundingClientRect.bottom <= 0 ? "above" : "below"
                e.target.style.setProperty("--d", "0ms")
                e.target.classList.remove("is-in")
            }
        })

        const targets = document.querySelectorAll("[data-reveal]")
        targets.forEach((el) => { enter.observe(el); exit.observe(el) })
        return () => {
            enter.disconnect()
            exit.disconnect()
        }
    }, [key])
}
