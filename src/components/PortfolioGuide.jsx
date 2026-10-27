import { useEffect, useId, useRef, useState } from "react"
import { useL, useLang } from "../i18n.jsx"
import { assistantApi, experiences, featuredProjects, pfe, site } from "../data/content.js"
import { langOf } from "./langOf.js"
import "./portfolio-guide.css"

const copy = {
    title: { fr: "Assistant", en: "Assistant" },
    titleAi: { fr: "Assistant IA", en: "AI Assistant" },
    slow: {
        fr: "Doucement ! 3 messages maximum toutes les 10 secondes. Patiente un instant avant de reposer ta question.",
        en: "Whoa, slow down! 3 messages per 10 seconds max. Please wait a moment before asking again.",
    },
    byline: { fr: "Conçu par Sayouba Ouedraogo", en: "Built by Sayouba Ouedraogo" },
    typing: { fr: "Écrit…", en: "Typing..." },
    typingBubble: { fr: "Écrit", en: "Typing" },
    open: { fr: "Ouvrir l'assistant", en: "Open the assistant" },
    close: { fr: "Fermer l'assistant", en: "Close the assistant" },
    reset: { fr: "Effacer la conversation", en: "Clear the conversation" },
    expand: { fr: "Agrandir", en: "Expand" },
    shrink: { fr: "Réduire", en: "Shrink" },
    send: { fr: "Envoyer", en: "Send" },
    placeholder: { fr: "Pose-moi une question...", en: "Ask me anything..." },
    hello: {
        fr: "Salut ! Je suis l'assistant de Sayouba. Pose-moi une question sur ses projets, son parcours ou ses compétences, ou choisis une question ci-dessous !",
        en: "Hi! I'm Sayouba's assistant. Ask me anything about Sayouba's work, experience, skills or projects, or choose from the suggested questions!",
    },
    greet: { fr: "Bonjour ! Que veux-tu savoir sur mon travail ?", en: "Hello! What would you like to know about my work?" },
    projects: { fr: "Mes projets phares :", en: "My featured projects:" },
    based: { fr: "Je suis basé à", en: "I'm based in" },
    unknown: {
        fr: "Je n'ai pas encore de réponse à ça. Écris-moi directement : ",
        en: "I don't have an answer to that yet. Write to me directly: ",
    },
}

const suggestions = [
    { fr: "Quelles sont tes compétences ?", en: "What are your skills?" },
    { fr: "Quelles sont tes disponibilités ?", en: "When are you available?" },
    { fr: "Où es-tu basé ?", en: "Where are you based?" },
]

const skills = {
    fr: "Je développe des applications web et mobiles avec React, Flutter, Spring Boot et FastAPI. Je travaille aussi sur l'IA appliquée : RAG, LLM et vision par ordinateur.",
    en: "I build web and mobile applications with React, Flutter, Spring Boot and FastAPI. I also work with applied AI: RAG, LLMs and computer vision.",
}

// Réponses locales, sans Worker configuré ou quand il ne répond pas : le premier sujet reconnu l'emporte.
const topics = [
    { match: /dispo|availab|stage|pfe|intern|recrut|hire|embauch|quand|when/, answer: L => `${L(pfe.text)} ${L(pfe.places)}.` },
    { match: /competen|skill|stack|techno|langage|language|outil|tool|react|flutter|spring|python|\bia\b|\bai\b|rag|llm/, answer: L => L(skills) },
    { match: /experien|parcours|career|poste|job|entreprise|company/, answer: L => experiences.map(e => `${L(e.role)} — ${e.company} (${L(e.period)})`).join("\n") },
    { match: /projet|project|realis|built|construit|portfolio/, answer: L => `${L(copy.projects)} ${featuredProjects.map(p => L(p.title)).join(", ")}.` },
    { match: /contact|mail|joindre|reach|linkedin|github|telephone|phone|numero/, answer: () => [site.email, site.phone, site.linkedin, site.github].join("\n") },
    { match: /\bou\b|base|where|ville|city|pays|country|habite|live/, answer: L => `${L(copy.based)} ${L(site.location)}.` },
    { match: /bonjour|salut|hello|\bhi\b|hey|coucou/, answer: L => L(copy.greet) },
]

const answerFor = (text, L) => {
    const plain = text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "")
    return topics.find(topic => topic.match.test(plain))?.answer(L) ?? L(copy.unknown) + site.email
}

