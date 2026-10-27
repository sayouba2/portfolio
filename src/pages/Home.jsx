import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useL, useLang } from "../i18n.jsx"
import { site, featuredProjects, otherProjects, asset, screensFor } from "../data/content.js"
import LiquidOrb from "../components/LiquidOrb.jsx"
import { useHead } from "../components/useHead.js"
import { homeHead } from "../seo.js"

export function SectionTitle({ first, second }) {
    return <h2 className="script-title" data-reveal><span>{first}</span><strong>{second}</strong></h2>
}

function CircularContact({ onContact }) {
    const L = useL()
    return <div className="circular-contact"><svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="hire-circle" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"/></defs><text><textPath href="#hire-circle" textLength="488">React ✳ Mobile ✳ Full Stack ✳ IA ✳ </textPath></text></svg><button onClick={onContact}>{L({ fr: "Parlons !", en: "Hire Me" })}</button></div>
}

function AboutStatement() {
    const L = useL()
    const ref = useRef(null)
    const { lang } = useLang()
    const text = L({ fr: "Je développe des applications web et mobiles, des agents IA et des solutions sur mesure qui simplifient le quotidien et répondent à de vrais besoins.", en: "Building web and mobile applications, AI agents, and tailored solutions that simplify everyday operations and solve real business challenges." })
    useEffect(() => {
        const node = ref.current
        const words = [...node.children]
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frame = 0
        const paint = () => {
            frame = 0
            const rect = node.getBoundingClientRect()
            const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (window.innerHeight * .85 - rect.top) / (rect.height + window.innerHeight * .25)))
            words.forEach((word, i) => word.style.setProperty("--word-opacity", progress > i / words.length ? "1" : ".18"))
        }
        const update = () => { if (!frame) frame = requestAnimationFrame(paint) }
        paint()
        window.addEventListener("scroll", update, { passive: true })
        window.addEventListener("resize", update)
        reduced.addEventListener("change", update)
        return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); reduced.removeEventListener("change", update) }
    }, [lang])
    return <p ref={ref} className="about-statement">{text.split(" ").map((word, i) => <span key={`${lang}-${i}`}>{word}{" "}</span>)}</p>
}

export default function Home({ onContact }) {
    const L = useL()
    const { lang } = useLang()
    const [preview, setPreview] = useState(null)
    const previewRef = useRef(null)
    useHead(homeHead(L))
    const projects = [...featuredProjects.map(p => ({ key: p.slug, title: p.title, image: screensFor(p.slug)[0]?.page, to: `/projets/${p.slug}`, type: L(p.type) })), ...otherProjects.map(p => ({ key: p.id, title: L(p.title), image: screensFor(p.id)[0]?.page || "images/projects/ai_rag_agent/1.png", to: p.github, type: p.id === "glaucoma" ? L({ fr: "Vision par ordinateur", en: "Computer vision" }) : L({ fr: "Assistant documentaire · RAG", en: "Document assistant · RAG" }) }))]
    const movePreview = e => {
        if (e.pointerType === "touch" || !previewRef.current) return
        previewRef.current.style.left = `${Math.min(window.innerWidth - 210, Math.max(210, e.clientX))}px`
        previewRef.current.style.top = `${Math.min(window.innerHeight - 150, Math.max(150, e.clientY))}px`
    }
    return <>
        <section className="home-hero" aria-labelledby="hero-heading">
            <div className="hero-orb-wrap"><LiquidOrb /></div>
            <div className="hero-copy">
                <h1 id="hero-heading">{lang === "fr" ? <>Des <em>Idées</em><br/>Aux <em>Solutions<br className="hero-title-break"/> Intelligentes</em></> : <>Turning <em>Ideas</em><br/>Into <em>AI-Powered<br className="hero-title-break"/> Solutions</em></>}</h1>
                <p>{lang === "fr" ? <>Développeur <strong>Full Stack</strong> passionné, je donne vie à vos idées à travers des <strong>applications web, mobiles</strong> et des <strong>solutions IA</strong>.</> : <>As a passionate <strong>Full Stack Developer</strong>, I bring ideas to life through cutting-edge <strong>web & mobile applications</strong> and <strong>AI solutions</strong>.</>}</p>
                <div className="hero-actions"><a className="raised-button" href={asset(L(site.cvUrl))} target="_blank" rel="noreferrer"><span>{L({ fr: "Mon CV", en: "Resume" })}</span></a><button className="raised-button" onClick={onContact}><span>Contact</span></button></div>
            </div>
            <CircularContact onContact={onContact}/>
        </section>
        <section className="home-about" id="a-propos">
            <SectionTitle first={L({ fr: "À propos", en: "About" })} second={L({ fr: "de moi", en: "Me" })}/>
            <AboutStatement/>
            <Link className="raised-button" to="/about"><span>{L({ fr: "En savoir plus", en: "See more" })}</span></Link>
        </section>
        <section className="home-work" id="projets">
            <SectionTitle first={L({ fr: "Derniers", en: "Recent" })} second={L({ fr: "Projets", en: "Work" })}/>
            <div className="recent-list" onPointerMove={movePreview} onPointerLeave={() => setPreview(null)}>
                {projects.map(p => {
                    const props = { className: "recent-project", onPointerEnter: () => setPreview(p), onFocus: () => setPreview(null), children: <><h3>{p.title}</h3><p>{p.type}</p><img className="recent-mobile-image" src={asset(p.image)} alt="" loading="lazy"/><span className="recent-arrow" aria-hidden="true">↗</span></> }
                    return p.to.startsWith("/") ? <Link key={p.key} to={p.to} {...props}/> : <a key={p.key} href={p.to} target="_blank" rel="noreferrer" {...props}/>
                })}
            </div>
            <Link className="raised-button all-work" to="/work"><span>{L({ fr: "Tous les projets", en: "View all" })}</span></Link>
            <div ref={previewRef} className={`project-preview${preview ? " is-visible" : ""}`} aria-hidden="true">{preview && <><img src={asset(preview.image)} alt=""/><span>{L({ fr: "Voir", en: "View" })}</span></>}</div>
        </section>
    </>
}
