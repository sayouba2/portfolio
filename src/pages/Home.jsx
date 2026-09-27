import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { site, ui, pfe, whatIDo, experiences, honors, featuredProjects, otherProjects, asset, screensFor } from "../data/content.js"
import GitLog from "../components/GitLog.jsx"
import Showcase from "../components/Showcase.jsx"
import Modal from "../components/Modal.jsx"
import ContactForm from "../components/ContactForm.jsx"
import Scoreboard from "../components/Scoreboard.jsx"
import { useHead } from "../components/useHead.js"
import { homeHead } from "../seo.js"

// three.js et React Three Fiber ne servent qu'à l'ouverture : chargés à part,
// ils ne retardent pas l'affichage du reste de la page.
const HeroScene = lazy(() => import("../components/hero/HeroScene.jsx"))
const CATEGORY_ACCENTS = { web: "#86E3CE", mobile: "#B9A4F0", ai: "#F3B27A" }

/**
 * Sans WebGL (navigateur ancien, accélération désactivée), la scène lève une
 * erreur : on affiche alors la même composition, figée, plutôt qu'un trou —
 * le nom n'existe sinon que dans le canevas.
 */
class SceneBoundary extends Component {
    state = { failed: false }
    static getDerivedStateFromError() { return { failed: true } }
    render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function StaticHero() {
    const [first, ...rest] = site.name.split(" ")
    return (
        <div className="hero-canvas hero-static" aria-hidden="true">
            <p className="hero-static-back">{first}</p>
            <img src={asset(site.portrait)} alt="" />
            <p className="hero-static-front">{rest.join(" ")}</p>
        </div>
    )
}

/**
 * Le haut du texte d'accroche, en pixels depuis le haut de l'ouverture. La
 * scène pose le nom juste au-dessus (et, sur téléphone, le portrait au-dessus
 * du nom) : ce bloc change de hauteur avec la langue, la largeur, les polices
 * et la hauteur réellement visible de l'écran, donc on le mesure.
 */
function useCopyTop() {
    const ref = useRef(null)
    const [top, setTop] = useState(null)
    useEffect(() => {
        const copy = ref.current
        if (!copy) return
        const update = () => setTop(copy.offsetTop)
        update()
        const observer = new ResizeObserver(update)
        observer.observe(copy)
        observer.observe(copy.offsetParent ?? document.body)
        return () => observer.disconnect()
    }, [])
    return [ref, top]
}

/**
 * Profondeur de l'ouverture : en descendant, la scène s'éloigne et s'assombrit,
 * le texte d'accroche remonte et s'efface — on plonge sous la surface.
 * Une seule variable CSS (--depth, de 0 à 1) écrite au plus une fois par image.
 */
function useHeroDepth(ref) {
    useEffect(() => {
        const hero = ref.current
        if (!hero) return
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frame = 0
        let listening = false
        const update = () => {
            frame = 0
            const depth = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight))
            hero.style.setProperty("--depth", depth.toFixed(3))
        }
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
        const sync = () => {
            if (reduced.matches) {
                if (listening) window.removeEventListener("scroll", onScroll)
                listening = false
                cancelAnimationFrame(frame)
                frame = 0
                hero.style.removeProperty("--depth")
                return
            }
            if (!listening) window.addEventListener("scroll", onScroll, { passive: true })
            listening = true
            update()
        }

        sync()
        reduced.addEventListener("change", sync)
        return () => {
            if (listening) window.removeEventListener("scroll", onScroll)
            reduced.removeEventListener("change", sync)
            cancelAnimationFrame(frame)
        }
    }, [ref])
}

const scrollTo = (id) => (e) => {
    e.preventDefault()
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    document.getElementById(id)?.scrollIntoView({ behavior })
}

function ProjectSummary({ p }) {
    const L = useL()
    const cs = p.caseStudy
    return (
        <>
            <p className="kicker">{L(ui.work.summaryKicker)} · {p.stack.slice(0, 3).join(" · ")}</p>
            <h2 className="modal-title">{p.title}</h2>
            <p className="modal-lead">{L(cs.takeaway)}</p>
            <ul className="modal-list">
                {cs.features.slice(0, 4).map((f, i) => <li key={i}>{L(f)}</li>)}
            </ul>
            <div className="modal-actions">
                <Link className="btn" to={`/projets/${p.slug}`}>{L(ui.work.fullCase)} →</Link>
                {p.liveUrl && <a className="btn ghost" href={p.liveUrl} target="_blank" rel="noreferrer">{L(ui.project.visit)} ↗</a>}
                {p.github && <a className="btn ghost" href={p.github} target="_blank" rel="noreferrer">{L(ui.project.code)} ↗</a>}
            </div>
        </>
    )
}

