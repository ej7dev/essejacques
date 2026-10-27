<template>
  <section ref="root" class="h" aria-labelledby="work-title">
    <div class="head wrap">
      <h2 id="work-title" class="display">Selected work</h2>
      <span class="count" aria-hidden="true"><b>{{ current }}</b> / {{ String(projects.length).padStart(2, "0") }}</span>
    </div>
    <div ref="track" class="track">
      <NuxtLink v-for="p in projects" :key="p.slug" :to="`/portfolio/${p.slug}`" class="slide" data-cursor="view">
        <ProjectCover :project="p" sizes="(max-width: 860px) 100vw, 65vw" />
        <div class="info">
          <div>
            <h3 class="display">{{ p.title }}</h3>
            <p v-if="p.metric" class="metric">{{ p.metric }}</p>
          </div>
          <span class="pill stack">{{ p.stack.slice(0, 3).join(", ") }}</span>
        </div>
      </NuxtLink>
      <NuxtLink to="/portfolio" class="slide all">
        <span class="display">See all works</span>
        <span class="pill">{{ total }} projects</span>
      </NuxtLink>
    </div>
    <div class="progress wrap" aria-hidden="true"><i ref="bar" /></div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from "~/data/projects";
const props = defineProps<{ projects: Project[]; total: number }>();
const root = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);
const bar = ref<HTMLElement | null>(null);
const current = ref("01");

useMotion(root, ({ gsap }) => {
  const mm = gsap.matchMedia();
  mm.add("(min-width: 861px)", () => {
    const el = track.value!;
    const dist = () => el.scrollWidth - window.innerWidth;
    const tween = gsap.to(el, {
      x: () => -dist(), ease: "none",
      scrollTrigger: {
        trigger: root.value, pin: true, scrub: 1, end: () => `+=${dist()}`, invalidateOnRefresh: true,
        onUpdate: (s) => {
          if (bar.value) bar.value.style.width = `${s.progress * 100}%`;
          const n = Math.min(props.projects.length, Math.floor(s.progress * props.projects.length) + 1);
          current.value = String(n).padStart(2, "0");
        },
      },
    });
    gsap.utils.toArray<HTMLElement>(".slide .cover").forEach((img) => {
      gsap.fromTo(img, { xPercent: 4 }, { xPercent: -4, ease: "none",
        scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
    });
  });
});
</script>

<style scoped>
.h { height: 100vh; min-height: 640px; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.head { display: flex; justify-content: space-between; align-items: end; padding-bottom: 28px; padding-top: calc(var(--header) * .6); }
.head h2 { font-size: clamp(3rem, 6vw, 6rem); }
.count { font-family: var(--display); font-size: clamp(2.5rem, 4vw, 4rem); color: var(--muted); }
.count b { color: var(--fg); font-weight: 400; }
.track { display: flex; gap: 28px; padding: 0 var(--gutter); width: max-content; will-change: transform; }
.slide { position: relative; width: min(62vw, 1000px); height: 62vh; border-radius: 14px; overflow: hidden; flex: none; background: var(--card); }
.slide :deep(.cover) { transform: scale(1.1); }
.slide::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, .85)); pointer-events: none; }
.info { position: absolute; z-index: 2; left: 30px; right: 30px; bottom: 26px; display: flex; justify-content: space-between; align-items: end; gap: 20px; }
.info h3 { font-size: clamp(3.5rem, 6vw, 6.5rem); margin-top: 10px; }
.metric { margin: 6px 0 0; color: #ddd; }
.stack { white-space: nowrap; }
.slide.all { width: min(36vw, 560px); display: grid; place-content: center; justify-items: center; gap: 20px; border: 1px solid var(--line); background: transparent; transition: background-color .4s, color .4s; }
.slide.all::after { display: none; }
.slide.all .display { font-size: clamp(4rem, 7vw, 7rem); }
.slide.all:hover { background: var(--fg); color: var(--bg); }
.progress { margin-top: 5vh; }
.progress::before { content: ""; display: block; height: 2px; background: var(--line); }
.progress i { display: block; height: 2px; width: 0; background: var(--fg); margin-top: -2px; }
@media (max-width: 860px) {
  .h { height: auto; min-height: 0; padding: 10vh 0; }
  .track { width: auto; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 12px; }
  .slide { width: 86vw; height: 66vh; scroll-snap-align: center; }
  .slide.all { width: 70vw; }
  .info { flex-direction: column; align-items: start; left: 20px; right: 20px; }
  .stack { white-space: normal; }
  .progress { display: none; }
}
</style>
