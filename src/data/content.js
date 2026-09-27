import screens from "./screens.json"

// Tout le contenu du site, bilingue FR/EN.
// Chaque chaîne localisée est un objet { fr, en } résolu par le helper L() de i18n.

// Résout un chemin d'asset par rapport à la racine du site, quelle que soit la
// route courante (les chemins relatifs casseraient sur /projets/:slug).
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, "")

export const site = {
    name: "Sayouba Ouedraogo",
    // Adresse publique, sans barre finale : base des URL canoniques et du sitemap.
    url: "https://portfolio.sayouba.com",
    // Description pour Google et les aperçus de partage (~150 caractères max).
    description: {
        fr: "Sayouba Ouedraogo, développeur full stack (web, mobile, IA) : projets, stages et hackathons. Recherche un stage PFE à partir de février 2027.",
        en: "Sayouba Ouedraogo, full stack developer (web, mobile, AI): projects, internships and hackathons. Seeking a final-year internship from February 2027.",
    },
    role: { fr: "Développeur Full Stack", en: "Full Stack Developer" },
    tagline: {
        fr: "Je conçois et développe des produits web, mobiles et IA — de l'architecture backend à l'interface utilisateur.",
        en: "I design and build web, mobile and AI products — from backend architecture to user interface.",
    },
    status: { fr: "Recherche un stage PFE — février 2027", en: "Seeking a final-year internship — February 2027" },
    location: { fr: "Marrakech, Maroc", en: "Marrakech, Morocco" },
    email: "sayouba.ouedraogo.pro@gmail.com",
    phone: "+212 6 23 11 30 83",
    github: "https://github.com/sayouba2",
    linkedin: "https://linkedin.com/in/ouedraogo-sayouba-121722258",
    // CV bilingues : le helper L() choisit la version selon la langue du site.
    cvUrl: { fr: "mescv/CV_OUEDRAOGO_SAYOUBA_Dev_FR.pdf", en: "mescv/CV_OUEDRAOGO_SAYOUBA_Dev_EN.pdf" },
    cvUrlNet: { fr: "mescv/CV_OUEDRAOGO_SAYOUBA_Net_FR.pdf", en: "mescv/CV_OUEDRAOGO_SAYOUBA_Net_EN.pdf" },
    // Portrait détouré pour la scène d'ouverture (WebP tiré de profile.png).
    portrait: "images/pictures/portrait.webp",
}

// Bandeau « Recherche PFE » affiché en haut du site.
export const pfe = {
    active: true,
    label: { fr: "Recherche PFE", en: "Seeking PFE" },
    text: {
        fr: "Disponible pour un stage de fin d'études de 6 mois à partir de février 2027 — développement mobile & web, IA appliquée, ou réseaux & sécurité IT.",
        en: "Available for a 6-month final-year internship from February 2027 — mobile & web development, applied AI, or networks & IT security.",
    },
    places: { fr: "Maroc · Remote / Hybride", en: "Morocco · Remote / Hybrid" },
    cta: { fr: "Me contacter", en: "Get in touch" },
}

