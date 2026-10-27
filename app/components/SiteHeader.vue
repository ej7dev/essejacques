<template>
  <header class="site-header" :class="{ hide: hidden }">
    <NuxtLink to="/" class="logo">Esse Jacques</NuxtLink>
    <nav aria-label="Main">
      <NuxtLink to="/about">About</NuxtLink>
      <NuxtLink to="/portfolio">Portfolio</NuxtLink>
      <a href="#contact">Contact</a>
      <a class="keep" href="/CV_Esse_Jacques_EN.pdf" target="_blank" rel="noopener">My CV</a>
    </nav>
  </header>
</template>

<script setup lang="ts">
const hidden = ref(false);
let last = 0;
function onScroll() {
  const y = window.scrollY;
  hidden.value = y > 200 && y > last;
  last = y;
}
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<style scoped>
.site-header {
  position: fixed; inset: 0 0 auto 0; z-index: 50; height: var(--header);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 var(--gutter);
  transition: transform .4s ease;
  mix-blend-mode: difference;
}
.site-header.hide { transform: translateY(-100%); }
/* Wordmark in the display face; the EJ monogram stays as the favicon. */
.logo { font-family: var(--display); text-transform: uppercase; font-size: 2rem; line-height: 1; letter-spacing: .02em; }
nav { display: flex; gap: clamp(18px, 3.4vw, 60px); font-size: .95rem; font-weight: 500; }
nav a { position: relative; }
nav a::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -4px; height: 1px; background: currentColor;
  transform: scaleX(0); transform-origin: right; transition: transform .35s ease;
}
nav a:hover::after, nav a.router-link-active::after { transform: scaleX(1); transform-origin: left; }
@media (max-width: 640px) {
  /* Phones keep About, Portfolio and the CV; Contact is one scroll away in the footer. */
  nav a[href="#contact"] { display: none; }
}
</style>
