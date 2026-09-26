// Données de référencement, partagées par le build (vite.config.js, qui écrit
// le <head> des pages et le sitemap) et par le navigateur (useHead, qui les
// met à jour quand on change de page ou de langue). `L` résout une chaîne
// { fr, en } : useL() côté navigateur, le français au build.
import { site, ui, education } from "./data/content.js"

export const SITE_URL = site.url

export function homeHead(L) {
    return { title: `${site.name} — ${L(site.role)}`, description: L(site.description), path: "/" }
}

export function projectHead(project, L) {
    return {
        title: `${project.title} — ${L(ui.project.caseStudy)} · ${site.name}`,
        description: L(project.oneLiner),
        path: `/projets/${project.slug}`,
    }
}

/** La fiche « Personne » lue par Google (schema.org), identique sur toutes les pages. */
export function personJsonLd(L) {
    const school = education.find((e) => e.id === "fst-marrakech")
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: site.name,
        url: `${SITE_URL}/`,
        image: `${SITE_URL}/${site.portrait}`,
        jobTitle: L(site.role),
        description: L(site.description),
        email: `mailto:${site.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Marrakech", addressCountry: "MA" },
        alumniOf: { "@type": "EducationalOrganization", name: L(school.institution) },
        knowsAbout: ["Développement web", "Développement mobile", "Intelligence artificielle", "React", "Flutter", "FastAPI", "Spring Boot", "PostgreSQL", "Docker"],
        sameAs: [site.github, site.linkedin],
    }
}