export const ui = {
    a11y: {
        skip: { fr: "Aller au contenu", en: "Skip to content" },
    },
    nav: {
        projects: { fr: "Projets", en: "Projects" },
        journey: { fr: "Parcours", en: "Background" },
        contact: { fr: "Contact", en: "Contact" },
        cv: { fr: "CV", en: "Resume" },
        home: { fr: "Accueil", en: "Home" },
        sections: { fr: "Sections", en: "Sections" },
    },
    project: {
        back: { fr: "Tous les projets", en: "All projects" },
        caseStudy: { fr: "Étude de cas", en: "Case study" },
        context: { fr: "Contexte & problème", en: "Context & problem" },
        solution: { fr: "Solution", en: "Solution" },
        features: { fr: "Fonctionnalités clés", en: "Key features" },
        architecture: { fr: "Architecture & choix techniques", en: "Architecture & technical choices" },
        takeaway: { fr: "Ce que ce projet démontre", en: "What this project demonstrates" },
        next: { fr: "Projet suivant", en: "Next project" },
        visit: { fr: "Visiter le site", en: "Visit the site" },
        online: { fr: "En ligne", en: "Live" },
        code: { fr: "Code source", en: "Source code" },
    },
    form: {
        name: { fr: "Nom", en: "Name" },
        email: { fr: "E-mail", en: "Email" },
        subject: { fr: "Sujet", en: "Subject" },
        message: { fr: "Message", en: "Message" },
        send: { fr: "Envoyer le message", en: "Send message" },
        sending: { fr: "Envoi en cours…", en: "Sending…" },
        success: {
            fr: "Merci ! Votre message a bien été envoyé, je vous répondrai rapidement.",
            en: "Thank you! Your message has been sent — I'll get back to you shortly.",
        },
        error: {
            fr: "L'envoi a échoué. Réessayez ou écrivez-moi directement par e-mail.",
            en: "Sending failed. Please try again or email me directly.",
        },
        invalid: {
            fr: "Merci de remplir tous les champs avec une adresse e-mail valide.",
            en: "Please fill in every field with a valid email address.",
        },
    },
    footer: {
        credit: { fr: "Conçu et développé par Sayouba Ouedraogo", en: "Designed & built by Sayouba Ouedraogo" },
    },
    // Proposition A — « Sous la surface ».
    craft: { fr: "Ce que je construis", en: "What I build" },
    craftSub: {
        fr: "Trois terrains de jeu, une même exigence : transformer une idée en produit fiable, lisible et utile.",
        en: "Three areas of practice, one standard: turning an idea into a reliable, clear and useful product.",
    },
    path: {
        // Le saut de ligne est rendu par `white-space: pre-line` sur .title.
        title: { fr: "Expériences\n& formation", en: "Experience\n& education" },
        sub: {
            fr: "Mon parcours en historique de commits : la formation sur la branche principale, les stages en branches, les distinctions en tags. Survole un commit pour son résumé, clique pour le détail.",
            en: "My path as a commit history: education on the main branch, internships as branches, honors as tags. Hover a commit for its summary, click for the details.",
        },
        // La légende du graphe : un recruteur n'a pas à connaître git pour le lire.
        legend: {
            stage: { fr: "Stages — expérience professionnelle", en: "Internships — professional experience" },
            formation: { fr: "Formation", en: "Education" },
            tag: { fr: "Distinctions", en: "Honors" },
        },
        // Préfixe des branches de stage : c'est un nom de branche git, il suit la langue.
        branch: { fr: "stage", en: "internship" },
    },
    work: {
        title: { fr: "Projets", en: "Projects" },
        sub: {
            fr: "Les vraies interfaces, sans recadrage. Clique sur une capture pour l'ouvrir — en taille réelle si tu veux lire chaque détail.",
            en: "The real interfaces, uncropped. Click a screenshot to open it — at actual size if you want to read every detail.",
        },
        summary: { fr: "Lire le résumé", en: "Read the summary" },
        summaryKicker: { fr: "Résumé", en: "Summary" },
        fullCase: { fr: "Étude de cas complète", en: "Full case study" },
        technologies: { fr: "Technologies", en: "Technologies" },
        others: { fr: "Autres dépôts", en: "Other repositories" },
        visit: { fr: "Visiter", en: "Visit" },
        code: { fr: "Code", en: "Code" },
    },
    competitions: {
        title: { fr: "Hackathons", en: "Hackathons" },
        sub: {
            fr: "Des week-ends à livrer un produit devant un jury, puis à accompagner d'autres équipes comme mentor : c'est là que j'ai appris à aller vite sans bâcler.",
            en: "Weekends shipping a product in front of a jury, then coaching other teams as a mentor: that's where I learned to move fast without cutting corners.",
        },
        with: { fr: "avec", en: "with" },
        teams: { fr: "équipes", en: "teams" },
    },
    viewer: {
        actualSize: { fr: "Taille réelle (1:1)", en: "Actual size (1:1)" },
        fit: { fr: "Ajuster à l'écran", en: "Fit to screen" },
        enlarge: { fr: "Agrandir", en: "Enlarge" },
        shot: { fr: "capture", en: "screenshot" },
        more: { fr: "Autres captures de", en: "More screenshots of" },
        prev: { fr: "Capture précédente", en: "Previous screenshot" },
        next: { fr: "Capture suivante", en: "Next screenshot" },
        swipe: { fr: "Glisser pour parcourir", en: "Swipe to browse" },
        pan: { fr: "Déplacer l’image pour explorer", en: "Pan the image to explore" },
        close: { fr: "Fermer", en: "Close" },
    },
    hero: {
        statement: { fr: "Des idées à l’écran.\nDu code à l’expérience.", en: "From ideas to interfaces.\nFrom code to experience." },
        description: { fr: "Je construis des produits web, mobiles et IA, de la première idée au dernier détail.", en: "I build web, mobile and AI products, from the first idea to the final detail." },
        availability: { fr: "Ouvert aux opportunités PFE · Fév. 2027", en: "Open to final-year internships · Feb. 2027" },
        artLabel: { fr: "Concevoir · Développer · Livrer", en: "Design · Develop · Deliver" },
        awards: { fr: "premières places", en: "first-place finishes" },
        resume: { fr: "Mon CV", en: "My resume" },
        featured: { fr: "Projet à découvrir", en: "Selected project" },
        projectType: { fr: "Reconnaissance faciale · IA", en: "Facial recognition · AI" },
        disciplines: { fr: "Domaines de développement", en: "Development disciplines" },
        cta: { fr: "Voir mes projets", en: "View my work" },
        cv: { fr: "Télécharger le CV", en: "Download my resume" },
        scroll: { fr: "Explorer", en: "Explore" },
    },
    contact: {
        eyebrow: { fr: "Remonter à la surface", en: "Back to the surface" },
        title: { fr: "Travaillons ensemble", en: "Let's work together" },
        phone: { fr: "Téléphone", en: "Phone" },
        location: { fr: "Basé à", en: "Based in" },
    },
    categories: {
        web: { fr: "Web", en: "Web" },
        mobile: { fr: "Mobile", en: "Mobile" },
        ai: { fr: "IA", en: "AI" },
    },
}

export const emailJs = {
    publicKey: "4o-UwuW0rilfQWEyY",
    serviceId: "service_aagc54q",
    templateId: "template_q345liu",
}

