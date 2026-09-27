import { useEffect } from "react"

const STEP_MS = 85
const MAX_DELAY_MS = 240
const RESET_MARGIN = 96

/**
 * Fait « remonter à la surface » les éléments marqués `data-reveal` à
 * chaque entrée dans l'écran, dans les deux sens (cf. styles.css).
 *
 * L'état « apparu » est un attribut (`data-in`), jamais une classe : React
 * réécrit `className` à chaque rendu (un commit du git log qu'on ouvre, par
 * exemple) et effacerait une classe ajoutée ici — l'élément redeviendrait
 * invisible tout en restant à l'écran.
 *
 * Ceux qui entrent dans le même mouvement apparaissent en cascade, avec un
 * décalage court et plafonné. Un second observateur ne réarme l'animation
 * qu'une fois l'élément complètement hors écran : aucun clignotement au bord.
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
        let exitObserver = null
        let focusFrame = 0

        const resetOutside = (el, rect = el.getBoundingClientRect()) => {
            if (rect.bottom >= -RESET_MARGIN && rect.top <= window.innerHeight + RESET_MARGIN) return
            if (el.contains(document.activeElement)) return
            el.setAttribute("data-side", rect.bottom < 0 ? "above" : "below")
            el.style.setProperty("--d", "0ms")
            el.style.removeProperty("transition-duration")
            el.removeAttribute("data-in")
        }

        const showAll = () => {
            observer?.disconnect()
            exitObserver?.disconnect()
            observer = null
            exitObserver = null
            root.classList.remove("reveal-on")
            targets.forEach((el) => {
                el.removeAttribute("data-side")
                el.style.setProperty("--d", "0ms")
                el.style.removeProperty("transition-duration")
                el.setAttribute("data-in", "")
            })
        }

        const observe = () => {
            observer?.disconnect()
            exitObserver?.disconnect()
            root.classList.add("reveal-on")

            if (!("IntersectionObserver" in window)) {
                showAll()
                return
            }

            observer = new IntersectionObserver((entries) => {
                const entering = entries
                    .filter((entry) => entry.isIntersecting && !entry.target.hasAttribute("data-in"))
                const fromAbove = entering.length > 0 && entering.every((entry) => entry.boundingClientRect.top < window.innerHeight / 2)
                entering
                    .sort((a, b) => (fromAbove ? -1 : 1) * (a.boundingClientRect.top - b.boundingClientRect.top) || a.boundingClientRect.left - b.boundingClientRect.left)
                    .forEach((entry, index) => {
                        entry.target.style.setProperty("--d", `${Math.min(index * STEP_MS, MAX_DELAY_MS)}ms`)
                        entry.target.setAttribute("data-in", "")
                    })
            }, { rootMargin: "-4% 0px -4% 0px", threshold: 0 })
            exitObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) resetOutside(entry.target, entry.boundingClientRect)
                })
            }, { rootMargin: `${RESET_MARGIN}px 0px`, threshold: 0 })

            targets.forEach((el) => {
                resetOutside(el)
                observer.observe(el)
                exitObserver.observe(el)
            })
        }

        const update = () => {
            if (media.matches) showAll()
            else observe()
        }

        // Une arrivée au clavier ne doit jamais attendre une animation.
        const revealFocus = (event) => {
            let element = event.target.closest("[data-reveal]")
            while (element) {
                element.style.setProperty("--d", "0ms")
                element.style.setProperty("transition-duration", "0s")
                element.setAttribute("data-in", "")
                element = element.parentElement?.closest("[data-reveal]")
            }
        }
        const releaseFocus = (event) => {
            cancelAnimationFrame(focusFrame)
            focusFrame = requestAnimationFrame(() => {
                let element = event.target.closest("[data-reveal]")
                while (element) {
                    element.style.removeProperty("transition-duration")
                    if (!media.matches) resetOutside(element)
                    element = element.parentElement?.closest("[data-reveal]")
                }
            })
        }

        update()
        document.addEventListener("focusin", revealFocus)
        document.addEventListener("focusout", releaseFocus)
        if (media.addEventListener) media.addEventListener("change", update)
        else media.addListener(update)

        return () => {
            observer?.disconnect()
            exitObserver?.disconnect()
            cancelAnimationFrame(focusFrame)
            document.removeEventListener("focusin", revealFocus)
            document.removeEventListener("focusout", releaseFocus)
            root.classList.remove("reveal-on")
            if (media.removeEventListener) media.removeEventListener("change", update)
            else media.removeListener(update)
        }
    }, [key])
}
