// SceneTransitions — ouverture en iris (§8.3) et transitions de scene au
// scroll (§8.5).
//
// Regle de la spec : un seul "moment fort" par section. Ne pas ajouter
// d'animation scroll-triggered au-dela de celles listees en §8.5.
//
// TODO : §8.5b (balayage de la bio), §8.5c (clap du contact), §8.5d (repere
// d'acte) et §8.5e (barre de progression) arriveront avec leurs sections.

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** §8.3 — seul effet d'entree orchestre a l'echelle de la page. */
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

/**
 * §8.5a — bobine horizontale des projets.
 *
 * La spec ecrit `ScrollTrigger.matchMedia(...)`, API retiree de GSAP en
 * 3.15 (verifie : `typeof ScrollTrigger.matchMedia === 'undefined'`). On
 * utilise `gsap.matchMedia()`, son remplacant officiel, qui fournit en
 * prime un `revert()` propre pour le demontage de l'ilot React.
 *
 * Le pin/scrub reste STRICTEMENT desktop : la §9 interdit de le reactiver
 * sur mobile, c'est la principale cause de saccades sur telephone.
 */
function setupProjectsReel() {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 1000px)', () => {
    const track = document.getElementById('reel-track');
    if (!track) return;

    // A noter : `--frame` vaut `clamp(16px, 2.6vw, 30px)`. Sur une propriete
    // personnalisee, getPropertyValue rend la chaine brute, non calculee ;
    // parseFloat donne donc NaN et c'est le repli 30 de la spec qui
    // s'applique — soit le maximum du clamp. Comportement conserve tel quel.
    const frame =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--frame'),
      ) || 30;

    // Fonction et non valeur figee : c'est ce que `invalidateOnRefresh`
    // attend pour se recalculer correctement au resize.
    //
    // CORRECTION au code de la §8.5a : la spec n'a pas de plancher a zero.
    // Quand la piste tient dans le viewport — peu de projets sur un grand
    // ecran — `scrollWidth - innerWidth` passe negatif et `x: -scrollLength`
    // devient POSITIF : la bobine part vers la droite. Mesure a 1440px avec
    // les 3 projets d'exemple : piste 1280px, scrollLength -100, la piste
    // glissait de +100px. Avec les vrais projets (plus nombreux) le cas ne
    // se presentera sans doute pas, mais le plancher doit exister.
    const scrollLength = () =>
      Math.max(0, track.scrollWidth - window.innerWidth + frame * 2);

    // Rien a faire defiler : aucun pin. Mieux vaut laisser passer le scroll
    // vertical qu'epingler la section sur une zone morte ou rien ne bouge.
    if (scrollLength() === 0) return;

    gsap.to(track, {
      x: () => -scrollLength(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#projects',
        start: 'top top',
        end: () => '+=' + (scrollLength() + window.innerHeight * 0.6),
        scrub: 0.6,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
  });

  mm.add('(max-width: 999px)', () => {
    // Mobile : pas de pin/scrub, simple apparition + scroll-snap natif en CSS.
    gsap.utils.toArray<HTMLElement>('.poster').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 88%' },
      });
    });
  });

  return mm;
}

export default function SceneTransitions() {
  useEffect(() => {
    // §9 : en reduced-motion la timeline d'intro n'est pas montee du tout.
    // Le bloc @media de global.css affiche alors directement le contenu.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!reduced) playIntro();
    });

    const mm = setupProjectsReel();

    // Le pin mesure la mise en page : tant que Fraunces et Space Grotesk ne
    // sont pas chargees, les hauteurs bougent encore et les bornes du
    // ScrollTrigger seraient calculees sur un texte en police de repli.
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ctx.revert();
      mm.revert();
    };
  }, []);

  return null;
}