/**
 * « Sous la surface » : un développeur full stack voit à travers les
 * interfaces. Tout le site joue sur les couches — la surface qu'on voit, le
 * système qu'il y a dessous.
 */
export default function Home() {
    const L = useL()
    const [open, setOpen] = useState(null)
    const close = useCallback(() => setOpen(null), [])
    const [copyRef, copyTop] = useCopyTop()
    const heroRef = useRef(null)
    useHeroDepth(heroRef)
    useHead(homeHead(L))

    // Projets montrés avec leurs captures : les phares (avec résumé), puis les
    // autres dépôts qui en ont. Ceux sans capture restent dans la liste finale.
    const shown = [
        ...featuredProjects.map((p) => ({
            key: p.slug, title: p.title, text: L(p.oneLiner), stack: p.stack,
            live: p.liveUrl, github: p.github, project: p.caseStudy && p, shots: screensFor(p.slug),
            category: p.category, accent: p.accent || CATEGORY_ACCENTS[p.category],
        })),
        ...otherProjects.filter((p) => screensFor(p.id).length).map((p) => ({
            key: p.id, title: L(p.title), text: L(p.text), stack: p.tags, github: p.github, shots: screensFor(p.id),
            category: p.category, accent: CATEGORY_ACCENTS[p.category],
        })),
    ]
    const others = otherProjects.filter((p) => !screensFor(p.id).length)
    const [user, domain] = site.email.split("@")
    const wins = honors.competitions.filter((competition) => competition.place === 1).length

    return (
        <>
            <header className="hero" ref={heroRef}>
                <SceneBoundary fallback={<StaticHero />}>
                    <Suspense fallback={<StaticHero />}>
                        <HeroScene name={site.name} portraitSrc={site.portrait} copyTop={copyTop} />
                    </Suspense>
                </SceneBoundary>
                <h1 className="sr-only">{site.name} — {L(site.role)}</h1>
                <div className="hero-copy" ref={copyRef}>
                    <div className="hero-topline">
                        {pfe.active && <p className="hero-status"><i aria-hidden="true" />{L(site.status)}</p>}
                        <p className="hero-place">{L(pfe.places)}</p>
                    </div>
                    <p className="hero-role">{L(site.role)}</p>
                    <p className="hero-tagline">{L(site.tagline)}</p>
                    <div className="hero-ctas">
                        <a className="btn" href="#projets" onClick={scrollTo("projets")}>{L(ui.hero.cta)}<span aria-hidden="true">↘</span></a>
                        <a className="btn ghost" href={asset(L(site.cvUrl))} target="_blank" rel="noreferrer">{L(ui.hero.cv)}<span aria-hidden="true">↓</span></a>
                    </div>
                </div>
                <div className="hero-scroll" aria-hidden="true"><span>{L(ui.hero.scroll)}</span><i /></div>
            </header>

            <section className="proof-strip" aria-labelledby="proof-t">
                <div className="proof-inner">
                    <p className="proof-label" id="proof-t" data-reveal>{L(ui.proof.label)}</p>
                    <ul>
                        <li data-reveal><strong>{L(ui.proof.availabilityValue)}</strong><span>{L(ui.proof.availability)}</span></li>
                        <li data-reveal><strong>{experiences.length}</strong><span>{L(ui.proof.internships)}</span></li>
                        <li data-reveal><strong>{wins}×</strong><span>{L(ui.proof.wins)}</span></li>
                        <li data-reveal><strong>{L(ui.proof.scopeValue)}</strong><span>{L(ui.proof.scope)}</span></li>
                    </ul>
                </div>
            </section>

            <section className="section craft" aria-labelledby="craft-t">
                <header className="section-heading">
                    <p className="chapter-marker" data-reveal><span>01</span> / 05</p>
                    <h2 id="craft-t" className="title section-title" data-reveal="title">{L(ui.craft)}</h2>
                    <p className="sub" data-reveal>{L(ui.craftSub)}</p>
                </header>
                <div className="craft-cols">
                    {whatIDo.map((b, index) => (
                        <div className="craft-col" key={b.id} data-reveal style={{ "--item": index }}>
                            <span className="craft-number" aria-hidden="true">0{index + 1}</span>
                            <h3>{L(b.title)}</h3>
                            <div className="craft-logos">
                                {b.logos.map((t) => <img key={t} src={asset(`images/tech/${t}.svg`)} alt={t} title={t} loading="lazy" />)}
                            </div>
                            <ul>{b.bullets.slice(0, 3).map((x, i) => <li key={i}>{L(x)}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section projects-section" id="projets" aria-labelledby="projets-t">
                <header className="section-heading section-heading-split">
                    <p className="chapter-marker" data-reveal><span>02</span> / 05</p>
                    <h2 id="projets-t" className="title" data-reveal="title">{L(ui.work.title)}</h2>
                    <p className="sub" data-reveal>{L(ui.work.sub)}</p>
                </header>
                <div className="projects">
                    {shown.map((p, index) => (
                        <article
                            className={`project ${index % 2 ? "project-reverse" : ""}`}
                            key={p.key}
                            style={{ "--project-accent": p.accent }}
                        >
                            <header className="project-head" data-reveal>
                                <div className="project-name">
                                    <p className="project-overline">
                                        <span>{String(index + 1).padStart(2, "0")} / {String(shown.length).padStart(2, "0")}</span>
                                        <span>{L(ui.categories[p.category])}</span>
                                    </p>
                                    <h3>
                                        {p.project ? <Link to={`/projets/${p.project.slug}`}>{p.title}</Link> : p.title}
                                    </h3>
                                    <ul className="project-tags" aria-label={L(ui.work.technologies)}>
                                        {p.stack.map((technology) => <li key={technology}>{technology}</li>)}
                                    </ul>
                                </div>
                                <div className="project-copy">
                                    <p>{p.text}</p>
                                    <div className="project-actions">
                                        {p.project && (
                                            <>
                                                <Link className="btn" to={`/projets/${p.project.slug}`}>{L(ui.work.fullCase)}<span aria-hidden="true">↗</span></Link>
                                                <button className="link summary-link" onClick={(e) => setOpen({ p: p.project, origin: e.detail ? { x: e.clientX, y: e.clientY } : null })}>{L(ui.work.summary)}</button>
                                            </>
                                        )}
                                        {p.live && <a className="link" href={p.live} target="_blank" rel="noreferrer">{L(ui.work.visit)} ↗</a>}
                                        {p.github && <a className="link" href={p.github} target="_blank" rel="noreferrer">{L(ui.work.code)} ↗</a>}
                                    </div>
                                </div>
                            </header>
                            <div className="project-media" data-reveal="frame"><Showcase title={p.title} shots={p.shots} priority={index === 0} /></div>
                        </article>
                    ))}
                </div>

                {others.length > 0 && (
                    <>
                        <h3 className="eyebrow others-title" data-reveal>{L(ui.work.others)}</h3>
                        <ul className="others">
                            {others.map((p) => (
                                <li key={p.id} data-reveal>
                                    <span className="others-name">{L(p.title)}</span>
                                    <span className="others-text">{L(p.text)}</span>
                                    <span className="others-tags">{p.tags.join(" · ")}</span>
                                    {p.github && <a href={p.github} target="_blank" rel="noreferrer" aria-label={`${L(ui.work.code)} — ${L(p.title)}`}>↗</a>}
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>

            <section className="section journey-section" id="parcours" aria-labelledby="parcours-t">
                <header className="section-heading section-heading-split">
                    <p className="chapter-marker" data-reveal><span>03</span> / 05</p>
                    <h2 id="parcours-t" className="title" data-reveal="title">{L(ui.path.title)}</h2>
                    <p className="sub" data-reveal>{L(ui.path.sub)}</p>
                </header>
                <GitLog />
            </section>

            <section className="section competition-section" id="hackathons" aria-labelledby="hackathons-t">
                <header className="section-heading section-heading-split">
                    <p className="chapter-marker" data-reveal><span>04</span> / 05</p>
                    <h2 id="hackathons-t" className="title" data-reveal="title">{L(ui.competitions.title)}</h2>
                    <p className="sub" data-reveal>{L(ui.competitions.sub)}</p>
                </header>
                <Scoreboard />
            </section>

            <section className="section contact" id="contact" aria-labelledby="contact-t">
                <p className="chapter-marker" data-reveal><span>05</span> / 05</p>
                <p className="eyebrow contact-eyebrow" data-reveal>{L(ui.contact.eyebrow)}</p>
                <h2 id="contact-t" className="title contact-title" data-reveal="title">{L(ui.contact.title)}</h2>
                <a className="contact-mail" href={`mailto:${site.email}`} data-reveal="title">{user}<wbr />@{domain}</a>
                <p className="contact-sub" data-reveal>{L(pfe.text)}</p>
                <div className="contact-grid" data-reveal>
                    <ContactForm />
                    <ul className="contact-lines">
                        <li><span>{L(ui.contact.phone)}</span><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>
                        <li><span>GitHub</span><a href={site.github} target="_blank" rel="noreferrer">github.com/sayouba2</a></li>
                        <li><span>LinkedIn</span><a href={site.linkedin} target="_blank" rel="noreferrer">ouedraogo-sayouba</a></li>
                        <li><span>{L(ui.contact.location)}</span><p>{L(site.location)}</p></li>
                    </ul>
                </div>
            </section>

            {open && (
                <Modal origin={open.origin} onClose={close} label={open.p.title}>
                    <ProjectSummary p={open.p} />
                </Modal>
            )}
        </>
    )
}
