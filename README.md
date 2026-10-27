# essejacques.me

Portfolio d'Esse Jacques, en Nuxt 4, généré en site statique.

## Commandes

```
npm install
npm run dev        # http://localhost:3000
npm run generate   # site statique dans .output/public
```

## Ajouter ou modifier un projet

Tout est dans `app/data/projects.ts` : un objet par projet.

- `featured: true` le place dans le défilement horizontal de l'accueil (ordre du fichier).
- `published: false` le cache partout (en attente d'autorisation client ou d'accord de confidentialité).
- `cover` et `gallery` : images WebP dans `public/img/projects/` (conversion : `magick capture.png -resize '1600x>' -quality 80 nom.webp`).
- `context`, `built`, `result` : l'étude de cas affichée sur `/portfolio/<slug>`.

## Structure

- `app/pages` : accueil, `/portfolio`, `/portfolio/[slug]`, `/about`.
- `app/components` : en-tête, curseur, pied de page avec contact, défilement horizontal, couverture de projet.
- `app/plugins/motion.client.ts` : défilement fluide (Lenis) synchronisé avec GSAP ScrollTrigger.
- `app/composables/useMotion.ts` : animations GSAP par page, nettoyées à chaque changement de page.
- `img/` : images sources (captures en PNG, anciennes images du site WordPress).
- `legacy/` : anciennes versions en HTML et maquettes de la page d'accueil.
- `projects.md` : inventaire des projets à compléter.

## Mise en ligne

Déployer le dossier `.output/public` sur un hébergeur statique (Netlify, Cloudflare Pages ou GitHub Pages), puis faire pointer essejacques.me dessus.
