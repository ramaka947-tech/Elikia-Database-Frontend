// Composant partagé (Rama)
// Ex : <Input label="Email" icon={Mail} type="email" error={errors.email} hint="..." />
// - error  : message en rouge sous le champ (bordure rouge)
// - hint   : aide en gris sous le champ (masquée quand il y a une erreur)
// - prefix : texte fixe avant la saisie (ex : "+221" pour un téléphone)
// Pour un mot de passe, l'œil pour afficher / masquer apparaît automatiquement.
import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, icon: Icon, type = 'text', className = '', error, hint, prefix, ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const id = useId();
  const messageId = `${id}-message`;
  const left = prefix ? (Icon ? 'pl-24' : 'pl-16') : Icon ? 'pl-11' : 'pl-4';

  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <div className="relative">
        {Icon && <Icon size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${error ? 'text-red-400' : 'text-slate-400'}`} />}
        {prefix && (
          <span className={`absolute top-1/2 -translate-y-1/2 text-sm font-medium text-ink pointer-events-none ${Icon ? 'left-11' : 'left-4'}`}>
            {prefix}
          </span>
        )}
        <input
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={`w-full h-12 rounded-xl border bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2
            ${error ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-line focus:ring-elikia/30 focus:border-elikia'}
            ${left} ${isPassword ? 'pr-12' : 'pr-4'} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-ink"
            aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <span id={messageId} className="block mt-1.5 text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span id={messageId} className="block mt-1.5 text-xs text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}
