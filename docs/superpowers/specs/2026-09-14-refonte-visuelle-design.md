# Refonte visuelle — portfolio Enzo Couteau

**Date** : 2026-09-14
**Statut** : validé sur la direction, en cours d'implémentation

## Rapport au CLAUDE.md

Le `CLAUDE.md` à la racine se présente comme « source de vérité unique ». Il ne
l'est plus pour l'apparence. Ce document **remplace** ses sections 4 et 5
(tokens, styles) et amende les sections 5.1 à 5.4, 8.3 à 8.5, ainsi que la
section 2 sur le point Three.js.

Restent valables et font toujours autorité dans le CLAUDE.md :

- section 3 — tout le contenu rédactionnel, actes et textes
- section 6 — modèle de données des projets
- section 9 — exigences d'accessibilité et de performance
- section 10 — SEO et métadonnées
- section 11 — points ouverts avec le client
- section 12 — checklist de recette

Le concept est inchangé : le développeur comme réalisateur, le site en quatre
actes. Seule sa référence visuelle change.

## Pourquoi cette refonte

La direction d'origine — salle de projection sombre, velours, or — a été jugée
insuffisante. Trois portfolios ont été donnés en référence : `cydstumpel.nl`,
`itssharl.ee`, `tamalsen.dev`. Ils se contredisent sur l'axe le plus
structurant : deux sont clairs, un est sombre.

Plutôt que d'en faire un patchwork, la direction s'ancre sur une référence
unique et cohérente : **l'affiche de cinéma sérigraphiée**, tradition Saul
Bass. Aplats, palette réduite, typographie condensée surdimensionnée, formes
découpées. Chaque choix en découle.

Ce qui est repris de chaque référence :

- **Cyd Stumpel** — l'énergie éditoriale, le nom surdimensionné, les badges
  pivotés façon tampon, les cartes à coins adoucis avec titre en surimpression.
- **Tamal Sen** — la numérotation sèche des sections, la rigueur de la grille.
- **Sharlee** — rien de significatif. C'est la référence la moins compatible
  avec un propos cinéma, et les dégradés organiques sont un tic répandu.

## Direction visuelle

### Palette

| Jeton | Valeur | Rôle | Contraste sur papier |
|---|---|---|---|
| `--papier` | `#F4EDE2` | Fond. Crème chaud, jamais de blanc pur. | — |
| `--encre` | `#16120F` | Texte. Noir d'impression, jamais `#000`. | 16,02 |
| `--rouge` | `#C4331B` | Accent unique. Rouge d'affiche. | 4,71 |
| `--papier-2` | `#E7DCCA` | Séparateurs, fonds de carte. | — |
| `--gris-papier` | `#675F55` | Texte secondaire. | 5,40 |

Un seul accent. La couleur vient des visuels de projet, pas de la charte.

Les valeurs ont été calculées, pas estimées. La première proposition échouait
en AA sur trois paires : gris secondaire à 3,33 et rouge à 4,11 sur papier, là
où il faut 4,5 pour du texte normal. Les valeurs retenues sont les plus
claires qui passent, afin de ne pas ternir l'affiche :

| Paire | Ratio | AA texte normal |
|---|---|---|
| encre sur papier | 16,02 | conforme |
| gris-papier sur papier | 5,40 | conforme |
| gris-papier sur papier-2 | 4,63 | conforme |
| rouge sur papier | 4,71 | conforme |
| papier sur rouge | 4,71 | conforme |

Toute modification de ces jetons impose de recalculer ces cinq ratios.

### Typographie

| Rôle | Famille | Usage |
|---|---|---|
| Display | **Anton** | Nom géant, titres d'acte. Condensé, capitales. |
| Éditorial | **Fraunces** italique | Accroches, citations, pitchs. |
| Interface | **Space Grotesk** | Texte courant, nav, formulaire, métadonnées. |

Trois familles, dont deux déjà chargées. Anton est la seule addition. Aucune
autre famille ne doit être introduite.

### Matière

- Grain argentique conservé, allégé, en `mix-blend-mode: multiply` — le mode
  `overlay` de la version sombre ne fonctionne pas sur fond clair.
- Perforations de pellicule conservées sur les affiches.
- Badges pivotés façon tampon, à la Cyd, pour les mentions courtes
  (disponibilité, sélection).

## Structure

Page unique, quatre actes, scroll vertical.

```
Acte 0   — OUVERTURE     nom géant, accroche, badge de disponibilité
Acte I   — LA SÉANCE     grille d'affiches  ← moment fort
Acte II  — LE SCÉNARIO   parcours
Acte III — LE CASTING    formulaire de brief
           GÉNÉRIQUE     footer
```

Un projet s'ouvre **en surimpression, sans quitter la page**. Pas de page
projet dédiée : l'objectif est la conversion, le formulaire doit rester à un
scroll.

### La grille d'affiches remplace la bobine

La bobine horizontale épinglée de la §8.5a est supprimée. Mesures relevées au
navigateur sur l'implémentation précédente :

