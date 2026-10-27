import { useEffect, useRef, useState } from "react"
import { useL } from "../i18n.jsx"
import { asset, education, experiences, honors, pfe, site, whatIDo } from "../data/content.js"
import { useHead } from "../components/useHead.js"
import { SocialLinks } from "../components/SocialLinks.jsx"
import "./about.css"

const copy = {
    page: { fr: "À propos", en: "About" },
    introduction: { fr: "Un peu plus", en: "A little more" },
    about: { fr: "SUR MOI", en: "ABOUT ME" },
    who: { fr: "QUI", en: "WHO" },
    am: { fr: "SUIS-JE ?", en: "AM I?" },
    hello: { fr: "Moi, c’est Sayouba.", en: "Hey, I’m Sayouba." },
    bio: {
        fr: "Étudiant ingénieur en Réseaux et Systèmes d’Information à la FST de Marrakech, je suis passionné par les idées qui deviennent des produits concrets. Je développe des applications web, mobiles et IA, avec autant d’attention portée à l’interface qu’à ce qui se passe derrière.",
        en: "I’m a Networks and Information Systems engineering student at the FST in Marrakech, passionate about turning ideas into real products. I build web, mobile and AI applications, giving the interface as much attention as the systems behind it.",
    },
    approach: {
        fr: "Mes stages, mes projets et les hackathons m’ont appris à comprendre un besoin, construire une solution et aller jusqu’à sa mise en ligne. Ce qui me motive : apprendre, résoudre des problèmes et créer des outils réellement utiles.",
        en: "Internships, personal projects and hackathons have taught me to understand a need, build a solution and see it through to deployment. What drives me is learning, solving problems and creating tools that are truly useful.",
    },
    cv: { fr: "Télécharger mon CV", en: "Download my resume" },
    contact: { fr: "Discutons ensemble", en: "Let’s talk" },
    scroll: { fr: "DÉCOUVRIR MON UNIVERS", en: "DISCOVER MY WORLD" },
    journeyScript: { fr: "Le chemin", en: "The journey" },
    journeyTitle: { fr: "PARCOURU", en: "SO FAR" },
    experience: { fr: "Expériences", en: "Experience" },
    education: { fr: "Formation", en: "Education" },
    servicesScript: { fr: "Ce que", en: "What" },
    servicesTitle: { fr: "JE FAIS", en: "I DO" },
    stackScript: { fr: "Mes outils", en: "My creative" },
    stackTitle: { fr: "AU QUOTIDIEN", en: "TOOLBOX" },
    stackText: { fr: "Les technologies avec lesquelles je transforme les idées en expériences.", en: "The technologies I use to turn ideas into experiences." },
    ai: { fr: "IA", en: "AI" },
    awardsScript: { fr: "Au-delà", en: "Beyond" },
    awardsTitle: { fr: "DU CODE", en: "THE CODE" },
    awardsText: { fr: "Créer en équipe, relever des défis et partager ce que j’apprends.", en: "Building together, taking on challenges and sharing what I learn." },
    project: { fr: "Projet", en: "Project" },
    contactScript: { fr: "La prochaine", en: "The next" },
    contactTitle: { fr: "AVENTURE ?", en: "CHAPTER?" },
    technologies: { fr: "Filtrer les technologies", en: "Filter technologies" },
    approachScript: { fr: "Ma", en: "My" },
    approachTitle: { fr: "DÉMARCHE", en: "APPROACH" },
    statTech: { fr: "Technologies au quotidien", en: "Technologies in use" },
    statExperience: { fr: "Expériences professionnelles", en: "Professional experiences" },
    statWins: { fr: "Hackathons remportés", en: "Hackathons won" },
}

const phases = [
    { title: { fr: "Comprendre", en: "Understand" }, text: { fr: "Écouter le besoin, cadrer le problème et définir ce qui compte vraiment.", en: "Listen to the need, frame the problem and define what really matters." } },
    { title: { fr: "Construire", en: "Build" }, text: { fr: "Concevoir l’architecture, développer l’interface et les services, tester en continu.", en: "Design the architecture, build the interface and services, test continuously." } },
    { title: { fr: "Déployer", en: "Ship" }, text: { fr: "Mettre en ligne, mesurer et faire évoluer la solution avec ses utilisateurs.", en: "Go live, measure and evolve the solution with its users." } },
]

