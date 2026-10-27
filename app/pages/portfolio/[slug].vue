<template>
  <article v-if="project" ref="root" class="case">
    <header class="top wrap">
      <NuxtLink to="/portfolio" class="back">All projects</NuxtLink>
      <SplitTitle tag="h1" :text="project.title" class="title" />
      <p class="summary">{{ project.summary }}</p>
    </header>

    <div class="hero wrap">
      <div v-if="staged" class="stage">
        <DeviceFrame v-if="project.video && project.videoPhone" kind="phone" class="main-device phone-video">
          <ProjectVideo :src="project.video" :label="`${project.title} walkthrough`" />
        </DeviceFrame>
        <DeviceFrame v-else :host="hostName" class="main-device">
          <ProjectVideo v-if="project.video" :src="project.video" :poster="project.cover" :label="`${project.title} walkthrough`" />
          <img v-else :src="project.cover" :srcset="srcsetOf(project.cover!)" sizes="(max-width: 1120px) 100vw, 1120px" v-bind="mediaSize(project.cover!)" fetchpriority="high" :alt="`${project.title} screenshot`">
        </DeviceFrame>
      </div>
      <div v-else class="frame" :class="{ diagram }">
        <ProjectCover :project="project" eager />
      </div>
    </div>

    <dl class="facts wrap">
      <div v-if="project.client"><dt>Client</dt><dd>{{ project.client }}</dd></div>
      <div v-if="project.metric"><dt>Key result</dt><dd>{{ project.metric }}</dd></div>
      <div v-if="project.url"><dt>Live</dt><dd><a :href="project.url" target="_blank" rel="noopener">{{ host(project.url) }} ↗</a></dd></div>
    </dl>

    <section v-if="project.context || project.built || project.result" class="story wrap" aria-label="Case study">
      <div v-if="project.context" class="block"><h2>Context</h2><p>{{ project.context }}</p></div>
      <div v-if="project.built" class="block"><h2>What I built</h2><p>{{ project.built }}</p></div>
      <div v-if="project.result" class="block"><h2>Result</h2><p>{{ project.result }}</p></div>
    </section>

    <section v-if="project.architecture?.length" class="arch wrap" aria-labelledby="arch-title">
      <h2 id="arch-title">Architecture</h2>
      <ol>
        <li v-for="a in project.architecture" :key="a.decision">
          <h3>{{ a.decision }}</h3>
          <p>{{ a.why }}</p>
        </li>
      </ol>
    </section>

    <section v-if="project.stack.length" class="stack wrap" aria-labelledby="stack-title">
      <h2 id="stack-title">Stack</h2>
      <ul><li v-for="s in project.stack" :key="s" class="pill">{{ s }}</li></ul>
    </section>

    <section v-if="extra.length" class="gallery wrap" aria-label="Screenshots">
      <figure v-for="src in extra" :key="src" :class="{ mobile: isMobileShot(src), raw: !isScreenshot(src) }">
        <img v-if="!isScreenshot(src)" :src="src" :srcset="srcsetOf(src)" sizes="(max-width: 1320px) 100vw, 1320px" v-bind="mediaSize(src)" :alt="`${project.title}, project visual`" loading="lazy">
        <DeviceFrame v-else :kind="isMobileShot(src) ? 'phone' : 'browser'" :host="hostName">
          <img :src="src" :srcset="srcsetOf(src)" :sizes="isMobileShot(src) ? '300px' : '(max-width: 1320px) 100vw, 1320px'" v-bind="mediaSize(src)" :alt="`${project.title}, ${isMobileShot(src) ? 'mobile' : 'desktop'} view`" loading="lazy">
        </DeviceFrame>
      </figure>
    </section>

    <NuxtLink :to="`/portfolio/${next.slug}`" class="next wrap" data-cursor="view">
      <span class="eyebrow">Next project</span>
      <span class="display">{{ next.title }}</span>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { PROJECTS, findProject, isMobileShot, isScreenshot, mediaSize, srcsetOf } from "~/data/projects";

const route = useRoute();
const project = computed(() => findProject(String(route.params.slug)));
if (!project.value) throw createError({ statusCode: 404, statusMessage: "Project not found", fatal: true });

const next = computed(() => {
  const i = PROJECTS.findIndex(p => p.slug === project.value!.slug);
  return PROJECTS[(i + 1) % PROJECTS.length]!;
});
const extra = computed(() => (project.value!.gallery ?? []).filter(src => src !== project.value!.cover));
const host = (url: string) => new URL(url).host.replace(/^www\./, "");
const hostName = computed(() => project.value!.url ? host(project.value!.url) : undefined);
// Real screenshots get a device frame on a stage; staged visuals and placeholders keep the full-bleed frame.
// Diagrams are shown whole: no crop, no parallax.
const diagram = computed(() => !!project.value!.cover?.endsWith("-diagram.webp"));
const staged = computed(() => !!project.value!.cover && isScreenshot(project.value!.cover) && !isMobileShot(project.value!.cover));

useSeoMeta({
  title: () => project.value!.title,
  description: () => project.value!.summary,
  ogTitle: () => `${project.value!.title}, Esse Jacques`,
  ogDescription: () => project.value!.summary,
  // JPG copies in /og: LinkedIn and some messengers do not read WebP previews.
  ogImage: () => project.value!.cover ? `https://essejacques.me/og/${project.value!.slug}.jpg` : "https://essejacques.me/og/default.jpg",
});