export const experiences = [
    {
        id: "centrale-casa",
        role: { fr: "Stagiaire Ingénieur logiciel — Data & aide à la décision", en: "Software Engineering Intern — Data & decision support" },
        company: "École Centrale Casablanca",
        period: { fr: "Août 2026 — en cours", en: "Aug 2026 — ongoing" },
        summary: {
            fr: "Plateforme interactive de visualisation et d'aide à la décision pour la surveillance et le contrôle des maladies infectieuses respiratoires au Maroc.",
            en: "Interactive visualization and decision-support platform for the surveillance and control of respiratory infectious diseases in Morocco.",
        },
        bullets: [
            {
                fr: "Conception des tableaux de bord d'indicateurs épidémiologiques, pensés pour être lus par des décideurs de santé publique et non par des data scientists.",
                en: "Designed the epidemiological indicator dashboards, built to be read by public-health decision-makers rather than data scientists.",
            },
            {
                fr: "Construction du pipeline de données qui alimente la plateforme, du nettoyage des sources à l'agrégation par territoire et par période.",
                en: "Built the data pipeline feeding the platform, from source cleaning to aggregation by territory and time period.",
            },
            {
                fr: "Déploiement et exploitation des services de la plateforme, en interaction directe avec l'équipe de recherche.",
                en: "Deployed and operated the platform services, working directly with the research team.",
            },
        ],
        tags: ["Data visualization", "Dashboards", "Aide à la décision", "Santé publique"],
    },
    {
        id: "spheralis",
        role: { fr: "Stagiaire Développement full stack & Data — e-supply chain", en: "Data & Full stack Development Intern — e-supply chain" },
        company: "Spheralis",
        period: { fr: "Juil. 2026", en: "Jul 2026" },
        summary: {
            fr: "Application web de gestion de stock remplaçant un suivi manuel sur Google Sheets, pour un prestataire e-commerce gérant plusieurs boutiques.",
            en: "Web-based inventory management application replacing manual Google Sheets tracking, for an e-commerce operator running several shops.",
        },
        bullets: [
            {
                fr: "Modélisation d'une base de données métier (produits, stock, mouvements, retours) avec l'historique complet des mouvements comme source de vérité.",
                en: "Modeled a business database (products, stock, movements, returns) with the full movement history as the source of truth.",
            },
            {
                fr: "Automatisation de l'entrée en stock : upload de bons de livraison PDF, parsing automatique des produits et mise à jour du stock — fin de la ressaisie manuelle, avec archivage des documents.",
                en: "Automated stock intake: delivery-note PDF upload, automatic product parsing and stock updates — eliminating manual re-entry, with document archiving.",
            },
            {
                fr: "Tableau de bord d'indicateurs (valeur de stock, ruptures, stock dormant, taux de retour, top ventes) via Metabase, intégré à l'application.",
                en: "KPI dashboard (stock value, stockouts, dormant stock, return rate, top sellers) built with Metabase and embedded in the app.",
            },
            {
                fr: "Architecture pensée comme socle extensible : centralisation des commandes, agent de confirmation et intégration WooCommerce posés en fondation.",
                en: "Architecture designed as an extensible foundation: order centralization, a confirmation agent and WooCommerce integration groundwork.",
            },
        ],
        tags: ["Python", "PostgreSQL", "Parsing PDF", "Metabase", "Docker"],
    },
    {
        id: "cmrpi",
        role: { fr: "Stagiaire Développeur mobile et cybersécurité", en: "Mobile Development & Cybersecurity Intern" },
        company: "CMRPI · EMC Cyberconfiance",
        period: { fr: "Juil. 2025 — août 2025", en: "Jul 2025 — Aug 2025" },
        summary: {
            fr: "Application mobile de signalement des cyberviolences pour enfants, bilingue FR/AR avec interface RTL, connectée à la ligne d'assistance nationale EMC.",
            en: "Mobile app for children to report cyberviolence, bilingual FR/AR with an RTL interface, connected to the EMC national helpline.",
        },
        bullets: [
            {
                fr: "Conception et développement de l'app (Flutter) et de l'API (FastAPI), avec une architecture de signalement découplée de l'API tierce.",
                en: "Designed and built the app (Flutter) and the API (FastAPI), with a reporting architecture decoupled from the third-party API.",
            },
            {
                fr: "Approche safety-by-design : orientation des enfants vers des canaux spécialisés plutôt qu'hébergement de contenus sensibles.",
                en: "Safety-by-design approach: children are routed to specialized channels rather than hosting sensitive content.",
            },
            {
                fr: "Gestion de l'anonymat et protection des données de mineurs, en conformité avec la loi marocaine 09-08.",
                en: "Anonymity handling and protection of minors' data, in compliance with Moroccan law 09-08.",
            },
        ],
        tags: ["Flutter", "FastAPI", "FR/AR · RTL", "Safety-by-design"],
    },
]

