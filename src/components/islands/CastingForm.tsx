// CastingForm — comportement du formulaire de brief (CLAUDE.md §8.7).
//
// L'ilot ne rend aucun balisage : le formulaire est ecrit cote serveur par
// Contact.astro et reste lisible sans JavaScript. On se greffe dessus.
//
// Deux responsabilites, pas une de plus :
//   1. maintenir `aria-invalid` en phase avec l'etat visuel `:user-invalid`
//   2. construire et declencher l'envoi
//
// La validation elle-meme est laissee au navigateur : le formulaire n'a pas
// d'attribut `novalidate`, donc l'evenement `submit` n'est emis QUE si tous
// les champs sont valides. Inutile de revalider a la main.

import { useEffect } from 'react';

const EMAIL = 'enzocouteau.pro@gmail.com';

/**
 * ENVOI REEL — point d'extension (CLAUDE.md §11, decision ouverte).
 *
 * Tant qu'aucun service n'est choisi, on ouvre un `mailto:` pre-rempli,
 * exactement comme le prototype. Pour brancher un envoi reel, remplacer le
 * corps de `envoyer()` par un `fetch` vers une route API Astro ou un service
 * tiers, en CONSERVANT le `mailto:` en filet de secours si la requete
 * echoue — c'est ce que demande la §8.7.
 */
function envoyer(champs: {
  projet: string;
  role: string;
  email: string;
  message: string;
}) {
  const sujet = `Brief projet — ${champs.projet || 'nouveau projet'}`;
  const corps = `Rôle : ${champs.role}\nContact : ${champs.email}\n\n${champs.message}`;
  window.location.href =
    `mailto:${EMAIL}?subject=${encodeURIComponent(sujet)}` +
    `&body=${encodeURIComponent(corps)}`;
}

export default function CastingForm() {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('#casting');
    if (!form) return;
    const statut = document.querySelector<HTMLElement>('#statut-envoi');

    // --- Pont entre l'etat visuel et l'etat accessible --------------------
    // `:user-invalid` n'emet aucun evenement : il faut sonder l'element aux
    // moments ou son etat peut avoir change. Sans ce pont, un lecteur
    // d'ecran n'annoncerait jamais qu'un champ est en erreur.
    const synchroniser = (cible: EventTarget | null) => {
      if (!(cible instanceof HTMLElement)) return;
      if (!cible.matches('input, select, textarea')) return;
      if (cible.matches(':user-invalid')) {
        cible.setAttribute('aria-invalid', 'true');
      } else {
        cible.removeAttribute('aria-invalid');
      }
    };

    const surSortie = (e: Event) => synchroniser(e.target);

    // On ne re-sonde a la frappe que si le champ est DEJA signale en erreur :
    // l'erreur disparait des qu'elle est corrigee, mais on n'en cree pas une
    // pendant que l'utilisateur tape encore.
    const surSaisie = (e: Event) => {
      const cible = e.target;
      if (cible instanceof HTMLElement && cible.getAttribute('aria-invalid') === 'true') {
        synchroniser(cible);
      }
    };

    // `blur` ne remonte pas : la phase de capture est obligatoire.
    form.addEventListener('blur', surSortie, true);
    form.addEventListener('change', surSortie);
    form.addEventListener('input', surSaisie);

    // --- Envoi --------------------------------------------------------------
    let minuteur = 0;

    const surEnvoi = (e: SubmitEvent) => {
      e.preventDefault();
      const data = new FormData(form);
      const lire = (cle: string) => String(data.get(cle) ?? '').trim();

      if (statut) {
        statut.removeAttribute('data-etat');
        statut.textContent = 'Ouverture de votre messagerie…';
      }

      envoyer({
        projet: lire('projet'),
        role: lire('role'),
        email: lire('email'),
        message: lire('message'),
      });

      // Un `mailto:` echoue silencieusement quand aucune messagerie n'est
      // configuree — cas frequent sur ordinateur de bureau. Sans ce message
      // de rattrapage, le visiteur reste devant « Ouverture… » sans rien
      // comprendre et le brief est perdu.
      minuteur = window.setTimeout(() => {
        if (!statut) return;
        statut.setAttribute('data-etat', 'erreur');
        statut.textContent =
          `Si rien ne s'est ouvert, écrivez directement à ${EMAIL}.`;
      }, 2500);
    };

    form.addEventListener('submit', surEnvoi);

    return () => {
      window.clearTimeout(minuteur);
      form.removeEventListener('blur', surSortie, true);
      form.removeEventListener('change', surSortie);
      form.removeEventListener('input', surSaisie);
      form.removeEventListener('submit', surEnvoi);
    };
  }, []);

  return null;
}
