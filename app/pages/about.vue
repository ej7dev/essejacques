<template>
  <div ref="root" class="about">
    <header class="top wrap">
      <p class="eyebrow">Unveiling my software engineering journey</p>
      <SplitTitle tag="h1" text="About" class="title" />
    </header>

    <section class="intro wrap">
      <p class="bio"><strong>Senior full-stack engineer with {{ years }}+ years</strong> of experience designing, building and deploying web and mobile products for fintech, the public sector, SaaS and UK recruitment agencies. I work across the whole stack, from Java, Python and NestJS backends to Angular, React and Nuxt front ends, Flutter and React Native apps, and the Docker, Kubernetes and CI/CD pipelines that run them.</p>
      <p class="bio dim">I enjoy owning a product end to end: scoping with the client, technical design, leading developers, shipping and handling production. Based in Dakar, Senegal.</p>
      <div class="cta">
        <a class="btn solid" href="/CV_Esse_Jacques_EN.pdf" download>Download my CV</a>
        <a class="btn" href="mailto:contact@essejacques.me">Email me</a>
      </div>
    </section>

    <section class="block wrap" aria-labelledby="exp-title">
      <h2 id="exp-title" class="display">Experience</h2>
      <ol class="timeline" reversed>
        <li v-for="r in roles" :key="r.title">
          <span class="when">{{ r.when }}</span>
          <div>
            <h3>{{ r.title }}</h3>
            <p class="org">{{ r.org }}</p>
            <p>{{ r.text }}</p>
            <ul class="wins">
              <li v-for="w in r.wins" :key="w.text"><NuxtLink :to="`/portfolio/${w.slug}`">{{ w.text }}</NuxtLink></li>
            </ul>
          </div>
        </li>
      </ol>
    </section>

    <section class="block wrap" aria-labelledby="skills-title">
      <h2 id="skills-title" class="display">Skills</h2>
      <dl class="skills">
        <div v-for="s in skills" :key="s.k"><dt>{{ s.k }}</dt><dd>{{ s.v }}</dd></div>
      </dl>
    </section>

    <section class="block wrap" aria-labelledby="edu-title">
      <h2 id="edu-title" class="display">Education</h2>
      <ul class="list">
        <li v-for="e in education" :key="e.k"><strong>{{ e.k }}</strong><span>{{ e.v }}</span></li>
      </ul>
    </section>

    <section class="block wrap" aria-labelledby="cert-title">
      <h2 id="cert-title" class="display">Certifications</h2>
      <ul class="list">
        <li v-for="c in certifications" :key="c.k"><strong>{{ c.k }}</strong><span>{{ c.v }}</span></li>
      </ul>
    </section>

    <section class="block wrap" aria-labelledby="learning-title">
      <h2 id="learning-title" class="display">Learning</h2>
      <ul class="list">
        <li v-for="l in learning" :key="l.k"><strong>{{ l.k }}</strong><span>{{ l.v }}</span></li>
      </ul>
    </section>

    <section class="block wrap last" aria-labelledby="lang-title">
      <h2 id="lang-title" class="display">Languages</h2>
      <ul class="list">
        <li v-for="l in languages" :key="l.k"><strong>{{ l.k }}</strong><span>{{ l.v }}</span></li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const years = useExperienceYears();
useSeoMeta({
  title: "About",
  description: "Esse Jacques, senior full-stack engineer in Dakar: experience, skills, education and certifications.",
  ogTitle: "About Esse Jacques",
});

const roles = [
  { when: "Dec 2024 to now", title: "Senior Full-Stack Engineer", org: "Socium, Dakar", text: "HR SaaS used in 20+ African countries. Lead on Workflow and Performance, security across all products, shared libraries and observability. 1,450+ commits across 10 repositories.",
    wins: [
      { slug: "socium-workflow", text: "Workflow v2 rebuilt from scratch, with no break for clients already live" },
      { slug: "socium-workspace", text: "One security model across five apps after a penetration test" },
      { slug: "socium-workspace", text: "HR reports with 143 KPIs, scheduled and rendered as PDF" },
    ] },
  { when: "Aug 2021 to Nov 2024", title: "Lead Software Engineer", org: "AXONE, Dakar", text: "Led the development team: scoping and solution design with clients, technical choices, code reviews, deployments and user training. Platforms for the BOAD, SENELEC, CNFPLF, ADS and Digital Senegal, plus fintech and SaaS products.",
    wins: [
      { slug: "boad-archiving", text: "BOAD: 100% of the bank's archives in a system whose integrity can be proven" },
      { slug: "senelec", text: "SENELEC: partner requests processed 60% faster" },
      { slug: "ads-inventory", text: "ADS: each highway asset inventoried in under a minute" },
      { slug: "cauris-pay", text: "CaurisFlux: one integration for every mobile money operator" },
    ] },
  { when: "Aug 2020 to Aug 2021", title: "Software Development Consultant", org: "Multivers, Paris (remote)", text: "Recruitment websites for London firms, FireWatch for Midgard, CI/CD and internal tooling.",
    wins: [
      { slug: "firewatch", text: "FireWatch: real-time wildfire detection, showcased at the Élysée" },
      { slug: "crem-recruitment", text: "Recruitment platforms for London firms, with ATS integrations" },
    ] },
];