const allFeaturedProjects = [
    {
        slug: "barakabox",
        title: "BarakaBox",
        category: "web",
        accent: "#16a34a",
        emoji: "🥖",
        oneLiner: {
            fr: "Marketplace anti-gaspillage alimentaire — invendus à prix réduits, livraison, dons solidaires et interface trilingue FR/EN/AR.",
            en: "Food-waste marketplace — unsold goods at reduced prices, delivery, charity donations and a trilingual FR/EN/AR interface.",
        },
        stack: ["FastAPI", "React", "PostgreSQL", "Stripe", "Docker"],
        liveUrl: "https://baraka-box.ma",
        images: Array.from({ length: 1 }, (_, i) => `images/projects/barakabox/${i + 1}.png`),
        caseStudy: {
            context: {
                fr: "Chaque jour, restaurants, boulangeries et supermarchés jettent des invendus encore parfaitement consommables, faute de canal simple pour les écouler ou les donner. BarakaBox répond à ce gaspillage en le transformant en opportunité : pour les commerçants (revenu récupéré), pour les acheteurs (prix réduits) et pour les associations caritatives (dons suivis).",
                en: "Every day, restaurants, bakeries and supermarkets throw away perfectly edible unsold goods, for lack of a simple channel to sell or donate them. BarakaBox turns that waste into opportunity: for merchants (recovered revenue), for buyers (reduced prices) and for charities (tracked donations).",
            },
            solution: {
                fr: "Une plateforme web complète de type marketplace multi-vendeurs : les commerçants publient leurs invendus à prix réduits, les acheteurs commandent en ligne (retrait ou livraison par des livreurs partenaires), et les invendus restants peuvent être donnés à des associations — chaque utilisateur visualisant son impact sur une page dédiée.",
                en: "A complete multi-vendor marketplace platform: merchants list their unsold goods at reduced prices, buyers order online (pickup or delivery by partner couriers), and remaining items can be donated to charities — with every user able to visualize their impact on a dedicated page.",
            },
            features: [
                { fr: "Marketplace multi-vendeurs : catalogue, panier, checkout et paiement en ligne via Stripe.", en: "Multi-vendor marketplace: catalog, cart, checkout and online payment via Stripe." },
                { fr: "4 rôles utilisateurs (acheteur, vendeur, livreur, admin) avec authentification JWT et espaces dédiés.", en: "4 user roles (buyer, seller, courier, admin) with JWT authentication and dedicated dashboards." },
                { fr: "Système de livraison : attribution et suivi des livraisons par des livreurs partenaires.", en: "Delivery system: assignment and tracking of deliveries by partner couriers." },
                { fr: "Volet solidaire : dons d'invendus aux associations avec page « Mon Impact » pour chaque utilisateur.", en: "Solidarity component: donation of unsold goods to charities with a per-user “My Impact” page." },
                { fr: "Commissions vendeurs calculées automatiquement sur les commandes livrées.", en: "Seller commissions computed automatically on delivered orders." },
                { fr: "Internationalisation FR/EN/AR (i18next) avec traduction dynamique des produits via l'API DeepL.", en: "FR/EN/AR internationalization (i18next) with dynamic product translation through the DeepL API." },
                { fr: "Notifications push web (Web Push/VAPID), e-mails transactionnels (Resend + Jinja2) et gestion d'images via Cloudinary.", en: "Web push notifications (Web Push/VAPID), transactional emails (Resend + Jinja2) and image management via Cloudinary." },
                { fr: "Dashboard admin avec statistiques et graphiques (Recharts).", en: "Admin dashboard with statistics and charts (Recharts)." },
            ],
            architecture: {
                fr: "Backend asynchrone en FastAPI avec SQLAlchemy 2.0 + asyncpg sur PostgreSQL 16, migrations Alembic, validation Pydantic v2 et tests Pytest. Frontend React 18 (Vite, TailwindCSS, React Query, Zustand, React Hook Form). Le tout conteneurisé en 3 services Docker (PostgreSQL, API, Nginx) avec healthchecks, configuration par environnement et déploiement sur Railway.",
                en: "Async FastAPI backend with SQLAlchemy 2.0 + asyncpg on PostgreSQL 16, Alembic migrations, Pydantic v2 validation and Pytest tests. React 18 frontend (Vite, TailwindCSS, React Query, Zustand, React Hook Form). Everything containerized as 3 Docker services (PostgreSQL, API, Nginx) with healthchecks, per-environment config and deployment on Railway.",
            },
            takeaway: {
                fr: "Conception d'un produit complet de bout en bout : modèle économique multi-acteurs, paiements réels, i18n avec RTL, notifications et déploiement conteneurisé.",
                en: "End-to-end product design: a multi-actor business model, real payments, i18n including RTL, notifications and containerized deployment.",
            },
            stackGroups: [
                { label: { fr: "Backend", en: "Backend" }, items: "Python · FastAPI (async) · SQLAlchemy 2.0 + asyncpg · PostgreSQL 16 · Alembic · Pydantic v2 · Pytest" },
                { label: { fr: "Frontend", en: "Frontend" }, items: "React 18 · Vite · TailwindCSS · React Query · Zustand · React Router · React Hook Form · react-i18next" },
                { label: { fr: "Services", en: "Services" }, items: "Stripe · Cloudinary · DeepL · Resend · Web Push" },
                { label: { fr: "DevOps", en: "DevOps" }, items: "Docker Compose (PostgreSQL, API, Nginx) · Railway · healthchecks" },
            ],
        },
    },
    {
        slug: "smartattend",
        title: "SmartAttend",
        category: "ai",
        accent: "#4f46e5",
        emoji: "🎓",
        oneLiner: {
            fr: "Pointage universitaire automatique par reconnaissance faciale — microservices Java/Python, suivi temps réel, biométrie chiffrée.",
            en: "Automated university attendance via facial recognition — Java/Python microservices, real-time tracking, encrypted biometrics.",
        },
        stack: ["Spring Boot", "FastAPI", "InsightFace", "React", "PostgreSQL"],
        images: Array.from({ length: 10 }, (_, i) => `images/projects/smart_attend/${i + 1}.png`),
        github: "",
        caseStudy: {
            context: {
                fr: "À l'université, l'appel manuel fait perdre du temps de cours et reste vulnérable à la fraude (signatures à la place d'un camarade) et aux erreurs de saisie. Le suivi des présences méritait d'être entièrement automatisé.",
                en: "At university, manual roll call wastes class time and remains vulnerable to fraud (signing for a classmate) and data-entry errors. Attendance tracking deserved to be fully automated.",
            },
            solution: {
                fr: "Un téléphone fixé en salle scanne les visages à l'entrée ; le système identifie chaque étudiant et met à jour la feuille de présence en temps réel sur le tableau de bord de l'enseignant. Les règles métier (retards, alertes d'absentéisme) s'appliquent automatiquement.",
                en: "A phone mounted in the classroom scans faces at the door; the system identifies each student and updates the attendance sheet in real time on the teacher's dashboard. Business rules (lateness, absenteeism alerts) apply automatically.",
            },
            features: [
                { fr: "Reconnaissance faciale à l'entrée avec seuil de confiance configurable (≥ 0,85).", en: "Facial recognition at the door with a configurable confidence threshold (≥ 0.85)." },
                { fr: "Règles métier automatisées : absent après 15 minutes, alerte au-delà de 33 % d'absences sur un module, unicité du pointage par séance.", en: "Automated business rules: marked absent after 15 minutes, alert when a student's absence rate exceeds 33% on a module, one check-in per session." },
                { fr: "Tableaux de bord par rôle : enseignant (suivi de séance en direct via WebSocket) et administrateur (utilisateurs, modules, statistiques, MFA obligatoire).", en: "Role-based dashboards: teacher (live session tracking over WebSocket) and administrator (users, modules, statistics, mandatory MFA)." },
                { fr: "App mobile étudiant : consultation des absences par module et notifications push (FCM).", en: "Student mobile app: per-module absence review and push notifications (FCM)." },
                { fr: "Enrôlement biométrique sécurisé : aucune photo stockée — uniquement des embeddings faciaux chiffrés en AES-256-GCM.", en: "Secure biometric enrollment: no photos stored — only facial embeddings encrypted with AES-256-GCM." },
            ],
            architecture: {
                fr: "Microservices : backend métier Java 21 / Spring Boot 3.3 séparé du service IA Python 3.11 / FastAPI + InsightFace, ce dernier isolé sur un réseau interne jamais exposé publiquement. Clean Architecture côté backend (domain / ports / application / infrastructure), approche API-First avec contrat OpenAPI avant implémentation, temps réel en WebSocket (STOMP). Infra : PostgreSQL 16, Redis 7, MinIO, Nginx en API Gateway, orchestration Docker Compose. Front web React 18 + TypeScript (TanStack Query, Zustand, MUI, Recharts).",
                en: "Microservices: a Java 21 / Spring Boot 3.3 business backend separated from a Python 3.11 / FastAPI + InsightFace AI service, the latter isolated on an internal network never exposed publicly. Clean Architecture on the backend (domain / ports / application / infrastructure), API-First approach with an OpenAPI contract written before implementation, real-time via WebSocket (STOMP). Infra: PostgreSQL 16, Redis 7, MinIO, Nginx as API gateway, Docker Compose orchestration. Web front in React 18 + TypeScript (TanStack Query, Zustand, MUI, Recharts).",
            },
            takeaway: {
                fr: "Conception d'un système distribué complet (4 clients, 2 services, 1 gateway), intégration d'IA en production avec contraintes de confidentialité biométrique, et maîtrise d'une stack polyglotte Java / Python / TypeScript.",
                en: "Design of a complete distributed system (4 clients, 2 services, 1 gateway), production AI integration under biometric privacy constraints, and command of a polyglot Java / Python / TypeScript stack.",
            },
            stackGroups: [
                { label: { fr: "Backend métier", en: "Business backend" }, items: "Java 21 · Spring Boot 3.3 · Clean Architecture · OpenAPI · WebSocket (STOMP)" },
                { label: { fr: "Service IA", en: "AI service" }, items: "Python 3.11 · FastAPI · InsightFace · réseau interne isolé" },
                { label: { fr: "Frontend", en: "Frontend" }, items: "React 18 · TypeScript · Vite · TanStack Query · Zustand · MUI · Recharts" },
                { label: { fr: "Infra", en: "Infra" }, items: "PostgreSQL 16 · Redis 7 · MinIO · Nginx (API Gateway) · Docker Compose" },
            ],
        },
    },
    {
        slug: "agrismart",
        title: "AgriSmart",
        category: "mobile",
        accent: "#ca8a04",
        emoji: "🌱",
        oneLiner: {
            fr: "Assistant agricole IoT + IA — capteurs temps réel, diagnostic photo GPT-4o Vision, alertes SMS et synthèse vocale pour l'accessibilité.",
            en: "IoT + AI farming assistant — real-time sensors, GPT-4o Vision photo diagnosis, SMS alerts and text-to-speech for accessibility.",
        },
        stack: ["React Native", "Node.js", "GPT-4o", "ESP32", "Twilio"],
        images: Array.from({ length: 7 }, (_, i) => `images/projects/agrismart/${i + 1}.png`),
        github: "https://github.com/sayouba2/agrismart",
        caseStudy: {
            context: {
                fr: "Au Burkina Faso, les petits agriculteurs subissent des pertes de récolte faute d'accès à un suivi précis des conditions de culture et à des conseils agronomiques adaptés à leur contexte (région, sol, zone climatique).",
                en: "In Burkina Faso, smallholder farmers suffer crop losses for lack of precise monitoring of growing conditions and agronomic advice adapted to their context (region, soil, climate zone).",
            },
            solution: {
                fr: "Une application mobile complète qui combine capteurs connectés, vision par ordinateur et conseils IA contextualisés : monitoring des parcelles en temps réel, suivi de culture par stades validés par analyse photo, gestion des anomalies jusqu'à résolution, et canaux accessibles (SMS, synthèse vocale) pour toucher les agriculteurs sans smartphone ou peu alphabétisés.",
                en: "A complete mobile application combining connected sensors, computer vision and contextualized AI advice: real-time plot monitoring, stage-based crop tracking validated by photo analysis, anomaly management through to resolution, and accessible channels (SMS, text-to-speech) to reach farmers without smartphones or with low literacy.",
            },
            features: [
                { fr: "Monitoring IoT temps réel : capteur ESP32 (température/humidité) interrogé toutes les 2 s, historique échantillonné sur 7 jours en graphiques 24 h / 7 j, avec mode simulation pour développer sans matériel.", en: "Real-time IoT monitoring: an ESP32 sensor (temperature/humidity) polled every 2s, history downsampled over 7 days in 24h/7d charts, with a simulation mode to develop without hardware." },
                { fr: "Suivi de culture par stades (machine à états) du semis à la récolte : le passage au stade suivant est validé par GPT-4o Vision à partir d'une photo du plant (stade, santé, anomalies nommées précisément — ex. cercosporiose, mildiou).", en: "Stage-based crop tracking (state machine) from sowing to harvest: stage transitions are validated by GPT-4o Vision from a photo of the plant (stage, health, precisely named anomalies — e.g. cercospora, downy mildew)." },
                { fr: "Gestion des anomalies jusqu'à résolution : fiche IA (causes, symptômes, traitement accessible localement, prévention), puis vérification de la guérison par nouvelle photo.", en: "Anomaly management through to resolution: an AI-generated sheet (causes, symptoms, locally available treatment, prevention), then recovery verification with a new photo." },
                { fr: "Recommandations agronomiques contextualisées (culture, variété, région, zone climatique, type de sol).", en: "Contextualized agronomic recommendations (crop, variety, region, climate zone, soil type)." },
                { fr: "Alertes SMS via Twilio quand les capteurs sortent des seuils sains, avec anti-spam (throttling 30 min, détection de nouvelle excursion).", en: "SMS alerts via Twilio when sensors leave healthy ranges, with anti-spam (30-min throttling, new-excursion detection)." },
                { fr: "Synthèse vocale (ElevenLabs) des recommandations en français, avec repli sur la voix du téléphone — pensée pour les utilisateurs peu alphabétisés.", en: "Text-to-speech (ElevenLabs) reading recommendations aloud in French, with fallback to the device voice — designed for low-literacy users." },
                { fr: "Météo locale (Open-Meteo) selon la région de la parcelle et fonctionnement hors-ligne partiel (SQLite embarqué).", en: "Local weather (Open-Meteo) based on the plot's region and partial offline operation (embedded SQLite)." },
            ],
            architecture: {
                fr: "App React Native 0.81 / Expo SDK 54 (React Navigation, Reanimated, SVG, expo-sqlite). Backend Node.js / Express (ESM) exposant une API REST : toutes les clés (OpenAI, ElevenLabs, Twilio) restent côté serveur. Prompt engineering avancé : schémas JSON stricts imposés au modèle, règles métier explicites, parsing tolérant et fallbacks gracieux. Robustesse : moyennes glissantes 24 h pour éviter qu'une lecture bruitée bloque une transition de stade, retries réseau, downsampling des séries. Les règles de progression sont isolées en fonctions pures, testables sans base ni UI.",
                en: "React Native 0.81 / Expo SDK 54 app (React Navigation, Reanimated, SVG, expo-sqlite). Node.js / Express (ESM) backend exposing a REST API: every key (OpenAI, ElevenLabs, Twilio) stays server-side. Advanced prompt engineering: strict JSON schemas enforced on the model, explicit business rules, tolerant parsing and graceful fallbacks. Robustness: 24h rolling averages so a noisy reading can't block a stage transition, network retries, series downsampling. Progression rules are isolated as pure functions, testable without a database or UI.",
            },
            takeaway: {
                fr: "Intégration d'IA fiable en production (sorties structurées, fallbacks), conception pour l'accessibilité et les contextes à faible connectivité, et pont entre matériel (IoT) et logiciel. Projet lauréat du 1er prix de la 6e édition des Journées Entrepreneuriales de la Jeunesse Africaine (JEJA, AEBM Mohammedia).",
                en: "Reliable production AI integration (structured outputs, fallbacks), design for accessibility and low-connectivity contexts, and bridging hardware (IoT) and software. Winner of the 1st prize at the 6th African Youth Entrepreneurship Days (JEJA, AEBM Mohammedia).",
            },
            stackGroups: [
                { label: { fr: "Mobile", en: "Mobile" }, items: "React Native 0.81 · Expo SDK 54 · React Navigation · Reanimated · expo-sqlite" },
                { label: { fr: "Backend", en: "Backend" }, items: "Node.js · Express (ESM) · API REST" },
                { label: { fr: "IA", en: "AI" }, items: "GPT-4o (vision, JSON structuré) · GPT-4o-mini · ElevenLabs (TTS)" },
                { label: { fr: "IoT & services", en: "IoT & services" }, items: "ESP32 (température/humidité) · Twilio (SMS) · Open-Meteo" },
            ],
        },
    },
    {
        slug: "smart-recruit",
        title: "Smart Recruit",
        category: "ai",
        accent: "#7c3aed",
        emoji: "🎙️",
        oneLiner: {
            fr: "Plateforme de recrutement IA menant des entretiens audio en temps réel — vainqueur du Hackathon Ramadan IA.",
            en: "AI recruitment platform conducting real-time audio interviews — winner of the Ramadan AI Hackathon.",
        },
        stack: ["IA conversationnelle", "Speech-to-text", "Temps réel"],
        images: Array.from({ length: 17 }, (_, i) => `images/projects/smart_recruit/${i + 1}.png`),
        github: "https://github.com/sayouba2/smart_recruit",
        caseStudy: {
            context: {
                fr: "Les premiers tours d'entretiens mobilisent un temps considérable côté recruteurs, pour des échanges souvent standardisés. L'idée : confier ce premier filtre à une IA capable de mener un véritable entretien oral.",
                en: "First-round interviews consume considerable recruiter time for often standardized exchanges. The idea: delegate that first filter to an AI capable of conducting a genuine spoken interview.",
            },
            solution: {
                fr: "Une plateforme de recrutement propulsée par l'IA, capable de mener des entretiens audio en temps réel : traitement de la parole, IA conversationnelle qui adapte ses questions, puis analyse des réponses des candidats pour aider à la décision. Le projet a remporté la 1ère place du Hackathon Ramadan IA.",
                en: "An AI-powered recruitment platform able to conduct real-time audio interviews: speech processing, conversational AI that adapts its questions, then analysis of candidate answers to support decision-making. The project won 1st place at the Ramadan AI Hackathon.",
            },
            features: [
                { fr: "Entretiens audio menés par l'IA en temps réel.", en: "Real-time AI-led audio interviews." },
                { fr: "Traitement de la parole (speech-to-text) intégré au flux d'entretien.", en: "Speech processing (speech-to-text) integrated into the interview flow." },
                { fr: "IA conversationnelle : questions adaptées au fil des réponses.", en: "Conversational AI: questions adapt as answers come in." },
                { fr: "Analyse des réponses des candidats pour assister la décision de recrutement.", en: "Candidate answer analysis to support hiring decisions." },
            ],
            architecture: {
                fr: "Projet construit en conditions de hackathon : pipeline temps réel reliant capture audio, transcription, moteur conversationnel IA et restitution de l'analyse dans une interface web.",
                en: "Built under hackathon conditions: a real-time pipeline connecting audio capture, transcription, the conversational AI engine and analysis output in a web interface.",
            },
            takeaway: {
                fr: "Capacité à livrer un produit IA fonctionnel en temps très contraint — et à convaincre un jury : 1ère place du hackathon.",
                en: "Ability to ship a working AI product under severe time constraints — and to convince a jury: 1st place at the hackathon.",
            },
            stackGroups: [
                { label: { fr: "IA & temps réel", en: "AI & real-time" }, items: "IA conversationnelle · speech-to-text · analyse de réponses" },
            ],
        },
    },
]