// Titre des panneaux « Ce que je fais » : un mot fort, un mot manuscrit, une image en noir et blanc.
const serviceArt = {
    fullstack: { image: "images/projects/smart_attend/web/2-1200.webp", bold: { fr: "Full Stack", en: "Full Stack" }, script: { fr: "Développement web", en: "Web development" } },
    mobile: { image: "images/pictures/profile-web.jpg", bold: { fr: "Mobile", en: "Mobile" }, script: { fr: "Applications", en: "Applications" } },
    ai: { image: "images/projects/glaucoma_detection/web/7-1200.webp", bold: { fr: "IA", en: "AI" }, script: { fr: "& Automatisation", en: "& Automation" } },
}

/**
 * Chaque [data-scene] reçoit --p, sa progression de 0 à 1 : pendant qu'il est
 * épinglé ("pin" : section haute à enfant sticky) ou pendant qu'il traverse
 * l'écran ("pass"). Le CSS fait le reste ; sans animation, --p garde sa valeur de repos.
 */
function useScenes() {
    useEffect(() => {
        const scenes = [...document.querySelectorAll("[data-scene]")]
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frame = 0
        const paint = () => {
            frame = 0
            const vh = window.innerHeight
            for (const el of scenes) {
                const r = el.getBoundingClientRect()
                if (r.bottom < -vh || r.top > vh * 2) continue
                const p = el.dataset.scene === "pin" ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height)
                el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4))
            }
        }
        const update = () => { if (!frame && !reduced.matches) frame = requestAnimationFrame(paint) }
        const sync = () => {
            cancelAnimationFrame(frame)
            frame = 0
            if (reduced.matches) scenes.forEach((el) => el.style.removeProperty("--p"))
            else paint()
        }
        sync()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        reduced.addEventListener("change", sync)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener("scroll", update)
            window.removeEventListener("resize", update)
            reduced.removeEventListener("change", sync)
        }
    }, [])
}

function Counter({ value }) {
    const ref = useRef(null)
    const [shown, setShown] = useState(value)
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined
        let frame = 0
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            observer.disconnect()
            const start = performance.now()
            const tick = (now) => {
                const t = Math.min(1, (now - start) / 1400)
                setShown(Math.round(value * (1 - (1 - t) ** 3)))
                if (t < 1) frame = requestAnimationFrame(tick)
            }
            frame = requestAnimationFrame(tick)
        }, { threshold: .6 })
        observer.observe(ref.current)
        return () => { observer.disconnect(); cancelAnimationFrame(frame) }
    }, [value])
    return <span ref={ref}>{shown}</span>
}

const technologies = [
    { name: "React", icon: "react", categories: ["frontend"] },
    { name: "JavaScript", icon: "javascript", categories: ["frontend"] },
    { name: "TypeScript", icon: "typescript", categories: ["frontend"] },
    { name: "Flutter", icon: "flutter", categories: ["frontend"] },
    { name: "Node.js", icon: "nodejs", categories: ["backend"] },
    { name: "Python", icon: "python", categories: ["backend", "ai"] },
    { name: "FastAPI", icon: "fastapi", categories: ["backend", "ai"] },
    { name: "Spring Boot", icon: "spring", categories: ["backend"] },
    { name: "Java", icon: "java", categories: ["backend"] },
    { name: "Laravel", icon: "laravel", categories: ["backend"] },
    { name: "PHP", icon: "php", categories: ["backend"] },
    { name: "PostgreSQL", icon: "postgresql", categories: ["backend"] },
    { name: "MySQL", icon: "mysql", categories: ["backend"] },
    { name: "Docker", icon: "docker", categories: ["devops"] },
    { name: "Git", icon: "git", categories: ["devops"] },
]

function Heading({ script, title, id, text }) {
    return (
        <header className="about-heading">
            <h2 id={id}><span className="about-heading-script">{script}</span><span className="about-heading-bold">{title}</span></h2>
            {text && <p>{text}</p>}
        </header>
    )
}

const GRAVITY = 2200 // px/s²
const BOUNCE = .35

/**
 * Les technologies sont des billes dans une boîte : la gravité les fait tomber,
 * celles de la catégorie choisie montent (gravité inversée). On peut les attraper
 * et les lancer. Sans animation, la simulation est jouée d'un coup : elles se posent.
 */
