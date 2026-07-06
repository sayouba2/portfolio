import { useEffect, useState } from "react"
import { asset } from "../data/content.js"

/**
 * Visionneuse plein écran : fond sombre neutre, compteur, flèches,
 * navigation clavier (← → Échap) et verrouillage du scroll de la page.
 */
export function Lightbox({ images, index, onClose, onMove }) {
    useEffect(() => {
        if (index === null) return
        const onKey = (e) => {
            if (e.key === "Escape") onClose()
            if (e.key === "ArrowLeft") onMove(-1)
            if (e.key === "ArrowRight") onMove(1)
        }
        window.addEventListener("keydown", onKey)
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = ""
        }
    }, [index, onClose, onMove])

    if (index === null) return null
    return (
        <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true">
            <span className="lightbox-count">{index + 1} / {images.length}</span>
            <button className="lightbox-close" onClick={onClose} aria-label="Fermer">✕</button>
            <button
                className="lightbox-arrow prev"
                onClick={(e) => { e.stopPropagation(); onMove(-1) }}
                aria-label="Image précédente"
            >‹</button>
            <img src={asset(images[index])} alt="" onClick={(e) => e.stopPropagation()} />
            <button
                className="lightbox-arrow next"
                onClick={(e) => { e.stopPropagation(); onMove(1) }}
                aria-label="Image suivante"
            >›</button>
        </div>
    )
}

/**
 * Carrousel : une grande image à la fois (pas de grille à parcourir),
 * flèches, compteur et rangée de vignettes. Clic sur l'image = plein écran.
 */
export function Carousel({ images, title }) {
    const [current, setCurrent] = useState(0)
    const [lightbox, setLightbox] = useState(null)
    const move = (dir) => setCurrent((c) => (c + dir + images.length) % images.length)

    return (
        <div className="carousel">
            <div className="carousel-main">
                <button className="carousel-arrow prev" onClick={() => move(-1)} aria-label="Image précédente">‹</button>
                <img
                    src={asset(images[current])}
                    alt={`${title} — ${current + 1}`}
                    onClick={() => setLightbox(current)}
                />
                <button className="carousel-arrow next" onClick={() => move(1)} aria-label="Image suivante">›</button>
                <span className="carousel-count">{current + 1} / {images.length}</span>
            </div>
            <div className="carousel-thumbs" role="tablist">
                {images.map((src, i) => (
                    <button
                        key={src}
                        className={`carousel-thumb ${i === current ? "active" : ""}`}
                        onClick={() => setCurrent(i)}
                        aria-label={`Image ${i + 1}`}
                    >
                        <img src={asset(src)} alt="" loading="lazy" />
                    </button>
                ))}
            </div>
            <Lightbox
                images={images}
                index={lightbox}
                onClose={() => setLightbox(null)}
                onMove={(dir) => setLightbox((i) => (i + dir + images.length) % images.length)}
            />
        </div>
    )
}
