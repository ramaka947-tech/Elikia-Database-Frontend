// Fenêtre « Nouvelle discussion » (clients). Responsable : Rama
import { useEffect, useState } from 'react';
import { MessageSquarePlus, Send } from 'lucide-react';
import api from '../../api/client';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function NewConversationModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ subject: '', body: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) { setForm({ subject: '', body: '' }); setError(''); }
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const { data } = await api.post('/messages/conversations', form);
      onCreated(data.id);
    } catch (err) {
      setError(err.response?.data?.message || "Envoi impossible.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} icon={MessageSquarePlus} title="Nouvelle discussion" description="Votre message sera lu par l'équipe Elikia Database.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Sujet *" placeholder="Ex : Information incorrecte sur une fiche" maxLength={150} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
        <label className="block">
          <span className="block text-sm font-medium text-ink mb-1.5">Message *</span>
          <textarea
            rows={5}
            maxLength={2000}
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Écrivez votre message..."
            required
            className="w-full rounded-xl border border-line bg-white p-4 text-sm placeholder:text-slate-400 resize-y focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
          />
        </label>
        {error && <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-600">{error}</p>}
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="h-12">Annuler</Button>
          <Button type="submit" disabled={sending || !form.subject.trim() || !form.body.trim()} className="h-12">
            <Send size={16} /> {sending ? 'Envoi...' : 'Envoyer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
