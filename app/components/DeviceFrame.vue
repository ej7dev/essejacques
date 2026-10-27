<template>
  <div class="device" :class="kind">
    <div v-if="kind === 'browser'" class="bar" aria-hidden="true">
      <span class="dots"><i /><i /><i /></span>
      <span v-if="host" class="address">{{ host }}</span>
    </div>
    <span v-else class="notch" aria-hidden="true" />
    <div class="screen"><slot /></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ kind?: "browser" | "phone"; host?: string }>(), { kind: "browser" });
</script>

<style scoped>
.device { position: relative; overflow: hidden; background: #1A1A1F; box-shadow: 0 40px 90px -30px rgba(0, 0, 0, .8), 0 0 0 1px rgba(255, 255, 255, .08); }
.screen :deep(img), .screen :deep(video) { display: block; width: 100%; height: auto; }

.browser { border-radius: 12px; }
.bar { display: flex; align-items: center; gap: 16px; height: 36px; padding: 0 14px; background: #232329; border-bottom: 1px solid rgba(255, 255, 255, .06); }
.dots { display: flex; gap: 7px; }
.dots i { width: 11px; height: 11px; border-radius: 50%; background: #3A3A42; }
.address { flex: 0 1 340px; margin: 0 auto; transform: translateX(-26px); padding: 3px 14px; border-radius: 6px; background: #17171B; color: var(--muted); font-size: .75rem; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.phone { border-radius: 44px; padding: 10px; background: #0E0E11; }
.phone .screen { border-radius: 34px; overflow: hidden; }
.notch { position: absolute; z-index: 1; top: 20px; left: 50%; width: 30%; height: 22px; transform: translateX(-50%); border-radius: 999px; background: #0E0E11; }

@media (max-width: 860px) {
  .address { display: none; }
  .phone { border-radius: 36px; padding: 8px; }
  .phone .screen { border-radius: 28px; }
}
</style>
