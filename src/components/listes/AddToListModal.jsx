// Fenêtre « Ajouter à une liste » (Rama, P1)
// Réutilisable depuis le Répertoire (sélection multiple), la Fiche et Mes listes :
//   <AddToListModal open={open} onClose={...} companyIds={['id1', 'id2']} onDone={(result) => ...} />
// result = { listId, listName, added, alreadyInList }
import { useEffect, useState } from 'react';
import { FolderPlus, Folder, Plus } from 'lucide-react';
import api from '../../api/client';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function AddToListModal({ open, onClose, companyIds = [], excludeListId = null, onDone }) {
  const [lists, setLists] = useState([]);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setCreating(false);
    setNewName('');
    setSelected(null);
    setLoading(true);
    api.get('/lists')
      .then(({ data }) => {
        const available = data.filter((l) => l.id !== excludeListId);
        setLists(available);
        if (available.length === 0) setCreating(true);
      })
      .catch(() => setError('Impossible de charger vos listes'))
      .finally(() => setLoading(false));
  }, [open, excludeListId]);

  async function createList() {
    if (!newName.trim()) return;
    setError('');
    try {
      const { data } = await api.post('/lists', { name: newName });
      setLists([data, ...lists]);
      setSelected(data.id);
      setCreating(false);
      setNewName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Création impossible');
    }
  }

  async function handleAdd() {
    if (!selected) return setError('Choisissez une liste');
    setSaving(true);
    setError('');
    try {
      const { data } = await api.post(`/lists/${selected}/companies`, { companyIds });
      const list = lists.find((l) => l.id === selected);
      onDone?.({ listId: selected, listName: list?.name, ...data });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Ajout impossible');
    } finally {
      setSaving(false);
    }
  }

  const n = companyIds.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={FolderPlus}
      title="Ajouter à une liste"
      description={`${n} entreprise${n > 1 ? 's' : ''} sélectionnée${n > 1 ? 's' : ''}`}
      size="sm"
    >
      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : (
        <>
          <ul className="space-y-1 max-h-64 overflow-y-auto -mx-2">
            {lists.map((l) => (
              <li key={l.id}>
                <label className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer ${selected === l.id ? 'bg-elikia-light' : 'hover:bg-slate-50'}`}>
                  <input type="radio" name="liste" checked={selected === l.id} onChange={() => setSelected(l.id)} className="w-4 h-4 accent-[#0a6b47]" />
                  <Folder size={18} className="text-elikia shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-sm font-medium text-ink">{l.name}</span>
                  <span className="text-sm text-slate-400">({l.count})</span>
                </label>
              </li>
            ))}
          </ul>

          {creating ? (
            <div className="mt-3 flex gap-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), createList())}
                maxLength={80}
                placeholder="Nom de la nouvelle liste"
                className="flex-1 min-w-0 h-11 px-4 rounded-xl border border-line text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
              />
              <Button type="button" onClick={createList} className="h-11 rounded-xl">Créer</Button>
            </div>
          ) : (
            <button type="button" onClick={() => setCreating(true)} className="mt-3 flex items-center gap-2 px-1 text-sm font-medium text-elikia hover:underline">
              <Plus size={18} /> Créer une nouvelle liste
            </button>
          )}

          {error && <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={onClose} className="h-12">Annuler</Button>
            <Button onClick={handleAdd} disabled={saving || !selected || n === 0} className="h-12">
              {saving ? 'Ajout...' : `Ajouter (${n})`}
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
