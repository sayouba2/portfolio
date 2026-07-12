// Tout le contenu du site, bilingue FR/EN.
// Chaque chaîne localisée est un objet { fr, en } résolu par le helper L() de i18n.

// Résout un chemin d'asset par rapport à la racine du site, quelle que soit la
// route courante (les chemins relatifs casseraient sur /projets/:slug).
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, "")

export const site = {
    name: "Sayouba Ouedraogo",
    role: { fr: "Développeur Full Stack", en: "Full Stack Developer" },
    tagline: {
        fr: "Je conçois et développe des produits web, mobiles et IA — de l'architecture backend à l'interface utilisateur.",
        en: "I design and build web, mobile and AI products — from backend architecture to user interface.",
    },
    status: { fr: "Disponible pour un stage", en: "Available for an internship" },
    location: { fr: "Marrakech, Maroc", en: "Marrakech, Morocco" },
    email: "sayouba.ouedraogo.pro@gmail.com",
    phone: "+212 6 23 11 30 83",
    github: "https://github.com/sayouba2",
    linkedin: "https://linkedin.com/in/ouedraogo-sayouba-121722258",
    cvUrl: "mescv/CV_OUEDRAOGO_SAYOUBA_DEV.pdf",
    photo: "images/pictures/profile-web.jpg",
}

