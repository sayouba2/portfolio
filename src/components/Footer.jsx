import { useEffect, useId, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useL } from "../i18n.jsx"
import { site } from "../data/content.js"
import { SocialLinks } from "./SocialLinks.jsx"
import "./footer.css"

function CurvedMarquee() {
    const id = useId().replace(/:/g, "")
    const rootRef = useRef(null)
    const textRef = useRef(null)
    const L = useL()
    const phrase = L({ fr: "WEB ✦ MOBILE ✦ INTELLIGENCE ARTIFICIELLE ✦ ", en: "WEBSITES ✦ MOBILE ✦ ARTIFICIAL INTELLIGENCE ✦ " })

    useEffect(() => {
        const text = textRef.current
        const root = rootRef.current
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let frame = 0
        let previous = 0
        let offset = 0
        let cycle = 0
        let visible = false
        let disposed = false
        const measure = () => { cycle = text.getComputedTextLength() / 6 }
        const paint = (now) => {
            if (!visible || document.hidden || reduced.matches || disposed) return
            if (previous) offset = (offset + Math.min(now - previous, 50) * .045) % (cycle || 1600)
            previous = now
            text.setAttribute("startOffset", String(-offset))
            frame = requestAnimationFrame(paint)
        }
        const sync = () => {
            cancelAnimationFrame(frame)
            previous = 0
            if (reduced.matches) text.setAttribute("startOffset", "0")
            else if (visible && !document.hidden) frame = requestAnimationFrame(paint)
        }
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
        observer.observe(root)
        measure()
        document.fonts?.ready.then(() => { if (!disposed) measure() })
        reduced.addEventListener("change", sync)
        document.addEventListener("visibilitychange", sync)
        return () => {
            disposed = true
            cancelAnimationFrame(frame)
            observer.disconnect()
            reduced.removeEventListener("change", sync)
            document.removeEventListener("visibilitychange", sync)
        }
    }, [phrase])

    return <div className="curved-marquee" ref={rootRef} aria-hidden="true">
        <svg viewBox="0 0 1440 440" focusable="false">
            <defs><path id={id} d="M -500 -160 Q 720 950 1940 -160" /></defs>
            <text><textPath ref={textRef} href={`#${id}`} startOffset="0">{phrase.repeat(6)}</textPath></text>
        </svg>
    </div>
}

export default function Footer({ onContact }) {
    const L = useL()
    const [word, setWord] = useState(0)
    const words = L({ fr: ["créons", "innovons", "développons"], en: ["create", "innovate", "develop"] })

    useEffect(() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
        let timer
        const sync = () => {
            clearInterval(timer)
            if (!reduced.matches && !document.hidden) timer = setInterval(() => setWord(value => (value + 1) % 3), 3200)
        }
        sync()
        reduced.addEventListener("change", sync)
        document.addEventListener("visibilitychange", sync)
        return () => {
            clearInterval(timer)
            reduced.removeEventListener("change", sync)
            document.removeEventListener("visibilitychange", sync)
        }
    }, [])

    return <footer className="site-footer" id="contact">
        <CurvedMarquee />
        <div className="footer-content">
            <h2 className="footer-invitation">
                <span className="footer-invitation-first">
                    {L({ fr: "Ensemble,", en: "Let's" })}
                    <button type="button" className="changing-word" onClick={onContact} aria-label={L({ fr: "Parlons de votre projet", en: "Let's talk about your project" })}>
                        <span key={`${L({ fr: "fr", en: "en" })}-${word}`} aria-hidden="true">{words[word]}</span>
                    </button>
                </span>
                <span className="footer-invitation-second"><em>{L({ fr: "des projets", en: "incredible work" })}</em> {L({ fr: "qui comptent.", en: "together" })}</span>
            </h2>

            <div className="footer-contact-row">
                <div className="footer-email-block">
                    <p className="footer-eyebrow">{L({ fr: "Restons en contact", en: "Get in touch" })}</p>
                    <a className="footer-email" href={`mailto:${site.email}`}>{site.email}</a>
                </div>
                <div className="footer-social-block">
                    <p className="footer-eyebrow">{L({ fr: "Réseaux", en: "Socials" })}</p>
                    <SocialLinks />
                </div>
            </div>

            <div className="footer-bottom">
                <nav className="footer-navigation" aria-label={L({ fr: "Navigation du pied de page", en: "Footer navigation" })}>
                    <Link to="/">{L({ fr: "Accueil", en: "Home" })}</Link>
                    <Link to="/about">{L({ fr: "À propos", en: "About" })}</Link>
                    <Link to="/work">{L({ fr: "Projets", en: "Work" })}</Link>
                </nav>
                <p className="footer-copyright">© {new Date().getFullYear()} {site.name}</p>
            </div>
        </div>
        <div className="footer-name" aria-hidden="true">SAYOUBA</div>
    </footer>
}
