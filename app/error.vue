<template>
  <div class="err">
    <p class="eyebrow">{{ notFound ? "Pipeline failed" : "Something went wrong" }}</p>
    <h1 class="display">{{ code }}</h1>

    <!-- A request pipeline where every stage passes until the requested page is looked up. -->
    <ol class="pipeline" :aria-label="`Request pipeline: the last stage failed with error ${code}`">
      <li v-for="(s, i) in stages" :key="s.name" :class="{ fail: i === stages.length - 1 }" :style="{ '--i': i }">
        <span class="dot" aria-hidden="true">
          <svg v-if="i < stages.length - 1" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
          <svg v-else viewBox="0 0 16 16"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" /></svg>
        </span>
        <strong>{{ s.name }}</strong>
        <span class="detail">{{ s.detail }}</span>
      </li>
    </ol>

    <p class="log"><span class="prompt" aria-hidden="true">›</span> {{ log }}</p>

    <div class="actions">
      <button class="btn solid" type="button" @click="clearError({ redirect: '/' })">Re-run from home</button>
      <button class="btn" type="button" @click="clearError({ redirect: '/portfolio' })">Open the portfolio</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
const props = defineProps<{ error: NuxtError }>();
useSeoMeta({ title: "Not found", robots: "noindex" });

const code = computed(() => props.error?.statusCode || 500);
const notFound = computed(() => code.value === 404);
// The static 404 page is shared by every missing URL: read the real path once in the browser.
const path = ref(props.error?.url || "/");
onMounted(() => { path.value = window.location.pathname; });

const stages = computed(() => [
  { name: "Request", detail: "GET received" },
  { name: "TLS", detail: "certificate valid" },
  { name: "Nginx", detail: "proxied" },
  { name: "Router", detail: notFound.value ? `${path.value} not found` : `error ${code.value}` },
]);
const log = computed(() => notFound.value
  ? `error: no route matches "${path.value}" (exit code 404)`
  : `error: the server answered ${code.value}`);
</script>

<style scoped>
.err { min-height: 100vh; display: grid; place-content: center; justify-items: center; text-align: center; gap: 22px; padding: 12vh 16px; }
.err h1 { font-size: clamp(8rem, 24vw, 20rem); line-height: .8; }
.btn { font: inherit; cursor: pointer; }
.actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }

.pipeline { list-style: none; margin: 8px 0 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 170px)); }
.pipeline li { position: relative; display: grid; justify-items: center; align-content: start; gap: 6px; padding: 0 10px; }
/* Connector to the next stage. */
.pipeline li:not(:last-child)::after {
  content: ""; position: absolute; top: 17px; left: calc(50% + 22px); right: calc(-50% + 22px); height: 2px; background: #2E7D4F;
  transform-origin: left; animation: line .3s ease-out both; animation-delay: calc(var(--i) * .45s + .35s);
}
.dot { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; background: #13281C; border: 1.5px solid #2E7D4F;
  animation: pass .35s ease-out both; animation-delay: calc(var(--i) * .45s); }
.dot svg { width: 16px; height: 16px; fill: none; stroke: #4ADE80; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.fail .dot { background: #2A1414; border-color: #B23B3B;
  animation: pass .35s ease-out both, shake .4s ease-in-out both; animation-delay: calc(var(--i) * .45s), calc(var(--i) * .45s + .35s); }
.fail .dot svg { stroke: #F87171; }
.pipeline strong { font-size: .95rem; font-weight: 600; }
.detail { font-size: .8rem; color: var(--muted); overflow-wrap: anywhere; }
.fail .detail { color: #F87171; }
.pipeline strong, .detail { animation: fade .3s ease-out both; animation-delay: calc(var(--i) * .45s + .1s); }

.log { margin: 4px 0 6px; max-width: 46rem; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: .85rem; color: #F87171; overflow-wrap: anywhere;
  animation: fade .4s ease-out both; animation-delay: 1.9s; }
.prompt { color: var(--muted); }
.eyebrow, .err h1, .actions { animation: rise .9s cubic-bezier(.2, .7, .2, 1) both; }
.err h1 { animation-delay: .05s; }
.actions { animation-delay: 2s; }

@keyframes pass { from { opacity: 0; transform: scale(.6); } }
@keyframes line { from { transform: scaleX(0); } }
@keyframes line-v { from { transform: scaleY(0); } }
@keyframes fade { from { opacity: 0; } }
@keyframes rise { from { opacity: 0; transform: translateY(30px); } }
@keyframes shake { 25% { transform: translateX(-4px); } 50% { transform: translateX(4px); } 75% { transform: translateX(-2px); } }

@media (max-width: 640px) {
  .pipeline { grid-template-columns: 1fr; gap: 18px; justify-items: start; }
  .pipeline li { grid-template-columns: 36px auto; justify-items: start; column-gap: 14px; row-gap: 2px; text-align: left; }
  .dot { grid-row: span 2; }
  .pipeline li:not(:last-child)::after { top: 38px; bottom: -18px; left: 27px; right: auto; width: 2px; height: auto; transform-origin: top; animation-name: line-v; }
}
@media (prefers-reduced-motion: reduce) {
  .err *, .err *::after { animation: none !important; }
}
</style>
