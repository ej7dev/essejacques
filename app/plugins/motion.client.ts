import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Smooth scroll (Lenis) driven by the GSAP ticker so ScrollTrigger stays in sync.
export default defineNuxtPlugin((nuxtApp) => {
  gsap.registerPlugin(ScrollTrigger);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let lenis: Lenis | null = null;

  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  nuxtApp.hook("page:finish", () => {
    if (window.location.hash) return;
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  });
  window.addEventListener("load", () => ScrollTrigger.refresh());

  return { provide: { lenis, reduceMotion: reduce } };
});
