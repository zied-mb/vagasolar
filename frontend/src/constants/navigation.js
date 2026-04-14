/**
 * Navigation items used by Header (desktop + mobile nav).
 * Extracted from Header.jsx.
 */
export const NAV_ITEMS = [
  { id: 'home',         name: 'Accueil'      },
  { id: 'services',     name: 'Services'     },
  { id: 'about',        name: 'À Propos'     },
  { id: 'projects',     name: 'Projets'      },
  { id: 'testimonials', name: 'Témoignages'  },
  { id: 'contact',      name: 'Contact'      },
];

/** Section ids used for scroll-spy, in DOM order */
export const SECTION_IDS = NAV_ITEMS.map((item) => item.id);
