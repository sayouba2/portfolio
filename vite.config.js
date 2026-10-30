import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { featuredProjects } from './src/data/content.js'
import { SITE_URL, homeHead, projectHead, personJsonLd } from './src/seo.js'

// Au build, le site est écrit en français, sa langue par défaut.
const fr = (v) => (v == null ? '' : typeof v === 'string' ? v : v.fr ?? '')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Remplace une balise du <head> ; échoue si index.html ne la contient plus. */
function set(html, pattern, value) {
    if (!pattern.test(html)) throw new Error(`seo-pages : balise introuvable dans index.html (${pattern})`)
    return html.replace(pattern, (_, before, after) => before + value + after)
}

/** Écrit titre, description, URL canonique, aperçus de partage et fiche Personne. */
function applyHead(html, { title, description, path }) {
    const url = SITE_URL + path
    html = set(html, /(<title>)[^<]*(<\/title>)/, esc(title))
    html = set(html, /(<meta name="description" content=")[^"]*(")/, esc(description))
    html = set(html, /(<link rel="canonical" href=")[^"]*(")/, url)
    for (const k of ['og', 'twitter']) {
        html = set(html, new RegExp(`(<meta property="${k}:url" content=")[^"]*(")`), url)
        html = set(html, new RegExp(`(<meta property="${k}:title" content=")[^"]*(")`), esc(title))
        html = set(html, new RegExp(`(<meta property="${k}:description" content=")[^"]*(")`), esc(description))
    }
    const jsonLd = JSON.stringify(personJsonLd(fr), null, 4).replace(/<\//g, '<\\/')
    return set(html, /(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, `\n${jsonLd}\n        `)
}

/**
 * Référencement d'un site à page unique hébergé sur GitHub Pages :
 * - le <head> de l'accueil est rempli depuis src/data/content.js ;
 * - chaque étude de cas reçoit sa propre page HTML (projets/<slug>.html, servie
 *   à /projets/<slug>), avec son titre et sa description. Sans elle, GitHub
 *   Pages répond 404 à ces adresses (le site ne s'affiche que via 404.html) et
 *   Google ne les indexe pas ;
 * - le sitemap liste l'accueil et les études de cas.
 */
function seoPages() {
    return {
        name: 'seo-pages',
        enforce: 'post',
        transformIndexHtml: (html) => applyHead(html, homeHead(fr)),
        generateBundle: {
            order: 'post',
            handler(_, bundle) {
                const index = bundle['index.html']
                if (!index) return
                const html = String(index.source)
                const pages = [homeHead(fr)]
                for (const p of featuredProjects) {
                    const head = projectHead(p, fr)
                    pages.push(head)
                    this.emitFile({ type: 'asset', fileName: `projets/${p.slug}.html`, source: applyHead(html, head) })
                }
                const today = new Date().toISOString().slice(0, 10)
                const urls = pages.map((h) => `  <url><loc>${SITE_URL}${h.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')
                this.emitFile({
                    type: 'asset',
                    fileName: 'sitemap.xml',
                    source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
                })
            },
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.VITE_BASE_URL || '/',
    plugins: [react(), seoPages()],
})
