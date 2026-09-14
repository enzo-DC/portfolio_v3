# CLAUDE.md — Portfolio Enzo Couteau ("Le réalisateur du web")

Ce fichier est la **source de vérité unique** pour construire la version de
production de ce portfolio. Il est volontairement exhaustif : tout le
contenu, tous les tokens de design, toute la logique d'animation et toute la
structure de fichiers y sont décrits ou embarqués directement, pour que la
version finale (Astro + TypeScript + Tailwind + GSAP + Lenis + Three.js)
puisse être construite sans deviner un seul détail ni se référer à un
fichier externe.

Tout le code ci-dessous provient d'un prototype HTML/CSS/JS déjà validé
visuellement par le client (comportement testé, syntaxe vérifiée). Le
travail consiste à le **porter fidèlement** dans l'architecture Astro décrite
en section 9 — pas à réinventer les animations, les couleurs ou le texte.

---

## 1. Vue d'ensemble

- **Propriétaire du site** : Enzo Couteau, développeur web freelance.
- **Cible** : agences, studios, grands comptes, porteurs de projet exigeants.
- **Objectif business** : conversion — transformer un visiteur en client qui
  envoie un brief via le formulaire de contact.
- **Concept créatif** : le développeur comme réalisateur de films. Le site
  est structuré en actes (0 à III) et habillé comme une salle de projection :
  sombre, feutrée, velours, grain de pellicule, lumière tamisée.
- **Ton** : haut de gamme, confiant, jamais familier. Le vocabulaire cinéma
  est un fil rouge structurant, pas un gadget répété sans raison.
- **Une page unique** (`/`), scroll vertical, navigation par ancres.

---

## 2. Stack technique & dépendances

| Domaine | Choix | Notes |
|---|---|---|
| Framework | **Astro** (mode statique) + îlots **React** | Le site est presque entièrement statique ; seuls curseur, scène 3D, smooth scroll et formulaire ont besoin de JS client. |
| Langage | **TypeScript strict** partout | `.astro`, `.tsx`, `.ts` |
| Style | **Tailwind CSS** pour le layout/utilitaires + fichiers CSS custom (section 4) pour l'identité visuelle | Tailwind ne doit pas remplacer les tokens ci-dessous, il vient en complément pour le responsive/flex/grid. |
| Smooth scroll | **`lenis`** (npm, dernière version stable) | Voir config exacte en section 8.1. |
| Animations | **`gsap`** + `gsap/ScrollTrigger` (npm, dernière version stable — ScrollTrigger est inclus gratuitement dans le package `gsap` public) | |
| 3D | **`three`** (npm, dernière version stable — pas de contrainte de version particulière, contrairement au prototype qui était limité à une vieille révision par son environnement de test) | Usage en vanilla Three.js dans un composant React isolé, React Three Fiber n'est pas nécessaire (scène simple : un nuage de particules). |
| Icônes | Aucune librairie — tout en CSS/SVG custom (cf. `.brand-mark`, chevrons, clapette) | Rester cohérent avec l'esthétique dessinée à la main. |
| Formulaire | `mailto:` en fallback minimum ; brancher idéalement une route API Astro + un service d'envoi (Resend, Formspree) | Voir section 8.6. |
| Déploiement | Vercel ou Netlify (les deux supportent Astro nativement) — à trancher avec le client | |

`package.json` — dépendances à installer :

```json
{
  "dependencies": {
    "astro": "latest",
    "@astrojs/react": "latest",
    "@astrojs/tailwind": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwindcss": "latest",
    "gsap": "latest",
    "lenis": "latest",
    "three": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@types/three": "latest"
  }
}
```

---

## 3. Contenu complet (à intégrer tel quel)

### 3.1 Métadonnées globales

- **Titre `<title>`** : `Enzo Couteau — Réalisateur & développeur web`
- **Meta description** : `Enzo Couteau — développeur web. Chaque projet est traité comme un film : réalisation, code, direction technique.`
- **Langue** : `fr`
- **Email de contact** : `enzocouteau.pro@gmail.com`
- **Nom / marque** : Enzo Couteau — studio nommé "Studio Couteau" dans les crédits.
- À ajouter en prod (absent du prototype, obligatoire pour la mise en ligne) :
  balises Open Graph (`og:title`, `og:description`, `og:image`, `og:type=website`),
  `theme-color` (`#0b0908`), favicon, `manifest.json` minimal si PWA non nécessaire
  peut être omis.

### 3.2 Acte 0 — Hero

- Prologue (italique, petite taille) : `« Un site ne suffit plus à convaincre un client exigeant. »`
- Titre (deux lignes) : `ENZO` / `COUTEAU`
- Sous-titre : `Réalisateur & développeur web — je transforme des projets ambitieux en expériences qu'on n'oublie pas, et qui convertissent.`
- Cue de scroll : label `ENTRER EN SALLE` + trait vertical animé (pas de flèche).

### 3.3 Acte I — Projets ("La séance")

Étiquette d'acte : `ACTE I` — Titre de section : `La séance`

Trois projets **fictifs**, à remplacer par les vrais projets d'Enzo dès
qu'il les fournit (voir modèle de données en section 6) :

| # | Titre | Rôle | Pitch | Stack (tags) | Lien |
|---|---|---|---|---|---|
| 01 | **Lumen** | Réalisation & direction technique | Une plateforme e-commerce pensée comme une vitrine de luxe, où chaque interaction a été chorégraphiée pour convertir. | Next.js, Stripe, Framer Motion | `https://github.com/` (placeholder) |
| 02 | **Nocturne** | Développement front-end & animation | Un tableau de bord SaaS pour une fintech, où la donnée devient narration visuelle en temps réel. | React, D3.js, WebSocket | `https://github.com/` (placeholder) |
| 03 | **Argentique** | Direction artistique & intégration | Un site vitrine pour un studio photo, pensé comme une pellicule que l'on déroule au fil du scroll. | Astro, GSAP, Three.js | `https://github.com/` (placeholder) |