- elle ne s'activait qu'entre 1000 et ~1340px de large avec trois projets ;
- son contenu incompressible réclamait 741px de hauteur, dont 519 pour la
  seule affiche, ce qui la mettait à l'étroit sous 740px de haut ;
- aucun `pin` n'est possible sur mobile — la §9 l'interdit explicitement.

Une grille responsive n'a aucune de ces limites, se réduit à une colonne sur
mobile, et c'est elle qui rend le dépliage possible.

## Le moment fort : le dépliage de l'affiche

Un clic sur une affiche l'agrandit jusqu'au plein écran, le détail se compose
autour. Le retour rejoue l'inverse. Identique au doigt et à la souris.

### Technique

Vérifié via `modern-web-guidance` :

- **View Transitions API** — Baseline depuis le 2025-10-14. Utilisable sans
  polyfill : les navigateurs qui ne la supportent pas appliquent la mise à
  jour du DOM sans animation.
- **`<dialog>` + `showModal()`** pour la surimpression : couche supérieure,
  piège de focus et touche Échap gérés nativement.
- **`closedby="any"`** pour la fermeture au clic extérieur. Non supporté par
  Safari : repli JS obligatoire, comparaison des coordonnées du clic avec le
  rectangle du dialogue.

Motif retenu pour l'élément partagé — « dynamic list item » : le visuel du
dialogue porte `view-transition-name: affiche` ; au clic, la carte
sélectionnée reçoit le même nom, puis on le retire après résolution de
`transition.finished`. Contrainte absolue : **jamais deux éléments portant le
même `view-transition-name` simultanément**, sinon la transition est annulée
et le DOM saute.

Points obligatoires :

- Router le focus vers le titre du détail (`tabindex="-1"`) après
  `transition.finished` — les View Transitions ne gèrent pas le focus.
- Ne pas transitionner d'élément portant une animation active : la transition
  opère sur des instantanés, l'animation apparaîtrait figée.
- `width: fit-content` sur les textes transitionnés, pour stabiliser leur
  rapport de forme.
- En `prefers-reduced-motion`, couper toutes les animations de
  `::view-transition-*` ; le dialogue s'ouvre alors instantanément.

### Risque identifié

Le `<dialog>` modal vit dans la couche supérieure, et les View Transitions
opèrent également dans cette couche. La combinaison des deux doit être
validée par un prototype dès la première étape d'implémentation, avant de
construire le reste autour.

## Mobile

Priorité explicite du client, au même rang que le desktop.

- Grille d'affiches en une colonne, affiche en ratio 3/4 pleine largeur moins
  gouttière.
- Le dialogue de détail occupe tout l'écran.
- Cibles tactiles de 44px minimum.
- Aucun `pin` ni `scrub` — interdit par la §9.
- Navigation latérale « pellicule » masquée sous 1000px, comme aujourd'hui.

## Ce qui est supprimé

| Élément | Raison |
|---|---|
| Bobine horizontale épinglée (§8.5a) | Remplacée par la grille. Limites mesurées ci-dessus. |
| Particules Three.js du hero (§8.4) | Sur fond papier clair, des particules dorées n'ont plus de sens. Suppression de la dépendance `three` et de `@types/three` : gain de poids et de budget performance pour la §12. |
| Curseur personnalisé (§8.2) | Un curseur custom est un tic, il dessert « le plus pratique possible », et aucune des trois références n'en a. |
| Palette velours (noir, or, bordeaux) | Remplacée intégralement. |

**Three.js disparaît de la stack.** C'est le changement le plus lourd par
rapport au CLAUDE.md §2 et il doit être confirmé : la §2 l'imposait.

## Ce qui est conservé

- Lenis pour le scroll — demande explicite du client, déjà implémenté (§8.1).
- GSAP + ScrollTrigger pour les révélations au scroll, en restant sobre : la
  spec impose un seul moment fort par section.
- Astro statique, îlots React, TypeScript strict.
- Tailwind 4 via `@tailwindcss/vite`, tokens exposés par `@theme inline`.
- Le grain, les perforations, le vocabulaire des actes.

## Modèle de données

`Project` de la §6 est étendu d'un champ optionnel :

```ts
visuel?: string;   // chemin du photogramme ; absent = repli bloc de couleur
```

Un seul composant, deux états : tant qu'aucun fichier n'est fourni, l'affiche
affiche son bloc de couleur et sa typographie. L'image le remplace dès
qu'elle arrive, sans retoucher le code. Décidé avec le client : les visuels
existent mais ne sont pas encore triés.

## Critères de recette

Ceux de la §12 restent, complétés par :

- Le dépliage fonctionne au clavier seul, de la grille au détail et retour.
- Le focus atterrit sur le titre du détail à l'ouverture, et revient sur
  l'affiche d'origine à la fermeture.
- En `prefers-reduced-motion`, le détail s'ouvre sans animation et reste
  entièrement utilisable.
- Dans Safari, la fermeture au clic extérieur fonctionne via le repli.
- Aucun débordement horizontal de page, de 320px à 2560px de large.
- Le contraste `--encre` sur `--papier` et `--gris-papier` sur `--papier` est
  vérifié AA.
