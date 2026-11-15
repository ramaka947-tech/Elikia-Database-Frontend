# Répertoire — notes d’intégration

La page `src/pages/Repertoire.jsx` consomme le client Axios partagé `src/api/client.js` et n'ajoute aucune dépendance.

## Routes utilisées
- `GET /companies` avec `q`, `sector`, `region`, `city`, `legal_form`, `estimated_size`, `status`, `page` et `limit`.
- `GET /companies/export` avec les mêmes filtres (et `ids` lorsqu'une sélection est exportée), attendu en réponse CSV.

La page accepte une réponse liste simple (`[]`) ou paginée (`{ results, count }`, `{ items, total }`, `{ companies, total }`, ou `{ data: [...] }`).

Si `/companies/export` n'est pas encore disponible, un export CSV local est généré à partir des entreprises récupérées par la recherche. Pour exporter toute la sélection filtrée, l'API `GET /companies` doit accepter un `limit` élevé ou la route d'export doit être implémentée côté backend.

## Fichiers ajoutés
- `components/repertoire/SearchBar.jsx`
- `components/repertoire/FilterPanel.jsx`
- `components/repertoire/CompanyTable.jsx`
- `components/repertoire/Pagination.jsx`
- `components/repertoire/ExportButton.jsx`

Les autres pages, routes, composants partagés et la configuration du projet ne sont pas modifiés.