const allOtherProjects = [
    {
        id: "smart-learning",
        title: { fr: "Smart Learning — Plateforme e-learning", en: "Smart Learning — E-learning platform" },
        text: {
            fr: "Plateforme web complète développée avec Laravel et MySQL : gestion des cours, suivi de la progression des étudiants, authentification et contrôle d'accès par rôles.",
            en: "Complete web platform built with Laravel and MySQL: course management, student progress tracking, authentication and role-based access control.",
        },
        category: "web",
        tags: ["Laravel", "MySQL"],
        github: "https://github.com/sayouba2/smart_learning",
    },
    {
        id: "glaucoma",
        title: { fr: "Détection du glaucome par IA", en: "Glaucoma detection with AI" },
        text: {
            fr: "Système web de traitement d'images ophtalmologiques pour assister le diagnostic du glaucome à l'aide de modèles de vision par ordinateur.",
            en: "Web-based system processing ophthalmological images to assist glaucoma diagnosis using computer vision models.",
        },
        category: "ai",
        tags: ["Vision par ordinateur", "Python"],
        github: "https://github.com/sayouba2/glaucoma_detection",
        images: Array.from({ length: 10 }, (_, i) => `images/projects/glaucoma_detection/${i + 1}.png`),
    },
    {
        id: "rag-agent",
        title: { fr: "Agent RAG IA", en: "RAG AI agent" },
        text: {
            fr: "Agent IA basé sur l'architecture RAG (Retrieval-Augmented Generation) permettant d'interroger des documents et d'obtenir des réponses contextuelles grâce aux LLMs.",
            en: "AI agent based on the RAG (Retrieval-Augmented Generation) architecture enabling document querying and contextual answers using LLMs.",
        },
        category: "ai",
        tags: ["RAG", "LLM"],
        github: "https://github.com/sayouba2/ai-rag-agent",
    },
    {
        id: "chat-app",
        title: { fr: "Application de chat en temps réel", en: "Real-time chat application" },
        text: {
            fr: "Messagerie instantanée avec gestion des utilisateurs, salons de discussion et communication en temps réel.",
            en: "Instant messaging with user management, chat rooms and real-time communication.",
        },
        category: "web",
        tags: ["WebSocket", "Temps réel"],
        github: "https://github.com/sayouba2/chat_app",
    },
    
    
    
]

