import { Link, useParams, Navigate } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { ui, featuredProjects } from "../data/content.js"
import Reveal from "../components/Reveal.jsx"
import { Carousel } from "../components/Gallery.jsx"

export default function ProjectPage() {
    const L = useL()
    const { slug } = useParams()

    const index = featuredProjects.findIndex((p) => p.slug === slug)
    if (index === -1) return <Navigate to="/" replace />

    const project = featuredProjects[index]
    const next = featuredProjects[(index + 1) % featuredProjects.length]
    const cs = project.caseStudy

    return (
        <article className="project-page">
            <div className="container container-narrow">
                <Reveal className="project-head">
                    <Link to="/#projets" className="back-link"><span className="arr arr-l">←</span> {L(ui.project.back)}</Link>
                    <p className="project-kicker">
                        {L(ui.project.caseStudy)} · {L(ui.categories[project.category])}
                        {project.liveUrl && <> · {L(ui.project.online)}</>}
                    </p>
                    <h1>{project.title}</h1>
                    <p className="project-oneliner">{L(project.oneLiner)}</p>
                    <div className="chips">
                        {project.stack.map((t) => <span className="chip" key={t}>{t}</span>)}
                    </div>
                    <div className="project-actions">
                        {project.liveUrl && (
                            <a className="btn btn-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                                {L(ui.project.visit)} <span className="arr arr-ur">↗</span>
                            </a>
                        )}
                        {project.github && (
                            <a className="btn btn-outline" href={project.github} target="_blank" rel="noreferrer">
                                {L(ui.project.code)} <span className="arr arr-ur">↗</span>
                            </a>
                        )}
                    </div>
                </Reveal>

                {project.liveUrl && (
                    <Reveal className="project-block">
                        <h2>{L(ui.project.live)}</h2>
                        <div className="live-frame">
                            <iframe
                                src={project.liveUrl}
                                title={project.title}
                                loading="lazy"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                            />
                        </div>
                    </Reveal>
                )}

                {project.images.length > 0 && (
                    <Reveal className="project-block">
                        <h2>{L(ui.project.gallery)}</h2>
                        <Carousel images={project.images} title={project.title} />
                    </Reveal>
                )}

                <Reveal className="project-block">
                    <h2>{L(ui.project.context)}</h2>
                    <p>{L(cs.context)}</p>
                </Reveal>

                <Reveal className="project-block">
                    <h2>{L(ui.project.solution)}</h2>
                    <p>{L(cs.solution)}</p>
                </Reveal>

                <Reveal className="project-block">
                    <h2>{L(ui.project.features)}</h2>
                    <ul className="feature-list">
                        {cs.features.map((f, i) => <li key={i}>{L(f)}</li>)}
                    </ul>
                </Reveal>

                <Reveal className="project-block">
                    <h2>{L(ui.project.architecture)}</h2>
                    <p>{L(cs.architecture)}</p>
                    <div className="stack-groups">
                        {cs.stackGroups.map((g, i) => (
                            <div className="stack-group" key={i}>
                                <span className="stack-group-label">{L(g.label)}</span>
                                <span className="stack-group-items">{g.items}</span>
                            </div>
                        ))}
                    </div>
                </Reveal>

                <Reveal className="project-block takeaway">
                    <h2>{L(ui.project.takeaway)}</h2>
                    <p>{L(cs.takeaway)}</p>
                </Reveal>

                <Reveal className="project-next">
                    <span>{L(ui.project.next)}</span>
                    <Link to={`/projets/${next.slug}`} className="next-link">
                        {next.title} <span className="arr arr-r">→</span>
                    </Link>
                </Reveal>
            </div>
        </article>
    )
}
