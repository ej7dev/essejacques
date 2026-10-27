<template>
  <div ref="el" class="cursor" :class="mode" aria-hidden="true">View</div>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
const mode = ref("");
let raf = 0;

onMounted(() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
  const over = (e: MouseEvent) => {
    const t = e.target as HTMLElement;
    mode.value = t.closest("[data-cursor=view]") ? "is-view" : t.closest("a, button") ? "is-link" : "";
  };
  window.addEventListener("mousemove", move);
  document.addEventListener("mouseover", over);
  const loop = () => {
    cx += (x - cx) * (reduce ? 1 : 0.18);
    cy += (y - cy) * (reduce ? 1 : 0.18);
    if (el.value) el.value.style.transform = `translate(${cx}px, ${cy}px)`;
    raf = requestAnimationFrame(loop);
  };
  loop();
  el.value?.classList.add("on");
  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    window.removeEventListener("mousemove", move);
    document.removeEventListener("mouseover", over);
  });
});
</script>

<style scoped>
.cursor {
  position: fixed; left: 0; top: 0; z-index: 90; pointer-events: none; display: none;
  width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, .7);
  place-items: center; font-size: 0; font-weight: 500; color: var(--bg);
  transition: width .3s, height .3s, margin .3s, background-color .3s, font-size .2s, border-color .3s;
}
.cursor.on { display: grid; }
.cursor.is-link { width: 64px; height: 64px; margin: -32px 0 0 -32px; border-color: transparent; background: rgba(255, 255, 255, .15); }
.cursor.is-view { width: 96px; height: 96px; margin: -48px 0 0 -48px; background: var(--fg); border-color: var(--fg); font-size: .85rem; }
</style>
