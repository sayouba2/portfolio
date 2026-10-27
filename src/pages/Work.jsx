import { useState } from "react"
import { Link } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { asset, featuredProjects, otherProjects, screensFor, site } from "../data/content.js"
import { useHead } from "../components/useHead.js"
import "./work.css"

const copy = {
    title: { fr: "Projets", en: "Work" },
    description: { fr: "Une sélection de mes projets web et IA : SmartAttend, Smart Recruit, vision par ordinateur et agents RAG.", en: "A selection of my web and AI projects: SmartAttend, Smart Recruit, computer vision and RAG agents." },
    filter: { fr: "Filtrer", en: "Filter" },
    filters: { fr: "Filtrer les projets", en: "Filter projects" },
    all: { fr: "Tous", en: "All" },
    fullstack: { fr: "Full stack", en: "Full stack" },
    ai: { fr: "Intelligence artificielle", en: "AI integrations" },
    list: { fr: "Vue liste", en: "List view" },
    grid: { fr: "Vue grille", en: "Grid view" },
    details: { fr: "Découvrir", en: "Explore" },
    source: { fr: "Voir le code", en: "View source" },
    results: { fr: "projets", en: "projects" },
    technologies: { fr: "Technologies", en: "Technologies" },
}

const projects = [
    ...featuredProjects.map(project => ({
        id: project.slug,
        title: project.title,
        description: project.oneLiner,
        tags: project.stack,
        href: `/projets/${project.slug}`,
        image: screensFor(project.slug)[0]?.page || project.images?.[0],
        internal: true,
        categories: ["fullstack", "ai"],
        type: project.slug === "smartattend"
            ? { fr: "Reconnaissance faciale · Application web", en: "Facial recognition · Web application" }
            : { fr: "Recrutement IA · Entretiens en temps réel", en: "AI recruitment · Real-time interviews" },
    })),
    ...otherProjects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.text,
        tags: project.tags,
        href: project.github,
        image: screensFor(project.id)[0]?.page || project.images?.[0] || "images/projects/ai_rag_agent/1.png",
        internal: false,
        categories: [project.category === "ai" ? "ai" : "fullstack"],
        type: project.id === "glaucoma"
            ? { fr: "Vision par ordinateur · Santé", en: "Computer vision · Healthcare" }
            : { fr: "Agent IA · Recherche documentaire", en: "AI agent · Document retrieval" },
    })),
]

function Icon({ name }) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {name === "filter" && <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />}
        {name === "list" && <><path d="M7 6h14M7 12h14M7 18h14" /><path d="M3 6h.1M3 12h.1M3 18h.1" /></>}
        {name === "grid" && <><rect x="3" y="3" width="7" height="7" rx=".5" /><rect x="14" y="3" width="7" height="7" rx=".5" /><rect x="3" y="14" width="7" height="7" rx=".5" /><rect x="14" y="14" width="7" height="7" rx=".5" /></>}
        {name === "arrow" && <path d="M5 19 19 5M5 5h14v14" />}
    </svg>
}

function ProjectLink({ project, className, children, ...props }) {
    return project.internal
        ? <Link className={className} to={project.href} {...props}>{children}</Link>
        : <a className={className} href={project.href} target="_blank" rel="noreferrer" {...props}>{children}</a>
}

export default function Work() {
    const L = useL()
    const [view, setView] = useState("grid")
    const [filterOpen, setFilterOpen] = useState(false)
    const [filter, setFilter] = useState("all")
    const visibleProjects = filter === "all" ? projects : projects.filter(project => project.categories.includes(filter))

    useHead({ title: `${L(copy.title)} — ${site.name}`, description: L(copy.description), path: "/work" })

    return <div className="work-page">
        <header className="work-heading">
            <h1>{L({ fr: <>Quand les <em>Idées</em><br />prennent <em>Vie</em></>, en: <>When <em>Ideas</em><br />Meet <em>Implementation</em></> })}</h1>
        </header>

        <section className="work-collection" aria-label={L(copy.title)}>
            <div className="work-toolbar">
                <button type="button" className={`work-filter-button${filterOpen ? " is-open" : ""}`} aria-expanded={filterOpen} aria-controls="work-filters" onClick={() => setFilterOpen(!filterOpen)}>
                    <Icon name="filter" /> {L(copy.filter)}{filter !== "all" && <span className="work-filter-dot" />}
                </button>
                <div className="work-view-controls" role="group" aria-label={L({ fr: "Affichage des projets", en: "Project layout" })}>
                    <button type="button" className="work-view-button" aria-label={L(copy.list)} aria-pressed={view === "list"} onClick={() => setView("list")}><Icon name="list" /></button>
                    <button type="button" className="work-view-button" aria-label={L(copy.grid)} aria-pressed={view === "grid"} onClick={() => setView("grid")}><Icon name="grid" /></button>
                </div>
            </div>

            <div className="work-filters" id="work-filters" hidden={!filterOpen} role="group" aria-label={L(copy.filters)}>
                {["all", "fullstack", "ai"].map(value => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{L(copy[value])}</button>)}
            </div>

            <p className="work-result-count" aria-live="polite">{visibleProjects.length} {L(copy.results)}</p>

            <div className={`work-projects work-projects--${view}`}>
                {visibleProjects.map((project, index) => <article className="work-card" key={project.id}>
                    <ProjectLink project={project} className="work-card-image" aria-label={L(project.title)}>
                        <img src={asset(project.image)} alt={L(project.title)} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
                        <span className="work-image-action">{L(project.internal ? copy.details : copy.source)} <Icon name="arrow" /></span>
                    </ProjectLink>
                    <div className="work-card-copy">
                        <p className="work-card-type">{L(project.type)}</p>
                        <h2><ProjectLink project={project}>{L(project.title)}</ProjectLink></h2>
                        <p className="work-card-description">{L(project.description)}</p>
                        <ul className="work-card-tags" aria-label={L(copy.technologies)}>{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
                        <ProjectLink project={project} className="work-card-visit">{L(project.internal ? copy.details : copy.source)} <Icon name="arrow" /></ProjectLink>
                    </div>
                </article>)}
            </div>
        </section>
    </div>
}
