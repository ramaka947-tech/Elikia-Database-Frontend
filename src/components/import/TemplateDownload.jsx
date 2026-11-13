// Télécharge le modèle CSV (colonnes du cahier des charges, section 16)
import Button from '../ui/Button';

const COLUMNS = [
  'name', 'legal_name', 'ninea', 'rccm', 'legal_form', 'sector', 'sub_sector',
  'description', 'city', 'region', 'address', 'employee_range', 'revenue_range',
  'business_type', 'primary_contact_name', 'primary_contact_role', 'phone',
  'email', 'website', 'linkedin_url', 'status', 'source', 'verified_at',
  'confidence_score',
];

export default function TemplateDownload() {
  function download() {
    const blob = new Blob([COLUMNS.join(',') + '\n'], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modele-import-elikia.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <Button type="button" variant="secondary" onClick={download}>
      Télécharger le modèle CSV
    </Button>
  );
}