Texte du lien de chaque carte : `Voir le film sur GitHub ↗` (le `↗` est
volontaire : c'est un indicateur de lien externe, pas une flèche décorative
générique — à garder uniquement sur les liens sortants réels).

### 3.4 Acte II — À propos ("Le scénario")

Étiquette d'acte : `ACTE II` — Titre de section : `Le scénario`

Bio (colonne de gauche, texte long en Fraunces) — **placeholder à valider
avec Enzo**, aucune donnée biographique réelle (années d'expérience, noms de
clients) n'a été inventée au-delà de ce texte volontairement générique :

> Je m'appelle Enzo Couteau. Je code des sites depuis que j'ai compris qu'une
> bonne interface se construit comme un bon film : un cadrage précis, un
> rythme maîtrisé, et rien qui ne serve pas l'histoire. Entre la technique et
> la mise en scène, je ne choisis pas — je fais les deux. Chaque projet est
> traité comme un tournage : cahier des charges en guise de scénario,
> prototypes comme rushes, et une obsession commune pour le détail qui
> change tout.

Carte "clapette / prise" (colonne de droite) :

- En-tête : `PRISE` — `N° 01`
- Production : `Studio Couteau`
- Réalisateur : `Enzo Couteau`
- Genre : `Web & expérience digitale`
- Format : `Sur-mesure, e-commerce, apps`
- Statut : `Dispo. pour tournage`

### 3.5 Acte III — Contact ("Le casting")

Étiquette d'acte : `ACTE III` — Titre de section : `L'appel de casting`

Chapô : `Vous avez un rôle à distribuer pour votre prochain projet ? Envoyez-moi le script.`

Graphique de clapette (au-dessus du formulaire) avec le texte : `STUDIO COUTEAU — PRISE 01`

Champs du formulaire :

| Champ | Label | Type | Placeholder / options | Requis |
|---|---|---|---|---|
| `projet` | Nom du projet | text | `Ex. Refonte du site X` | oui |
| `role` | Votre rôle | select | Sélectionner / Studio / agence / Marque / grand compte / Porteur de projet / startup / Autre | oui |
| `email` | Contact | email | `vous@exemple.com` | oui |
| `message` | Le synopsis | textarea | `Racontez-moi le projet en quelques phrases…` | oui |

Bouton d'envoi : `Envoyer le script` (pas de flèche).
Texte de secours sous le formulaire : `Ou écrivez directement à enzocouteau.pro@gmail.com` (lien mailto).

### 3.6 Générique de fin (footer)

- `Réalisation & code — Enzo Couteau`
- `Contact — enzocouteau.pro@gmail.com`
- `Portfolio — GitHub sur demande`
- Bouton retour en haut (icône `.brand-mark`, rotation 180° au survol).
- Copyright : `© {année courante} Enzo Couteau — Studio Couteau. Tous droits réservés.`

### 3.7 Navigation

- Barre du haut (logo + nav) : `La séance` / `Le scénario` / `Le casting`
- Labels de la pellicule latérale (desktop) : `Ouverture` / `La séance` / `Le scénario` / `Le casting`
- Labels de l'acte en cours (barre du bas) : `ACTE 0 — OUVERTURE` / `ACTE I — LA SÉANCE` / `ACTE II — LE SCÉNARIO` / `ACTE III — LE CASTING`

---

## 4. Design tokens — `src/styles/tokens.css`

À copier tel quel comme base, puis exposer les mêmes valeurs dans
`tailwind.config.ts` (`theme.extend.colors`, `theme.extend.fontFamily`) pour
pouvoir les utiliser aussi en classes utilitaires.

```css
:root{
  /* Couleurs — velours de salle de cinéma */
  --black-deep:   #050403;
  --black:        #0b0908;
  --black-soft:   #14100e;
  --bordeaux:     #4a1023;
  --bordeaux-lt:  #7c1f3f;
  --bordeaux-dk:  #2c0a15;
  --gold:         #c9a24b;
  --gold-bright:  #ecc978;
  --gold-dim:     rgba(201,162,75,0.35);
  --silver:       #a8adb6;
  --silver-dim:   #6c6f75;
  --cream:        #ece4d3;
  --cream-dim:    #b9b2a3;

  /* Typo */
  --f-display: "Fraunces", Georgia, serif;
  --f-sans: "Space Grotesk", Arial, sans-serif;

  /* Rythme */
  --frame: clamp(16px, 2.6vw, 30px);
  --frame-mobile: clamp(10px, 3.5vw, 16px);
  --radius: 2px;

  --ease-out: cubic-bezier(.16,.84,.44,1);
  --ease-io: cubic-bezier(.65,0,.35,1);
}
```

**Règle absolue** : le fond n'est jamais un noir pur (`#000`). Toujours une
des variantes ci-dessus.

