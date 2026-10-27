<template>
  <div>
    <a class="skip" href="#main">Skip to content</a>
    <SiteCursor />
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