const LINK = /(https?:\/\/\S+|[\w.+-]+@[\w-]+\.[\w.]+)/
const linkify = (text) => text.split(LINK).map((part, i) => i % 2
    ? <a key={i} href={part.startsWith("http") ? part : `mailto:${part}`} target="_blank" rel="noopener noreferrer">{part}</a>
    : part)

const Robot = (props) => (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
        <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
    </svg>
)

/** Deux yeux dont les pupilles suivent le curseur ; le reflet pointe vers lui. */
function Eyes({ blinking }) {
    const ref = useRef(null)
    useEffect(() => {
        const root = ref.current
        let frame = 0
        let x = -100
        let y = -100
        const paint = () => {
            frame = 0
            const dx = x * .1
            const dy = y * .1
            const k = Math.min(1, 3.9 / (Math.hypot(dx, dy) || 1))
            const angle = Math.atan2(y, x) * 180 / Math.PI - 180
            for (const eye of root.children) {
                eye.firstChild.style.transform = `translate(${dx * k}px, ${dy * k}px)`
                eye.firstChild.firstChild.style.transform = `rotate(${angle}deg)`
            }
        }
        const onMove = (event) => {
            const box = root.getBoundingClientRect()
            x = event.clientX - box.left - box.width / 2
            y = event.clientY - box.top - box.height / 2
            frame ||= requestAnimationFrame(paint)
        }
        paint()
        window.addEventListener("mousemove", onMove)
        return () => {
            window.removeEventListener("mousemove", onMove)
            cancelAnimationFrame(frame)
        }
    }, [])
    return <span ref={ref} className={blinking ? "guide-eyes is-blinking" : "guide-eyes"} aria-hidden="true">
        {[0, 1].map(i => <span className="guide-eye" key={i}><span className="guide-pupil"><span className="guide-glint-arm"><span className="guide-glint" /></span></span></span>)}
    </span>
}

