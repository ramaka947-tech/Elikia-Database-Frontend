// Composant partagé (Rama)
// Ex : <Input label="Email" icon={Mail} type="email" />
// Pour un mot de passe, l'œil pour afficher / masquer apparaît automatiquement.
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, icon: Icon, type = 'text', className = '', ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>}
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input
          type={isPassword && visible ? 'text' : type}
          className={`w-full h-12 rounded-xl border border-line bg-white text-sm placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia
            ${Icon ? 'pl-11' : 'pl-4'} ${isPassword ? 'pr-12' : 'pr-4'} ${className}`}
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
    </label>
  );
}
