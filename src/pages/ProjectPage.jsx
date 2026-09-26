import { Link, useParams, Navigate } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { ui, featuredProjects, screensFor } from "../data/content.js"
import Showcase from "../components/Showcase.jsx"
import { useHead } from "../components/useHead.js"
import { homeHead, projectHead } from "../seo.js"

/** Une ligne de l'étude de cas : l'intitulé en marge, le texte à droite. */
function Block({ title, className = "", children }) {
    return (
        <section className={`case-block ${className}`} data-reveal>
            <h2 className="eyebrow">{title}</h2>
            <div className="case-text">{children}</div>
        </section>
    )
}

export default function ProjectPage() {
    const L = useL()
    const { slug } = useParams()

    const index = featuredProjects.findIndex((p) => p.slug === slug)
    // Appelé avant la redirection : un hook ne se saute pas.
    useHead(index === -1 ? homeHead(L) : projectHead(featuredProjects[index], L))
    if (index === -1) return <Navigate to="/" replace />

    const project = featuredProjects[index]
    const next = featuredProjects[(index + 1) % featuredProjects.length]
    const cs = project.caseStudy

    return (
        <article className="case">
            <header className="section case-head">
                <Link to="/#projets" className="link" data-reveal>← {L(ui.project.back)}</Link>
                <p className="kicker" data-reveal>
                    {L(ui.project.caseStudy)} · {L(ui.categories[project.category])}
                    {project.liveUrl && <> · {L(ui.project.online)}</>}
                </p>
                <h1 className="title" data-reveal="title">{project.title}</h1>
                <p className="case-lead" data-reveal>{L(project.oneLiner)}</p>
                <p className="project-stack" data-reveal>{project.stack.join(" · ")}</p>
                {(project.liveUrl || project.github) && (
                    <div className="modal-actions" data-reveal>
                        {project.liveUrl && <a className="btn" href={project.liveUrl} target="_blank" rel="noreferrer">{L(ui.project.visit)} ↗</a>}
                        {project.github && <a className="btn ghost" href={project.github} target="_blank" rel="noreferrer">{L(ui.project.code)} ↗</a>}
                    </div>
                )}
            </header>

            <div className="section case-shots" data-reveal="frame">
                <Showcase title={project.title} shots={screensFor(project.slug)} />
            </div>

            <div className="section case-body">
                <Block title={L(ui.project.context)}><p>{L(cs.context)}</p></Block>
                <Block title={L(ui.project.solution)}><p>{L(cs.solution)}</p></Block>
                <Block title={L(ui.project.features)}>
                    <ul className="modal-list">
                        {cs.features.map((f, i) => <li key={i}>{L(f)}</li>)}
                    </ul>
                </Block>
                <Block title={L(ui.project.architecture)}>
                    <p>{L(cs.architecture)}</p>
                    <dl className="case-stack">
                        {cs.stackGroups.map((g, i) => (
                            <div key={i}>
                                <dt>{L(g.label)}</dt>
                                <dd>{g.items}</dd>
                            </div>
                        ))}
                    </dl>
                </Block>
                <Block title={L(ui.project.takeaway)} className="takeaway">
                    <p className="modal-lead">{L(cs.takeaway)}</p>
                </Block>
            </div>

            {next.slug !== project.slug && (
                <nav className="section case-next" aria-label={L(ui.project.next)} data-reveal>
                    <span className="eyebrow">{L(ui.project.next)}</span>
                    <Link to={`/projets/${next.slug}`}>{next.title} →</Link>
                </nav>
            )}
        </article>
    )
}
