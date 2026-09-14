import { createContext, useCallback, useContext, useEffect, useState } from "react"

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "fr")

    useEffect(() => {
        localStorage.setItem("lang", lang)
        document.documentElement.lang = lang
    }, [lang])

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLang() {
    return useContext(LanguageContext)
}

/**
 * Résout une chaîne localisée {fr, en} (ou une chaîne brute) dans la langue courante.
 * La fonction est mémoïsée : sans cela elle change d'identité à chaque rendu et
 * relance sans fin les effets qui la prennent en dépendance.
 */
export function useL() {
    const { lang } = useLang()
    return useCallback((value) => {
        if (value == null) return ""
        if (typeof value === "string") return value
        return value[lang] ?? value.fr ?? ""
    }, [lang])
}