**Polices** : `Fraunces` (axes `ital` + `opsz`, graisses 300 à 600) pour tout
ce qui est display/éditorial ; `Space Grotesk` (400 à 700) pour toute l'UI.
Aucune autre famille ne doit être introduite.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,340;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```
(Alternative plus performante/RGPD : auto-héberger ces deux polices en
`.woff2` dans `public/fonts` et déclarer des `@font-face` — à trancher avec
le client, voir section 11.)

---

## 5. Styles globaux & composants — `src/styles/global.css`

Reset et éléments transverses (grain, iris, curseur, cadre letterbox,
navigation pellicule, structure de section) :

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html{ background: var(--black); color: var(--cream); scroll-behavior: auto; }
body{
  font-family: var(--f-sans);
  background: var(--black);
  color: var(--cream);
  overflow-x: hidden;
  min-height: 100vh;
}
img{ max-width: 100%; display:block; }
a{ color: inherit; text-decoration: none; }
button{ font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
::selection{ background: var(--bordeaux-lt); color: var(--cream); }

:focus-visible{
  outline: 2px solid var(--gold-bright);
  outline-offset: 4px;
  border-radius: 1px;
}

.visually-hidden{
  position:absolute; width:1px; height:1px; overflow:hidden;
  clip:rect(0 0 0 0); white-space:nowrap;
}

/* --- Grain de pellicule (texture globale, ~gratuit au GPU) --- */
#grain{
  position: fixed; inset: -50%;
  width: 200%; height: 200%;
  pointer-events: none;
  z-index: 60;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  animation: grain-shift 8s steps(8) infinite;
}
@keyframes grain-shift{
  0%,100%{ transform: translate(0,0); }
  10%{ transform: translate(-2%,-3%); }
  30%{ transform: translate(3%,2%); }
  50%{ transform: translate(-3%,3%); }
  70%{ transform: translate(2%,-2%); }
  90%{ transform: translate(-1%,2%); }
}
@media (prefers-reduced-motion: reduce){ #grain{ animation: none; } }

/* --- Ouverture en iris (overlay plein écran, section 8.3 pour la logique JS) --- */
#iris-intro{
  position: fixed; inset: 0;
  z-index: 200;
  pointer-events: none;
  --r: 0vmax;
  background: radial-gradient(circle at 50% 50%, transparent var(--r), var(--black-deep) calc(var(--r) + 1.5px));
}

/* --- Curseur personnalisé : l'obturateur --- */
#cursor-ring{
  position: fixed; top:0; left:0;
  width: 34px; height: 34px;
  margin-left:-17px; margin-top:-17px;
  border: 1px solid var(--gold-bright);
  border-radius: 50%;
  pointer-events: none;
  z-index: 210;
  display: flex; align-items:center; justify-content:center;
  font-family: var(--f-sans);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--gold-bright);
  opacity: 0;
  transition: opacity .25s var(--ease-out), width .3s var(--ease-io), height .3s var(--ease-io),
              margin .3s var(--ease-io), background .3s var(--ease-io), border-color .3s var(--ease-io);
  will-change: transform;
}
html.has-cursor #cursor-ring{ opacity: 1; }
html.has-cursor, html.has-cursor *{ cursor: none !important; }
#cursor-ring.is-viewing{
  width: 72px; height: 72px; margin-left:-36px; margin-top:-36px;
  background: rgba(5,4,3,0.55);
  border-color: var(--gold-bright);
}
#cursor-ring span{ opacity:0; transform: scale(.8); transition: opacity .2s, transform .2s; }
#cursor-ring.is-viewing span{ opacity:1; transform: scale(1); }
@media (hover: none), (pointer: coarse){ #cursor-ring{ display:none; } }

/* --- Cadre écran large, persistant sur tout le site --- */
.letterbox{
  position: fixed; left:0; right:0;
  height: clamp(24px, 4vw, 34px);
  background: var(--black-deep);
  z-index: 90;
  display:flex; align-items:center;
  padding: 0 var(--frame);
  font-family: var(--f-sans);
  font-size: 11px;
  letter-spacing: 0.14em;
  color: var(--cream-dim);
}
.letterbox--top{ top:0; border-bottom: 1px solid var(--gold-dim); justify-content: space-between; }
.letterbox--bottom{ bottom:0; border-top: 1px solid var(--gold-dim); justify-content: space-between; }

.brand{
  display:flex; align-items:center; gap:10px;
  font-family: var(--f-sans); font-weight:600;
  color: var(--cream); letter-spacing: 0.08em;
  font-size: 12px;
}
.brand-mark{
  width: 16px; height: 16px; border-radius:50%;
  border: 1.5px solid var(--gold);
  position: relative; flex: none;
}
.brand-mark::before, .brand-mark::after{
  content:""; position:absolute; background: var(--gold);
  top:50%; left:50%;
}
.brand-mark::before{ width:9px; height:1.5px; transform: translate(-50%,-50%); }
.brand-mark::after{ width:1.5px; height:9px; transform: translate(-50%,-50%); }

.letterbox-nav{ display:flex; gap: clamp(14px,2vw,28px); }
.letterbox-nav a{ color: var(--cream-dim); transition: color .2s; padding: 4px 0; }
.letterbox-nav a:hover{ color: var(--gold-bright); }

#timecode{ font-variant-numeric: tabular-nums; color: var(--silver-dim); }
#act-label{ color: var(--gold-dim); }

@media (max-width: 720px){
  .letterbox-nav{ display:none; }
  .letterbox--bottom #timecode{ display:none; }
}

/* --- Navigation "pellicule" latérale, desktop uniquement --- */
.filmstrip-nav{
  position: fixed; right: 22px; top: 50%; transform: translateY(-50%);
  z-index: 85;
  display:flex; flex-direction:column; align-items:center; gap: 18px;
}
.filmstrip-track{ position:relative; width:1px; height: 160px; background: rgba(201,162,75,0.18); }
.filmstrip-progress{ position:absolute; top:0; left:0; width:100%; height:0%; background: var(--gold-bright); }
.filmstrip-dots{ display:flex; flex-direction:column; gap: 28px; position:absolute; top:0; left:50%; transform:translateX(-50%); height:100%; justify-content:space-between; }
.filmstrip-dot{
  position:relative; width:7px; height:7px; border-radius:50%;
  background: transparent; border: 1px solid var(--silver-dim);
  transition: background .25s, border-color .25s, transform .25s;
}
.filmstrip-dot.is-active{ background: var(--gold-bright); border-color: var(--gold-bright); transform: scale(1.3); }
.filmstrip-dot .dot-label{
  position:absolute; right: 18px; top:50%; transform: translateY(-50%);
  white-space:nowrap; font-size: 10px; letter-spacing:.1em; color: var(--cream-dim);
  opacity:0; transition: opacity .2s;
}
.filmstrip-dot:hover .dot-label{ opacity:1; }
@media (max-width: 1000px){ .filmstrip-nav{ display:none; } }

/* --- Structure générale des sections --- */
#scroll-content{ position: relative; width:100%; }
#scroll-content.is-virtual{ position: fixed; top:0; left:0; will-change: transform; }
main{ position: relative; z-index: 5; }

.section{
  position: relative;
  padding: clamp(90px,14vw,150px) var(--frame) clamp(70px,10vw,110px);
  min-height: 100vh;
  display:flex; flex-direction:column; justify-content:center;
}
.act-tag{
  display:inline-flex; align-items:center; gap:8px;
  font-family: var(--f-sans); font-size: 11px; letter-spacing:0.18em;
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  padding: 5px 12px;
  transform: rotate(-1deg);
  width: fit-content;
  margin-bottom: 22px;
}
.section-title{
  font-family: var(--f-display);
  font-weight: 500;
  font-size: clamp(2.2rem, 6vw, 4.4rem);
  line-height: 1.02;
  color: var(--cream);
  max-width: 14ch;
}

@media (prefers-reduced-motion: reduce){
  .hero-prologue, .hero-title .line span, .hero-sub, .scroll-cue{
    filter:none !important; opacity:1 !important; transform:none !important;
  }
  #iris-intro{ display:none; }
}
```

