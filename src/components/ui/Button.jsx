// Composant partagé (Rama). Variantes : primary, secondary, dark, danger
export default function Button({ variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-elikia text-white hover:bg-elikia-dark',
    secondary: 'bg-white text-ink border border-line hover:bg-slate-50',
    dark: 'bg-navy text-white hover:bg-navy-soft',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