/**
 * Projets retirés de la version en ligne. Filtrés ici plutôt que supprimés :
 * AgriSmart reviendra quand sa version finale sera prête (c'est un prototype),
 * et le contenu reste disponible si l'un d'eux doit réapparaître.
 */
const RETIRED = new Set(["barakabox", "agrismart", "smart-learning", "chat-app"])
export const featuredProjects = allFeaturedProjects.filter((p) => !RETIRED.has(p.slug))
export const otherProjects = allOtherProjects.filter((p) => !RETIRED.has(p.id))

/**
 * Captures retravaillées : barre de favoris du navigateur recadrée, WebP en
 * pleine résolution (la taille réelle, pour l'agrandissement) et en 1200 px
 * pour la page. Les dimensions servent à réserver la place exacte.
 */
const SCREEN_DIRS = { smartattend: "smart_attend", "smart-recruit": "smart_recruit", glaucoma: "glaucoma_detection" }
// L'ordre de présentation : la capture la plus parlante d'abord ; les doublons écartés.
const SCREEN_ORDER = {
    smartattend: [2, 6, 10, 5, 7, 3, 4, 9, 8, 1],
    "smart-recruit": [1, 6, 11, 12, 14, 16, 4, 8, 7, 9, 10, 5, 13, 15, 17, 2, 3],
    glaucoma: [7, 1, 6, 4, 8, 5, 9, 2, 3], // la n° 10 est la version anglaise de la n° 1
}
export function screensFor(key) {
    const dir = SCREEN_DIRS[key]
    const byN = new Map((screens[key] ?? []).map((i) => [i.n, i]))
    return (SCREEN_ORDER[key] ?? []).map((n) => {
        const i = byN.get(n)
        return i && {
            n, w: i.w, h: i.h,
            full: `images/projects/${dir}/web/${n}.webp`,
            page: `images/projects/${dir}/web/${n}-1200.webp`,
        }
    }).filter(Boolean)
}

