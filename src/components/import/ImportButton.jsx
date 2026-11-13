// Bouton « Importer CSV » à placer dans la page Répertoire.
// Visible uniquement pour les ADMIN ; mène à la page dédiée /admin/import.
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function ImportButton() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <Button variant="secondary" onClick={() => navigate('/admin/import')}>
      <Upload size={16} /> Importer CSV
    </Button>
  );
}