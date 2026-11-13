// Composant partagé (Rama) : badge du niveau de confiance d'une fiche
// Ex : <ConfidenceBadge score={company.confidence_score} />
import Badge from './Badge';

export default function ConfidenceBadge({ score }) {
  if (score === null || score === undefined) return <Badge color="gray">Non évalué</Badge>;
  if (score >= 80) return <Badge color="green">Vérifié {score} %</Badge>;
  if (score >= 50) return <Badge color="gold">Estimé {score} %</Badge>;
  return <Badge color="red">À vérifier {score} %</Badge>;
}