// Blocs illustrés « Ce que je fais » (illustrations MIT de developerFolio, logos devicon)
export const whatIDo = [
    {
        id: "fullstack",
        illustration: "images/illustrations/skill.svg",
        title: { fr: "Développement Web Full Stack", en: "Full Stack Web Development" },
        logos: ["react", "nodejs", "laravel", "fastapi", "spring", "postgresql", "docker"],
        bullets: [
            {
                fr: "Applications web complètes, du site vitrine à la marketplace avec paiement en ligne (React, FastAPI, Laravel, Node.js).",
                en: "Complete web applications, from simple sites to marketplaces with online payment (React, FastAPI, Laravel, Node.js).",
            },
            {
                fr: "APIs propres et documentées : approche API-First (OpenAPI), microservices, temps réel WebSocket.",
                en: "Clean, documented APIs: API-First approach (OpenAPI), microservices, real-time WebSocket.",
            },
            {
                fr: "Bases de données métier bien modélisées (PostgreSQL, MySQL, Redis), avec l'historique comme source de vérité.",
                en: "Well-modeled business databases (PostgreSQL, MySQL, Redis), with history as the source of truth.",
            },
        ],
    },
    {
        id: "mobile",
        illustration: "images/illustrations/jsFramework.svg",
        title: { fr: "Développement Mobile", en: "Mobile Development" },
        logos: ["flutter", "react", "typescript"],
        bullets: [
            {
                fr: "Applications cross-platform Flutter et React Native/Expo, menées de bout en bout.",
                en: "Cross-platform Flutter and React Native/Expo apps, shipped end to end.",
            },
            {
                fr: "Fonctionnalités avancées : mode hors-ligne (SQLite), notifications push, interfaces bilingues RTL (FR/AR).",
                en: "Advanced features: offline mode (SQLite), push notifications, bilingual RTL interfaces (FR/AR).",
            },
            {
                fr: "Pont avec le matériel : capteurs IoT (ESP32), caméra, synthèse vocale.",
                en: "Hardware bridges: IoT sensors (ESP32), camera, text-to-speech.",
            },
        ],
    },
    {
        id: "ai",
        illustration: "images/illustrations/manOnTable.svg",
        title: { fr: "IA & Automatisation", en: "AI & Automation" },
        logos: ["python", "javascript", "java"],
        bullets: [
            {
                fr: "Intégration LLM en production : GPT-4o (vision), agents RAG, sorties JSON structurées avec fallbacks gracieux.",
                en: "Production LLM integration: GPT-4o (vision), RAG agents, structured JSON outputs with graceful fallbacks.",
            },
            {
                fr: "Vision par ordinateur : reconnaissance faciale (InsightFace), diagnostic d'images médicales et agricoles.",
                en: "Computer vision: facial recognition (InsightFace), medical and agricultural image diagnosis.",
            },
            {
                fr: "Prompt engineering rigoureux : règles métier explicites, parsing tolérant, moyennes glissantes anti-bruit.",
                en: "Rigorous prompt engineering: explicit business rules, tolerant parsing, noise-resistant rolling averages.",
            },
        ],
    },
]