function TechPit() {
    const L = useL()
    const [filter, setFilter] = useState("frontend")
    const filterRef = useRef(filter)
    const pitRef = useRef(null)
    const settleRef = useRef(null)
    const filters = [
        { id: "frontend", label: "Frontend" },
        { id: "backend", label: "Backend" },
        { id: "ai", label: L(copy.ai) },
        { id: "devops", label: "DevOps" },
    ]
    const select = (id) => {
        setFilter(id)
        filterRef.current = id
        settleRef.current?.()
    }

    useEffect(() => {
        const pit = pitRef.current
        const balls = [...pit.children]
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        let w = 0, h = 0, r = 40, frame = 0, last = 0, dragged = null, pointer = null
        const measure = () => {
            w = pit.clientWidth
            h = pit.clientHeight
            r = w < 600 ? 30 : 40
            pit.style.setProperty("--size", `${r * 2}px`)
        }
        measure()
        const bodies = technologies.map((tech) => ({ tech, x: r + Math.random() * (w - 2 * r), y: r + Math.random() * h / 2, vx: 0, vy: 0, a: 0 }))

        const step = (dt) => {
            for (const b of bodies) {
                if (b === dragged) continue
                b.vy += GRAVITY * dt * (b.tech.categories.includes(filterRef.current) ? -1 : 1)
                b.vx *= .995
                b.x += b.vx * dt
                b.y += b.vy * dt
            }
            for (let pass = 0; pass < 4; pass++) {
                for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
                    const p = bodies[i], q = bodies[j]
                    const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy)
                    if (d >= 2 * r || d === 0) continue
                    const nx = dx / d, ny = dy / d, push = 2 * r - d
                    const pShare = p === dragged ? 0 : q === dragged ? 1 : .5
                    p.x -= nx * push * pShare; p.y -= ny * push * pShare
                    q.x += nx * push * (1 - pShare); q.y += ny * push * (1 - pShare)
                    const vn = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny
                    if (vn < 0) {
                        const impulse = -(1 + BOUNCE) * vn / 2
                        p.vx -= impulse * nx; p.vy -= impulse * ny
                        q.vx += impulse * nx; q.vy += impulse * ny
                    }
                }
                for (const b of bodies) {
                    if (b.x < r) { b.x = r; b.vx = Math.abs(b.vx) * BOUNCE }
                    if (b.x > w - r) { b.x = w - r; b.vx = -Math.abs(b.vx) * BOUNCE }
                    if (b.y < r) { b.y = r; b.vy = Math.abs(b.vy) * BOUNCE; b.vx *= .9 }
                    if (b.y > h - r) { b.y = h - r; b.vy = -Math.abs(b.vy) * BOUNCE; b.vx *= .9 }
                }
            }
            for (const b of bodies) b.a += b.vx * dt / r
        }
        const paint = () => bodies.forEach((b, i) => {
            balls[i].style.transform = `translate(${b.x - r}px, ${b.y - r}px)`
            balls[i].firstChild.style.transform = `rotate(${b.a}rad)`
        })
        const tick = (now) => {
            // Pas fixe de 1/120 s : même vitesse quel que soit l'écran (60, 120 Hz…).
            const steps = Math.min(8, Math.max(1, Math.round((now - (last || now - 16.7)) / (1000 / 120))))
            last = now
            for (let s = 0; s < steps; s++) step(1 / 120)
            paint()
            frame = requestAnimationFrame(tick)
        }
        const settle = () => {
            for (let s = 0; s < 360; s++) step(1 / 120)
            paint()
        }
        const start = () => { if (!frame && !reduced) { last = 0; frame = requestAnimationFrame(tick) } }
        const stop = () => { cancelAnimationFrame(frame); frame = 0 }

        const local = (e) => { const box = pit.getBoundingClientRect(); return { x: e.clientX - box.left, y: e.clientY - box.top, t: e.timeStamp } }
        const down = (e) => {
            const ball = e.target.closest(".tech-ball")
            if (!ball || reduced) return
            dragged = bodies[balls.indexOf(ball)]
            pointer = local(e)
            pit.setPointerCapture(e.pointerId)
        }
        const move = (e) => {
            if (!dragged) return
            const next = local(e), dt = Math.max(1, next.t - pointer.t) / 1000
            dragged.vx = (next.x - pointer.x) / dt
            dragged.vy = (next.y - pointer.y) / dt
            dragged.x = Math.min(w - r, Math.max(r, next.x))
            dragged.y = Math.min(h - r, Math.max(r, next.y))
            pointer = next
        }
        const up = () => {
            if (!dragged) return
            const speed = Math.hypot(dragged.vx, dragged.vy), max = 2400
            if (speed > max) { dragged.vx *= max / speed; dragged.vy *= max / speed }
            dragged = null
        }

        paint()
        pit.setAttribute("data-live", "")
        const resize = new ResizeObserver(() => { measure(); if (reduced) settle() })
        resize.observe(pit)
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !document.hidden) start()
            else stop()
        })
        observer.observe(pit)
        const visibility = () => { if (document.hidden) stop() }
        document.addEventListener("visibilitychange", visibility)
        pit.addEventListener("pointerdown", down)
        pit.addEventListener("pointermove", move)
        pit.addEventListener("pointerup", up)
        pit.addEventListener("pointercancel", up)
        if (reduced) { settleRef.current = settle; settle() }
        return () => {
            stop()
            resize.disconnect()
            observer.disconnect()
            document.removeEventListener("visibilitychange", visibility)
            pit.removeEventListener("pointerdown", down)
            pit.removeEventListener("pointermove", move)
            pit.removeEventListener("pointerup", up)
            pit.removeEventListener("pointercancel", up)
            settleRef.current = null
        }
    }, [])

    return (
        <>
            <div className="skill-filters" role="group" aria-label={L(copy.technologies)}>
                {filters.map((item) => <button type="button" className={filter === item.id ? "skill-filter skill-filter-active" : "skill-filter"} key={item.id} onClick={() => select(item.id)} aria-pressed={filter === item.id}>{item.label}</button>)}
            </div>
            <ul className="tech-pit" ref={pitRef}>
                {technologies.map((tech) => (
                    <li className={tech.categories.includes(filter) ? "tech-ball is-active" : "tech-ball"} key={tech.name} title={tech.name}>
                        <img src={asset(`images/tech/${tech.icon}.svg`)} alt={tech.name} loading="lazy" width="40" height="40" draggable="false" />
                    </li>
                ))}
            </ul>
        </>
    )
}

