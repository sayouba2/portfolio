import { useState } from "react"
import { Link } from "react-router-dom"
import { useLang, useL } from "../i18n.jsx"
import { site, ui, experiences, featuredProjects, otherProjects, whatIDo, skills, education, honors, asset } from "../data/content.js"
import Reveal from "../components/Reveal.jsx"
import ContactForm from "../components/ContactForm.jsx"
import { Lightbox } from "../components/Gallery.jsx"

function SectionTitle({ children, sub }) {
    return (
        <Reveal className="section-head">
            <h2>{children}</h2>
            {sub && <p className="section-sub">{sub}</p>}
        </Reveal>
    )
}

const ICONS = {
    github: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.76 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.67.8.55A10.99 10.99 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>,
    linkedin: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4V24h-4V8Zm7.5 0h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.65 4.78 6.1V24h-4v-8.5c0-2.03-.04-4.64-2.83-4.64-2.83 0-3.27 2.2-3.27 4.5V24H8V8Z"/></svg>,
    mail: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M2 4h20a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm10 8.4L4.2 6.6v11h15.6v-11L12 12.4ZM4.9 6h14.2L12 10.6 4.9 6Z"/></svg>,
    phone: <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1.1-.24c1.2.4 2.5.62 3.9.62a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.85 21 3 13.15 3 3.6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.21 2.66.62 3.89a1 1 0 0 1-.25 1.09L6.6 10.8Z"/></svg>,
}

function Hero() {
    const L = useL()
    return (
        <section className="hero" id="accueil">
            <div className="container hero-inner">
                <div className="hero-text">
                    <h1>
                        {L(ui.hero.hello)}{" "}
                        <span className="hero-name">{site.name}</span>{" "}
                        <span className="wave" aria-hidden="true">👋</span>
                    </h1>
                    <p className="hero-role">{L(site.role)}</p>
                    <p className="hero-about">{L(ui.hero.about)}</p>
                    <div className="hero-socials">
                        <a className="soc gh" href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub">{ICONS.github}</a>
                        <a className="soc li" href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">{ICONS.linkedin}</a>
                        <a className="soc ml" href={`mailto:${site.email}`} aria-label="E-mail">{ICONS.mail}</a>
                    </div>
                    <div className="hero-ctas">
                        <a
                            href="#projets"
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault()
                                document.getElementById("projets")?.scrollIntoView({ behavior: "smooth" })
                            }}
                        >
                            {L(ui.hero.seeProjects)}
                        </a>
                        <a href={asset(site.cvUrl)} target="_blank" rel="noreferrer" className="btn btn-outline">
                            {L(ui.hero.downloadCv)}
                        </a>
                    </div>
                </div>
                <div className="hero-illu">
                    <figure className="photo-frame">
                        <img src={asset(site.photo)} alt={site.name} width="320" height="320" />
                        <figcaption>
                            <strong>{site.name}</strong>
                            <span>{L(site.role)}</span>
                        </figcaption>
                    </figure>
                </div>
            </div>
        </section>
    )
}

