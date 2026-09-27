import { useEffect } from "react"

const STEP_MS = 60
const MAX_DELAY_MS = 240

/**
 * Fait « remonter à la surface » les éléments marqués `data-reveal` à leur
 * première entrée dans l'écran (cf. styles.css).
 *
 * L'état « apparu » est un attribut (`data-in`), jamais une classe : React
 * réécrit `className` à chaque rendu (un commit du git log qu'on ouvre, par
 * exemple) et effacerait une classe ajoutée ici — l'élément redeviendrait
 * invisible tout en restant à l'écran.
 *
 * Ceux qui entrent dans le même mouvement apparaissent en cascade, avec un
 * décalage court et plafonné. Après leur première apparition, ils sont retirés
 * de l'observateur et restent visibles.
 *
 * Les éléments ne sont masqués que sous `html.reveal-on`, posé ici : sans
 * script, ou si l'utilisateur a demandé moins d'animations, tout reste visible.
 * `key` relance l'observation à chaque changement de page.
 */
export function useScrollReveal(key) {
    useEffect(() => {
        const root = document.documentElement
        const media = window.matchMedia("(prefers-reduced-motion: reduce)")
        const targets = [...document.querySelectorAll("[data-reveal]")]
        let observer = null

        const showAll = () => {
            observer?.disconnect()
            observer = null
            root.classList.remove("reveal-on")
            targets.forEach((el) => {
                el.removeAttribute("data-side")
                el.style.setProperty("--d", "0ms")
                el.setAttribute("data-in", "")
            })
        }

        const observe = () => {
            observer?.disconnect()
            root.classList.add("reveal-on")

            if (!("IntersectionObserver" in window)) {
                showAll()
                return
            }

            const nextObserver = new IntersectionObserver((entries) => {
                entries
                    .filter((entry) => entry.isIntersecting && !entry.target.hasAttribute("data-in"))
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
                    .forEach((entry, index) => {
                        entry.target.style.setProperty("--d", `${Math.min(index * STEP_MS, MAX_DELAY_MS)}ms`)
                        entry.target.setAttribute("data-in", "")
                        nextObserver.unobserve(entry.target)
                    })
            }, { rootMargin: "-8% 0px -8% 0px" })
            observer = nextObserver

            targets.forEach((el) => {
                el.removeAttribute("data-side")
                if (!el.hasAttribute("data-in")) nextObserver.observe(el)
            })
        }

        const update = () => {
            if (media.matches) showAll()
            else observe()
        }

        update()
        if (media.addEventListener) media.addEventListener("change", update)
        else media.addListener(update)

        return () => {
            observer?.disconnect()
            root.classList.remove("reveal-on")
            if (media.removeEventListener) media.removeEventListener("change", update)
            else media.removeListener(update)
        }
    }, [key])
}
