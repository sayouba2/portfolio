import { useEffect } from "react"
import { SITE_URL } from "../seo.js"

function setAttr(selector, attr, value) {
    document.head.querySelector(selector)?.setAttribute(attr, value)
}

/**
 * Met à jour le titre de l'onglet et les balises de référencement et de partage
 * de la page affichée (cf. homeHead / projectHead dans seo.js). Le build écrit
 * déjà les mêmes valeurs, en français, dans le HTML de chaque page ; ce hook les
 * garde justes quand on navigue ou qu'on passe en anglais.
 */
export function useHead({ title, description, path }) {
    useEffect(() => {
        const url = SITE_URL + path
        document.title = title
        setAttr('meta[name="description"]', "content", description)
        setAttr('link[rel="canonical"]', "href", url)
        for (const k of ["og", "twitter"]) {
            setAttr(`meta[property="${k}:title"]`, "content", title)
            setAttr(`meta[property="${k}:description"]`, "content", description)
            setAttr(`meta[property="${k}:url"]`, "content", url)
        }
    }, [title, description, path])
}
