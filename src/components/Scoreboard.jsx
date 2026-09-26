import { Link } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { ui, honors, featuredProjects } from "../data/content.js"

/**
 * Le champ des concurrents : un point par équipe, les `top` premiers allumés.
 * Montre l'échelle d'un classement mieux qu'un chiffre seul — « top 10 »
 * ne dit pas la même chose sur 12 équipes que sur 200.
 */
function Field({ rank, top, field }) {
    const L = useL()
    const label = `${rank} / ${field} ${L(ui.competitions.teams)}`
    return (
        <figure className={`cp-field ${field > 60 ? "dense" : ""}`}>
            <span className="cp-dots" role="img" aria-label={label}>
                {Array.from({ length: field }, (_, i) => (
                    <i key={i} className={i < top ? "on" : undefined} style={i < top ? { "--k": i } : undefined} />
                ))}
            </span>
            <figcaption>{label}</figcaption>
        </figure>
    )
}

/** Les hackathons, présentés comme un tableau de classement. */
export default function Scoreboard() {
    const L = useL()
    return (
        <ol className="cp-board">
            {honors.competitions.map((c) => {
                const project = c.project && featuredProjects.find((p) => p.slug === c.project)
                const kind = c.role ? "role" : c.place === 1 ? "first" : ""
                return (
                    <li key={c.id} className={`cp-row ${kind}`} data-reveal>
                        <span className="cp-rank">{L(c.rank)}</span>
                        <div className="cp-body">
                            <h3>{L(c.title)}</h3>
                            {c.meta && <p className="cp-meta">{L(c.meta)}</p>}
                            {project && (
                                <Link className="link" to={`/projets/${project.slug}`}>
                                    {L(ui.competitions.with)} {project.title} →
                                </Link>
                            )}
                            {c.withName && <p className="cp-with">{L(ui.competitions.with)} {c.withName}</p>}
                        </div>
                        {c.field && <Field rank={L(c.rank)} top={c.top} field={c.field} />}
                    </li>
                )
            })}
        </ol>
    )
}
