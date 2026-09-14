// ProjectExpander — depliage d'une affiche en detail plein ecran.
// Reference : docs/superpowers/specs/2026-09-14-refonte-visuelle-design.md
//
// L'ilot ne construit AUCUN contenu : la grille et les panneaux de detail
// sont rendus cote serveur par Projects.astro. Il ne fait qu'orchestrer.
//
// Deux mecanismes natifs portent le gros du travail :
//   - <dialog>.showModal() : couche superieure, piege de focus, touche Echap
//   - View Transitions API : morphing de l'affiche vers le detail
//
// Contrainte absolue de l'API : jamais deux elements portant le meme
// `view-transition-name` au meme instant, sinon la transition est annulee et
// le DOM saute. D'ou le retrait du nom sur l'affiche AU SEIN du callback de
// mise a jour, au moment meme ou on le pose sur le detail.

import { useEffect } from 'react';

const NOM_PARTAGE = 'affiche-active';

type Nommable = HTMLElement | null;

function poserNom(el: Nommable, nom: string) {
  if (el) el.style.viewTransitionName = nom;
}
function retirerNom(el: Nommable) {
  if (el) el.style.viewTransitionName = '';
}

/** Execute `maj` dans une view transition si disponible, sinon directement.
 *  L'API est concue pour l'amelioration progressive : sans elle, le DOM se
 *  met a jour sans animation, ce qui reste parfaitement utilisable. */
function transitionner(maj: () => void): Promise<void> {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };
  if (!doc.startViewTransition) {
    maj();
    return Promise.resolve();
  }
  return doc.startViewTransition(maj).finished.catch(() => undefined);
}

export default function ProjectExpander() {
  useEffect(() => {
    const dialog = document.querySelector<HTMLDialogElement>('#detail-projet');
    if (!dialog) return;

    const affiches = Array.from(
      document.querySelectorAll<HTMLButtonElement>('[data-affiche]'),
    );
    if (affiches.length === 0) return;

    // Affiche dont le detail est ouvert : sert a rendre le focus au bon
    // bouton a la fermeture.
    let origine: HTMLButtonElement | null = null;

    const panneau = (slug: string) =>
      dialog.querySelector<HTMLElement>(`[data-detail="${slug}"]`);
    const cadreDetail = (slug: string) =>
      dialog.querySelector<HTMLElement>(`[data-detail-cadre="${slug}"]`);
    const cadreAffiche = (slug: string) =>
      document.querySelector<HTMLElement>(`[data-cadre="${slug}"]`);

    // Fonctions flechees et non declarations : une declaration est hissee,
    // TypeScript ne peut donc pas garantir qu'elle ne s'execute pas avant le
    // garde `if (!dialog) return` ci-dessus, et elargit `dialog` a null.
    const ouvrir = async (bouton: HTMLButtonElement) => {
      const slug = bouton.dataset.affiche;
      if (!slug) return;

      const vue = panneau(slug);
      const depuis = cadreAffiche(slug);
      const vers = cadreDetail(slug);
      if (!vue) return;

      origine = bouton;

      // Le dialogue prend le nom du projet ouvert : un seul dialogue sert
      // tous les projets, son nom accessible doit donc suivre.
      dialog.setAttribute('aria-labelledby', `detail-titre-${slug}`);

      // Etat AVANT : seule l'affiche porte le nom partage.
      poserNom(depuis, NOM_PARTAGE);

      await transitionner(() => {
        // Etat APRES : on retire le nom de l'affiche au moment meme ou on le
        // pose sur le detail, pour qu'il n'y ait jamais deux porteurs.
        retirerNom(depuis);
        poserNom(vers, NOM_PARTAGE);
        vue.hidden = false;
        dialog.showModal();
      });

      // Routage du focus : les View Transitions ne le gerent pas. Sans cela,
      // le focus resterait sur un bouton desormais masque par le dialogue.
      vue.querySelector<HTMLElement>('.detail-titre')?.focus();
    };

    const fermer = async () => {
      const vue = dialog.querySelector<HTMLElement>('[data-detail]:not([hidden])');
      if (!vue) return;
      const slug = vue.dataset.detail ?? '';
      const depuis = cadreDetail(slug);
      const vers = cadreAffiche(slug);
      const bouton = origine;

      await transitionner(() => {
        retirerNom(depuis);
        poserNom(vers, NOM_PARTAGE);
        vue.hidden = true;
        dialog.close();
      });

      // Nettoyage : aucun nom ne doit survivre a la transition, sinon la
      // suivante echouerait.
      retirerNom(vers);
      origine = null;
      bouton?.focus();
    };

    const surClicAffiche = (e: Event) => {
      const bouton = (e.currentTarget as HTMLButtonElement) ?? null;
      if (bouton) void ouvrir(bouton);
    };
    affiches.forEach((b) => b.addEventListener('click', surClicAffiche));

    const surClicFermer = (e: Event) => {
      if ((e.target as HTMLElement).closest('[data-fermer]')) void fermer();
    };
    dialog.addEventListener('click', surClicFermer);

    // Echap : on intercepte la fermeture native pour rejouer la transition
    // inverse plutot que de voir le detail disparaitre d'un coup.
    const surAnnulation = (e: Event) => {
      e.preventDefault();
      void fermer();
    };
    dialog.addEventListener('cancel', surAnnulation);

    // Repli pour Safari, qui ne supporte pas `closedby` : on compare les
    // coordonnees du clic au rectangle du dialogue pour distinguer un clic
    // sur l'arriere-plan d'un clic dans le contenu.
    const sansClosedBy = !('closedBy' in HTMLDialogElement.prototype);
    const surClicExterieur = (e: MouseEvent) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const dedans =
        r.top <= e.clientY &&
        e.clientY <= r.top + r.height &&
        r.left <= e.clientX &&
        e.clientX <= r.left + r.width;
      if (!dedans) void fermer();
    };
    if (sansClosedBy) dialog.addEventListener('click', surClicExterieur);

    return () => {
      affiches.forEach((b) => b.removeEventListener('click', surClicAffiche));
      dialog.removeEventListener('click', surClicFermer);
      dialog.removeEventListener('cancel', surAnnulation);
      if (sansClosedBy) dialog.removeEventListener('click', surClicExterieur);
    };
  }, []);

  return null;
}