export const ui = {
    nav: {
        experience: { fr: "Expérience", en: "Experience" },
        projects: { fr: "Projets", en: "Projects" },
        skills: { fr: "Compétences", en: "Skills" },
        journey: { fr: "Parcours", en: "Background" },
        contact: { fr: "Contact", en: "Contact" },
        cv: { fr: "CV", en: "Resume" },
    },
    hero: {
        hello: { fr: "Bonjour, je suis", en: "Hi, I'm" },
        seeProjects: { fr: "Voir mes projets", en: "See my projects" },
        downloadCv: { fr: "Télécharger mon CV", en: "Download my resume" },
        about: {
            fr: "Étudiant ingénieur à la FST Marrakech, je développe des applications web et mobiles et des systèmes intégrant l'IA — du schéma de base de données à l'interface. Formé par les CTF et les hackathons (1ère place au Hackathon Ramadan IA), j'aime les produits utiles, bien construits et sécurisés dès la conception.",
            en: "Engineering student at FST Marrakech, I build web and mobile applications and AI-powered systems — from the database schema to the interface. Shaped by CTFs and hackathons (1st place at the Ramadan AI Hackathon), I like products that are useful, well built and secure by design.",
        },
    },
    sections: {
        experience: { fr: "Expérience", en: "Experience" },
        featured: { fr: "Projets phares", en: "Featured projects" },
        featuredSub: {
            fr: "Quatre projets qui montrent comment je conçois : du problème à la solution.",
            en: "Four projects that show how I build: from problem to solution.",
        },
        otherProjects: { fr: "Autres projets", en: "More projects" },
        skills: { fr: "Ce que je fais", en: "What I do" },
        skillsSub: {
            fr: "Trois terrains de jeu, une même exigence : des produits complets qui fonctionnent en vrai.",
            en: "Three playgrounds, one standard: complete products that work in the real world.",
        },
        stackTitle: { fr: "Technologies principales", en: "Core technologies" },
        journey: { fr: "Formation & distinctions", en: "Education & honors" },
        education: { fr: "Formation", en: "Education" },
        honors: { fr: "Distinctions", en: "Honors" },
        contact: { fr: "Contact", en: "Contact" },
        contactSub: {
            fr: "Un projet, une opportunité de stage ou simplement une question ? Écrivez-moi.",
            en: "A project, an internship opportunity or just a question? Drop me a line.",
        },
    },
    project: {
        back: { fr: "Tous les projets", en: "All projects" },
        caseStudy: { fr: "Étude de cas", en: "Case study" },
        context: { fr: "Contexte & problème", en: "Context & problem" },
        solution: { fr: "Solution", en: "Solution" },
        features: { fr: "Fonctionnalités clés", en: "Key features" },
        architecture: { fr: "Architecture & choix techniques", en: "Architecture & technical choices" },
        gallery: { fr: "Aperçu", en: "Preview" },
        takeaway: { fr: "Ce que ce projet démontre", en: "What this project demonstrates" },
        stack: { fr: "Stack", en: "Stack" },
        next: { fr: "Projet suivant", en: "Next project" },
        readCase: { fr: "Lire l'étude de cas", en: "Read the case study" },
        live: { fr: "Aperçu en direct", en: "Live preview" },
        visit: { fr: "Visiter le site", en: "Visit the site" },
        online: { fr: "En ligne", en: "Live" },
        code: { fr: "Code source", en: "Source code" },
        photoOf: { fr: "sur", en: "of" },
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
    categories: {
        web: { fr: "Web", en: "Web" },
        mobile: { fr: "Mobile", en: "Mobile" },
        ai: { fr: "IA", en: "AI" },
        all: { fr: "Tous", en: "All" },
    },
}

export const emailJs = {
    publicKey: "4o-UwuW0rilfQWEyY",
    serviceId: "service_aagc54q",
    templateId: "template_q345liu",
}

export const experiences = [
    {
        id: "cmrpi",
        role: { fr: "Stagiaire Développeur mobile et cybersécurité", en: "Mobile Development & Cybersecurity Intern" },
        company: "CMRPI · EMC Cyberconfiance",
        period: { fr: "Juil 2026 — en cours", en: "Jul 2026 — ongoing" },
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
    {
        id: "spheralis",
        role: { fr: "Stagiaire Développement full stack & Data — e-supply chain", en: "Data & Full stack Development Intern — e-supply chain" },
        company: "Spheralis",
        period: { fr: "Juil 2025 — août 2025", en: "Jul 2025 — Aug 2025" },
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
]

export const featuredProjects = [
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

export const otherProjects = [
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

export const skills = {
    domains: [
        {
            icon: "🖥️",
            title: { fr: "Développement web", en: "Web development" },
            text: { fr: "React, Laravel, Node.js/Express, TailwindCSS — du site vitrine à la marketplace complète.", en: "React, Laravel, Node.js/Express, TailwindCSS — from simple sites to full marketplaces." },
        },
        {
            icon: "📱",
            title: { fr: "Développement mobile", en: "Mobile development" },
            text: { fr: "Flutter et React Native/Expo, avec publication d'apps complètes (offline, notifications, RTL).", en: "Flutter and React Native/Expo, shipping complete apps (offline, notifications, RTL)." },
        },
        {
            icon: "🤖",
            title: { fr: "IA & automatisation", en: "AI & automation" },
            text: { fr: "Intégration LLM (GPT-4o, RAG), vision par ordinateur, prompt engineering avec sorties structurées.", en: "LLM integration (GPT-4o, RAG), computer vision, prompt engineering with structured outputs." },
        },
        {
            icon: "🔌",
            title: { fr: "Backend & APIs", en: "Backend & APIs" },
            text: { fr: "FastAPI, Spring Boot, Express — API-First (OpenAPI), microservices, temps réel WebSocket.", en: "FastAPI, Spring Boot, Express — API-First (OpenAPI), microservices, real-time WebSocket." },
        },
        {
            icon: "🗄️",
            title: { fr: "Bases de données", en: "Databases" },
            text: { fr: "PostgreSQL, MySQL, Redis, SQLite — modélisation métier et historique comme source de vérité.", en: "PostgreSQL, MySQL, Redis, SQLite — business modeling with history as the source of truth." },
        },
        {
            icon: "🛠️",
            title: { fr: "DevOps & outils", en: "DevOps & tools" },
            text: { fr: "Docker/Compose, Nginx, Railway, Git/GitHub — déploiements conteneurisés avec healthchecks.", en: "Docker/Compose, Nginx, Railway, Git/GitHub — containerized deployments with healthchecks." },
        },
    ],
    stack: ["Python", "JavaScript / TypeScript", "Java", "PHP", "React", "Flutter", "FastAPI", "Spring Boot", "PostgreSQL", "Docker"],
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
        period: { fr: "2024 — aujourd'hui", en: "2024 — present" },
        title: { fr: "Cycle ingénieur — Réseaux et Systèmes d'Information", en: "Engineering degree — Networks & Information Systems" },
        institution: { fr: "Faculté des Sciences et Techniques, Marrakech", en: "Faculty of Sciences and Techniques, Marrakech" },
        text: {
            fr: "Réseaux informatiques, systèmes distribués et sécurité de l'information, avec une pratique soutenue du développement logiciel.",
            en: "Computer networks, distributed systems and information security, with sustained software development practice.",
        },
    },
    {
        period: { fr: "2022 — 2024", en: "2022 — 2024" },
        title: { fr: "DEUST — Sciences et Techniques", en: "DEUST — Sciences and Techniques" },
        institution: { fr: "FST Settat", en: "FST Settat" },
        text: {
            fr: "Formation scientifique généraliste : mathématiques, informatique et sciences de l'ingénieur.",
            en: "General scientific training: mathematics, computer science and engineering sciences.",
        },
    },
    {
        period: { fr: "2019 — 2022", en: "2019 — 2022" },
        title: { fr: "Baccalauréat technique série C — Maths & Sciences physiques", en: "Technical Baccalaureate (C) — Maths & Physical Sciences" },
        institution: { fr: "Lycée Scientifique National, Bobo-Dioulasso", en: "Lycée Scientifique National, Bobo-Dioulasso" },
        text: {
            fr: "Spécialisation mathématiques et sciences physiques — le socle de mon esprit analytique.",
            en: "Specialization in mathematics and physical sciences — the foundation of my analytical mindset.",
        },
    },
]

export const honors = {
    highlights: [
        {
            title: { fr: "Hackathon Ramadan IA — 1ère place", en: "Ramadan AI Hackathon — 1st place" },
            text: {
                fr: "Vainqueur régional avec Smart Recruit, une plateforme d'entretiens de recrutement menés par l'IA en temps réel. Organisé par le Ministère de la Transition Numérique et de la Réforme de l'Administration du Maroc.",
                en: "Regional winner with Smart Recruit, a platform for real-time AI-led recruitment interviews. Organized by Morocco's Ministry of Digital Transition and Administration Reform.",
            },
        },
        {
            title: { fr: "JEJA (6e édition) — 1er prix", en: "JEJA (6th edition) — 1st prize" },
            text: {
                fr: "Premier prix des Journées Entrepreneuriales de la Jeunesse Africaine avec AgriSmart, l'assistant agricole IoT + IA. Organisées par l'AEBM Mohammedia.",
                en: "First prize at the African Youth Entrepreneurship Days with AgriSmart, the IoT + AI farming assistant. Organized by AEBM Mohammedia.",
            },
        },
    ],
    badges: [
        { fr: "Top 5 — GCDxJIT CTF (30 équipes)", en: "Top 5 — GCDxJIT CTF (30 teams)" },
        { fr: "Top 5 national — Orange Digital Center Champions 2025", en: "National Top 5 — Orange Digital Center Champions 2025" },
        { fr: "Top 10 — HackShield Hackathon (200 équipes)", en: "Top 10 — HackShield Hackathon (200 teams)" },
        { fr: "HackTheBox University CTF 2025", en: "HackTheBox University CTF 2025" },
        { fr: "Certifications Fortinet FCF (×3)", en: "Fortinet FCF certifications (×3)" },
        { fr: "Certifications Cisco — réseaux & systèmes (×3)", en: "Cisco certifications — networking & OS (×3)" },
        { fr: "CPPS — Hack & Fix Academy", en: "CPPS — Hack & Fix Academy" },
        { fr: "GITEX Africa 2025", en: "GITEX Africa 2025" },
    ],
    note: {
        fr: "Une culture sécurité forgée en compétition — un atout que j'applique à chaque ligne de code.",
        en: "A security mindset forged in competition — an asset I apply to every line of code.",
    },
}
