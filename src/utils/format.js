// Petites fonctions d'affichage partagées (Rama)
export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

export const plural = (n, word, pluralWord = `${word}s`) => `${n} ${n > 1 ? pluralWord : word}`;
