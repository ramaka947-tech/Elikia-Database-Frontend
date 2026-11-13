// Titre et phrase d'introduction de chaque page connectée (fichier partagé, géré par Rama)
// Affichés dans la barre du haut sur ordinateur, et en haut de la page sur téléphone (Layout),
// sauf si mobile: false (pages qui ont déjà leur propre en-tête, ex : détail d'une liste).
export function getPageTitle(pathname, isAdmin = false) {
  if (pathname === '/tableau-de-bord') return { title: 'Tableau de bord', text: "Vue d'ensemble de la base des entreprises." };
  if (pathname === '/entreprises') return { title: 'Répertoire des entreprises', text: 'Recherchez et filtrez les entreprises du Sénégal.' };
  if (pathname === '/entreprises/nouveau') return { title: 'Ajouter une entreprise', text: 'Créez une nouvelle fiche entreprise.' };
  if (pathname.endsWith('/modifier')) return { title: 'Modifier une entreprise', text: 'Mettez à jour les informations de la fiche.' };
  if (pathname.startsWith('/entreprises/')) return { title: 'Fiche entreprise', text: '', mobile: false };
  if (pathname === '/admin/import') return { title: 'Import CSV', text: 'Importez des entreprises depuis un fichier CSV.' };
  if (pathname === '/listes') return { title: 'Mes listes', text: 'Organisez vos entreprises, retrouvez-les facilement et exportez vos sélections.' };
  if (pathname.startsWith('/listes/')) return { title: 'Mes listes', text: '', mobile: false };
  if (pathname === '/admin/utilisateurs') return { title: 'Utilisateurs', text: 'Gérez les comptes des utilisateurs de la plateforme.' };
  if (pathname === '/messages') {
    return { title: 'Messages', text: isAdmin ? 'Les messages envoyés par les utilisateurs.' : "Échangez avec l'équipe Elikia Database." };
  }
  if (pathname.startsWith('/messages/')) return { title: 'Messages', text: '', mobile: false };
  if (pathname === '/profil') return { title: 'Mon compte', text: 'Gérez votre profil, vos paramètres et la sécurité de votre compte.' };
  return { title: '', text: '' };
}