function WhatIDo() {
    const L = useL()
    return (
        <section className="section" id="competences">
            <div className="container">
                <SectionTitle sub={L(ui.sections.skillsSub)}>{L(ui.sections.skills)}</SectionTitle>
                <div className="wid-list">
                    {whatIDo.map((block, i) => (
                        <Reveal className={`wid-row ${i % 2 ? "flip" : ""}`} key={block.id}>
                            <div className="wid-illu">
                                <img src={asset(block.illustration)} alt="" loading="lazy" />
                            </div>
                            <div className="wid-body">
                                <h3>{L(block.title)}</h3>
                                <div className="wid-logos">
                                    {block.logos.map((t) => (
                                        <img key={t} src={asset(`images/tech/${t}.svg`)} alt={t} title={t} loading="lazy" />
                                    ))}
                                </div>
                                <ul>
                                    {block.bullets.map((b, j) => <li key={j}>{L(b)}</li>)}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
                <Reveal className="stack-line">
                    <p>{L(ui.sections.stackTitle)}</p>
                    <div className="chips">
                        {skills.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
                    </div>
                </Reveal>
            </div>
        </section>
    )
}

function Experience() {
    const L = useL()
    return (
        <section className="section section-tint" id="experience">
            <div className="container">
                <SectionTitle>{L(ui.sections.experience)}</SectionTitle>
                <div className="xp-grid">
                    {experiences.map((xp, i) => (
                        <Reveal key={xp.id} className="card xp-card" delay={i * 100}>
                            <div className="xp-top">
                                <span className="chip chip-blue">{L(xp.period)}</span>
                                <span className="xp-company">{xp.company}</span>
                            </div>
                            <h3>{L(xp.role)}</h3>
                            <p className="xp-summary">{L(xp.summary)}</p>
                            <ul>
                                {xp.bullets.map((b, j) => <li key={j}>{L(b)}</li>)}
                            </ul>
                            <div className="chips">
                                {xp.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    )
}

function FeaturedCard({ project, index }) {
    const L = useL()
    const cover = project.images[0]
    return (
        <Reveal className="card proj-card" delay={index * 80}>
            {cover && (
                <Link to={`/projets/${project.slug}`} className="proj-cover">
                    <img src={asset(cover)} alt={project.title} loading="lazy" />
                </Link>
            )}
            <div className="proj-body">
                <div className="proj-title-row">
                    <h3>{project.title}</h3>
                    {project.liveUrl && <span className="chip chip-green">● {L(ui.project.online)}</span>}
                    <span className="chip chip-blue">{L(ui.categories[project.category])}</span>
                </div>
                <p>{L(project.oneLiner)}</p>
                <div className="chips">
                    {project.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
                </div>
                <div className="proj-links">
                    <Link to={`/projets/${project.slug}`} className="text-link">
                        {L(ui.project.readCase)} <span className="arr arr-r">→</span>
                    </Link>
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-link">
                            {L(ui.project.visit)} <span className="arr arr-ur">↗</span>
                        </a>
                    )}
                    {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="text-link">
                            {L(ui.project.code)} <span className="arr arr-ur">↗</span>
                        </a>
                    )}
                </div>
            </div>
        </Reveal>
    )
}

function Projects() {
    const L = useL()
    const [filter, setFilter] = useState("all")
    const [gallery, setGallery] = useState(null) // { images, index } pour les autres projets
    const filtered = otherProjects.filter((p) => filter === "all" || p.category === filter)

    return (
        <section className="section" id="projets">
            <div className="container">
                <SectionTitle sub={L(ui.sections.featuredSub)}>{L(ui.sections.featured)}</SectionTitle>
                <div className="proj-grid">
                    {featuredProjects.map((p, i) => <FeaturedCard key={p.slug} project={p} index={i} />)}
                </div>

                <Reveal className="other-block">
                    <div className="other-head">
                        <h3>{L(ui.sections.otherProjects)}</h3>
                        <div className="filters" role="group">
                            {["all", "web", "ai", "mobile"].map((cat) => (
                                <button
                                    key={cat}
                                    className={`filter ${filter === cat ? "active" : ""}`}
                                    onClick={() => setFilter(cat)}
                                >
                                    {L(ui.categories[cat])}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="other-grid">
                        {filtered.map((p) => (
                            <article className="card other-card" key={p.id}>
                                {p.images?.length > 0 && (
                                    <button
                                        className="other-cover"
                                        onClick={() => setGallery({ images: p.images, index: 0 })}
                                        aria-label={`Voir les captures — ${L(p.title)}`}
                                    >
                                        <img src={asset(p.images[0])} alt="" loading="lazy" />
                                        <span className="other-cover-count">{p.images.length} 📷</span>
                                    </button>
                                )}
                                <div className="other-body">
                                    <h4>{L(p.title)}</h4>
                                    <p>{L(p.text)}</p>
                                    <div className="chips">
                                        {p.tags.map((t) => <span className="chip" key={t}>{t}</span>)}
                                    </div>
                                    {p.github && (
                                        <a href={p.github} target="_blank" rel="noreferrer" className="text-link">
                                            {L(ui.project.code)} <span className="arr arr-ur">↗</span>
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </Reveal>
            </div>
            <Lightbox
                images={gallery?.images ?? []}
                index={gallery ? gallery.index : null}
                onClose={() => setGallery(null)}
                onMove={(dir) => setGallery((g) => g && { ...g, index: (g.index + dir + g.images.length) % g.images.length })}
            />
        </section>
    )
}

function Journey() {
    const L = useL()
    return (
        <section className="section section-tint" id="parcours">
            <div className="container">
                <SectionTitle>{L(ui.sections.journey)}</SectionTitle>
                <div className="journey-grid">
                    <Reveal className="journey-col">
                        <h3 className="col-title">{L(ui.sections.education)}</h3>
                        {education.map((ed, i) => (
                            <div className="card edu-card" key={i}>
                                <span className="chip chip-blue edu-period">{L(ed.period)}</span>
                                <h4>{L(ed.title)}</h4>
                                <p className="edu-inst">{L(ed.institution)}</p>
                                <p>{L(ed.text)}</p>
                            </div>
                        ))}
                    </Reveal>
                    <Reveal className="journey-col" delay={100}>
                        <h3 className="col-title">{L(ui.sections.honors)}</h3>
                        {honors.highlights.map((h, i) => (
                            <div className="card honor-card" key={i}>
                                <span className="trophy" aria-hidden="true">🏆</span>
                                <div>
                                    <h4>{L(h.title)}</h4>
                                    <p>{L(h.text)}</p>
                                </div>
                            </div>
                        ))}
                        <div className="chips honor-chips">
                            {honors.badges.map((b, i) => <span className="chip" key={i}>{L(b)}</span>)}
                        </div>
                        <p className="honor-note">{L(honors.note)}</p>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

function Contact() {
    const { lang } = useLang()
    const L = useL()
    return (
        <section className="section" id="contact">
            <div className="container">
                <div className="contact-grid">
                    <Reveal className="contact-left">
                        <h2>{L(ui.sections.contact)}</h2>
                        <p className="section-sub">{L(ui.sections.contactSub)}</p>
                        <a href={`mailto:${site.email}`} className="contact-email">{site.email}</a>
                        <div className="contact-lines">
                            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{ICONS.phone} {site.phone}</a>
                            <a href={site.github} target="_blank" rel="noreferrer">{ICONS.github} github.com/sayouba2</a>
                            <a href={site.linkedin} target="_blank" rel="noreferrer">{ICONS.linkedin} LinkedIn — {lang === "fr" ? "Sayouba Ouedraogo" : "Sayouba Ouedraogo"}</a>
                        </div>
                        <img className="contact-illu" src={asset("images/illustrations/contactMailDark.svg")} alt="" loading="lazy" />
                    </Reveal>
                    <Reveal className="card form-card" delay={100}>
                        <ContactForm />
                    </Reveal>
                </div>
            </div>
        </section>
    )
}

export default function Home() {
    return (
        <>
            <Hero />
            <WhatIDo />
            <Experience />
            <Projects />
            <Journey />
            <Contact />
        </>
    )
}
