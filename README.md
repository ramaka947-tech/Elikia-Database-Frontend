# Elikia Database : Frontend

Interface de la plateforme Elikia Database : recherche et consultation des entreprises et entrepreneurs du Sénégal.
Parcours principal : **chercher, filtrer, consulter une fiche, administrer la donnée**.

L'API est dans un dépôt séparé : **elikia-backend** (le contrat de l'API est dans son README).

Livraison : **lundi**.

---

## Équipe et répartition

Chaque membre développe **sa fonctionnalité de bout en bout** : sa page dans ce dépôt, et sa route dans le dépôt backend.

| Membre | Fonctionnalité | Fichiers dans ce dépôt |
|---|---|---|
| **Rama KA** (lead) | Socle technique | `App.jsx`, `api/client.js`, `context/`, `components/layout/`, `components/ui/`, `index.css`, `pages/Login.jsx`, déploiement |
| **Assane Ndongue** | Répertoire | `pages/Repertoire.jsx`, `components/repertoire/` : recherche, filtres, liste, pagination, bouton export |
| **Abdoulaye BA** | Fiche + administration | `pages/Fiche.jsx`, `pages/CompanyForm.jsx`, `components/fiche/` : fiche détaillée, formulaire, archiver/supprimer |
| **Sophiatou Ndiaye** | Import + dashboard | `pages/Import.jsx`, `pages/Dashboard.jsx`, `components/import/`, `components/dashboard/` |

**Règle :** chacun ne modifie que ses propres fichiers et crée ses composants dans son dossier (ex : `components/repertoire/SearchBar.jsx`).

**Fichiers partagés (ne pas modifier sans prévenir Rama) :** `App.jsx`, `main.jsx`, `index.css`, `api/client.js`, `context/`, `components/layout/`, `components/ui/`, `package.json`, `vite.config.js`.

Toutes les pages sont déjà déclarées dans `App.jsx`. Chacun n'a qu'à remplir la sienne.

---

## Technologies

| Besoin | Outil |
|---|---|
| Framework | React + Vite |
| Navigation | React Router |
| Style | Tailwind CSS v4 |
| Icônes | lucide-react |
| Appels API | Axios (déjà configuré dans `api/client.js`) |
| Hébergement | Vercel |

---

## Organisation du code

```
src/
  main.jsx, App.jsx               Rama (partagé)
  index.css                       Rama (partagé : Tailwind + couleurs)
  api/client.js                   Rama (partagé : Axios + token)
  context/AuthContext.jsx         Rama (partagé)
  components/layout/              Rama (partagé : header, menu, protection des pages)
  components/ui/                  Rama (partagé : Button, Input, Badge)
  pages/Login.jsx                 Rama
  pages/Repertoire.jsx            Assane
  components/repertoire/          Assane
  pages/Fiche.jsx                 Abdoulaye
  pages/CompanyForm.jsx           Abdoulaye
  components/fiche/               Abdoulaye
  pages/Dashboard.jsx             Sophiatou
  pages/Import.jsx                Sophiatou
  components/import/              Sophiatou
  components/dashboard/           Sophiatou
```

### Pages

| URL | Page | Accès |
|---|---|---|
| `/login` | Connexion | public |
| `/` | Tableau de bord | connecté |
| `/entreprises` | Répertoire | connecté |
| `/entreprises/:id` | Fiche entreprise | connecté |
| `/entreprises/nouveau` | Création | ADMIN |
| `/entreprises/:id/modifier` | Modification | ADMIN |
| `/admin/import` | Import CSV | ADMIN |

---

## Appeler l'API

Toujours passer par `api/client.js` : le token est ajouté automatiquement.

```jsx
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const { data } = await api.get('/companies', { params: { q: 'sonatel', region: 'Dakar' } });

const { user, isAdmin } = useAuth();   // pour afficher les boutons admin
```

---

## Style : Tailwind CSS

Tailwind est **déjà installé et configuré**. On utilise **Tailwind v4** : il n'y a **pas** de fichier `tailwind.config.js` (les tutos qui en parlent sont pour l'ancienne version v3, ne pas en créer).

- Le style s'écrit **directement dans le JSX** avec `className`. Pas de fichiers `.css` par composant.
- Les couleurs Elikia sont définies une seule fois dans `src/index.css` :

