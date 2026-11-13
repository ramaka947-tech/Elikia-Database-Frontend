// Responsable : Sophiatou
// Appel API : POST /import (FormData avec le champ 'file')
// Le titre de la page est déjà affiché dans la barre du haut (Topbar).
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../api/client';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import FileDropzone from '../components/import/FileDropzone';
import ImportResult from '../components/import/ImportResult';
import TemplateDownload from '../components/import/TemplateDownload';

export default function Import() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function handleImport() {
    // Le nom du champ doit être exactement "file" : c'est ce que le back attend
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.post('/import', formData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "L'import a échoué. Vérifiez le fichier et réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/entreprises" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-elikia">
        <ArrowLeft size={16} /> Retour au répertoire
      </Link>

      <Card title="Importer des entreprises" action={<TemplateDownload />}>
        <p className="mb-4 text-sm text-slate-600">
          Choisissez un fichier CSV respectant le modèle. Les doublons sont ignorés et les
          lignes invalides sont listées ci-dessous.
        </p>
        <FileDropzone file={file} onChange={setFile} />
        <Button className="mt-4" onClick={handleImport} disabled={!file || loading}>
          {loading ? 'Import en cours...' : 'Lancer l\'import'}
        </Button>
      </Card>

      {error && <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {result && <ImportResult result={result} />}
    </div>
  );
}