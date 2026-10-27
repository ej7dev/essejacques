<template>
  <img v-if="project.cover" class="cover" :src="project.cover" :srcset="srcsetOf(project.cover)" :sizes="sizes ?? '(max-width: 860px) 100vw, 50vw'" v-bind="mediaSize(project.cover)" :alt="`${project.title} screenshot`" :loading="eager ? 'eager' : 'lazy'" :fetchpriority="eager ? 'high' : undefined">
  <div v-else class="cover placeholder" aria-hidden="true"><span>{{ project.title }}</span></div>
</template>

<script setup lang="ts">
import { mediaSize, srcsetOf, type Project } from "~/data/projects";
defineProps<{ project: Project; eager?: boolean; sizes?: string }>();
</script>

<style scoped>
.cover { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: top center; }
.placeholder {
  display: grid; place-items: center; text-align: center; padding: 0 6%;
  background: radial-gradient(110% 90% at 50% 0%, #3A3F5C 0%, #22243A 45%, #121219 100%);
}
.placeholder span {
  font-family: var(--display); text-transform: uppercase; line-height: .85;
  font-size: clamp(4rem, 9vw, 12rem); color: transparent; -webkit-text-stroke: 1px rgba(255, 255, 255, .28);
}
</style>
