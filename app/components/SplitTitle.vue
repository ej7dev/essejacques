<template>
  <component :is="tag" class="display" :aria-label="text">
    <template v-for="(word, w) in words" :key="w">
      <span class="split" aria-hidden="true"><span v-for="(c, i) in word" :key="i" class="ch">{{ c }}</span></span>{{ w < words.length - 1 ? " " : "" }}
    </template>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string; tag?: string }>(), { tag: "h2" });
const words = computed(() => props.text.split(" ").map(w => [...w]));
</script>
