// SceneTransitions — ouverture en iris + entree du titre (CLAUDE.md §8.3).
//
// C'est le SEUL effet d'entree orchestre a l'echelle de la page : la spec
// interdit explicitement d'ajouter un fade-in generique sur d'autres
// elements au chargement.
//
// TODO (§8.5) : les ScrollTrigger de transition entre actes viendront ici,
// une fois les sections Projets / A propos / Contact portees.

import { useEffect } from 'react';
import gsap from 'gsap';

function playIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('#iris-intro', {
    '--r': '120vmax',
    duration: 1.7,
    ease: 'power2.inOut',
    onComplete: () => {
      const iris = document.getElementById('iris-intro');
      if (iris) iris.style.display = 'none';
    },
  })
    .to('.hero-prologue', { opacity: 1, filter: 'blur(0px)', y: 0, duration: 0.9 }, 0.35)
    .to(
      '.hero-title .line span',
      { opacity: 1, filter: 'blur(0px)', y: '0%', scale: 1, duration: 1.1, stagger: 0.12 },
      0.55,
    )
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
    .to('.scroll-cue', { opacity: 1, duration: 0.6 }, '-=0.3');

  return tl;
}

export default function SceneTransitions() {
  useEffect(() => {
    // §9 : en reduced-motion on ne monte pas la timeline du tout. Le bloc
    // @media de global.css (§5) affiche alors directement le contenu et
    // masque #iris-intro.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      playIntro();
    });

    return () => ctx.revert();
  }, []);

  return null;
}
