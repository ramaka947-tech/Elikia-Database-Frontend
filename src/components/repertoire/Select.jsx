// Liste déroulante avec petit libellé au-dessus (propre au Répertoire)
export default function Select({ label, value, onChange, options, placeholder, disabled = false }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-slate-600 mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-elikia/40 focus:border-elikia disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value}>{opt.label}</option>;
        })}
      </select>
    </label>
  );
}
