import { useCallback, useState } from "react"
import { Link } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { site, ui, pfe, whatIDo, featuredProjects, otherProjects, asset, screensFor } from "../data/content.js"
import GitLog from "../components/GitLog.jsx"
import Showcase from "../components/Showcase.jsx"
import Modal from "../components/Modal.jsx"
import ContactForm from "../components/ContactForm.jsx"
import Scoreboard from "../components/Scoreboard.jsx"
import Hero from "../components/hero/Hero.jsx"
import { useHead } from "../components/useHead.js"
import { homeHead } from "../seo.js"

const CATEGORY_ACCENTS = { web: "#86E3CE", mobile: "#B9A4F0", ai: "#F3B27A" }

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

    return (
        <>
            <Hero />

            <section className="section craft" aria-labelledby="craft-t">
                <header className="section-heading">
                    <h2 id="craft-t" className="title section-title" data-reveal="title">{L(ui.craft)}</h2>
                    <p className="sub" data-reveal>{L(ui.craftSub)}</p>
                </header>
                <div className="craft-cols">
                    {whatIDo.map((b) => (
                        <div className="craft-col" key={b.id} data-reveal>
                            <h3>{L(b.title)}</h3>
                            <div className="craft-logos">
                                {b.logos.map((t) => <img key={t} src={asset(`images/tech/${t}.svg`)} alt={t} title={t} loading="lazy" />)}
                            </div>
                            <ul>{b.bullets.slice(0, 3).map((x, i) => <li key={i}>{L(x)}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section journey-section" id="parcours" aria-labelledby="parcours-t">
                <header className="section-heading section-heading-split">
                    <h2 id="parcours-t" className="title" data-reveal="title">{L(ui.path.title)}</h2>
                    <p className="sub" data-reveal>{L(ui.path.sub)}</p>
                </header>
                <GitLog />
            </section>

            <section className="section projects-section" id="projets" aria-labelledby="projets-t">
                <header className="section-heading section-heading-split">
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
                            <header className="project-head">
                                <div className="project-name" data-reveal={index % 2 ? "right" : "left"}>
                                    <p className="project-overline">
                                        <span>{L(ui.categories[p.category])}</span>
                                    </p>
                                    <h3>
                                        {p.project ? <Link to={`/projets/${p.project.slug}`}>{p.title}</Link> : p.title}
                                    </h3>
                                    <ul className="project-tags" aria-label={L(ui.work.technologies)}>
                                        {p.stack.map((technology) => <li key={technology}>{technology}</li>)}
                                    </ul>
                                </div>
                                <div className="project-copy" data-reveal={index % 2 ? "left" : "right"}>
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

            <section className="section competition-section" id="hackathons" aria-labelledby="hackathons-t">
                <header className="section-heading section-heading-split">
                    <h2 id="hackathons-t" className="title" data-reveal="title">{L(ui.competitions.title)}</h2>
                    <p className="sub" data-reveal>{L(ui.competitions.sub)}</p>
                </header>
                <Scoreboard />
            </section>

            <section className="section contact" id="contact" aria-labelledby="contact-t">
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