export default function About({ onContact }) {
    const L = useL()
    useHead({ title: `${L(copy.page)} — ${site.name}`, description: L(site.description), path: "/about" })
    useScenes()
    const openContact = () => {
        if (onContact) onContact()
        else window.location.href = `mailto:${site.email}`
    }
    const who = <><span>{L(copy.who)}</span> {L(copy.am)}</>
    const stats = [
        { value: technologies.length, suffix: "+", label: copy.statTech },
        { value: experiences.length, label: copy.statExperience },
        { value: honors.competitions.filter((award) => award.place === 1).length, label: copy.statWins },
    ]

    return (
        <div className="about-page">
            <section className="about-hero-scene" data-scene="pin" aria-labelledby="about-hero-title">
                <div className="about-hero">
                    <div className="about-hero-name" aria-hidden="true">SAYOUBA</div>
                    <img className="about-hero-portrait" src={asset(site.portrait)} alt={site.name} fetchPriority="high" />
                    <div className="about-hero-copy">
                        <p>{L(copy.introduction)}</p>
                        <h1 id="about-hero-title">{L(copy.about)}</h1>
                    </div>
                    <a className="about-hero-scroll" href="#about-introduction"><span>{L(copy.scroll)}</span><span aria-hidden="true">↓</span></a>
                    <span className="about-signature" aria-hidden="true">Sayouba</span>
                </div>
            </section>

            <section className="about-who-scene" id="about-introduction" data-scene="pin" aria-labelledby="about-who-title">
                <div className="about-who-sticky">
                    <h2 className="about-who-title" id="about-who-title">
                        <span className="about-who-row" aria-hidden="true">{who}</span>
                        <span className="about-who-row">{who}</span>
                        <span className="about-who-row" aria-hidden="true">{who}</span>
                    </h2>
                </div>
            </section>

            <div className="about-section about-introduction">
                <div className="about-bio-grid">
                    <div className="about-bio-copy">
                        <p className="about-eyebrow">{L(site.role)} · {L(site.location)}</p>
                        <h3>{L(copy.hello)}</h3>
                        <p>{L(copy.bio)}</p>
                        <p>{L(copy.approach)}</p>
                        <div className="about-bio-actions">
                            <a className="about-button" href={asset(L(site.cvUrl))} download>{L(copy.cv)}<span aria-hidden="true">{"↗\uFE0E"}</span></a>
                            <button className="about-text-link" type="button" onClick={openContact}>{L(copy.contact)}<span aria-hidden="true">{"↗\uFE0E"}</span></button>
                        </div>
                        <SocialLinks />
                    </div>
                    <figure className="about-bio-photo">
                        <img src={asset(site.portrait)} alt={site.name} loading="lazy" width="640" height="800" />
                        <figcaption><span>Sayouba Ouedraogo</span><span>Marrakech, MA</span></figcaption>
                    </figure>
                    <dl className="about-stats">
                        {stats.map((stat) => <div key={stat.label.en}><dt>{L(stat.label)}</dt><dd><Counter value={stat.value} />{stat.suffix}</dd></div>)}
                    </dl>
                </div>
            </div>

            <div className="tech-marquee" aria-hidden="true">
                <div>{[...technologies, ...technologies].map((tech, i) => <span key={i}><img src={asset(`images/tech/${tech.icon}.svg`)} alt="" width="16" height="16" />{tech.name}</span>)}</div>
            </div>

            <section className="about-section about-approach" data-scene="pass" aria-labelledby="about-approach-title">
                <Heading id="about-approach-title" script={L(copy.approachScript)} title={L(copy.approachTitle)} />
                <div className="approach-track">
                    <svg className="approach-path" viewBox="0 0 1200 420" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M-60 70H1010C1180 70 1180 330 1010 330H150C40 330 40 470 150 470" /></svg>
                    <ol className="approach-phases">
                        {phases.map((phase, index) => <li key={phase.title.en}><span>Phase {index + 1}</span><h3>{L(phase.title)}</h3><p>{L(phase.text)}</p></li>)}
                    </ol>
                </div>
            </section>

            <section className="about-section about-journey" aria-labelledby="about-journey-title">
                <Heading id="about-journey-title" script={L(copy.journeyScript)} title={L(copy.journeyTitle)} />
                <div className="about-journey-grid">
                    <div className="about-journey-column">
                        <h3 className="about-column-title"><span aria-hidden="true">{"↗\uFE0E"}</span>{L(copy.experience)}</h3>
                        <ol className="about-timeline">
                            {experiences.map((entry) => (
                                <li className="about-timeline-item" key={entry.id}>
                                    <p className="about-timeline-date">{L(entry.period)}</p>
                                    <h4>{entry.company}</h4>
                                    <p className="about-timeline-role">{L(entry.role)}</p>
                                    <p className="about-timeline-summary">{L(entry.summary)}</p>
                                    <div className="about-tags">{entry.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="about-journey-column">
                        <h3 className="about-column-title"><span aria-hidden="true">{"↗\uFE0E"}</span>{L(copy.education)}</h3>
                        <ol className="about-timeline">
                            {education.map((entry) => (
                                <li className="about-timeline-item" key={entry.id}>
                                    <p className="about-timeline-date">{L(entry.period)}</p>
                                    <h4>{L(entry.title)}</h4>
                                    <p className="about-timeline-role">{L(entry.institution)}</p>
                                    <p className="about-timeline-summary">{L(entry.text)}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            <section className="expertise-section" aria-labelledby="expertise-title">
                <div className="about-section"><Heading id="expertise-title" script={L(copy.servicesScript)} title={L(copy.servicesTitle)} /></div>
                {whatIDo.map((service, index) => (
                    <article className="service-panel" key={service.id} aria-label={L(service.title)}>
                        <img src={asset(serviceArt[service.id].image)} alt="" loading="lazy" decoding="async" />
                        <div className="service-panel-copy">
                            <span className="service-panel-index">0{index + 1}</span>
                            <h3><strong>{L(serviceArt[service.id].bold)}</strong><em>{L(serviceArt[service.id].script)}</em></h3>
                            <ul>{service.bullets.map((bullet, i) => <li key={i}>{L(bullet)}</li>)}</ul>
                            <div className="expertise-logos">{service.logos.slice(0, 5).map((logo) => <img key={logo} src={asset(`images/tech/${logo}.svg`)} alt={logo} loading="lazy" width="24" height="24" />)}</div>
                        </div>
                    </article>
                ))}
            </section>

            <section className="about-section skill-section" aria-labelledby="skill-title">
                <Heading id="skill-title" script={L(copy.stackScript)} title={L(copy.stackTitle)} text={L(copy.stackText)} />
                <TechPit />
            </section>

            <section className="about-section about-awards" aria-labelledby="about-awards-title">
                <Heading id="about-awards-title" script={L(copy.awardsScript)} title={L(copy.awardsTitle)} text={L(copy.awardsText)} />
                <ol className="about-awards-list">
                    {honors.competitions.map((award) => (
                        <li className="about-award" key={award.id}>
                            <span className="about-award-rank">{L(award.rank)}</span>
                            <div><h3>{L(award.title)}</h3><p>{L(award.meta)}</p>{(award.project || award.withName) && <span className="about-award-project">{L(copy.project)} : {award.project === "smart-recruit" ? "Smart Recruit" : L(award.withName)}</span>}</div>
                            <span className="about-award-arrow" aria-hidden="true">{"↗\uFE0E"}</span>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="about-section about-contact" aria-labelledby="about-contact-title">
                <Heading id="about-contact-title" script={L(copy.contactScript)} title={L(copy.contactTitle)} />
                <p>{L(pfe.text)}</p>
                <button className="about-button" type="button" onClick={openContact}>{L(copy.contact)}<span aria-hidden="true">{"↗\uFE0E"}</span></button>
            </section>
        </div>
    )
}
