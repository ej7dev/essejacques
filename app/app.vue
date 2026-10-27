<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
// One canonical URL per page, without trailing slash or query string.
const canonical = computed(() => `https://essejacques.me${route.path === "/" ? "" : route.path.replace(/\/$/, "")}`);
useHead({
  link: [{ rel: "canonical", href: canonical }],
  script: [{
    type: "application/ld+json",
    innerHTML: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Esse Jacques",
      jobTitle: "Senior Full-Stack Engineer",
      address: { "@type": "PostalAddress", addressLocality: "Dakar", addressCountry: "SN" },
      email: "mailto:contact@essejacques.me",
      url: "https://essejacques.me",
      sameAs: ["https://www.linkedin.com/in/esse-jacques", "https://github.com/ej7dev", "https://leetcode.com/u/ej7dev/"],
    }),
  }],
});
useSeoMeta({
  ogSiteName: "Esse Jacques",
  ogType: "website",
  ogUrl: canonical,
  ogImage: "https://essejacques.me/og/default.jpg",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Esse Jacques, Senior Full-Stack Engineer in Dakar",
  twitterCard: "summary_large_image",
});
</script>