### 5.1 Styles du Hero — `src/styles/hero.css` (ou scoped dans `Hero.astro`)

```css
#hero{ align-items:center; text-align:center; padding-top: clamp(120px,20vw,170px); }
#hero-canvas{ position:absolute; inset:0; z-index:0; opacity: 0.9; }
.hero-inner{ position:relative; z-index:2; max-width: 900px; margin: 0 auto; }

.hero-prologue{
  font-family: var(--f-display); font-style: italic; font-weight: 400;
  font-size: clamp(1rem, 2vw, 1.3rem); color: var(--cream-dim);
  margin-bottom: clamp(20px,3vw,32px);
  filter: blur(6px); opacity:0; transform: translateY(8px);
}
.hero-title{
  font-family: var(--f-display); font-weight: 500;
  font-size: clamp(3.6rem, 13vw, 9.5rem); line-height: 0.9; letter-spacing: -0.01em;
  color: var(--cream); text-shadow: 0 0 60px rgba(201,162,75,0.12);
}
.hero-title .line{ overflow:hidden; }
.hero-title .line span{ display:block; filter: blur(14px); opacity: 0; transform: translateY(30%) scale(1.04); }

.hero-sub{
  margin: clamp(26px,4vw,36px) auto 0; max-width: 46ch;
  font-family: var(--f-sans); font-size: clamp(0.95rem, 1.4vw, 1.05rem); line-height: 1.6;
  color: var(--cream-dim); opacity:0; transform: translateY(10px);
}
.scroll-cue{
  margin: clamp(48px,7vw,72px) auto 0; display:flex; flex-direction:column; align-items:center; gap:10px;
  font-size: 11px; letter-spacing:.16em; color: var(--silver); opacity:0;
}
.scroll-cue .chevron{
  width: 1px; height: 30px; background: linear-gradient(var(--gold), transparent);
  position: relative; animation: cue-run 1.8s var(--ease-io) infinite;
}
@keyframes cue-run{
  0%{ transform: scaleY(0); transform-origin: top; opacity: 0;}
  40%{ transform: scaleY(1); transform-origin: top; opacity:1;}
  60%{ transform: scaleY(1); transform-origin: bottom; opacity:1;}
  100%{ transform: scaleY(0); transform-origin: bottom; opacity:0;}
}
```

### 5.2 Styles Projets — `src/styles/projects.css`

```css
#projects{ overflow: hidden; padding-left:0; padding-right:0; }
.projects-head{ padding: 0 var(--frame); margin-bottom: clamp(30px,5vw,50px); }
.reel-viewport{ overflow: hidden; }
.reel-track{ display:flex; gap: clamp(20px, 3vw, 40px); padding: 10px var(--frame) 40px; width: max-content; }

@media (max-width: 999px){
  .reel-track{ overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .poster{ scroll-snap-align: start; }
}

.poster{
  position: relative; flex: none; width: min(78vw, 380px); aspect-ratio: 3/4.1;
  border: 1px solid var(--gold-dim);
  background: linear-gradient(160deg, var(--bordeaux-dk), var(--black-soft) 60%);
  padding: 26px 24px; display:flex; flex-direction:column; justify-content:flex-end; overflow:hidden;
}
.poster::before, .poster::after{ /* perforations façon pellicule */
  content:""; position:absolute; left:0; right:0; height: 22px;
  background-image: radial-gradient(circle, var(--black-deep) 3.5px, transparent 3.6px);
  background-size: 22px 22px; background-position: 10px center; background-repeat: repeat-x; opacity: 0.9;
}
.poster::before{ top:0; }
.poster::after{ bottom:0; }
.poster-glow{
  position:absolute; inset:0;
  background: radial-gradient(circle at 30% 20%, var(--poster-tint, var(--gold-dim)), transparent 60%);
  opacity: 0.5; transition: opacity .4s var(--ease-out);
}
.poster:hover .poster-glow{ opacity: 0.9; }
.poster-index{ font-family: var(--f-sans); font-size: 11px; color: var(--silver-dim); letter-spacing:.1em; margin-bottom: 14px; }
.poster-title{ font-family: var(--f-display); font-weight: 500; font-size: clamp(1.7rem, 3vw, 2.3rem); color: var(--cream); margin-bottom: 10px; position:relative; z-index:2; }
.poster-role{ font-size: 11px; letter-spacing:.08em; color: var(--gold); margin-bottom: 14px; position:relative; z-index:2; }
.poster-pitch{ font-family: var(--f-display); font-size: 0.98rem; line-height:1.55; color: var(--cream-dim); max-width: 32ch; position:relative; z-index:2; }
.poster-tags{ display:flex; flex-wrap:wrap; gap:8px; margin-top: 16px; position:relative; z-index:2; }
.poster-tags span{ font-size: 10px; letter-spacing:.06em; color: var(--silver); border: 1px solid rgba(168,173,182,0.3); padding: 3px 8px; }
.poster-link{
  margin-top: 18px; font-size: 11px; letter-spacing:.08em; color: var(--gold-bright);
  display:inline-flex; align-items:center; gap:6px; position:relative; z-index:2;
  width: fit-content; border-bottom: 1px solid transparent; transition: border-color .2s;
}
.poster-link:hover{ border-color: var(--gold-bright); }
```

