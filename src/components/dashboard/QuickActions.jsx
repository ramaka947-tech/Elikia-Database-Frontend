// Raccourcis du tableau de bord. Les actions admin ne s'affichent qu'aux ADMIN.
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function QuickActions() {
  const { isAdmin } = useAuth();

  const actions = [
    { to: '/entreprises', label: 'Parcourir le répertoire', icon: Building2 },
    ...(isAdmin
      ? [
          { to: '/entreprises/nouveau', label: 'Ajouter une entreprise', icon: PlusCircle },
          { to: '/admin/import', label: 'Importer un CSV', icon: Upload },
        ]
      : []),
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="flex items-center gap-3 bg-white rounded-xl shadow p-4 hover:bg-elikia-light transition"
        >
          <span className="w-10 h-10 rounded-full bg-elikia text-white flex items-center justify-center">
            <Icon size={20} />
          </span>
          <span className="font-medium text-ink">{label}</span>
        </Link>
      ))}
    </div>
  );
}