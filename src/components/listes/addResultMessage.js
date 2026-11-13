// Message de confirmation après un ajout à une liste (Rama, P1)
export function addResultToast({ listName, added, alreadyInList }) {
  if (added === 0) {
    return { type: 'success', title: 'Déjà dans la liste', text: `Ces entreprises sont déjà dans « ${listName} ».` };
  }
  const title = `${added} entreprise${added > 1 ? 's' : ''} ajoutée${added > 1 ? 's' : ''}`;
  const extra = alreadyInList > 0 ? ` (${alreadyInList} déjà présente${alreadyInList > 1 ? 's' : ''})` : '';
  return { type: 'success', title, text: `Ajoutée${added > 1 ? 's' : ''} à la liste « ${listName} »${extra}.` };
}
