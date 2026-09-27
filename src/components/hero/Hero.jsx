import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useL } from "../../i18n.jsx"
import { asset, featuredProjects, honors, pfe, screensFor, site, ui } from "../../data/content.js"
import "./hero.css"

// Les valeurs animées restent dans le DOM : aucun rendu React au pointeur.
// La boucle ne tourne que le temps de rejoindre la position demandée.
function useHeroMotion(ref) {
    useEffect(() => {
        const hero = ref.current
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        const fine = window.matchMedia("(pointer: fine)")
        let frame = 0
        let x = 0
        let y = 0
        let targetX = 0
        let targetY = 0
        let visible = true

        const paint = () => {
            frame = 0
            x += (targetX - x) * .085
            y += (targetY - y) * .085
            hero.style.setProperty("--hero-x", `${x.toFixed(2)}px`)
            hero.style.setProperty("--hero-y", `${y.toFixed(2)}px`)
            if (Math.abs(targetX - x) + Math.abs(targetY - y) > .05) frame = requestAnimationFrame(paint)
        }
        const requestPaint = () => {
            if (!frame && visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(paint)
        }
        const move = (event) => {
            if (!fine.matches || reduced.matches || event.pointerType === "touch") return
            const bounds = hero.getBoundingClientRect()
            targetX = (event.clientX / bounds.width - .5) * 22
            targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 16
            requestPaint()
        }
        const reset = () => { targetX = 0; targetY = 0; requestPaint() }
        const sync = () => {
            hero.dataset.motion = visible && !document.hidden && !reduced.matches ? "on" : "off"
            if (reduced.matches || !fine.matches || !visible || document.hidden) {
                cancelAnimationFrame(frame)
                frame = 0
                x = y = targetX = targetY = 0
                hero.style.removeProperty("--hero-x")
                hero.style.removeProperty("--hero-y")
            }
        }
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            sync()
        })
        observer.observe(hero)
        hero.addEventListener("pointermove", move, { passive: true })
        hero.addEventListener("pointerleave", reset)
        reduced.addEventListener("change", sync)
        fine.addEventListener("change", sync)
        document.addEventListener("visibilitychange", sync)
        sync()
        return () => {
            cancelAnimationFrame(frame)
            observer.disconnect()
            hero.removeEventListener("pointermove", move)
            hero.removeEventListener("pointerleave", reset)
            reduced.removeEventListener("change", sync)
            fine.removeEventListener("change", sync)
            document.removeEventListener("visibilitychange", sync)
        }
    }, [ref])
}

function explore(event) {
    event.preventDefault()
    const section = document.getElementById("projets")
    if (!section) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    section.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" })
    const heading = section.querySelector("h2")
    heading?.setAttribute("tabindex", "-1")
    heading?.focus({ preventScroll: true })
    window.history.replaceState(window.history.state, "", "#projets")
}

export default function Hero() {
    const L = useL()
    const ref = useRef(null)
    useHeroMotion(ref)
    const [first, ...last] = site.name.split(" ")
    const project = featuredProjects[0]
    const shot = screensFor(project.slug)[0]
    const wins = honors.competitions.filter(item => item.place === 1).length

    return (
        <header className="hero" ref={ref} aria-labelledby="hero-name" data-scroll="hero">
            <div className="hero-grid" aria-hidden="true" />
            <div className="hero-shell">
                <div className="hero-main">
                    <div className="hero-content">
                        <p className="hero-eyebrow hero-enter" style={{ "--enter": "0ms" }}>
                            <span aria-hidden="true">✳</span> {L(site.role)}
                        </p>
                        <h1 className="hero-name" id="hero-name" aria-label={site.name}>
                            <span className="hero-name-line"><span>{first}</span></span>
                            <span className="hero-name-line"><span>{last.join(" ")}<i aria-hidden="true">.</i></span></span>
                        </h1>
                        <div className="hero-intro hero-enter" style={{ "--enter": "260ms" }}>
                            <p className="hero-statement">{L(ui.hero.statement)}</p>
                            <p className="hero-description">{L(ui.hero.description)}</p>
                        </div>
                        <div className="hero-actions hero-enter" style={{ "--enter": "360ms" }}>
                            <a className="btn hero-primary" href="#projets" onClick={explore}>
                                {L(ui.hero.cta)} <span aria-hidden="true">↗</span>
                            </a>
                            <a className="hero-cv" href={asset(L(site.cvUrl))} target="_blank" rel="noreferrer">
                                {L(ui.hero.resume)} <span aria-hidden="true">↓</span>
                            </a>
                        </div>
                        {pfe.active && <a className="hero-availability hero-enter" style={{ "--enter": "440ms" }} href="#contact">
                            <span className="hero-status-dot" aria-hidden="true" />
                            {L(ui.hero.availability)}
                            <span aria-hidden="true">↗</span>
                        </a>}
                    </div>

                    <div className="hero-visual hero-enter" style={{ "--enter": "160ms" }}>
                        <div className="hero-art" aria-hidden="true">
                            <div className="hero-disc" />
                            <div className="hero-orbit"><span /></div>
                            <div className="hero-orbit hero-orbit-inner" />
                            <span className="hero-cross hero-cross-top">+</span>
                            <span className="hero-cross hero-cross-bottom">+</span>
                            <span className="hero-art-label">{L(ui.hero.artLabel)}</span>
                            <div className="hero-portrait">
                                <img src={asset(site.portrait)} alt="" width="1122" height="1403" fetchPriority="high" />
                            </div>
                        </div>
                        <div className="hero-award">
                            <span className="hero-award-mark" aria-hidden="true">✳</span>
                            <p><strong>{String(wins).padStart(2, "0")}</strong><span>{L(ui.hero.awards)}</span></p>
                        </div>
                        <Link className="hero-project" to={`/projets/${project.slug}`}>
                            {shot && <img src={asset(shot.page)} alt="" width="112" height="78" loading="lazy" />}
                            <span className="hero-project-copy"><span>{L(ui.hero.featured)}</span><strong>{project.title}</strong><small>{L(ui.hero.projectType)}</small></span>
                            <span className="hero-project-arrow" aria-hidden="true">↗</span>
                        </Link>
                    </div>
                </div>

                <div className="hero-footer hero-enter" style={{ "--enter": "540ms" }}>
                    <p className="hero-location"><span aria-hidden="true">◎</span>{L(site.location)}</p>
                    <ul className="hero-disciplines" aria-label={L(ui.hero.disciplines)}>
                        <li>Web</li><li>Mobile</li><li>{L(ui.categories.ai)}</li>
                    </ul>
                    <a className="hero-explore" href="#projets" onClick={explore}>{L(ui.hero.scroll)}<span aria-hidden="true">↓</span></a>
                </div>
            </div>
        </header>
    )
}