const root = ref<HTMLElement | null>(null);
useMotion(root, ({ gsap }) => {
  gsap.from(".title .ch", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .04, delay: .1 });
  gsap.from([".summary", ".back"], { opacity: 0, y: 20, duration: .9, delay: .5, stagger: .1 });
  if (staged.value) {
    gsap.from(".stage", { clipPath: "inset(12% 8% 12% 8% round 14px)", duration: 1.4, ease: "power4.out", delay: .3 });
    gsap.from(".main-device", { y: 80, scale: .94, duration: 1.4, ease: "power4.out", delay: .35 });
  } else {
    gsap.from(".frame", { clipPath: "inset(12% 8% 12% 8% round 14px)", duration: 1.4, ease: "power4.out", delay: .3 });
    if (!diagram.value) gsap.fromTo(".frame .cover", { yPercent: -6 }, { yPercent: 6, ease: "none",
      scrollTrigger: { trigger: ".frame", start: "top bottom", end: "bottom top", scrub: true } });
  }
  gsap.utils.toArray<HTMLElement>(".block, .arch h2, .arch li, .stack h2, .gallery figure, .facts > div, .next .eyebrow, .next .display").forEach(el => gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" } }));
  gsap.from(".stack .pill", { y: 16, opacity: 0, duration: .6, stagger: .04, scrollTrigger: { trigger: ".stack ul", start: "top 90%" } });
});
</script>

<style scoped>
.top { padding-top: calc(var(--header) + 8vh); text-align: center; }
.back { font-size: .9rem; font-weight: 500; color: var(--muted); }
.back::before { content: "← "; }
.back:hover { color: var(--fg); }
.title { font-size: clamp(5rem, 16vw, 15rem); margin: .2em 0 .1em; }
.summary { max-width: 44rem; margin: 0 auto; color: #cfcfcf; font-size: clamp(1rem, 1.5vw, 1.2rem); }
.hero { padding-top: 7vh; }
.frame { position: relative; height: min(78vh, 760px); border-radius: 14px; overflow: hidden; background: var(--card); }
.frame :deep(.cover) { inset: -8% 0; height: 116%; }
.frame.diagram { height: auto; aspect-ratio: 1600 / 760; }
.frame.diagram :deep(.cover) { inset: 0; height: 100%; object-fit: contain; }
.stage { display: grid; place-items: center; padding: clamp(28px, 6vw, 90px) clamp(16px, 5vw, 80px) 0; border-radius: 14px; overflow: hidden;
  background: radial-gradient(120% 90% at 50% 0%, #34384F 0%, #1E2030 50%, #131318 100%); }
.main-device { width: min(100%, 1120px); margin-bottom: -2px; border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
.main-device.phone-video { width: min(100%, 340px); margin-bottom: clamp(28px, 6vw, 90px); border-radius: 44px; }
.facts { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 28px; margin: 0; padding-top: 7vh; padding-bottom: 7vh; border-bottom: 1px solid var(--line); }
.facts dt { color: var(--muted); font-size: .85rem; margin-bottom: 4px; }
.facts dd { margin: 0; font-weight: 500; }
.facts a { text-decoration: underline; text-underline-offset: 4px; }
.story { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(24px, 4vw, 60px); padding-top: 10vh; padding-bottom: 6vh; }
.block h2, .stack h2, .arch h2 { font-family: var(--display); font-weight: 400; text-transform: uppercase; font-size: clamp(2.6rem, 4vw, 3.8rem); line-height: .9; margin: 0 0 14px; }
.block p { margin: 0; color: #d6d6d6; line-height: 1.7; }
.arch { padding-top: 4vh; padding-bottom: 6vh; }
.arch ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 clamp(24px, 4vw, 60px); }
.arch li { padding: 22px 0; border-top: 1px solid var(--line); }
.arch h3 { margin: 0 0 6px; font-size: 1.05rem; font-weight: 500; }
.arch p { margin: 0; color: #bdbdbd; line-height: 1.6; }
.stack { padding-top: 4vh; padding-bottom: 8vh; }
.stack ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 10px; }
.stack .pill { font-size: .9rem; padding: 6px 16px; }
.gallery { display: flex; flex-wrap: wrap; justify-content: center; gap: 24px; padding-bottom: 10vh; }
.gallery figure { margin: 0; flex: 1 1 100%; }
.gallery figure.raw { border-radius: 14px; overflow: hidden; background: var(--card); }
.gallery figure.mobile { flex: 0 1 calc((100% - 48px) / 3); display: grid; place-items: center; padding: 28px; border-radius: 14px; background: var(--card); }
.gallery figure.mobile .device { width: min(100%, 300px); }
.gallery img { width: 100%; height: auto; }
.next { display: block; text-align: center; padding-top: 12vh; padding-bottom: 14vh; border-top: 1px solid var(--line); }
.next .display { display: block; font-size: clamp(5rem, 14vw, 13rem); margin-top: .2em; transition: opacity .3s; }
.next:hover .display { opacity: .7; }
@media (max-width: 860px) {
  .facts { grid-template-columns: 1fr 1fr; }
  .story { grid-template-columns: 1fr; }
  .arch ol { grid-template-columns: 1fr; }
  .gallery figure.mobile { flex-basis: 100%; }
  .stage { padding: 24px 12px 0; }
  .frame { height: auto; aspect-ratio: 16 / 10; }
  .frame.diagram { height: auto; }
}
</style>
