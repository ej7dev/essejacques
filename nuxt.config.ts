export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  modules: ["@nuxtjs/sitemap"],
  css: ["~/assets/css/fonts.css", "~/assets/css/main.css"],
  site: {
    url: "https://essejacques.me",
    name: "Esse Jacques",
  },
  app: {
    head: {
      htmlAttrs: { lang: "en" },
      titleTemplate: "%s | Esse Jacques",
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#0D0D0D" },
      ],
      link: [
        { rel: "icon", href: "/img/logo-ej.png" },
        // Latin faces used on every page (about 8 KB each), so text does not reflow when fonts arrive.
        { rel: "preload", href: "/fonts/six-caps-400-latin.woff2", as: "font", type: "font/woff2", crossorigin: "" },
        ...[300, 400, 500, 600].map(w => ({ rel: "preload", href: `/fonts/poppins-${w}-latin.woff2`, as: "font", type: "font/woff2", crossorigin: "" })),
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  nitro: {
    prerender: { crawlLinks: true, routes: ["/", "/portfolio", "/about"] },
  },
});
