// Accès direct à la recherche : redirige vers /entreprises?q=...
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function QuickSearch() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    navigate(q.trim() ? `/entreprises?q=${encodeURIComponent(q.trim())}` : '/entreprises');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row gap-3 sm:items-end">
      <div className="flex-1">
        <Input
          label="Rechercher une entreprise"
          placeholder="Nom, dirigeant, secteur, ville, NINEA, RCCM..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <Button type="submit">Rechercher</Button>
    </form>
  );
}
