// SceneTransitions — revelations au scroll (spec du 2026-09-14).
//
// Volontairement minimal. La spec impose un seul moment fort par section, et
// celui de l'Acte I est le depliage de l'affiche, pas une apparition. Tout ce
// qui reste ici est une entree sobre des blocs marques `.reveal`.
//
// Supprime par rapport au CLAUDE.md : l'ouverture en iris (§8.3) et la bobine
// horizontale epinglee (§8.5a), qui n'existent plus dans cette direction.

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SceneTransitions() {
  useEffect(() => {
    // §9 : en mouvement reduit, aucune animation. global.css force alors
    // `.reveal` a son etat final, le contenu est visible immediatement.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((bloc) => {
        gsap.to(bloc, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: bloc, start: 'top 88%' },
        });
      });
    });

    // Le pin et les bornes dependent de la mise en page : tant qu'Anton et
    // Fraunces ne sont pas chargees, les hauteurs bougent encore.
    let annule = false;
    void document.fonts?.ready.then(() => {
      if (!annule) ScrollTrigger.refresh();
    });

    return () => {
      annule = true;
      ctx.revert();
    };
  }, []);

  return null;
}
