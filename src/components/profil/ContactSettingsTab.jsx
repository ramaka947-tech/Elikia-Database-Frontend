// Onglet « Coordonnées » (ADMIN) : email, téléphone et réseaux sociaux affichés dans le pied de page
// de l'accueil. Un champ laissé vide n'apparaît pas sur le site. Responsable : Rama
import { useEffect, useState } from 'react';
import { Phone, Mail, Linkedin, Facebook, Instagram, Save, Info } from 'lucide-react';
import api from '../../api/client';
import { loadSiteSettings, setSiteSettings } from '../../utils/useSiteSettings';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import SectionHeader from './SectionHeader';

const empty = { contact_email: '', contact_phone: '', linkedin_url: '', facebook_url: '', instagram_url: '' };

export default function ContactSettingsTab({ onToast }) {
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSiteSettings(true).then((data) => {
      const values = Object.fromEntries(Object.keys(empty).map((k) => [k, data?.[k] || '']));
      setForm(values);
      setSaved(values);
    });
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const changed = Object.keys(empty).some((k) => form[k] !== saved[k]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.put('/settings', form);
      setSiteSettings(data);
      setSaved(data);
      setForm(data);
      onToast({ type: 'success', title: 'Coordonnées enregistrées', text: 'Le pied de page du site est à jour.' });
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <SectionHeader icon={Phone} title="Coordonnées du site" text="Ces informations s'affichent dans le pied de page de l'accueil." />

      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Email de contact" icon={Mail} type="email" placeholder="contact@exemple.sn" value={form.contact_email} onChange={set('contact_email')} />
          <Input label="Téléphone" icon={Phone} type="tel" placeholder="+221 ..." value={form.contact_phone} onChange={set('contact_phone')} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="LinkedIn" icon={Linkedin} placeholder="https://..." value={form.linkedin_url} onChange={set('linkedin_url')} />
          <Input label="Facebook" icon={Facebook} placeholder="https://..." value={form.facebook_url} onChange={set('facebook_url')} />
          <Input label="Instagram" icon={Instagram} placeholder="https://..." value={form.instagram_url} onChange={set('instagram_url')} />
        </div>

        <p className="flex items-start gap-3 text-sm rounded-xl px-4 py-3 bg-elikia-light text-elikia-dark">
          <Info size={18} className="shrink-0 mt-0.5" />
          Laissez un champ vide pour ne pas l'afficher sur le site.
        </p>
        {error && <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-600">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => setForm(saved)} disabled={!changed}>Annuler</Button>
          <Button type="submit" disabled={!changed || saving}>
            <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
