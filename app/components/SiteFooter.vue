<template>
  <footer ref="root">
    <section id="contact" class="contact wrap" aria-labelledby="contact-title">
      <p class="eyebrow">Have a project or a role in mind?</p>
      <a href="mailto:contact@essejacques.me" class="talk" data-cursor="view">
        <SplitTitle id="contact-title" text="Let's talk" class="big" />
      </a>
      <div class="strip">
        <a href="mailto:contact@essejacques.me">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /></svg>
          <strong>contact@essejacques.me</strong><span>Email</span>
        </a>
        <div>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
          <strong>Dakar, Senegal</strong><span>Address</span>
        </div>
        <a href="https://www.linkedin.com/in/esse-jacques" target="_blank" rel="noopener me">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z" /></svg>
          <strong>esse-jacques</strong><span>LinkedIn</span>
        </a>
      </div>
    </section>
    <div class="bar wrap">
      <button class="back" type="button" @click="toTop">
        <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true"><path d="M1 8l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2" /></svg>
        Back Top
      </button>
      <span>{{ year }} © Esse Jacques. All rights reserved.</span>
      <div class="follow">
        <a href="https://www.linkedin.com/in/esse-jacques" target="_blank" rel="noopener me">LinkedIn</a>
        <a href="https://github.com/ej7dev" target="_blank" rel="noopener me">GitHub</a>
        <a href="https://leetcode.com/u/ej7dev/" target="_blank" rel="noopener me">LeetCode</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Set at build time, then refreshed in the browser so an old static build never shows last year.
const year = ref(new Date().getFullYear());
onMounted(() => { year.value = new Date().getFullYear(); });
const { $lenis } = useNuxtApp();
const root = ref<HTMLElement | null>(null);
const route = useRoute();
function toTop() {
  $lenis ? $lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" });
}
useMotion(root, ({ gsap, ScrollTrigger }) => {
  const enter = { trigger: ".contact", start: "top 75%" };
  gsap.from(".contact .eyebrow", { opacity: 0, y: 20, duration: .8, scrollTrigger: enter });
  gsap.from(".big .ch", { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: .045, delay: .1, scrollTrigger: enter });
  gsap.from(".strip > *", { y: 30, opacity: 0, duration: .9, stagger: .12, delay: .35,
    scrollTrigger: { trigger: ".strip", start: "top 92%" } });
  // The footer outlives page changes: recompute trigger positions once the new page has its height.
  watch(() => route.path, () => nextTick(() => setTimeout(() => ScrollTrigger.refresh(), 450)));
});
</script>

<style scoped>
.contact { text-align: center; padding-top: 16vh; padding-bottom: 12vh; border-top: 1px solid var(--line); }
.talk { display: inline-block; position: relative; margin: .2em 0 .35em; }
.big { font-size: clamp(6rem, 20vw, 18rem); margin: 0; }
.talk::after { content: ""; position: absolute; left: 4%; right: 4%; bottom: .06em; height: 4px; background: currentColor;
  transform: scaleX(0); transform-origin: right; transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
.talk:hover::after, .talk:focus-visible::after { transform: scaleX(1); transform-origin: left; }
.strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.strip svg { width: 26px; height: 26px; display: block; margin: 0 auto 14px; }
.strip strong { display: block; font-weight: 600; font-size: 1.05rem; }
.strip span { color: var(--muted); font-weight: 500; }
.strip a:hover strong { text-decoration: underline; text-underline-offset: 4px; }
.bar { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; padding-top: 30px; padding-bottom: 34px; font-size: .9rem; font-weight: 500; }
.back { display: inline-flex; align-items: center; gap: 18px; justify-self: start; background: none; border: 0; color: inherit; font: inherit; cursor: pointer; padding: 0; }
.follow { justify-self: end; display: flex; gap: 22px; }
.follow a:hover { text-decoration: underline; text-underline-offset: 4px; }
@media (max-width: 860px) {
  .strip { grid-template-columns: 1fr; }
  .bar { grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .back, .follow { justify-self: center; }
}
</style>
