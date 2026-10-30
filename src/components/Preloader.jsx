import { useEffect, useState } from "react"
import { useLang } from "../i18n.jsx"
import "./preloader.css"

const GREETINGS = ["Bonjour", "Hello", "Hola", "Ciao", "Olá", "Hallo", "你好", "Привет", "مرحبا", "Salam"]
const FIRST_MS = 1000
const STEP_MS = 150
// Même calendrier que la référence : le rideau part 0,7 s après le dernier mot, qui s'efface juste après.
const LIFT_MS = 2930
const FADE_MS = 3050
// Le troisième rideau part 400 ms après le premier et dure 800 ms : on attend qu'il ait fini.
const END_MS = LIFT_MS + 1200

/** Salutations en plusieurs langues, puis trois rideaux qui remontent. Une fois par chargement du site. */
export default function Preloader() {
    const { lang } = useLang()
    // La première salutation est celle de la langue du site ; figée au montage.
    const [words] = useState(() => lang === "en" ? ["Hello", "Bonjour", ...GREETINGS.slice(2)] : GREETINGS)
    const [index, setIndex] = useState(0)
    const [done, setDone] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)

    useEffect(() => {
        if (done || index >= words.length - 1) return undefined
        const timer = setTimeout(() => setIndex(index + 1), index === 0 ? FIRST_MS : STEP_MS)
        return () => clearTimeout(timer)
    }, [done, index, words.length])

    useEffect(() => {
        if (done) return undefined
        const timer = setTimeout(() => setDone(true), END_MS)
        return () => clearTimeout(timer)
    }, [done])

    if (done) return null
    return <div className="preloader" aria-hidden="true" style={{ "--lift": `${LIFT_MS}ms`, "--fade": `${FADE_MS}ms` }}>
        <span className="preloader-curtain" />
        <span className="preloader-curtain" />
        <span className="preloader-curtain" />
        <p className="preloader-word"><span />{words[index]}</p>
    </div>
}
