<template>
  <video
    ref="el" :poster="poster" :aria-label="label" v-bind="mediaSize(src)" muted loop playsinline preload="none"
    :controls="still"
  >
    <source :src="src" type="video/mp4">
  </video>
</template>

<script setup lang="ts">
import { mediaSize } from "~/data/projects";

const props = defineProps<{ src: string; poster?: string; label: string }>();

// Plays only while on screen. With reduced motion, it never autoplays and shows controls instead.
const el = ref<HTMLVideoElement | null>(null);
const still = ref(false);
let observer: IntersectionObserver | undefined;

onMounted(() => {
  still.value = useNuxtApp().$reduceMotion as boolean;
  if (still.value || !el.value) return;
  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) el.value?.play().catch(() => { still.value = true; });
    else el.value?.pause();
  }, { threshold: .35 });
  observer.observe(el.value);
});
onBeforeUnmount(() => observer?.disconnect());
watch(() => props.src, () => el.value?.load());
</script>
