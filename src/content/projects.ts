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
  tint: string;        // encre du bloc de repli, ex. "#1F4D5C"
  githubUrl: string;
  /** Chemin du photogramme. Absent = repli sur le bloc de couleur `tint`.
   *  Un seul composant, deux etats : deposer un fichier suffit. */
  visuel?: string;
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
    tint: "#1F4D5C", // bleu petrole
    githubUrl: "https://github.com/",
  },
  {
    slug: "nocturne",
    index: "Séance 02",
    title: "Nocturne",
    role: "Développement front-end & animation",
    pitch: "Un tableau de bord SaaS pour une fintech, où la donnée devient narration visuelle en temps réel.",
    tags: ["React", "D3.js", "WebSocket"],
    tint: "#2E2A55", // bleu nuit
    githubUrl: "https://github.com/",
  },
  {
    slug: "argentique",
    index: "Séance 03",
    title: "Argentique",
    role: "Direction artistique & intégration",
    pitch: "Un site vitrine pour un studio photo, pensé comme une pellicule que l'on déroule au fil du scroll.",
    tags: ["Astro", "GSAP", "Three.js"],
    tint: "#7A5C2E", // sepia
    githubUrl: "https://github.com/",
  },
];