export default function PortfolioGuide() {
    const L = useL()
    const { lang } = useLang()
    const panelId = useId()
    const [open, setOpen] = useState(false)
    const [wide, setWide] = useState(false)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [busy, setBusy] = useState(false)
    const [draft, setDraft] = useState("")
    const [blinking, setBlinking] = useState(false)
    const [badge, setBadge] = useState(false)
    const touched = useRef(false)
    const timer = useRef(0)
    const pending = useRef(null)
    const toggleRef = useRef(null)
    const inputRef = useRef(null)
    const bodyRef = useRef(null)

    // La pastille « 1 » arrive 3 s après le bouton, lui-même révélé à la fin de l'intro.
    useEffect(() => {
        const t = setTimeout(() => { if (!touched.current) setBadge(true) }, 6500)
        return () => clearTimeout(t)
    }, [])
    useEffect(() => () => {
        clearTimeout(timer.current)
        pending.current?.abort()
    }, [])
    useEffect(() => {
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
    }, [messages, draft, busy])

    const close = () => {
        setOpen(false)
        toggleRef.current?.focus({ preventScroll: true })
    }

    useEffect(() => {
        if (!open) return undefined
        inputRef.current?.focus({ preventScroll: true })
        const onKeyDown = (event) => {
            if (event.key !== "Escape") return
            event.stopPropagation()
            setOpen(false)
            toggleRef.current?.focus({ preventScroll: true })
        }
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [open])

    const finish = (reply) => {
        setMessages(m => [...m, { role: "bot", text: reply }])
        setDraft("")
        setBusy(false)
    }

    // Réponse locale : « Écrit… » un instant, puis la réponse s'affiche mot à mot comme un flux.
    const playLocal = (reply) => {
        const words = reply.split(/(\s+)/)
        timer.current = setTimeout(() => {
            let shown = 0
            timer.current = setInterval(() => {
                shown += 2
                setDraft(words.slice(0, shown).join(""))
                if (shown < words.length) return
                clearInterval(timer.current)
                finish(reply)
            }, 40)
        }, 700)
    }

    // Réponse de l'IA lue au fil du flux du Worker ; null s'il ne répond pas.
    const streamReply = async (history, signal, say) => {
        let reply = ""
        try {
            const response = await fetch(assistantApi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }), signal })
            if (response.status === 429) return say(copy.slow)
            if (!response.ok || !response.body) return null
            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            for (;;) {
                const { done, value } = await reader.read()
                if (done) break
                reply += decoder.decode(value, { stream: true })
                setDraft(reply)
            }
        } catch { /* réseau coupé ou conversation effacée : on garde ce qui est arrivé */ }
        return reply.trim() || null
    }

    const ask = async (raw) => {
        const text = raw.trim()
        if (!text || busy) return
        const history = [...messages, { role: "user", text }]
        setMessages(history)
        setInput("")
        setBusy(true)
        const abort = new AbortController()
        pending.current = abort
        // Les messages de secours parlent la langue de la question, pas forcément celle du site.
        const asked = langOf(text, lang)
        const say = (value) => value?.[asked] ?? value
        const reply = assistantApi ? await streamReply(history.slice(-10), abort.signal, say) : null
        if (abort.signal.aborted) return
        if (reply) finish(reply)
        else playLocal(answerFor(text, say))
    }

    const reset = () => {
        pending.current?.abort()
        clearTimeout(timer.current)
        setMessages([])
        setDraft("")
        setBusy(false)
        setInput("")
    }

    const toggle = () => {
        touched.current = true
        setBadge(false)
        setBlinking(true)
        setTimeout(() => setBlinking(false), 300)
        if (open) close()
        else setOpen(true)
    }

    return (
        <aside className="portfolio-guide">
            <section className={`guide-panel${open ? " is-open" : ""}${wide ? " is-wide" : ""}`} id={panelId} role="dialog" aria-labelledby={`${panelId}-title`} inert={!open}>
                <header className="guide-header">
                    <div className="guide-id">
                        <span className="guide-avatar"><Robot /><span className="guide-status" /></span>
                        <div>
                            <h2 id={`${panelId}-title`}>{L(assistantApi ? copy.titleAi : copy.title)}</h2>
                            <p>{L(busy ? copy.typing : copy.byline)}</p>
                        </div>
                    </div>
                    <div className="guide-tools">
                        <button type="button" onClick={reset} aria-label={L(copy.reset)}>
                            <svg className="guide-trash" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z" /></svg>
                        </button>
                        <button type="button" className="guide-expand" onClick={() => setWide(w => !w)} aria-label={L(wide ? copy.shrink : copy.expand)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                {wide ? <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" /> : <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />}
                            </svg>
                        </button>
                        <button type="button" onClick={close} aria-label={L(copy.close)}>
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z" /></svg>
                        </button>
                    </div>
                </header>
                <div className="guide-scroll">
                    <div className="guide-body" ref={bodyRef}>
                        {messages.length === 0 ? (
                            <div className="guide-empty">
                                <Robot className="guide-empty-icon" />
                                <p>{L(copy.hello)}</p>
                                <div className="guide-suggestions">
                                    {suggestions.map((question, i) => <button type="button" key={i} onClick={() => ask(L(question))}>{L(question)}</button>)}
                                </div>
                            </div>
                        ) : (
                            <div className="guide-thread" aria-live="polite">
                                {messages.map((message, i) => (
                                    <div className={`guide-msg is-${message.role}`} key={i}><p>{message.role === "bot" ? linkify(message.text) : message.text}</p></div>
                                ))}
                                {busy && <div className="guide-msg is-bot" aria-hidden="true">
                                    {draft ? <p>{linkify(draft)}</p> : <p className="guide-typing">{L(copy.typingBubble)}<span /><span /><span /></p>}
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
                <form className="guide-form" onSubmit={(event) => { event.preventDefault(); ask(input) }}>
                    <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder={L(copy.placeholder)} aria-label={L(copy.placeholder)} maxLength={300} />
                    <button type="submit" disabled={busy} aria-label={L(copy.send)}>
                        <svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M440 6.5L24 246.4c-34.4 19.9-31.1 70.8 5.7 85.9L144 379.6V464c0 46.4 59.2 65.5 86.6 28.6l43.8-59.1 111.9 46.2c5.9 2.4 12.1 3.6 18.3 3.6 8.2 0 16.3-2.1 23.6-6.2 12.8-7.2 21.6-20 23.9-34.5l59.4-387.2c6.1-40.1-36.9-68.8-71.5-48.9zM192 464v-64.6l36.6 15.1L192 464zm212.6-28.7l-153.8-63.5L391 169.5c10.7-15.5-9.5-33.5-23.7-21.2L155.8 332.6 48 288 464 48l-59.4 387.3z" /></svg>
                    </button>
                </form>
            </section>
            <button ref={toggleRef} type="button" className="guide-toggle" aria-label={L(open ? copy.close : copy.open)} aria-expanded={open} aria-controls={panelId} onClick={toggle}>
                <Eyes blinking={blinking} />
                {badge && <span className="guide-badge" aria-hidden="true">1</span>}
            </button>
        </aside>
    )
}
