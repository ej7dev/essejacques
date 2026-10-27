<template>
  <div ref="root">
    <section class="hero" aria-label="Introduction">
      <div class="hero-inner">
        <SplitTitle tag="h1" text="Esse Jacques" class="name" />
        <p class="sub eyebrow">Senior full-stack engineer based in Dakar.<br>I design, build and run the systems institutions depend on: mobile money payments, bank archives, government platforms and multi-tenant SaaS.</p>
      </div>
      <div class="hero-foot wrap">
        <a class="hint" href="#work-title">Scroll to Explore
          <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true"><path d="M1 1l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" /></svg>
        </a>
        <span>Featured Projects</span>
      </div>
    </section>

    <HorizontalWork :projects="FEATURED" :total="PROJECTS.length" />

    <p class="tagline eyebrow wrap">From the first API call to production, for banks, governments and SaaS across Africa and the UK.</p>

    <section class="skills wrap" aria-labelledby="skills-label">
      <p id="skills-label" class="label">What I build</p>
      <ul>
        <li v-for="s in skills" :key="s" class="display"><span class="line">{{ s }}</span></li>
      </ul>
    </section>

    <section class="teaser wrap" aria-labelledby="teaser-title">
      <p class="eyebrow">Unveiling my software engineering journey</p>
      <NuxtLink to="/about" class="about-link" data-cursor="view">
        <SplitTitle id="teaser-title" text="About" class="about-title" />
      </NuxtLink>
      <div class="facts">
        <div><b class="display">{{ years }}+</b><span>years building products</span></div>
        <div><b class="display">20+</b><span>African countries reached by Socium</span></div>
        <div><b class="display">{{ PROJECTS.length }}</b><span>projects in the portfolio</span></div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const years = useExperienceYears();
import { FEATURED, PROJECTS } from "~/data/projects";

useSeoMeta({
  title: "Senior Full-Stack Engineer in Dakar",
  description: "Esse Jacques, senior full-stack engineer in Dakar. Payments, archives, public platforms and an HR SaaS used in 20+ African countries, plus products for the UK.",
  ogTitle: "Esse Jacques, Senior Full-Stack Engineer",
  ogDescription: "Payments, archives, public platforms and an HR SaaS used in 20+ African countries, plus products for the UK.",
});

const skills = ["Mobile money payment rails", "Electronic archiving (SAE)", "Platforms for governments", "HR SaaS in 20+ countries", "Apps live on both stores", "Pipelines to production", "AI that stays on premise"];
const root = ref<HTMLElement | null>(null);

useMotion(root, ({ gsap }) => {
  gsap.from(".name .ch", { yPercent: 110, duration: 1.2, ease: "power4.out", stagger: .045, delay: .15 });
  gsap.from([".sub", ".hero-foot"], { opacity: 0, y: 20, duration: 1, ease: "power3.out", delay: .8, stagger: .15 });
  gsap.to(".hero-inner", { yPercent: -35, opacity: 0, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.from(".tagline", { opacity: 0, y: 30, duration: 1, scrollTrigger: { trigger: ".tagline", start: "top 85%" } });
  gsap.from(".skills .label", { opacity: 0, y: 16, duration: .8, scrollTrigger: { trigger: ".skills", start: "top 85%" } });
  gsap.from(".skills .line", { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: .07,
    scrollTrigger: { trigger: ".skills ul", start: "top 85%" } });
  gsap.utils.toArray<HTMLElement>(".skills li").forEach(li => gsap.fromTo(li, { color: "#666666" }, { color: "#FFFFFF", ease: "none",
    scrollTrigger: { trigger: li, start: "top 80%", end: "top 50%", scrub: true } }));
  gsap.from(".about-title .ch", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .06,
    scrollTrigger: { trigger: ".about-title", start: "top 85%" } });
  gsap.from(".teaser .eyebrow", { opacity: 0, y: 20, duration: .8, scrollTrigger: { trigger: ".teaser", start: "top 80%" } });
  gsap.from(".facts > div", { y: 40, opacity: 0, duration: .9, stagger: .12, scrollTrigger: { trigger: ".facts", start: "top 90%" } });
});
</script>

<style scoped>
.hero { height: 100vh; min-height: 560px; position: relative; display: grid; place-items: center; text-align: center; padding: 0 var(--gutter); }
.name { font-size: clamp(6rem, 21vw, 22rem); line-height: .9; white-space: nowrap; letter-spacing: .01em; }
.sub { margin: 1.2rem auto 0; max-width: 46rem; line-height: 1.5; }
.hero-foot { position: absolute; left: 0; right: 0; bottom: 36px; display: flex; justify-content: space-between; align-items: center; font-size: .9rem; font-weight: 500; }
.hint { display: inline-flex; align-items: center; gap: 14px; }
.hint svg { animation: nudge 1.8s ease-in-out infinite; }
@keyframes nudge { 50% { transform: translateY(4px); } }

.tagline { text-align: center; padding-top: 16vh; padding-bottom: 10vh; font-size: clamp(.95rem, 1.4vw, 1.15rem); }
.skills { text-align: center; padding-bottom: 14vh; }
.label { font-weight: 500; font-size: .95rem; text-transform: uppercase; margin: 0 0 2vh; }
.skills ul { list-style: none; margin: 0; padding: 0; display: grid; gap: clamp(10px, 1.6vw, 24px); }
.skills li { font-size: clamp(3.6rem, 9.5vw, 8.4rem); line-height: .98; color: #666; overflow: hidden; }
.skills .line { display: inline-block; }

.teaser { text-align: center; padding-top: 10vh; padding-bottom: 16vh; }
.about-link { display: inline-block; }
.about-title { font-size: clamp(8rem, 24vw, 22rem); margin-top: .1em; transition: opacity .3s; }
.about-link:hover .about-title { opacity: .75; }
.facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; max-width: 1000px; margin: 8vh auto 0; }
.facts b { display: block; font-size: clamp(4rem, 7vw, 6.5rem); line-height: .9; }
.facts span { color: var(--muted); }

@media (max-width: 560px) {
  .name { white-space: normal; font-size: 38vw; line-height: .85; }
  .name :deep(.split) { display: block; }
  .facts { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .hint svg { animation: none; }
  .skills li { color: var(--fg); }
}
</style>
