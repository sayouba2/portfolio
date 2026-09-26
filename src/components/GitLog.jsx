import { useState } from "react"
import { useL } from "../i18n.jsx"
import { ui, experiences, education, honors } from "../data/content.js"

/**
 * Le parcours raconté dans la langue d'un développeur : un `git log --graph`.
 * Les études sont la branche principale ; les stages, des branches qui en
 * partent ; les distinctions, des tags posés sur le commit où elles sont nées
 * (le détail des compétitions vit dans Scoreboard).
 * Survol = le corps du commit (le résumé). Clic = le diff (le détail).
 */
const HISTORY = [
    { ref: "centrale-casa", lane: 1, branch: "centrale-casablanca", head: true, scope: "centrale" },
    { ref: "spheralis", lane: 1, branch: "spheralis", scope: "spheralis" },
    { ref: "cmrpi", lane: 1, branch: "cmrpi", scope: "cmrpi", fork: true },
    { ref: "fst-marrakech", lane: 0, main: true, scope: "fst", tags: [0, 1] },
    { ref: "fst-settat", lane: 0, scope: "fst" },
    { ref: "lycee-bobo", lane: 0, scope: "lycée", root: true },
]

/** Empreinte stable et plausible pour un identifiant — pour les « commits ». */
function shortHash(s) {
    let h = 2166136261
    for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
    return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7)
}

// Un tag git ne supporte ni espaces ni accents : on dérive un nom lisible.
const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 34).replace(/-$/, "")

function resolve(h, L) {
    const branch = h.main ? "main" : h.branch && `${h.head ? "HEAD -> " : ""}${L(ui.path.branch)}/${h.branch}`
    const x = experiences.find((e) => e.id === h.ref)
    if (x) return { ...h, branch, kind: "stage", date: L(x.period), title: L(x.role), org: x.company, body: L(x.summary), diff: x.bullets.map(L), stack: x.tags }
    const e = education.find((e) => e.id === h.ref)
    return { ...h, branch, kind: "formation", date: L(e.period), title: L(e.title), org: L(e.institution), body: L(e.text), diff: [], stack: [] }
}

function Graph({ c, open }) {
    // Chaque ligne dessine sa part du graphe : quand un commit s'ouvre, les
    // traits s'allongent avec lui au lieu de se casser.
    return (
        <span className={`gl-graph lane-${c.lane}`} aria-hidden="true">
            <i className={`gl-rail r0 ${c.root ? "end" : ""}`} />
            {c.lane === 1 && <i className={`gl-rail r1 ${c.fork ? "fork" : ""} ${c.head ? "start" : ""}`} />}
            {c.fork && <i className="gl-curve" />}
            <i className={`gl-dot ${open ? "on" : ""}`} />
        </span>
    )
}

export default function GitLog() {
    const L = useL()
    const [open, setOpen] = useState(null)
    const commits = HISTORY.map((h) => resolve(h, L))

    return (
        <div className="gl">
            <ul className="gl-legend" data-reveal>
                <li className="stage"><i aria-hidden="true" />{L(ui.path.legend.stage)}</li>
                <li className="formation"><i aria-hidden="true" />{L(ui.path.legend.formation)}</li>
                <li className="tag"><i aria-hidden="true" />{L(ui.path.legend.tag)}</li>
            </ul>
            <p className="gl-prompt" data-reveal><span>~/sayouba</span> git log --graph --decorate</p>
            <ol className="gl-list">
                {commits.map((c) => {
                    const isOpen = open === c.ref
                    return (
                        <li key={c.ref} className={`gl-commit ${c.kind} ${isOpen ? "open" : ""}`} data-reveal>
                            <Graph c={c} open={isOpen} />
                            <button className="gl-head" onClick={() => setOpen(isOpen ? null : c.ref)} aria-expanded={isOpen}>
                                <span className="gl-line1">
                                    <span className="gl-hash">{shortHash(c.ref)}</span>
                                    {c.branch && <span className="gl-deco">({c.branch}{c.tags ? "," : ")"}</span>}
                                    {c.tags?.map((t, i) => (
                                        <span className="gl-tag" key={t}>
                                            tag: {slug(`${L(honors.competitions[t].title)} ${L(honors.competitions[t].rank)}`)}{i === c.tags.length - 1 ? ")" : ","}
                                        </span>
                                    ))}
                                    <span className="gl-date">{c.date}</span>
                                </span>
                                <span className="gl-msg">
                                    <span className="gl-type">{c.kind === "stage" ? `feat(${c.scope})` : `build(${c.scope})`}:</span> {c.title}
                                </span>
                                <span className="gl-author">{c.org}</span>
                                {/* Le corps du commit : le résumé, révélé au survol. */}
                                <span className="gl-body">{c.body}</span>
                            </button>

                            {/* Le diff : le détail, ouvert au clic. */}
                            {isOpen && (c.diff.length > 0 || c.stack.length > 0) && (
                                <div className="gl-diff">
                                    {c.stack.length > 0 && <p className="gl-hunk">@@ {c.stack.join(" · ")} @@</p>}
                                    {c.diff.map((d, i) => <p className="gl-add" key={i}><span>+</span>{d}</p>)}
                                </div>
                            )}
                        </li>
                    )
                })}
            </ol>
        </div>
    )
}
