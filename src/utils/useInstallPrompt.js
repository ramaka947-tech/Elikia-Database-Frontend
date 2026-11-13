// Installation de l'application (PWA) (Rama)
// const { canInstall, isIOS, installed, install } = useInstallPrompt();
//  - canInstall : Chrome / Edge / Android proposent l'installation -> install() ouvre la fenêtre du navigateur
//  - isIOS      : iPhone / iPad (Safari n'a pas de bouton d'installation) -> on affiche la marche à suivre
// L'événement du navigateur est capté dès le chargement du site (il n'arrive qu'une fois),
// même si le bouton s'affiche plus tard (après la connexion par exemple).
import { useEffect, useState } from 'react';

let deferred = null;
const subscribers = new Set();
const notify = () => subscribers.forEach((fn) => fn());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function detectIOS() {
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (ua.includes('Macintosh') && window.navigator.maxTouchPoints > 1);
}

export default function useInstallPrompt() {
  const [, refresh] = useState(0);

  useEffect(() => {
    const fn = () => refresh((n) => n + 1);
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }, []);

  const installed = isStandalone();

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    notify();
  }

  return {
    installed,
    canInstall: !installed && Boolean(deferred),
    isIOS: !installed && detectIOS(),
    install,
  };
}
