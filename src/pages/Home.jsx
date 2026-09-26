import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { site, ui, pfe, whatIDo, featuredProjects, otherProjects, asset, screensFor } from "../data/content.js"
import GitLog from "../components/GitLog.jsx"
import Showcase from "../components/Showcase.jsx"
import Modal from "../components/Modal.jsx"
import ContactForm from "../components/ContactForm.jsx"

// three.js et React Three Fiber ne servent qu'à l'ouverture : chargés à part,
// ils ne retardent pas l'affichage du reste de la page.
const HeroScene = lazy(() => import("../components/hero/HeroScene.jsx"))

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

const scrollTo = (id) => (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
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

    // Projets montrés avec leurs captures : les phares (avec résumé), puis les
    // autres dépôts qui en ont. Ceux sans capture restent dans la liste finale.
    const shown = [
        ...featuredProjects.map((p) => ({
            key: p.slug, title: p.title, text: L(p.oneLiner), stack: p.stack,
            live: p.liveUrl, github: p.github, project: p.caseStudy && p, shots: screensFor(p.slug),
        })),
        ...otherProjects.filter((p) => screensFor(p.id).length).map((p) => ({
            key: p.id, title: L(p.title), text: L(p.text), stack: p.tags, github: p.github, shots: screensFor(p.id),
        })),
    ]
    const others = otherProjects.filter((p) => !screensFor(p.id).length)
    const [user, domain] = site.email.split("@")

    return (
        <>
            <header className="hero">
                <SceneBoundary fallback={<StaticHero />}>
                    <Suspense fallback={<div className="hero-canvas" />}>
                        <HeroScene name={site.name} portraitSrc={site.portrait} copyTop={copyTop} />
                    </Suspense>
                </SceneBoundary>
                <h1 className="sr-only">{site.name} — {L(site.role)}</h1>
                <div className="hero-copy" ref={copyRef}>
                    {pfe.active && <p className="hero-status"><i aria-hidden="true" />{L(site.status)}</p>}
                    <p className="hero-role">{L(site.role)}</p>
                    <p className="hero-tagline">{L(site.tagline)}</p>
                    <div className="hero-ctas">
                        <a className="btn" href="#projets" onClick={scrollTo("projets")}>{L(ui.hero.cta)}</a>
                        <a className="btn ghost" href={asset(L(site.cvUrl))} target="_blank" rel="noreferrer">{L(ui.hero.cv)}</a>
                    </div>
                </div>
            </header>

            <section className="section craft" aria-labelledby="craft-t">
                <h2 id="craft-t" className="eyebrow">{L(ui.craft)}</h2>
                <div className="craft-cols">
                    {whatIDo.map((b) => (
                        <div className="craft-col" key={b.id}>
                            <h3>{L(b.title)}</h3>
                            <div className="craft-logos">
                                {b.logos.map((t) => <img key={t} src={asset(`images/tech/${t}.svg`)} alt={t} title={t} loading="lazy" />)}
                            </div>
                            <ul>{b.bullets.slice(0, 3).map((x, i) => <li key={i}>{L(x)}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section" id="parcours" aria-labelledby="parcours-t">
                <h2 id="parcours-t" className="title">{L(ui.path.title)}</h2>
                <p className="sub">{L(ui.path.sub)}</p>
                <GitLog />
            </section>

            <section className="section" id="projets" aria-labelledby="projets-t">
                <h2 id="projets-t" className="title">{L(ui.work.title)}</h2>
                <p className="sub">{L(ui.work.sub)}</p>
                <div className="projects">
                    {shown.map((p) => (
                        <article className="project" key={p.key}>
                            <header className="project-head">
                                <div className="project-name">
                                    <h3>{p.title}</h3>
                                    <p className="project-stack">{p.stack.join(" · ")}</p>
                                </div>
                                <div className="project-copy">
                                    <p>{p.text}</p>
                                    <div className="project-actions">
                                        {p.project && (
                                            <button className="btn" onClick={(e) => setOpen({ p: p.project, x: e.clientX, y: e.clientY })}>
                                                {L(ui.work.summary)}
                                            </button>
                                        )}
                                        {p.live && <a className="link" href={p.live} target="_blank" rel="noreferrer">{L(ui.work.visit)} ↗</a>}
                                        {p.github && <a className="link" href={p.github} target="_blank" rel="noreferrer">{L(ui.work.code)} ↗</a>}
                                    </div>
                                </div>
                            </header>
                            <Showcase title={p.title} shots={p.shots} />
                        </article>
                    ))}
                </div>

                {others.length > 0 && (
                    <>
                        <h3 className="eyebrow others-title">{L(ui.work.others)}</h3>
                        <ul className="others">
                            {others.map((p) => (
                                <li key={p.id}>
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

            <section className="section contact" id="contact" aria-labelledby="contact-t">
                <h2 id="contact-t" className="eyebrow">{L(ui.contact.title)}</h2>
                <a className="contact-mail" href={`mailto:${site.email}`}>{user}<wbr />@{domain}</a>
                <p className="contact-sub">{L(pfe.text)}</p>
                <div className="contact-grid">
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
                <Modal origin={open} onClose={close} label={open.p.title}>
                    <ProjectSummary p={open.p} />
                </Modal>
            )}
        </>
    )
}
