// Bouton "Exporter CSV (n)" : la sélection si des lignes sont cochées, sinon tous les résultats filtrés
import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import { exportCompanies, getErrorMessage } from './api';

export default function ExportButton({ filters, total, selectedIds = [], onResult }) {
  const [exporting, setExporting] = useState(false);
  const count = selectedIds.length || total;

  async function handleExport() {
    setExporting(true);
    try {
      await exportCompanies(filters, selectedIds);
      onResult({ type: 'success', message: `Export CSV téléchargé (${count} entreprise${count > 1 ? 's' : ''}).` });
    } catch (err) {
      onResult({ type: 'error', message: `Export impossible : ${getErrorMessage(err)}` });
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button type="button" variant="dark" onClick={handleExport} disabled={exporting || total === 0}>
      {exporting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Download size={16} aria-hidden="true" />}
      {exporting ? 'Export…' : `Exporter CSV${count > 0 ? ` (${count})` : ''}`}
    </Button>
  );
}
