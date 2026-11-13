// Coordonnées du site + chiffres de l'accueil (Rama)
// const settings = useSiteSettings();  ->  { contact_email, contact_phone, linkedin_url, ..., stats: { companies, sectors } }
// Chargées une seule fois puis gardées en mémoire. En cas d'erreur, tout reste vide (rien d'inventé n'est affiché).
import { useEffect, useState } from 'react';
import api from '../api/client';

let cache = null;
let request = null;

export function loadSiteSettings(force = false) {
  if (force) { cache = null; request = null; }
  if (!request) {
    request = api.get('/settings')
      .then(({ data }) => (cache = data))
      .catch(() => (cache = {}));
  }
  return request;
}

// Après une modification par l'admin, on met à jour la copie en mémoire
export function setSiteSettings(data) {
  cache = { ...cache, ...data };
  request = Promise.resolve(cache);
}

export default function useSiteSettings() {
  const [settings, setSettings] = useState(cache || {});
  useEffect(() => {
    let alive = true;
    loadSiteSettings().then((data) => alive && setSettings(data));
    return () => { alive = false; };
  }, []);
  return settings;
}
