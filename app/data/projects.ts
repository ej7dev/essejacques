export type Category = "fintech" | "public" | "saas" | "devops" | "websites" | "mobile";

export interface Project {
  slug: string;
  title: string;
  /** Omitted when the client must not be named. */
  client?: string;
  categories: Category[];
  year: string;
  summary: string;
  metric?: string;
  stack: string[];
  cover?: string;
  gallery?: string[];
  /** Short muted loop shown in the hero of the case study (MP4, under 1.5 MB). */
  video?: string;
  /** The video was filmed on a phone screen: shown in a phone frame. */
  videoPhone?: boolean;
  url?: string;
  featured?: boolean;
  /** Hidden until the client or the NDA allows it. */
  published?: boolean;
  context?: string;
  built?: string;
  result?: string;
  /** Key technical choices, each with the reason behind it. */
  architecture?: { decision: string; why: string }[];
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "fintech", label: "Fintech" },
  { id: "public", label: "Public sector" },
  { id: "saas", label: "SaaS" },
  { id: "devops", label: "DevOps" },
  { id: "websites", label: "Websites" },
  { id: "mobile", label: "Mobile" },
];

import media from "./media.json";

const img = (name: string) => `/img/projects/${name}.webp`;

type Media = { w: number; h: number; sm?: number };
const MEDIA = media as Record<string, Media>;
/** Real pixel size, so the browser reserves the space before the file arrives (see scripts/prepare-media.py). */
export const mediaSize = (src: string) => MEDIA[src] ? { width: MEDIA[src].w, height: MEDIA[src].h } : {};
/** Full size plus the 720 px copy, when there is one. */
export const srcsetOf = (src: string) => {
  const m = MEDIA[src];
  return m?.sm ? `${src.replace(/\.webp$/, "-sm.webp")} ${m.sm}w, ${src} ${m.w}w` : undefined;
};

// Images that already are a staged scene (laptop photo, diagram): shown as is, never inside a device frame.
const STAGED = new Set(["senelec", "cauris-crm", "school", "mobile-app", "threads", "social-app", "devsecops-diagram", "socium-security-diagram", "spring-cloud-diagram", "jenkins-sonarqube-diagram", "benin-cockpit-diagram", "cnfplf-diagram"].map(img));
export const isScreenshot = (src: string) => !STAGED.has(src) && !src.endsWith("-diagram.webp");
export const isMobileShot = (src: string) => src.includes("-mobile");

