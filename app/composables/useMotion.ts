import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Runs GSAP setup after mount inside a gsap.context scoped to `root`,
 * and reverts every tween and ScrollTrigger on unmount (needed for page navigation).
 */
export function useMotion(root: Ref<HTMLElement | null>, setup: (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void) {
  let ctx: gsap.Context | null = null;
  onMounted(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    ctx = gsap.context(() => setup({ gsap, ScrollTrigger }), root.value ?? undefined);
  });
  onBeforeUnmount(() => ctx?.revert());
}
