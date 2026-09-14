// Modele de donnees des projets (CLAUDE.md §6)
// Copie verbatim depuis la spec.
// TODO (§11) : remplacer Lumen / Nocturne / Argentique par les vrais
// projets d'Enzo (visuels, liens GitHub reels) avant mise en ligne.

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
