<template>
  <div ref="root" class="portfolio">
    <header class="top wrap">
      <p class="eyebrow">{{ PROJECTS.length }} projects across fintech, public sector, SaaS, websites and mobile</p>
      <SplitTitle tag="h1" text="Portfolio" class="title" />
    </header>

    <div class="filters wrap" role="group" aria-label="Filter projects">
      <button type="button" :aria-pressed="active === 'all'" @click="active = 'all'">All <sup>{{ PROJECTS.length }}</sup></button>
      <button v-for="c in CATEGORIES" :key="c.id" type="button" :aria-pressed="active === c.id" @click="active = c.id">
        {{ c.label }} <sup>{{ count(c.id) }}</sup>
      </button>
    </div>

    <TransitionGroup tag="ul" name="cell" class="grid wrap">
      <li v-for="(p, i) in list" :key="p.slug" class="cell">
        <NuxtLink :to="`/portfolio/${p.slug}`" data-cursor="view">
          <ProjectCover :project="p" :eager="i < 2" sizes="(max-width: 860px) 100vw, 66vw" />
          <span class="arrow" aria-hidden="true">↗</span>
          <div class="info">
            <h2 class="display">{{ p.title }}</h2>
            <p class="sum">{{ p.metric || p.summary }}</p>
            <p v-if="p.stack.length" class="stack">{{ p.stack.slice(0, 4).join(", ") }}</p>
          </div>
        </NuxtLink>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CATEGORIES, PROJECTS, type Category } from "~/data/projects";

useSeoMeta({
  title: "Portfolio",
  description: "All projects by Esse Jacques: fintech, public sector platforms, SaaS products, websites and mobile apps.",
  ogTitle: "Portfolio, Esse Jacques",
});

const active = ref<Category | "all">("all");
const list = computed(() => active.value === "all" ? PROJECTS : PROJECTS.filter(p => p.categories.includes(active.value as Category)));
const count = (c: Category) => PROJECTS.filter(p => p.categories.includes(c)).length;

const root = ref<HTMLElement | null>(null);
// Cells move when the filter changes: recompute ScrollTrigger positions so hidden cells still reveal.
watch(active, () => nextTick(() => setTimeout(() => ScrollTrigger.refresh(), 400)));
useMotion(root, ({ gsap }) => {
  gsap.from(".title .ch", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .05, delay: .1 });
  gsap.from(".filters button", { opacity: 0, y: 16, duration: .6, stagger: .05, delay: .5 });
  gsap.utils.toArray<HTMLElement>(".cell").forEach((c, i) => gsap.from(c, { y: 60, opacity: 0, duration: 1, ease: "power3.out", delay: (i % 3) * .08,
    scrollTrigger: { trigger: c, start: "top 92%" } }));
});
</script>

<style scoped>
.top { padding-top: calc(var(--header) + 8vh); text-align: center; }
.title { font-size: clamp(7rem, 22vw, 20rem); margin-top: .15em; }
.filters { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; padding-top: 5vh; padding-bottom: 6vh; }
.filters button {
  font: inherit; font-size: .9rem; font-weight: 500; color: var(--fg); background: transparent; cursor: pointer;
  border: 1px solid var(--line); border-radius: 999px; padding: 9px 20px; transition: background-color .3s, color .3s, border-color .3s;
}
.filters button:hover { border-color: rgba(255, 255, 255, .5); }
.filters button[aria-pressed="true"] { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.filters sup { font-size: .65rem; opacity: .6; }

.grid { list-style: none; margin: 0; padding-bottom: 14vh; display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 240px; gap: 18px; grid-auto-flow: dense; }
.cell { grid-column: span 2; grid-row: span 2; }
/* Rows of 6 columns repeat every 7 cards: [4, 2], [2, 2, 2], [3, 3] */
.cell:nth-child(7n + 1) { grid-column: span 4; }
.cell:nth-child(7n + 6), .cell:nth-child(7n + 7) { grid-column: span 3; }
.cell a { position: relative; display: block; height: 100%; border-radius: 14px; overflow: hidden; background: var(--card); }
.cell :deep(.cover) { transition: transform .8s cubic-bezier(.2, .7, .1, 1), filter .5s; }
.cell a::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgba(0, 0, 0, .88)); pointer-events: none; }
.cell a:hover :deep(.cover) { transform: scale(1.06); filter: brightness(.75); }
.arrow { position: absolute; z-index: 2; top: 20px; right: 20px; width: 46px; height: 46px; border-radius: 50%; background: var(--fg); color: var(--bg); display: grid; place-items: center; transform: scale(0); transition: transform .35s cubic-bezier(.2, .7, .1, 1.3); }
.cell a:hover .arrow, .cell a:focus-visible .arrow { transform: scale(1); }
.info { position: absolute; z-index: 2; left: 24px; right: 24px; bottom: 20px; }
.info h2 { font-size: clamp(2.8rem, 4.6vw, 4.8rem); margin-top: 10px; }
.sum { margin: 6px 0 0; color: #ddd; font-size: .95rem; }
.stack { margin: 0; max-height: 0; overflow: hidden; color: var(--muted); font-size: .85rem; transition: max-height .4s, margin .4s; }
.cell a:hover .stack, .cell a:focus-visible .stack { max-height: 44px; margin-top: 8px; }

.cell-enter-active, .cell-leave-active { transition: opacity .35s ease, transform .35s ease; }
.cell-enter-from, .cell-leave-to { opacity: 0; transform: scale(.96); }
.cell-leave-active { position: absolute; visibility: hidden; }

@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; grid-auto-rows: 340px; }
  .cell, .cell:nth-child(n) { grid-column: auto; grid-row: auto; }
  .stack { max-height: none; margin-top: 8px; }
}
</style>