// Order matters: flagship projects first, as on the resume. `featured` ones feed the home page.
const ALL: Project[] = [
  // Flagship projects
  {
    slug: "socium-workflow", title: "Socium Workflow", client: "Socium, HR SaaS in 20+ African countries", categories: ["saas"], year: "2025 to 2026",
    summary: "Leave and approval engine of a multi-tenant HR suite, rebuilt end to end while clients stayed live.",
    metric: "v2 rebuilt from scratch, no break for live clients",
    stack: ["Angular 20", "NestJS", "MongoDB Atlas", "Redis", "Keycloak", "Kubernetes", "Azure"],
    cover: img("socium-workflow-dashboard"), gallery: [img("socium-workflow-diagram"), img("socium-workflow-builder"), img("socium-suite-apps")],
    featured: true,
    context: "Socium's HR suite runs for clients such as the Presidency of Senegal and Senegal Numerique, on Azure, Kubernetes and on premise. The Workflow product had outgrown its first version: business rules were scattered across the front end, and an Angular 15 codebase was blocking every upgrade.",
    built: "As lead, I rebuilt v2 on both sides. The leave engine moved server side as the single source of truth: half days, overlapping requests, public holidays, balances and caps, eligibility and seniority rules, with a dry run mode so users see the exact outcome before submitting. On top of it: multi-step approval chains, bulk approvals, server-side exports and Redis caching on the hot read paths, plus the migration from Angular 15 to 20 (standalone components, Signals). Like the four other apps of the suite, it runs on the shared security model I put in place: tenant isolation in a common data-access layer, fail-closed guards and per-app permissions on Keycloak.",
    result: "A new product in production on a modern stack, delivered without a service break for tenants already live.",
    architecture: [
      { decision: "Leave rules live on the server", why: "The API is the single source of truth for balances, overlaps and eligibility, and a dry run shows the exact outcome before a request is submitted." },
      { decision: "Tenant isolation in a shared data layer", why: "Every query is scoped to the company by default and fails closed, which fixed the penetration test findings at the root instead of endpoint by endpoint." },
      { decision: "Shared @socium libraries", why: "Permissions and business rules are written once and reused by every app of the suite, so they cannot drift apart." },
      { decision: "Permissions per app", why: "Each app has its own Keycloak roles, with no global admin role that would open every product at once." },
    ],
  },
  {
    slug: "socium-performance", title: "Socium Performance", client: "Socium", categories: ["saas"], year: "2025 to 2026",
    summary: "Performance management: evaluations, objectives, trainings, promotions and 9-box.",
    stack: ["Angular", "NestJS", "MongoDB", "Keycloak"],
    cover: img("socium-performance-9box"), gallery: [img("socium-performance-diagram"), img("socium-performance-9box"), img("socium-performance-dashboard")],
    context: "Each client company runs its own review campaigns, rating scales and weighting rules, and HR needs the same score on screen, in the printed report and in the dashboards.",
    built: "As lead: evaluations with live scoring, configurable rating scales and printable PDF reports; objectives with sub-objectives, strict weighting controls, bulk closing and role-based views; training plans with scheduled reminders and Yello e-learning integration; promotions, mobility and the 9-box talent grid. Like the four other apps of the suite, it runs on the shared security model I put in place: tenant isolation in a common data-access layer, fail-closed guards and per-app permissions on Keycloak.",
    result: "As lead on the module, about 384 commits: evaluations, objectives, trainings, promotions and the 9-box in one place.",
    architecture: [
      { decision: "One score calculation for the whole suite", why: "Evaluation scores are computed by a shared @socium library, so the live score during input, the PDF report and the dashboards always show the same number." },
      { decision: "Write routes guarded by the journey", why: "An answer can only be written by its evaluator, on their own form, at the right step of the campaign, checked on the server." },
      { decision: "Reminders outside the API", why: "An hourly serverless cron sends training and evaluation reminders at the time each company configured, without loading the API." },
      { decision: "Strict weighting rules", why: "Objective weights are validated on the server, sub-objectives included, and gaps trigger a notification instead of a silent error." },
    ],
  },
  {
    slug: "socium-workspace", title: "Socium Workspace", client: "Socium", categories: ["saas"], year: "2025 to 2026",
    summary: "Core HR: employee records, seniority, absences, offboarding and reporting.",
    metric: "HR reports with 143 KPIs",
    stack: ["Angular", "NestJS", "MongoDB", "Keycloak", "AWS S3", "AWS Lambda", "Datadog"],
    cover: img("socium-suite-apps"), gallery: [img("socium-suite-apps"), img("socium-security-diagram")],
    context: "Core HR data feeds every other app of the suite: if seniority, absences or job descriptions are wrong in Workspace, leave rights, evaluations and reports are wrong everywhere.",
    built: "Seniority computed from hiring dates, absences and absence rate, skills and trainings linked to job descriptions, offboarding that deactivates the Keycloak account automatically, and an HR reporting module with 143 KPIs, scheduled delivery and PDF rendering. Security is shared by the whole suite: after a penetration test found tenant isolation and IDOR weaknesses, I moved tenant isolation into a shared data-access layer instead of each endpoint, with fail-closed guards and per-app permissions on Keycloak, a file service on S3 with antimalware scanning and short-lived signed links, and Datadog logging across the five apps.",
    result: "One security model shared by the five apps, closing the penetration test findings at the root.",
    architecture: [
      { decision: "Seniority computed, not stored", why: "Seniority is derived on the fly from the hiring date, with explicit overrides, so it never drifts from the contract." },
      { decision: "Offboarding closes access", why: "Ending a contract deactivates the employee's Keycloak account automatically, instead of relying on someone to remember." },
      { decision: "Reports as templates over a KPI catalogue", why: "143 KPIs feed report templates that a serverless job renders as PDF and sends on schedule, with holding and subsidiary comparisons." },
      { decision: "Security shared by the whole suite", why: "Tenant isolation lives in the shared data layer and files go through one secure service, so every app gets the same protection." },
    ],
  },
  {
    slug: "sociumjob", title: "SociumJob", client: "Socium", categories: ["saas", "websites"], year: "2025",
    summary: "Job board and ATS of the Socium suite, with CV parsing and server-side rendering.",
    stack: ["Nuxt 3", "NestJS"],
    cover: img("sociumjob-desktop"), gallery: [img("sociumjob-diagram"), img("sociumjob-desktop"), img("sociumjob-mobile")],
    url: "https://sociumjob.com", video: "/video/sociumjob.mp4",
    context: "Job offers were poorly indexed by search engines, and production suffered from memory leaks and N+1 queries.",
    built: "A rebuild on Nuxt 3 for server-side rendering and indexable job pages, connected to the suite's ATS: applications land in a hiring pipeline and uploaded CVs are parsed into structured candidate profiles. I also resolved critical production incidents (memory leaks, N+1 queries). Uploaded CVs go through the suite's secured file service: antimalware scan on S3 and short-lived signed links. Like the four other apps of the suite, the ATS runs on the shared security model I put in place: tenant isolation in a common data-access layer, fail-closed guards and per-app permissions on Keycloak.",
    result: "Indexable job pages, and production incidents fixed at their cause rather than worked around.",
    architecture: [
      { decision: "Server-side rendering for the job board", why: "Job pages are rendered by Nuxt on the server, so search engines index every offer and candidates see content immediately." },
      { decision: "CVs handled by the secure file service", why: "Uploaded CVs are scanned for malware on S3 and only served through short-lived signed links." },
      { decision: "Applications in the shared data layer", why: "Candidates and applications use the suite's shared models, so a recruitment request in Workflow and a hire in Job talk about the same data." },
      { decision: "Permissions per app", why: "Recruiters get Job permissions only, through the suite's per-app RBAC, with one permission per screen." },
    ],
  },
  {
    slug: "cauris-pay", title: "CaurisFlux", client: "Cauris Pay", categories: ["fintech"], year: "2026",
    summary: "Mobile money aggregator for Africa: one API in front of Orange Money, Wave, MTN, Airtel and M-Pesa.",
    metric: "One integration for every mobile money operator",
    stack: ["NestJS", "Angular", "Nx", "PostgreSQL", "Redis", "Bull", "Next.js", "React Native", "Docker", "GitLab CI", "SonarQube"],
    cover: img("caurisflux-admin-payment-methods"), gallery: [img("caurisflux-diagram"), img("caurisflux-admin-payment-methods"), img("caurisflux-admin-dashboard"), img("caurisflux-desktop"), img("caurisflux-mobile"), img("caurisflux-docs-desktop")],
    url: "https://www.caurisflux.com", featured: true, video: "/video/caurisflux-checkout.mp4", videoPhone: true,
    context: "Merchants had to integrate each operator separately, each with its own API, callback format and failure modes. Retries and late callbacks made double charges a real risk.",
    built: "A single payment API with one adapter per operator behind a common contract, normalized statuses and webhooks, and idempotency keys enforced end to end so a retried request can never charge a customer twice. Around the core: a hosted checkout, a merchant dashboard and an admin console in Angular, developer documentation, a Next.js marketing site, and CaurisFlux, a Europe to Africa money transfer app in React Native.",
    result: "Merchants go live on every operator through one documented integration instead of five.",
    architecture: [
      { decision: "One adapter per aggregator", why: "Operators sit behind a common interface, so adding one does not touch the payment engine, and a circuit breaker keeps a failing provider from slowing down the others." },
      { decision: "Idempotency on every money-moving endpoint", why: "A double click or a network retry replays the first response instead of charging the customer twice." },
      { decision: "Callbacks verified before they count", why: "Operator callbacks go through an IP allowlist and a timestamped HMAC signature, and a Redis nonce rejects replays, so a forged callback cannot mark a payment as paid." },
      { decision: "A ledger, not just a balance", why: "Each credit is written in a SQL transaction with a row lock and a before and after movement, so balances always match their history, even under concurrent payments." },
      { decision: "Signed, retried webhooks", why: "Merchants verify each notification with an HMAC signature, and failed deliveries are retried from a queue." },
      { decision: "Reconciliation of pending payments", why: "A job asks the operators about pending transactions every five minutes, so a lost callback never leaves a payment stuck." },
      { decision: "A quality gate before every release", why: "GitLab CI runs lint, type checks, SonarQube, the build and the tests before it builds the Docker image and triggers the deployment." },
    ],
  },
  {
    slug: "senelec", title: "Senelec", client: "SENELEC, national electricity utility", categories: ["public"], year: "2022 to 2026",
    summary: "Guichet Unique: a single window that routes partner requests through the national utility's back-end systems.",
    metric: "60% faster request processing",
    stack: ["Spring Boot", "Java", "Angular", "Keycloak", "SOAP", "Liquibase", "PostgreSQL", "Nginx", "F5", "GitLab CI"],
    cover: img("senelec"), gallery: [img("senelec-diagram")], featured: true,
    context: "Partner requests went through several desks and disconnected systems, with documents exchanged by hand and no shared view of where a file stood.",
    built: "Three applications: a partner portal open to the internet, an internal back office and a Spring Boot API. The platform is segmented by exposure: only the portal sits in the DMZ, behind the F5 and an Nginx reverse proxy, while the back office, the API and Keycloak stay in a private zone, with PostgreSQL on a dedicated server. Around the workflow: SMS notifications over a SOAP gateway, documents exported to the GED, separate Keycloak realms for partners and agents, and versioned migrations with Liquibase. I also deployed it myself, with GitLab CI pipelines for each application.",
    result: "Request processing is 60% faster, with every file traceable from submission to closure.",
    architecture: [
      { decision: "Segmented by exposure", why: "Only the partner portal is reachable from the internet, behind the F5 and Nginx. The back office, the API and the identity server stay in a private zone, and the database on its own server." },
      { decision: "Two identity realms, plus ownership", why: "Partners and SENELEC agents sign in to separate Keycloak realms, and an ownership guard makes sure a partner never reaches someone else's request by changing an ID." },
      { decision: "Every change leaves a trace", why: "Each status change updates the request history, and a global interceptor audits every write request." },
      { decision: "SMS through the operator's SOAP gateway", why: "Partners are notified by SMS over the imposed SOAP service, with messages converted to the GSM-7 alphabet so they fit 160 characters instead of 70." },
      { decision: "Documents exported to the GED in the background", why: "Scheduled jobs push documents to the document management system, outside the user's request." },
      { decision: "Delivered by pipeline", why: "GitLab CI builds each of the three applications and deploys them, so a release is repeatable instead of a manual copy." },
    ],
  },
  {
    slug: "boad-archiving", title: "BOAD archiving", client: "BOAD, regional development bank", categories: ["public"], year: "2024 to 2026",
    summary: "Next-generation electronic archiving system with a tamper-evident audit trail, replacing the bank's legacy platform.",
    metric: "100% of the bank's archives migrated",
    stack: ["NestJS", "Angular", "PostgreSQL", "pgvector", "Ollama", "RAG", "Tesseract OCR", "Azure AD", "Docker", "GitLab CI"],
    cover: img("boad-dashboard"), gallery: [img("boad-diagram"), img("boad-integrity"), img("boad-record"), img("boad-search"), img("boad-journal")],
    video: "/video/boad.mp4", featured: true,
    context: "The bank's archives lived in MaarchRM, a legacy system that had to be replaced without losing a single document and while preserving legal proof of integrity.",
    built: "A domain model redesigned from scratch around the archive lifecycle (deposit, control, retention rules, communicability, final disposal), and a migration of the full legacy corpus. Every operation is written to an append-only, hash-chained lifecycle journal that is sealed automatically every hour, so any alteration breaks the chain and can be proven. OCR makes scanned documents searchable, and ArchivIA, a retrieval-augmented assistant, answers questions about an archive by citing its passages, restricted to what the user is cleared to read. Sign-in goes through Azure AD.",
    result: "The new system holds 100% of the bank's archives, with integrity that can be proven, not just assumed.",
    architecture: [
      { decision: "An append-only journal enforced by the database", why: "Database triggers reject updates and deletes and compute the hash chain themselves, so the proof does not depend on trusting the application." },
      { decision: "Hourly sealing", why: "Each seal bounds the window in which tampering could go unnoticed, and it can be attested by an external RFC 3161 timestamp authority." },
      { decision: "Permissions applied before ranking", why: "ArchivIA filters passages by the user's clearance inside the query, before the result limit, so a restricted document cannot even reveal that it exists." },
      { decision: "AI that stays on premise", why: "Embeddings (bge-m3) and answers run in a local Ollama, with a pgvector index in PostgreSQL, so no archive ever leaves the bank's servers." },
      { decision: "Delivered as containers", why: "GitLab CI builds a Docker image on every commit, pushes it to the registry and redeploys production over SSH, with the compose file versioned alongside the code." },
    ],
  },
  {
    slug: "benin-cockpit", title: "Benin Cockpit", client: "Presidency of Benin", categories: ["public", "mobile"], year: "2026",
    summary: "Executive cockpit tracking about 40 priority government projects, on the web and on mobile.",
    metric: "About 40 priority projects tracked",
    stack: ["Django REST Framework", "Python", "Django Channels", "Celery", "Redis", "PostgreSQL", "FastAPI", "Next.js", "React Native", "Expo", "GitHub Actions", "Docker", "Nginx", "AWS EC2"],
    cover: img("benin-cockpit-dashboard"), gallery: [img("benin-cockpit-diagram"), img("benin-cockpit-dashboard")],
    featured: true,
    context: "The Presidency needed a consolidated, up-to-date view of its priority projects instead of reports gathered by hand from each ministry.",
    built: "A Django REST API with a dedicated AI service that produces meeting summaries, a web dashboard for decision makers and a React Native (Expo) mobile app for follow-up on the move. Delivery is automated with GitHub Actions, Docker and Nginx behind Let's Encrypt, with monitoring in production.",
    result: "Decision makers follow every priority project from one cockpit, on desktop or phone.",
    architecture: [
      { decision: "Tokens out of JavaScript's reach", why: "Sessions use JWT in httpOnly cookies, with 15-minute access tokens, rotation and a blacklist, so a stolen device can be signed out remotely." },
      { decision: "Access checked at three levels", why: "Every request is filtered by role, then by query, then by object, so each user only sees the ministries or projects in their scope." },
      { decision: "Long jobs in the background", why: "Transcription, meeting minutes and action items run in Celery over Redis and are tracked by task id, because a two-hour meeting does not fit in an HTTP request." },
      { decision: "A separate AI service with a swappable model", why: "A FastAPI service handles transcription and summaries, the language model is a setting, and transcription falls back across three engines." },
      { decision: "Real-time updates", why: "Django Channels pushes changes over WebSocket, with Web Push and Firebase notifications on mobile." },
      { decision: "Staging, then production", why: "GitHub Actions deploys staging from master and production from a dedicated branch, with a health check after each deployment." },
    ],
  },
  {
    slug: "firewatch", title: "Firewatch", client: "Midgard, French civil security start-up", categories: ["saas"], year: "2021",
    summary: "Real-time wildfire and smoke detection platform for firefighters, from camera and drone feeds to field alerts.",
    metric: "Showcased at the Élysée",
    stack: ["NestJS", "Django", "RabbitMQ", "Java", "Angular", "NgRx", "WebSocket"],
    cover: img("firewatch-dashboard"), featured: true, video: "/video/firewatch.mp4", url: "https://www.midgard-ai.com",
    gallery: [img("firewatch-diagram"), img("firewatch-alerts"), img("firewatch-map"), img("firewatch-cameras"), img("firewatch-media")],
    context: "Every minute counts in a wildfire. Fire services monitor large forest areas through camera networks and drones, and needed smoke detected and confirmed before it spreads.",
    built: "Event-driven microservices: AI detection scores each camera and drone frame and publishes detections to RabbitMQ, a Django service processes those events into alerts with a confidence level and an azimuth, and a NestJS API with role-based access pushes them over WebSocket. The Angular front end, with NgRx state, shows live alerts, a map with each camera's field of view, remote control of the confirmation camera, and a media library of drone imagery.",
    result: "Operators validate or dismiss a detection in seconds and push it to dispatch. The platform was showcased at the Élysée.",
    architecture: [
      { decision: "An event pipeline on RabbitMQ", why: "Detections are published to a queue, so the AI keeps scoring frames even when processing slows down, and no detection is lost in between." },
      { decision: "Django for event processing", why: "A dedicated service turns raw detections into alerts with a confidence level and an azimuth, separate from the API that serves operators." },
      { decision: "Alerts pushed, never polled", why: "NestJS pushes each alert over WebSocket, so an operator sees new smoke within seconds of its detection." },
      { decision: "One NgRx store for live streams", why: "Alerts, camera status and the map read from the same state, so every panel stays consistent as events arrive." },
      { decision: "Role-based access on every action", why: "Permissions decide who can validate an alert or take control of a camera, checked on the API and reflected in the interface." },
    ],
  },
  {
    slug: "cnfplf", title: "CNFPLF", client: "Senegalese public sector", categories: ["public"], year: "2025 to 2026",
    summary: "Three business applications for a public body: e-Budget, e-Courrier and e-Matière, on one platform.",
    metric: "3 apps on one platform",
    stack: ["Spring Boot", "Java", "Angular", "PostgreSQL", "WebSocket (STOMP)", "Spring AOP", "Tesseract OCR", "Docker", "Nginx", "Windows Server"],
    cover: img("cnfplf-diagram"),
    context: "Budget, mail and supplies were managed separately, mostly on paper, inside an infrastructure that had to stay on premise. Every budget commitment and every incoming letter had to be traceable to a person and a date.",
    built: "One Spring Boot platform with three business modules behind a single Angular app: e-Budget follows budget execution from commitment to payment order, e-Courrier captures incoming mail from the mailboxes, reads attachments with OCR and tracks deadlines, and e-Mati\u00e8re manages stock movements, inventories and valuation. Permissions are declared per module and action, an AOP audit trail covers about 600 operations, and notifications arrive in real time over WebSocket (STOMP). Deployed as Docker images behind Nginx on the client's own server, with PostgreSQL.",
    result: "Three applications in production on the client's own infrastructure.",
    architecture: [
      { decision: "One modular monolith for three apps", why: "Budget, mail and stock live in separate modules of one Spring Boot application, so the client runs a single deployment with one sign-in and one audit trail." },
      { decision: "Permissions as module and action", why: "About thirty roles are described as module:action permissions and checked by an annotation on each endpoint, so access rules read like the organisation chart." },
      { decision: "An audit trail that cannot block the work", why: "An aspect records who did what, from where and with which values on about 600 operations, written asynchronously in its own transaction so a logging failure never cancels a business action." },
      { decision: "Mail captured, read and followed up", why: "Mailboxes are polled every five minutes, attachments go through a Tesseract OCR service, key fields are extracted, and an hourly job flags overdue replies." },
      { decision: "Budget figures recomputed, never typed", why: "Engaged, liquidated and ordered amounts are aggregated per budget line from the underlying documents, so the totals always match the paperwork." },
      { decision: "Real time over STOMP", why: "Users receive their notifications over WebSocket as soon as a letter is assigned to them." },
    ],
  },
  {
    slug: "ads-inventory", title: "ADS inventory", client: "Autoroutes du Sénégal", categories: ["public", "mobile"], year: "2026",
    summary: "Asset inventory of the national highway network, on the web and on Android devices in the field.",
    metric: "Under a minute per asset",
    stack: ["Angular 20", "NestJS 11", "PostgreSQL", "Capacitor", "Nx", "IndexedDB", "Docker", "Nginx", "DigitalOcean Spaces"],
    cover: img("ads-inventory"), gallery: [img("ads-diagram"), img("ads-item"), img("ads-sites")],
    featured: true,
    context: "Bridges, culverts, toll stations and equipment along the highway were inventoried on paper, so the asset register was always late and hard to audit.",
    built: "A web platform and an Android app sharing one Nx monorepo. Each asset gets a barcode and a QR code, is located by site and kilometre point, and carries its full movement history. Field teams scan or create assets on site and print labels over Bluetooth straight from the app.",
    result: "Each asset is now inventoried in under a minute, and the register reflects the field in real time.",
    architecture: [
      { decision: "Offline first", why: "Field data is kept in IndexedDB and replayed to the API when the network comes back, because many highway sites have no signal." },
      { decision: "A thin Android shell for one reason", why: "Capacitor wraps the same web app only to reach Bluetooth Classic label printers, which Web Bluetooth cannot drive." },
      { decision: "Labels composed on the server", why: "The API builds the TSPL printer code from a template stored in the database, so the label layout changes without republishing the app." },
      { decision: "Roles, then ownership", why: "A roles guard decides what each profile may do on the API, and an ownership rule on top means a field agent only edits the records they created, so every entry stays traceable." },
      { decision: "Containerised releases", why: "The API and the web app ship as Docker images through a registry and run behind Nginx, with asset photos served from object storage and a CDN." },
    ],
  },
  {
    slug: "denkmako", title: "Denkmako", client: "Denkmako", categories: ["mobile", "saas"], year: "2025",
    summary: "Multi-vendor marketplace for Senegalese fashion, straight from the workshops, on web, iOS and Android.",
    metric: "60+ creator shops, live on both stores",
    stack: ["Flutter", "Riverpod", "NestJS 11", "Angular 20", "Nx", "PostgreSQL", "Redis", "BullMQ", "AWS S3", "Firebase Cloud Messaging"],
    cover: img("denkmako-desktop"), gallery: [img("denkmako-diagram"), img("denkmako-app-home-mobile"), img("denkmako-app-product-mobile"), img("denkmako-app-shops-mobile"), img("denkmako-app-categories-mobile"), img("denkmako-desktop"), img("denkmako-mobile")],
    video: "/video/denkmako-app.mp4", videoPhone: true,
    url: "https://denkmako.com", featured: true,
    context: "Senegalese designers sold through Instagram and WhatsApp, one conversation at a time: no catalogue, no trusted payment, and made-to-measure orders tracked by hand. The marketplace had to serve buyers and dozens of independent workshops at once, each with its own stock, lead times and payment habits, on mid-range phones and mobile data.",
    built: "I built the whole platform: one Flutter app for both buyers and sellers (Riverpod, go_router), a modular NestJS API of about sixty controllers in an Nx workspace, an Angular back office for moderation and orders, and the landing site. A cart spanning several shops is split into one sub-order per vendor, each driven by a server-side state machine. Payments go through a provider registry (Orange Money, Wave, PayDunya, Paxity), images are normalised to WebP on upload, and the app speaks French, English and Wolof.",
    result: "Live on the App Store and Google Play, with more than 60 creator shops and 800 pieces online.",
    architecture: [
      { decision: "One sub-order per vendor", why: "A single checkout spans several workshops, and each sub-order moves at its own pace: made-to-measure takes weeks, ready-to-wear ships the same day." },
      { decision: "An order state machine on the server", why: "Allowed transitions are declared per role and enforced by the API, and only an administrator can roll a status back." },
      { decision: "A registry of payment providers", why: "Orange Money, Wave, PayDunya and Paxity sit behind one interface with server-side callbacks, while the app handles QR codes, deep links and polling until payment is confirmed." },
      { decision: "Images normalised at upload", why: "Every photo is converted to WebP and capped at 2,000 pixels, which keeps the catalogue light on mobile data." },
      { decision: "One Flutter app, two experiences", why: "Buyers and sellers share authentication, networking and the design system, and a single HTTP client handles tokens, offline errors and expired sessions." },
      { decision: "Built for local users", why: "French, English and Wolof, with push notifications through Firebase and background jobs for WhatsApp and SMS messages." },
    ],
  },
  {
    slug: "digital-senegal", title: "Digital Senegal", client: "Plateforme des Entreprises Numériques du Sénégal", categories: ["public", "websites"], year: "2026",
    summary: "National data platform and directory of Senegal's digital companies.",
    metric: "National directory of the digital sector",
    stack: ["Angular 21", "NestJS 11", "MongoDB", "AWS S3", "Nodemailer"],
    cover: img("digital-senegal-desktop"), gallery: [img("digital-senegal-diagram"), img("digital-senegal-desktop"), img("digital-senegal-mobile")],
    url: "https://digitalsenegal.sn", featured: true,
    context: "The digital sector had no single, trusted source for its companies, news, trainings and opportunities, and the data it would collect was personal.",
    built: "A public portal with analytics dashboards on the ecosystem. Security was designed in from the start: passwordless magic link authentication, personal data encrypted at rest, then an independent security audit whose findings were all fixed before launch.",
    result: "A national directory of the ecosystem, open to everyone and built to protect the data it holds.",
    architecture: [
      { decision: "Passwordless sign-in", why: "A random one-time link, stored only as a SHA-256 hash and valid for 15 minutes, so there is no password to store or steal." },
      { decision: "An audit trail on sensitive actions", why: "An interceptor records every write and sensitive read with the IP address, user agent and outcome." },
      { decision: "Notifications driven by events", why: "Business code emits internal events and notifications are sent from listeners, so a slow email never holds up a request." },
    ],
  },

  // Public sector and HR SaaS
  {
    slug: "socium-security", title: "Socium security", client: "Socium", categories: ["saas"], year: "2025 to 2026", published: false,
    summary: "Hardening of a five-app multi-tenant suite after a penetration test.",
    metric: "One security model across 5 apps",
    stack: ["NestJS", "Keycloak", "AWS S3", "AWS Lambda", "Datadog"],
    cover: img("socium-security-diagram"),
    context: "A penetration test found tenant isolation and IDOR weaknesses. Fixing them app by app would have left gaps.",
    built: "Tenant isolation enforced in a shared data-access layer rather than in each endpoint, fail-closed guards, per-app permissions and RBAC with Keycloak. A secured file service on S3 with antimalware scanning and short-lived signed links, and Datadog logging across the suite.",
    result: "One security model and one file service shared by all five apps, closing the reported findings at the root.",
  },
  {
    slug: "propriyo", title: "Propriyo", categories: ["saas"], year: "2026",
    summary: "Multi-tenant rental management SaaS: leases, rent collection, reminders, receipts and owner payouts.",
    metric: "Per-agency data isolation",
    stack: ["NestJS 11", "Angular 20", "MongoDB", "Nx", "Puppeteer", "WhatsApp Cloud API", "MinIO", "Traefik", "Docker", "GitLab CI", "Next.js 16", "Ollama"],
    cover: img("propriyo-desktop"), gallery: [img("propriyo-diagram"), img("propriyo-desktop"), img("propriyo-mobile")],
    url: "https://propriyo.com",
    context: "Rental agencies run leases, rent collection, reminders and owner payouts across spreadsheets, WhatsApp and paper receipts. Each agency must only ever see its own data, owners want to follow what their property earns, and tenants pay with mobile money.",
    built: "A multi-tenant SaaS of about sixty NestJS modules in an Nx workspace, with an Angular app for agencies and a portal for tenants. Every request goes through layered guards: active account, valid subscription, then the modules the agency's plan includes. Rents are collected through a payment gateway with signed, idempotent webhooks, statuses age on their own through scheduled jobs that escalate reminders by email and WhatsApp, and receipts and e-signed leases are rendered as PDF. Delivery runs through GitLab CI to Docker behind Traefik, with documents on MinIO. An AI assistant on a self-hosted Ollama is in testing: it drafts messages and lease contracts and analyses the events of a property, without the data leaving the platform.",
    result: "Agencies run the whole rental cycle in one place, from the lease to the owner payout, with AI features being tested on a self-hosted model.",
    architecture: [
      { decision: "Tenant isolation in every query", why: "Every service filters by agency, and an owner only reaches their own properties through a dedicated scope service." },
      { decision: "Guards in layers", why: "Each request re-checks that the account is still active, that the subscription is valid, and that the agency's plan includes the module being called." },
      { decision: "Payments through a gateway, idempotent by design", why: "Webhooks are signed and keyed by the external reference, so a replayed notification never marks a rent as paid twice." },
      { decision: "Rent statuses that age on their own", why: "Scheduled jobs move rents to late and escalate reminders, with a catch-up at startup so a missed night is never lost." },
      { decision: "Side effects as event listeners", why: "Receipts, wallet credits and WhatsApp messages react to domain events, which keeps the payment flow short and each channel independent." },
      { decision: "AI on a self-hosted model", why: "The assistant in testing runs on Ollama, so drafting leases and analysing tenant history never sends agency data to a third party." },
    ],
  },

  // DevOps
  {
    slug: "devsecops-pipeline", title: "DevSecOps pipeline", client: "Open source reference", categories: ["devops"], year: "2024",
    summary: "Corporate CI/CD pipeline on AWS: from a commit to a scanned, quality-gated release running on Kubernetes.",
    metric: "17 automated stages, security gates at build and image level",
    stack: ["Jenkins", "Kubernetes", "AWS EC2", "SonarQube", "Trivy", "Nexus", "Docker", "Helm", "Prometheus", "Grafana", "Maven"],
    cover: img("devsecops-diagram"),
    url: "https://github.com/ej7dev/DevSecOps-Corporate-Pipeline",
    context: "Most pipelines stop at build and deploy. A corporate pipeline has to prove, at every release, that the code meets a quality bar and ships no known vulnerability, and that what runs in production is observed.",
    built: "The full infrastructure provisioned on AWS EC2: a Kubernetes cluster, SonarQube, Nexus and Jenkins on dedicated instances. The Jenkins pipeline compiles and tests with Maven, scans the file system with Trivy, runs SonarQube analysis and blocks on its quality gate, publishes versioned artifacts to Nexus, then builds, tags and scans the Docker image before pushing it and deploying to Kubernetes, where it verifies pods and services. Prometheus and Grafana, installed with Helm, monitor both the cluster and the application, and Jenkins reports each run by email.",
    result: "A reproducible, documented blueprint where nothing reaches the cluster without passing tests, the quality gate and two vulnerability scans. Shared on LinkedIn, where it drew close to 300 reactions.",
  },
  {
    slug: "spring-cloud-microservices", title: "Spring Cloud microservices", client: "Open source reference", categories: ["devops"], year: "2024",
    summary: "Microservice architecture with an edge gateway, service discovery, centralized configuration and Keycloak security.",
    stack: ["Spring Boot", "Spring Cloud Gateway", "Eureka", "Spring Cloud Config", "OpenFeign", "Keycloak", "Docker Compose"],
    cover: img("spring-cloud-diagram"),
    url: "https://github.com/ej7dev/spring-boot-edge-microservices",
    built: "Product, order and payment services behind a Spring Cloud Gateway, registered in Eureka and configured from a Git-backed Config Server, so configuration changes without a rebuild. Services call each other through OpenFeign, the edge is secured with Keycloak (OAuth2, Spring Security), and the whole stack starts with Docker Compose.",
  },
  {
    slug: "jenkins-sonarqube", title: "Jenkins and SonarQube CI", client: "Open source reference", categories: ["devops"], year: "2024",
    summary: "Continuous integration for a JHipster application (Spring Boot and Angular) with static analysis and quality gates.",
    stack: ["Jenkins", "SonarQube", "Docker", "JHipster", "Spring Boot", "Angular", "Maven"],
    cover: img("jenkins-sonarqube-diagram"),
    url: "https://github.com/ej7dev/jhipster-jenkins-sonarcube",
    built: "Declarative Jenkins pipelines running on ephemeral Docker agents, SonarQube analysis through the Maven scanner and a quality gate that fails the build, applied to a full-stack JHipster application with Checkstyle, ESLint and Jest.",
  },

  // Recruitment platforms (UK)
  {
    slug: "gosbloom", title: "Gosbloom", client: "Gosbloom, London", categories: ["websites", "saas"], year: "2025",
    summary: "Recruitment platform with a custom ATS and CV parsing, for a London agency in recruitment, home care and compliance.",
    metric: "Custom ATS with CV parsing",
    stack: ["Angular 21", "Nx", "Firebase", "Tailwind CSS 4"],
    cover: img("gosbloom-desktop"), gallery: [img("gosbloom-desktop"), img("gosbloom-mobile")],
    url: "https://gosbloom.com",
    context: "The agency recruits across several sectors and needed to stop handling applications through inboxes and spreadsheets.",
    built: "A server-rendered public site for SEO and a back office in the same Nx monorepo. Candidates apply online, their CVs are parsed into structured profiles, and recruiters manage jobs and candidates through a custom ATS. Separate staging and production environments on Firebase.",
    result: "Applications, jobs and content run from one platform built around the agency's own process.",
  },
  {
    slug: "crem-recruitment", title: "Crem", client: "CREM Recruitment, UK", categories: ["websites", "saas"], year: "2024 to 2026",
    summary: "Recruitment platform with a custom ATS and CV parsing, for a subscription-based recruitment service.",
    metric: "Custom ATS with CV parsing",
    stack: ["Angular 21", "Nx", "Firebase", "Cloud Functions"],
    cover: img("crem-desktop"), gallery: [img("crem-desktop"), img("crem-mobile")],
    url: "https://www.cremrecruitment.co.uk",
    context: "CREM sells recruitment as a subscription and needed one platform that attracts candidates and clients and runs the hiring pipeline behind them.",
    built: "A public site with job search and an admin back office in an Nx monorepo. A custom ATS tracks candidates through the pipeline, and CV parsing in Cloud Functions turns uploaded résumés into structured, searchable profiles.",
    result: "The agency runs its whole recruitment flow on its own platform.",
  },
  {
    slug: "peridot", title: "Peridot Partners", client: "Peridot Partners, UK", categories: ["websites", "saas"], year: "2026",
    summary: "Executive and board recruitment platform for charities, education and the public sector, with a custom ATS and CV parsing.",
    metric: "Custom ATS with CV parsing",
    stack: ["Angular 21", "Nx", "Firebase"],
    cover: img("peridot-desktop"), gallery: [img("peridot-desktop"), img("peridot-mobile")],
    url: "https://peridot-website.web.app",
    built: "A server-rendered public site and a back office with a custom ATS: senior appointments published online, applications with CV parsing into structured profiles, and candidate tracking for the search team.",
  },
  {
    slug: "team-network", title: "TEAM Network", client: "TEAM Network, UK", categories: ["websites", "saas"], year: "2025 to 2026",
    summary: "Platform for the UK network of independent recruitment agencies, with a custom ATS and CV parsing.",
    metric: "Custom ATS with CV parsing",
    stack: ["Angular 21", "Nx", "Firebase"],
    cover: img("team-network-desktop"), gallery: [img("team-network-desktop"), img("team-network-mobile")],
    url: "https://team-network-c3c8c.web.app",
    built: "A public site and a back office for the network, with a custom ATS and CV parsing that turns applications into structured candidate profiles.",
  },
  {
    slug: "twoscore", title: "TwoScore", client: "TwoScore Recruitment, UK", categories: ["websites", "saas"], year: "2025 to 2026",
    summary: "Recruitment platform for health, safety, environment and quality roles, with a custom ATS, CV parsing and a CMS.",
    metric: "Custom ATS with CV parsing",
    stack: ["Angular 20", "Firebase", "Tailwind CSS 4", "PWA"],
    cover: img("twoscore-desktop"), gallery: [img("twoscore-desktop"), img("twoscore-mobile")],
    url: "https://www.two-score.com",
    built: "An installable PWA with a CMS for the team's content, job listings and applications, a custom ATS, and CV parsing into structured candidate profiles.",
  },
  {
    slug: "silverstone", title: "Silver Stone", client: "Silver Stone Search & Selection, UK", categories: ["websites", "saas"], year: "2026",
    summary: "Executive search platform with server-side rendering, a custom ATS and CV parsing.",
    metric: "Custom ATS with CV parsing",
    stack: ["Angular 21", "Nx", "Firebase"],
    cover: img("silverstone-desktop"), gallery: [img("silverstone-desktop"), img("silverstone-mobile")],
    url: "https://silverstone-web.web.app",
    built: "A server-rendered site for search visibility and a back office with a custom ATS, where uploaded CVs are parsed into structured profiles for the consultants.",
  },
  {
    slug: "4square-recruitment", title: "4Square Recruitment", client: "4Square Recruitment, UK", categories: ["websites", "saas"], year: "2023 to 2026",
    summary: "Specialist recruitment across IT, cyber and engineering, with a custom ATS and CV parsing.",
    stack: ["Angular 16", "Tailwind CSS 3"],
    cover: img("4square-desktop"), gallery: [img("4square-desktop"), img("4square-mobile")],
    url: "https://www.4square-recruitment.com",
    built: "Contribution to the platform: job pages, applications, the custom ATS and CV parsing.",
  },

  // Fintech and SaaS products
  {
    slug: "xamdocs", title: "XamDocs AI", client: "AXONE", categories: ["saas", "mobile"], year: "2025", published: false,
    summary: "Document assistant: ask questions about your documents in a chat, on mobile and web.",
    stack: ["Flutter", "Angular 20", "NestJS 11", "MongoDB"],
    built: "A Flutter chat client and an Angular web app on a NestJS API that sends documents to an AI backend for analysis and answers grounded in their content.",
  },
  {
    slug: "mobiflex", title: "Mobiflex", client: "Pals Automobile", categories: ["saas"], year: "2026", published: false,
    summary: "Car mobility and investment platform.",
    stack: ["Angular 21", "NestJS 11", "Next.js 16", "Nx"],
    built: "An Nx monorepo with a NestJS API, an Angular application and a Next.js public site.",
  },
  {
    slug: "nana", title: "NANA", client: "NANA", categories: ["saas"], year: "2026", published: false,
    summary: "Salon booking platform: availability, appointments, payments and reviews.",
    stack: ["NestJS 11", "Next.js 16", "Nx"],
    built: "A NestJS API handling salons, staff availability, bookings, payments and reviews, with a Next.js front end.",
  },
  {
    slug: "cauris-assure", title: "Cauris Assure", client: "Cauris", categories: ["fintech", "saas"], year: "2026", published: false,
    summary: "Insurance coupon issuing and tracking for small businesses.",
    stack: ["Angular 21", "NestJS 11", "Nx"],
  },
  {
    slug: "cauris-erp", title: "Cauris ERP", client: "Cauris", categories: ["saas"], year: "2025", published: false,
    summary: "Multi-tenant ERP delivered as a service, with automated delivery pipelines.",
    stack: ["NestJS 11", "Angular 20", "Nx", "Azure Pipelines"],
  },
  {
    slug: "axonepay", title: "AxonePay", client: "AXONE", categories: ["fintech"], year: "2023 to 2025", published: false,
    summary: "Invoicing API with user management and authentication.",
    stack: ["NestJS", "TypeORM", "PostgreSQL"],
  },
  {
    slug: "afrofame", title: "Afrofame", client: "Afrofame", categories: ["saas", "websites"], year: "2024 to 2025", published: false,
    summary: "Personalised video messages from celebrities, and a directory of Afro talent.",
    stack: ["NestJS 10", "PostgreSQL", "Next.js 15", "React 19"],
    built: "A NestJS API on PostgreSQL for orders, talent profiles and deliveries, with a Next.js and React 19 client space.",
  },
  {
    slug: "agence-cauris-crm", title: "Agence Cauris CRM", client: "Agence Cauris", categories: ["saas"], year: "2022",
    summary: "CRM and management dashboard for an agency.",
    stack: [],
    cover: img("cauris-crm"),
  },

  // Websites

  // Mobile
  {
    slug: "school-management", title: "School Management", client: "School", categories: ["mobile"], year: "2024",
    summary: "Mobile app for students and parents: attendance, timetable, results and fees.",
    stack: ["SwiftUI"],
    url: "https://github.com/ej7dev/swiftui-school-app",
    cover: img("school"),
  },
  {
    slug: "booking-app", title: "Booking app", client: "Side project", categories: ["mobile"], year: "2024",
    summary: "Accommodation booking app.",
    stack: ["SwiftUI"],
    url: "https://github.com/ej7dev/AirbnbClone-SwiftUI",
    cover: img("mobile-app"),
  },
  {
    slug: "threads-clone", title: "Threads clone", client: "Side project", categories: ["mobile"], year: "2024",
    summary: "Social app inspired by Threads.",
    stack: ["SwiftUI", "Firebase", "SwiftData"],
    url: "https://github.com/ej7dev/ThreadsClone-SwiftUI",
    cover: img("threads"),
  },
  {
    slug: "aora", title: "Aora", client: "Side project", categories: ["mobile"], year: "2024",
    summary: "Video sharing app.",
    stack: ["React Native", "Expo"],
    url: "https://github.com/ej7dev/react-native-video-app",
    cover: img("social-app"),
  },
];

export const PROJECTS = ALL.filter(p => p.published !== false);
export const FEATURED = PROJECTS.filter(p => p.featured);
export const findProject = (slug: string) => PROJECTS.find(p => p.slug === slug);