const skills = [
  { k: "Backend", v: "Java (Spring Boot), Python (Django, Django REST Framework, Flask, FastAPI), NestJS, Node.js" },
  { k: "Frontend", v: "Angular, React, Next.js, Nuxt, TypeScript, Tailwind CSS, NgRx" },
  { k: "Mobile", v: "Flutter, React Native (Expo), Capacitor, App Store and Google Play releases" },
  { k: "Architecture", v: "Microservices, modular monolith, multi-tenancy, event-driven systems, REST, SOAP, GraphQL, idempotency" },
  { k: "Data", v: "PostgreSQL, Oracle Database, SQL Server, MySQL, MongoDB, Redis, Elasticsearch, Firestore" },
  { k: "Cloud and DevOps", v: "Docker, Kubernetes, GitLab CI/CD, GitHub Actions, Azure Pipelines, AWS (EC2, S3, Lambda, VPC), Azure, Firebase, Nginx" },
  { k: "Security", v: "OAuth2, OpenID Connect, JWT, Keycloak, RBAC, SSO, MFA, passwordless authentication, encryption at rest, OWASP" },
  { k: "Quality and observability", v: "JUnit, Testcontainers, Jest, Vitest, pytest, Playwright, SonarQube, Grafana, Prometheus, Datadog" },
];

const education = [
  { k: "MBA in Digital Solutions Design and Development", v: "ISM Digital Campus, Dakar" },
  { k: "Bachelor's degree in Software Engineering, Networks and Systems", v: "ISM Digital Campus, Dakar" },
  { k: "Bachelor's degree in Computer Science", v: "INU Champollion, Albi, France" },
];

const certifications = [
  { k: "DevOps Engineer: Linux, Docker, Kubernetes, Terraform, CI/CD", v: "Udemy" },
  { k: "Microservices and Distributed Systems", v: "Amigoscode" },
  { k: "CCNA Routing and Switching", v: "Cisco" },
  { k: "Blockchain Developer", v: "LinkedIn, 2024" },
  { k: "Building an Ubuntu Server", v: "LinkedIn, 2024" },
  { k: "Linux: Web Services", v: "LinkedIn, 2024" },
  { k: "Learning Kubernetes", v: "LinkedIn, 2022" },
  { k: "Continuous Integration and Continuous Delivery with GitLab", v: "LinkedIn, 2022" },
  { k: "Flutter Essentials", v: "LinkedIn, 2021" },
];

// In progress, not certified yet.
const learning = [
  { k: "AWS Certified Solutions Architect, Associate (SAA-C03)", v: "Training completed, exam in preparation" },
  { k: "Certified Kubernetes Administrator (CKA)", v: "In preparation" },
  { k: "Certified Kubernetes Application Developer (CKAD)", v: "In preparation" },
  { k: "Software architecture katas with the C4 model", v: "System context, container and component diagrams on real cases" },
];

const languages = [
  { k: "French", v: "Native" },
  { k: "English", v: "Professional working proficiency" },
];

const root = ref<HTMLElement | null>(null);
useMotion(root, ({ gsap }) => {
  gsap.from(".title .ch", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .06, delay: .1 });
  gsap.from(".top .eyebrow", { opacity: 0, y: 16, duration: .8, delay: .4 });
  gsap.utils.toArray<HTMLElement>(".bio, .cta, .block > h2, .timeline > li, .wins li, .skills > div, .list li").forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" } }));
});
</script>

<style scoped>
.top { padding-top: calc(var(--header) + 8vh); text-align: center; }
.title { font-size: clamp(8rem, 26vw, 24rem); margin-top: .1em; }
.intro { max-width: 980px; margin: 6vh auto 0; text-align: center; }
.bio { font-size: clamp(1.15rem, 1.9vw, 1.55rem); line-height: 1.55; font-weight: 300; margin: 0 0 1.2em; }
.bio strong { font-weight: 500; }
.bio.dim { color: #bdbdbd; }
.cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; margin-top: 4vh; }
.block { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2.2fr); gap: clamp(24px, 5vw, 80px); padding-top: 14vh; }
.block > h2 { font-size: clamp(3.4rem, 6vw, 6rem); align-self: start; position: sticky; top: calc(var(--header) + 20px); }
.timeline { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.timeline > li { display: grid; grid-template-columns: 11rem minmax(0, 1fr); gap: 4px 24px; padding: 26px 0; border-bottom: 1px solid var(--line); }
.when { color: var(--muted); font-size: .9rem; padding-top: 3px; }
.timeline h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
.org { color: var(--muted); margin: 0 0 8px; }
.timeline p { margin: 0; color: #d0d0d0; }
.wins { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 8px; }
.wins a { color: var(--fg); text-decoration: underline; text-decoration-color: var(--line); text-underline-offset: 4px; transition: text-decoration-color .2s; }
.wins a:hover { text-decoration-color: var(--fg); }
.wins li::before { content: "+ "; color: var(--muted); }
.skills { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 40px; }
.skills dt { font-weight: 600; margin-bottom: 4px; }
.skills dd { margin: 0; color: #bdbdbd; }
.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.list li { display: flex; justify-content: space-between; align-items: baseline; gap: 8px 24px; flex-wrap: wrap; padding: 20px 0; border-bottom: 1px solid var(--line); }
.list strong { font-weight: 600; }
.list span { color: var(--muted); }
.last { padding-bottom: 14vh; }
@media (max-width: 860px) {
  .block, .skills { grid-template-columns: 1fr; }
  .block > h2 { position: static; }
  .timeline > li { grid-template-columns: 1fr; }
}
</style>