### 5.3 Styles À propos — `src/styles/about.css`

```css
#about{ align-items: stretch; }
.about-grid{
  display:grid; grid-template-columns: 1.3fr 0.9fr; gap: clamp(40px,6vw,90px);
  align-items:center; max-width: 1180px; margin: 0 auto; width:100%;
}
@media (max-width: 860px){ .about-grid{ grid-template-columns: 1fr; } }

.bio-text{
  font-family: var(--f-display); font-size: clamp(1.15rem, 2vw, 1.5rem); line-height: 1.6;
  margin-top: 26px; max-width: 58ch;
  /* Balayage lumineux : le texte "s'éclaire" au scroll comme sous un projecteur */
  background-image: linear-gradient(100deg, var(--silver-dim) 40%, var(--cream) 50%, var(--silver-dim) 60%);
  background-size: 300% 100%; background-position: 100% 0;
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.slate{
  background: var(--black-soft); border: 1px solid var(--gold-dim);
  padding: clamp(26px,3vw,36px); transform: rotate(1.2deg);
  box-shadow: 0 30px 60px -30px rgba(0,0,0,0.7);
}
.slate-top{ display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid var(--gold-dim); padding-bottom: 14px; margin-bottom: 18px; }
.slate-top span{ font-size:11px; letter-spacing:.14em; color: var(--gold); }
.slate-row{ display:flex; justify-content:space-between; gap: 16px; padding: 10px 0; border-bottom: 1px solid rgba(168,173,182,0.14); font-size: 13px; }
.slate-row:last-child{ border-bottom:none; }
.slate-row dt{ color: var(--silver-dim); letter-spacing:.05em; }
.slate-row dd{ color: var(--cream); text-align:right; font-family: var(--f-display); font-style: italic; }
```

### 5.4 Styles Contact & footer — `src/styles/contact.css`

```css
#contact{ align-items:center; text-align:center; }
.clap{ width: clamp(130px,20vw,180px); margin: 0 auto clamp(30px,4vw,44px); }
.clap-top{
  height: 26px; background: repeating-linear-gradient(-45deg, var(--gold) 0 14px, var(--black-deep) 14px 28px);
  transform-origin: bottom left; border: 1px solid var(--black-deep);
}
.clap-body{ height: 60px; background: var(--black-soft); border: 1px solid var(--gold-dim); border-top:none; display:flex; align-items:center; justify-content:center; }
.clap-body span{ font-size: 10px; letter-spacing:.1em; color: var(--silver-dim); }

.contact-form{ max-width: 560px; margin: 0 auto; text-align:left; width:100%; }
.form-row{ display:grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 560px){ .form-row{ grid-template-columns: 1fr; } }

.field{ margin-bottom: 26px; }
.field label{ display:block; font-size: 11px; letter-spacing:.1em; color: var(--gold); margin-bottom: 8px; }
.field input, .field select, .field textarea{
  width: 100%; background: transparent; border: none; border-bottom: 1px solid rgba(168,173,182,0.35);
  color: var(--cream); font-family: var(--f-sans); font-size: 15px; padding: 8px 2px; transition: border-color .25s;
}
.field select{ appearance: none; }
.field select option{ background: var(--black-soft); color: var(--cream); }
.field textarea{ resize: vertical; min-height: 90px; font-family: var(--f-display); }
.field input:focus, .field select:focus, .field textarea:focus{ border-color: var(--gold-bright); }
.field input::placeholder, .field textarea::placeholder{ color: var(--silver-dim); }

.ticket-btn{
  position: relative; display:inline-flex; align-items:center; justify-content:center;
  padding: 15px 34px; border: 1px solid var(--gold); color: var(--gold-bright);
  font-family: var(--f-sans); font-size: 13px; letter-spacing:.12em; overflow:hidden; margin-top: 6px;
}
.ticket-btn::before{
  content:""; position:absolute; inset:0; background: var(--gold);
  transform: translateY(101%); transition: transform .35s var(--ease-io); z-index:0;
}
.ticket-btn span{ position:relative; z-index:1; transition: color .35s; }
.ticket-btn:hover::before{ transform: translateY(0); }
.ticket-btn:hover span{ color: var(--black-deep); }

.contact-fallback{ margin-top: 22px; font-size: 13px; color: var(--cream-dim); }
.contact-fallback a{ color: var(--gold-bright); border-bottom: 1px solid var(--gold-dim); }
.form-status{ margin-top: 16px; font-size: 13px; color: var(--gold-bright); min-height: 1.2em; }

#generique{
  padding: 70px var(--frame) calc(70px + 40px);
  border-top: 1px solid var(--gold-dim);
  display:flex; flex-wrap:wrap; gap: 30px; justify-content:space-between; align-items:flex-end;
}
.credits-list{ font-size: 13px; line-height:2; color: var(--cream-dim); }
.credits-list b{ color: var(--cream); font-weight:500; }
.back-to-top{
  width: 46px; height:46px; border:1px solid var(--gold-dim); border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  transition: transform .5s var(--ease-io), border-color .3s;
}
.back-to-top:hover{ transform: rotate(180deg); border-color: var(--gold-bright); }
.copyright{ width:100%; margin-top: 20px; font-size:11px; color: var(--silver-dim); letter-spacing:.05em; }
```

