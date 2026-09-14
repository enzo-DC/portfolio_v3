// SmoothScrollProvider — inertie de scroll Lenis + pont vers ScrollTrigger
// (CLAUDE.md §8.1).
//
// La spec est explicite : en production on utilise le vrai package `lenis`,
// pas le scroll virtuel bricole du prototype. Lenis reste actif sur mobile,
// il gere nativement le tactile.
//
// prefers-reduced-motion : Lenis le respecte nativement depuis la v1.3
// (lerp force a 1, comportement natif conserve). Aucune logique manuelle.

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); // valeur par defaut de GSAP
      lenis.destroy();
    };
  }, []);

  return null;
}