export const education = [
    {
        id: "fst-marrakech",
        period: { fr: "2024 — aujourd'hui", en: "2024 — present" },
        title: { fr: "Cycle ingénieur — Réseaux et Systèmes d'Information", en: "Engineering degree — Networks & Information Systems" },
        institution: { fr: "Faculté des Sciences et Techniques, Marrakech", en: "Faculty of Sciences and Techniques, Marrakech" },
        text: {
            fr: "Réseaux informatiques, systèmes distribués et sécurité de l'information, avec une pratique soutenue du développement logiciel.",
            en: "Computer networks, distributed systems and information security, with sustained software development practice.",
        },
    },
    {
        id: "fst-settat",
        period: { fr: "2022 — 2024", en: "2022 — 2024" },
        title: { fr: "DEUST — Sciences et Techniques", en: "DEUST — Sciences and Techniques" },
        institution: { fr: "FST Settat", en: "FST Settat" },
        text: {
            fr: "Formation scientifique généraliste : mathématiques, informatique et sciences de l'ingénieur.",
            en: "General scientific training: mathematics, computer science and engineering sciences.",
        },
    },
    {
        id: "lycee-bobo",
        period: { fr: "2019 — 2022", en: "2019 — 2022" },
        title: { fr: "Baccalauréat technique série C — Maths & Sciences physiques", en: "Technical Baccalaureate (C) — Maths & Physical Sciences" },
        institution: { fr: "Lycée Scientifique National, Bobo-Dioulasso", en: "Lycée Scientifique National, Bobo-Dioulasso" },
        text: {
            fr: "Spécialisation mathématiques et sciences physiques — le socle de mon esprit analytique.",
            en: "Specialization in mathematics and physical sciences — the foundation of my analytical mindset.",
        },
    },
]

/**
 * Les hackathons, rangés comme un tableau de classement : le rang d'abord.
 * `field` = nombre d'équipes, quand il est connu (jamais inventé) ; `top` = le
 * classement atteint dans ce champ. `role` remplace le rang quand Sayouba n'était
 * pas en compétition (mentor).
 */
export const honors = {
    competitions: [
        {
            id: "ramadan-ia",
            place: 1,
            rank: { fr: "1er", en: "1st" },
            title: { fr: "Hackathon Ramadan IA", en: "Ramadan AI Hackathon" },
            meta: {
                fr: "Vainqueur régional — organisé par le Ministère de la Transition Numérique et de la Réforme de l'Administration du Maroc",
                en: "Regional winner — organized by Morocco's Ministry of Digital Transition and Administration Reform",
            },
            project: "smart-recruit",
            field: 20,
            top: 1,
        },
        {
            id: "jeja",
            place: 1,
            rank: { fr: "1er", en: "1st" },
            title: { fr: "JEJA — 6e édition", en: "JEJA — 6th edition" },
            meta: {
                fr: "Journées Entrepreneuriales de la Jeunesse Africaine — organisées par l'AEBM Mohammedia",
                en: "African Youth Entrepreneurship Days — organized by AEBM Mohammedia",
            },
            // Projet retiré de la version en ligne (prototype) : cité, sans lien.
            withName: "AgriSmart",
            field: 10,
            top: 1,
        },
        {
            id: "rallyia",
            role: true,
            rank: { fr: "Mentor", en: "Mentor" },
            title: { fr: "RallyIA Future Lab", en: "RallyIA Future Lab" },
            meta: {
                fr: "Mentor des équipes — organisé à Merzouga par le Ministère de la Transition Numérique et de la Réforme de l'Administration du Maroc",
                en: "Team mentor — held in Merzouga by Morocco's Ministry of Digital Transition and Administration Reform",
            },
        },
    ],
}