---

## 6. Modèle de données — `src/content/projects.ts`

```ts
export interface Project {
  slug: string;
  index: string;       // "Séance 01"
  title: string;       // "Lumen"
  role: string;        // "Réalisation & direction technique"
  pitch: string;
  tags: string[];
  tint: string;        // couleur d'accent CSS, ex. "#7c1f3f66"
  githubUrl: string;
}

// Données fictives — À REMPLACER par les vrais projets d'Enzo.
export const projects: Project[] = [
  {
    slug: "lumen",
    index: "Séance 01",
    title: "Lumen",
    role: "Réalisation & direction technique",
    pitch: "Une plateforme e-commerce pensée comme une vitrine de luxe, où chaque interaction a été chorégraphiée pour convertir.",
    tags: ["Next.js", "Stripe", "Framer Motion"],
    tint: "#7c1f3f66",
    githubUrl: "https://github.com/",
  },
  {
    slug: "nocturne",
    index: "Séance 02",
    title: "Nocturne",
    role: "Développement front-end & animation",
    pitch: "Un tableau de bord SaaS pour une fintech, où la donnée devient narration visuelle en temps réel.",
    tags: ["React", "D3.js", "WebSocket"],
    tint: "#c9a24b55",
    githubUrl: "https://github.com/",
  },
  {
    slug: "argentique",
    index: "Séance 03",
    title: "Argentique",
    role: "Direction artistique & intégration",
    pitch: "Un site vitrine pour un studio photo, pensé comme une pellicule que l'on déroule au fil du scroll.",
    tags: ["Astro", "GSAP", "Three.js"],
    tint: "#a8adb655",
    githubUrl: "https://github.com/",
  },
];
```

---

## 7. Arborescence de fichiers cible

```
src/
  components/
    layout/
      Letterbox.astro         # bandes fixes haut/bas, logo, nav, timecode, act-label
      FilmstripNav.astro      # nav pellicule desktop (progression + 4 points)
      GrainOverlay.astro
    sections/
      Hero.astro
      Projects.astro          # boucle sur projects.ts, rend les <Poster />
      Poster.astro            # une carte de projet
      About.astro
      Contact.astro
      Credits.astro           # footer / générique de fin
    islands/
      SmoothScrollProvider.tsx  # init Lenis + intégration ScrollTrigger, client:load
      CustomCursor.tsx          # client:media="(pointer: fine)"
      HeroScene.tsx             # Three.js, client:visible
      SceneTransitions.tsx      # centralise tous les ScrollTrigger (section 8.5), client:load
      CastingForm.tsx           # client:visible ou client:idle
  content/
    projects.ts
  styles/
    tokens.css
    global.css
    hero.css
    projects.css
    about.css
    contact.css
  layouts/
    BaseLayout.astro          # <html>, <head>, meta/OG, imports fonts + styles globaux
  pages/
    index.astro
public/
  fonts/                      # si auto-hébergement des polices (section 11)
  favicon.svg
  og-image.jpg
astro.config.mjs
tailwind.config.ts
tsconfig.json
```

---

## 8. Logique JavaScript/TypeScript de référence

Tout le code de cette section a été écrit, testé syntaxiquement et validé
dans le prototype. Il doit être **adapté** (typé, découpé en îlots React,
nettoyé des `var`/IIFE) mais **pas réinventé** : les valeurs numériques
(durées, easings, seuils, opacités) sont des choix de design déjà validés.

### 8.1 Smooth scroll — `SmoothScrollProvider.tsx`

Dans le prototype (contraint à cdnjs, qui n'héberge pas Lenis), l'inertie a
été simulée à la main. **En production, utiliser le vrai package `lenis`**
avec l'intégration officielle GSAP :

```ts
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Lenis respecte nativement `prefers-reduced-motion` depuis la v1.3
  // (lerp forcé à 1, comportement natif conservé) — pas besoin de logique
  // manuelle supplémentaire pour ce cas.

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

Sur mobile/tactile, garder Lenis actif (il gère nativement le touch) mais
vérifier ses options `touchInertia`/`syncTouch` par défaut ; ne pas
désactiver Lenis sur mobile comme le faisait le prototype (c'était une
contrainte du hack de scroll virtuel, pas de Lenis lui-même).

### 8.2 Curseur personnalisé — `CustomCursor.tsx`

Logique à porter en React (état local + `requestAnimationFrame`) :

```ts
// Pseudo-code de la boucle, à adapter en hook React (useEffect + rAF) :
let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function ringLoop() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(ringLoop);
}
```

- Rayon par défaut : 34px (`margin: -17px`), bordure 1px `--gold-bright`.
- État "survol d'un lien de projet" (`data-cursor="view"`) : passe à 72px,
  fond `rgba(5,4,3,0.55)`, affiche le texte `VOIR`.
- Coefficient de lerp du curseur : `0.18` (plus réactif que le scroll).
- **Ne monter ce composant que si `matchMedia('(pointer: coarse)')` est
  faux** — sur tactile, ne rien monter du tout (pas de fallback visuel
  nécessaire, le curseur natif suffit).
- Quand le composant est actif, ajouter la classe `has-cursor` sur `<html>`
  (c'est ce qui déclenche `cursor: none` globalement en CSS, cf. section 5).

### 8.3 Ouverture en iris + entrée du titre — `SceneTransitions.tsx`

Timeline GSAP jouée une fois au chargement du hero (respecter
`prefers-reduced-motion` : si actif, ne pas monter cette timeline du tout,
le CSS de secours en section 5 affiche directement le contenu) :

```ts
function playIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to("#iris-intro", {
    "--r": "120vmax",
    duration: 1.7,
    ease: "power2.inOut",
    onComplete: () => {
      const iris = document.getElementById("iris-intro");
      if (iris) iris.style.display = "none";
    },
  })
    .to(".hero-prologue", { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.9 }, 0.35)
    .to(".hero-title .line span", { opacity: 1, filter: "blur(0px)", y: "0%", scale: 1, duration: 1.1, stagger: 0.12 }, 0.55)
    .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
    .to(".scroll-cue", { opacity: 1, duration: 0.6 }, "-=0.3");
}
```

C'est le **seul** effet d'entrée orchestré à l'échelle de toute la page —
ne pas ajouter de fade-in générique sur d'autres éléments au chargement.

### 8.4 Scène Three.js — `HeroScene.tsx`

Paramètres exacts validés dans le prototype :

```ts
// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
const dpr = Math.min(window.devicePixelRatio || 1, 1.6); // cap DPR obligatoire
renderer.setPixelRatio(dpr);

