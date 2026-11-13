// Composant partagé (Rama)
export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>}
      <input
        className={`w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-elikia/40 focus:border-elikia ${className}`}
        {...props}
      />
    </label>
  );
}
