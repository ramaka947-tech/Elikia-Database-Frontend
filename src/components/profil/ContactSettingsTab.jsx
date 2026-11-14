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
import {
  checkEmail, checkSenegalPhone, checkSocialUrl, normalizeSenegalPhone, formatSenegalPhone,
  filterDigits, filterEmail, LIMITS,
} from '../../utils/validation';

// Le téléphone est saisi sans l'indicatif (9 chiffres), puis enregistré sous la forme « +221 77 123 45 67 »
const toForm = (data) => ({
  ...Object.fromEntries(Object.keys(empty).map((k) => [k, data?.[k] || ''])),
  contact_phone: data?.contact_phone ? normalizeSenegalPhone(data.contact_phone) : '',
});

const empty = { contact_email: '', contact_phone: '', linkedin_url: '', facebook_url: '', instagram_url: '' };

export default function ContactSettingsTab({ onToast }) {
  const [form, setForm] = useState(empty);
  const [saved, setSaved] = useState(empty);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSiteSettings(true).then((data) => {
      const values = toForm(data);
      setForm(values);
      setSaved(values);
    });
  }, []);

  const filters = {
    contact_phone: (v) => filterDigits(v, 9),
    contact_email: filterEmail,
    linkedin_url: (v) => v.trim(),
    facebook_url: (v) => v.trim(),
    instagram_url: (v) => v.trim(),
  };
  const set = (field) => (e) => {
    setForm({ ...form, [field]: filters[field](e.target.value) });
    setErrors({ ...errors, [field]: null });
  };

  // Tous les champs sont facultatifs, mais un champ rempli doit être correct
  function validate() {
    const next = {
      contact_email: form.contact_email ? checkEmail(form.contact_email) : null,
      contact_phone: form.contact_phone ? checkSenegalPhone(form.contact_phone) : null,
      linkedin_url: checkSocialUrl('linkedin_url', form.linkedin_url),
      facebook_url: checkSocialUrl('facebook_url', form.facebook_url),
      instagram_url: checkSocialUrl('instagram_url', form.instagram_url),
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }
  const changed = Object.keys(empty).some((k) => form[k] !== saved[k]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { ...form, contact_phone: form.contact_phone ? formatSenegalPhone(form.contact_phone) : '' };
      const { data } = await api.put('/settings', payload);
      setSiteSettings(data);
      setSaved(toForm(data));
      setForm(toForm(data));
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

      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Email de contact" icon={Mail} type="email" placeholder="contact@exemple.sn" maxLength={LIMITS.email} value={form.contact_email} onChange={set('contact_email')} error={errors.contact_email} />
          <Input
            label="Téléphone"
            icon={Phone}
            prefix="+221"
            type="tel"
            inputMode="numeric"
            placeholder="77 123 45 67"
            maxLength={9}
            value={form.contact_phone}
            onChange={set('contact_phone')}
            error={errors.contact_phone}
            hint="9 chiffres, commençant par 70, 75, 76, 77, 78, 30 ou 33."
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="LinkedIn" icon={Linkedin} placeholder="https://www.linkedin.com/..." maxLength={200} value={form.linkedin_url} onChange={set('linkedin_url')} error={errors.linkedin_url} />
          <Input label="Facebook" icon={Facebook} placeholder="https://www.facebook.com/..." maxLength={200} value={form.facebook_url} onChange={set('facebook_url')} error={errors.facebook_url} />
          <Input label="Instagram" icon={Instagram} placeholder="https://www.instagram.com/..." maxLength={200} value={form.instagram_url} onChange={set('instagram_url')} error={errors.instagram_url} />
        </div>

        <p className="flex items-start gap-3 text-sm rounded-xl px-4 py-3 bg-elikia-light text-elikia-dark">
          <Info size={18} className="shrink-0 mt-0.5" />
          Laissez un champ vide pour ne pas l'afficher sur le site.
        </p>
        {error && <p className="text-sm rounded-xl px-4 py-3 bg-red-50 text-red-600">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => { setForm(saved); setErrors({}); }} disabled={!changed}>Annuler</Button>
          <Button type="submit" disabled={!changed || saving}>
            <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