// Caméra
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
camera.position.z = 12;

// Particules — densité adaptative
const count = isDesktopEnough ? 420 : 160; // isDesktopEnough = matchMedia('(min-width: 1000px)')
// positions aléatoires dans une boîte 18 x 10 x 10 centrée sur l'origine

const material = new THREE.PointsMaterial({
  color: 0xc9a24b,       // --gold
  size: 0.045,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
```

Comportement d'animation :
- Rotation Y suit la position horizontale de la souris (lerp `0.02`) + une
  dérive constante très lente (`+0.0006`/frame) même sans interaction.
- Rotation X suit la position verticale de la souris (lerp `0.02`).
- Léger flottement vertical sinusoïdal : `Math.sin(t * 0.15) * 0.3`.
- **Suspendre le rendu** (ne pas appeler `renderer.render`) quand le hero
  n'est pas visible à l'écran (`IntersectionObserver`, seuil `0.05`).
- **Ne pas monter ce composant du tout** si `prefers-reduced-motion: reduce`
  est actif, ou si la création du `WebGLRenderer` échoue (try/catch —
  fallback : le fond du hero reste le dégradé CSS, sans particules).
- Recalcule `camera.aspect` et `renderer.setSize` sur resize (debounce
  ~150ms).

### 8.5 Transitions de scène au scroll — `SceneTransitions.tsx` (suite)

Toutes ces animations utilisent `gsap.registerPlugin(ScrollTrigger)` et
doivent lire le scroll via l'instance Lenis (section 8.1), pas le scroll
natif brut.

**a) Bobine horizontale des projets (desktop ≥ 1000px uniquement)** :

```ts
ScrollTrigger.matchMedia({
  "(min-width: 1000px)": () => {
    const track = document.getElementById("reel-track")!;
    const frame = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--frame")) || 30;
    const scrollLength = track.scrollWidth - window.innerWidth + frame * 2;

    gsap.to(track, {
      x: -scrollLength,
      ease: "none",
      scrollTrigger: {
        trigger: "#projects",
        start: "top top",
        end: () => "+=" + (scrollLength + window.innerHeight * 0.6),
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  },
  "(max-width: 999px)": () => {
    // Mobile : pas de pin/scrub, simple apparition + scroll-snap natif en CSS
    gsap.utils.toArray<HTMLElement>(".poster").forEach((card) => {
      gsap.from(card, {
        opacity: 0, y: 30, duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: card, start: "top 88%" },
      });
    });
  },
});
```

**b) Balayage lumineux du texte de bio (Acte II)** — technique
`background-position` + `background-clip: text`, pas une apparition en fondu :

```ts
gsap.to("#bio-text", {
  backgroundPosition: "0% 0",
  ease: "none",
  scrollTrigger: { trigger: "#about", start: "top 75%", end: "top 15%", scrub: 0.5 },
});

gsap.from(".slate", {
  opacity: 0, y: 24, rotate: 1.2, duration: 0.9, ease: "power2.out",
  scrollTrigger: { trigger: ".slate", start: "top 85%" },
});
```

**c) Clap de cinéma à l'arrivée sur le contact** :

```ts
gsap.set("#clap-top", { transformOrigin: "bottom left", rotate: -18, y: -4 });
gsap.to("#clap-top", {
  rotate: 0, y: 0, duration: 0.5, ease: "power3.in",
  scrollTrigger: { trigger: "#clap", start: "top 80%", toggleActions: "play none none reverse" },
});
gsap.from(".contact-form", {
  opacity: 0, y: 20, duration: 0.7, ease: "power2.out",
  scrollTrigger: { trigger: ".contact-form", start: "top 88%" },
});
```

**d) Repère de l'acte courant** (met à jour la barre du bas + les points de
la pellicule latérale) :

```ts
const actLabels: Record<string, string> = {
  "0": "ACTE 0 — OUVERTURE",
  "1": "ACTE I — LA SÉANCE",
  "2": "ACTE II — LE SCÉNARIO",
  "3": "ACTE III — LE CASTING",
};

document.querySelectorAll<HTMLElement>(".section").forEach((section) => {
  const act = section.dataset.act!;
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onToggle: (self) => {
      if (!self.isActive) return;
      document.getElementById("act-label")!.textContent = actLabels[act];
      document.querySelectorAll(".filmstrip-dot").forEach((d) => {
        d.classList.toggle("is-active", d.getAttribute("data-act") === act);
      });
    },
  });
});
```

**e) Barre de progression globale** (remplit `.filmstrip-progress`) :

```ts
ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    document.getElementById("filmstrip-progress")!.style.height = self.progress * 100 + "%";
  },
});
```

**Règle générale** : ne pas ajouter d'autre animation scroll-triggered que
celles listées ci-dessus. Le brief impose un seul "moment fort" par section,
pas une apparition en fondu-glissé générique sur chaque bloc.

### 8.6 Timecode décoratif — composant `Letterbox.astro` / petit script client

```ts
function startTimecode(el: HTMLElement) {
  const start = Date.now();
  const pad = (n: number) => String(n).padStart(2, "0");
  function tick() {
    const elapsed = Date.now() - start;
    const h = Math.floor(elapsed / 3600000);
    const m = Math.floor((elapsed % 3600000) / 60000);
    const s = Math.floor((elapsed % 60000) / 1000);
    const f = Math.floor((elapsed % 1000) / 40); // ~25 "images"/seconde
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
```

### 8.7 Formulaire de casting — `CastingForm.tsx`

Le prototype ouvre un `mailto:` pré-rempli, sans backend :

```ts
function handleSubmit(e: SubmitEvent, formEl: HTMLFormElement, statusEl: HTMLElement) {
  e.preventDefault();
  const data = new FormData(formEl);
  const projet = String(data.get("projet") ?? "").trim();
  const role = String(data.get("role") ?? "");
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  const subject = `Brief projet — ${projet || "nouveau projet"}`;
  const body = `Rôle : ${role}\nContact : ${email}\n\n${message}`;
  const mailto = `mailto:enzocouteau.pro@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  statusEl.textContent = "Ouverture de votre messagerie…";
  window.location.href = mailto;
}
```

**En production**, remplacer ce `mailto:` par un vrai envoi (au choix,
à trancher avec le client — voir section 11) :
- une route API Astro (`src/pages/api/contact.ts`) qui envoie l'email via
  un service SMTP/API (Resend, Postmark…), ou
- un service tiers sans backend (Formspree, Basin…).

Garder le `mailto:` comme **filet de secours** si le `fetch` vers l'API
échoue (réseau, erreur serveur).

---

## 9. Accessibilité & performance — exigences non négociables

- `prefers-reduced-motion: reduce` désactive entièrement : iris d'ouverture,
  particules Three.js, curseur custom (si de toute façon non pertinent sans
  animation, garder le curseur natif). Lenis gère nativement ce cas depuis
  sa v1.3 (voir 8.1).
- Focus clavier toujours visible (`:focus-visible`), y compris avec le
  curseur custom actif — ne jamais faire `outline: none` sans remplacement.
- Formulaire de contact entièrement utilisable au clavier ; labels `<label
  for>` explicites (pas de placeholder-comme-label) ; retour d'envoi annoncé
  via `aria-live="polite"` (`role="status"`).
- Contraste : le texte `--cream` / `--cream-dim` sur fond `--black`/`--black-soft`
  doit être vérifié AA (les valeurs choisies le sont déjà, à revérifier si
  les tokens sont modifiés).
- Cibler Lighthouse mobile : 90+ Performance, 100 Accessibilité.
- Densité de particules, DPR cappé à 1.6, rendu Three.js suspendu hors-écran :
  voir section 8.4 — ne pas régresser sur ces trois points en portant le code.
- Pas de `pin`/`scrub` GSAP sur mobile pour la bobine de projets (voir 8.5a)
  — c'est la principale cause de saccades sur téléphone, à ne jamais réactiver.

---

## 10. SEO & métadonnées (à ajouter, absent du prototype)

Dans `BaseLayout.astro` :

```html
<title>Enzo Couteau — Réalisateur & développeur web</title>
<meta name="description" content="Enzo Couteau — développeur web. Chaque projet est traité comme un film : réalisation, code, direction technique.">
<meta name="theme-color" content="#0b0908">
<meta property="og:type" content="website">
<meta property="og:title" content="Enzo Couteau — Réalisateur & développeur web">
<meta property="og:description" content="Chaque projet est traité comme un film : réalisation, code, direction technique.">
<meta property="og:image" content="/og-image.jpg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

L'image `og-image.jpg` reste à produire (capture stylisée du hero, format
1200×630) — à faire une fois le design final figé.

---

## 11. Points ouverts à trancher avec le client

- [ ] Récupérer les vrais projets (visuels, éventuelles vidéos de preview au
      survol, liens GitHub réels) pour remplacer Lumen/Nocturne/Argentique
      dans `src/content/projects.ts`.
- [ ] Valider ou réécrire le texte de bio (Acte II) avec de vraies infos
      (parcours, années d'expérience) — actuellement volontairement vague.
- [ ] Choisir l'hébergement (Vercel / Netlify) et le nom de domaine final.
- [ ] Google Fonts CDN vs auto-hébergement des polices (`public/fonts` +
      `@font-face`) — meilleur score de confidentialité/performance en
      auto-hébergé, plus simple à maintenir en CDN.
- [ ] Choisir le mode d'envoi réel du formulaire (route API + service
      SMTP, ou Formspree/Basin) plutôt que le seul `mailto:` de secours.
- [ ] Produire `og-image.jpg` et `favicon.svg` une fois le design figé.
- [ ] Décider s'il faut un mode clair/alternatif (non prévu dans le brief
      initial — a priori non, le noir velours est la signature du site).

---

## 12. Checklist de recette avant mise en ligne

- [ ] Lighthouse mobile ≥ 90 Performance / 100 Accessibilité / 100 SEO.
- [ ] Test clavier complet (Tab à travers toute la page, formulaire inclus).
- [ ] Test avec `prefers-reduced-motion: reduce` activé au niveau OS.
- [ ] Test sur un mobile bas de gamme réel (pas seulement un émulateur) pour
      valider l'absence de saccades sur la bobine de projets et le grain.
- [ ] Vérifier le fallback sans WebGL (désactiver le GPU ou tester sur un
      navigateur qui le bloque) : le hero doit rester lisible et propre.
- [ ] Vérifier l'envoi réel du formulaire de contact (pas seulement le
      `mailto:`) si une route API a été branchée.
- [ ] Vérifier les liens GitHub une fois les vrais projets intégrés (pas de
      `href="https://github.com/"` orphelin en production).