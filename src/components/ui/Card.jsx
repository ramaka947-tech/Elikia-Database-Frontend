// Composant partagé (Rama). Carte blanche arrondie pour regrouper du contenu.
// Ex : <Card title="Contacts">...</Card>
export default function Card({ title, action, className = '', children }) {
  return (
    <section className={`bg-white rounded-2xl border border-line p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-base font-semibold text-forest">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