| Classe | Couleur | Usage |
|---|---|---|
| `bg-elikia`, `text-elikia`, `border-elikia` | vert émeraude | boutons principaux, éléments actifs |
| `bg-elikia-dark` | vert foncé | survol des boutons |
| `bg-elikia-light` | vert très clair | badges "vérifié", fonds légers |
| `bg-navy`, `text-navy` | bleu nuit | sidebar, titres, fonds sombres |
| `bg-navy-soft` | bleu nuit plus clair | cartes sur fond sombre |
| `text-gold`, `bg-gold-light` | doré | petites touches d'accent, badges "estimé" |
| `text-ink` | gris très foncé | texte principal |
| `border-line` | gris clair | bordures des cartes et champs |

Polices : `font-serif` (DM Serif Display) pour les grands titres, le reste est en Inter par défaut.

Le layout (sidebar à gauche, barre du haut avec le titre de la page) est déjà en place : **ne pas remettre de grand titre en haut de vos pages**, il est affiché automatiquement dans la barre du haut.

Composants partagés disponibles dans `components/ui/` : `Button` (variantes `primary`, `secondary`, `dark`, `danger`), `Input`, `Badge` (couleurs `green`, `gold`, `red`, `gray`, `navy`), `Card` (carte blanche avec titre optionnel).

Icônes : `lucide-react` est installé. Ex : `import { Search } from 'lucide-react';` puis `<Search size={18} />`.

- Avant de créer un bouton, un champ ou un badge, **utiliser les composants de `components/ui/`** (`Button`, `Input`, `Badge`).
- Penser mobile : utiliser les préfixes `md:` et `lg:` (ex : `grid grid-cols-1 md:grid-cols-3`).
- Les informations estimées doivent se distinguer des informations vérifiées (ex : `<Badge color="gold">Estimé</Badge>` et `<Badge color="green">Vérifié</Badge>`).

```jsx
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

<Card title="Sonatel" action={<Badge color="green">Vérifié 92 %</Badge>}>
  <p className="text-sm text-slate-600">Télécommunications · Dakar</p>
  <Button className="mt-4">Voir la fiche</Button>
</Card>
```

Besoin d'une nouvelle couleur ou d'un nouveau composant partagé : demander à Rama.

---

## Installation

Le backend doit tourner en même temps (voir le README du dépôt **elikia-backend**).

```bash
git clone <URL_DU_DEPOT_FRONTEND>
cd elikia-frontend
git checkout develop
git checkout -b feat/ma-branche
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

### Variables d'environnement (`.env`)

| Variable | Valeur |
|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` |

Compte de test : **admin@elikia.sn / Admin123!**

---

## Branches Git

```
main        version stable, déployée. Personne ne pousse dessus directement.
develop     branche d'intégration. Toutes les pull requests arrivent ici.
feat/...    une branche par personne, créée depuis develop.
```

Branches : `feat/socle` (Rama), `feat/repertoire` (Assane), `feat/fiche-admin` (Abdoulaye), `feat/import-dashboard` (Sophiatou). Mêmes noms dans les deux dépôts.

### Workflow quotidien

```bash
git checkout develop
git pull origin develop
git checkout feat/ma-branche
git merge develop

# travailler, puis :
git add .
git commit -m "feat(repertoire): ajout de la barre de recherche"
git push origin feat/ma-branche
```

Ensuite, sur GitHub : **Pull Request de `feat/ma-branche` vers `develop`** (jamais vers `main`). Une autre personne relit, puis on merge. Rama merge `develop` vers `main` quand une version est stable.

Besoin d'une nouvelle librairie npm : prévenir Rama avant (conflits sur `package.json`).

---

## Planning

| Jour | Objectif |
|---|---|
| Vendredi | Chacun développe sa fonctionnalité (backend + frontend) et pousse une première version le soir |
| Samedi | Intégration sur `develop`, import des vraies données |
| Dimanche | Responsive mobile, corrections, déploiement, vidéo de démo, P1 si temps |
| Lundi | Démo |

Si on est en retard, on abandonne les fonctions P1 (listes/favoris, profil, journal) avant de bâcler les fonctions P0.

---

## Definition of Done

Un utilisateur peut se connecter, rechercher une entreprise, appliquer des filtres, ouvrir une fiche lisible. Un administrateur peut créer ou modifier une fiche, importer un CSV et exporter les résultats. L'application est déployée, responsive et stable.

---

## Bugs connus / améliorations

À compléter avant la livraison.
