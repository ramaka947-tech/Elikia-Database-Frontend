// Fenêtre de création / modification d'une liste (Rama, P1)
// list = null -> création ; list = { id, name, description } -> modification
import { useEffect, useState } from 'react';
import { FolderPlus, FolderPen } from 'lucide-react';
import api from '../../api/client';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const MAX = 200;
const NAME_MAX = 80;

// Nom de liste : 2 à 80 caractères, avec au moins une lettre (les chiffres sont acceptés : « Prospects 2026 »)
function checkListName(value) {
  const v = value.trim();
  if (!v) return 'Le nom de la liste est obligatoire.';
  if (v.length < 2) return 'Le nom de la liste doit contenir au moins 2 caractères.';
  if (!/\p{L}/u.test(v)) return 'Le nom de la liste doit contenir au moins une lettre.';
  return null;
}

export default function ListFormModal({ open, onClose, list = null, onSaved }) {
  const editing = Boolean(list);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(list?.name || '');
      setDescription(list?.description || '');
      setError('');
    }
  }, [open, list]);

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = checkListName(name);
    if (problem) return setError(problem);
    setSaving(true);
    setError('');
    try {
      const body = { name, description };
      const { data } = editing ? await api.patch(`/lists/${list.id}`, body) : await api.post('/lists', body);
      onSaved(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={editing ? FolderPen : FolderPlus}
      title={editing ? 'Modifier la liste' : 'Créer une nouvelle liste'}
      description={editing ? 'Les entreprises de la liste ne seront pas modifiées.' : 'Organisez vos entreprises selon vos besoins (prospects, partenaires, secteur, etc.).'}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Nom de la liste <span className="text-red-500">*</span></span>
          <input
            autoFocus
            value={name}
            onChange={(e) => { setName(e.target.value.replace(/\s{2,}/g, ' ').slice(0, NAME_MAX)); setError(''); }}
            maxLength={NAME_MAX}
            placeholder="Ex. Partenaires potentiels"
            className="w-full h-12 px-4 rounded-xl border border-line text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
          />
          <span className="block text-right text-xs text-slate-400 mt-1">{name.length} / {NAME_MAX}</span>
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Description (facultative)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX))}
            rows={3}
            placeholder="Ex. Entreprises du secteur Tech à contacter."
            className="w-full px-4 py-3 rounded-xl border border-line text-sm resize-none focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
          />
          <span className="block text-right text-xs text-slate-400 mt-1">{description.length} / {MAX}</span>
        </label>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="h-12">Annuler</Button>
          <Button type="submit" disabled={saving} className="h-12">
            {saving ? 'Enregistrement...' : editing ? 'Enregistrer' : 'Créer la liste'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
