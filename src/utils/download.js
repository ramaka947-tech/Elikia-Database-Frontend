// Téléchargement d'un fichier protégé par le token (ex : export Excel). Responsable : Rama
import api from '../api/client';

export async function downloadFile(url, fallbackName = 'export.xlsx') {
  const res = await api.get(url, { responseType: 'blob' });
  const disposition = res.headers['content-disposition'] || '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(res.data);
  link.download = match ? match[1] : fallbackName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}
