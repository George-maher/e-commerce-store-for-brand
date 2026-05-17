export default function Badge({ variant = 'primary', children, className = '' }) {
  const variants = {
    primary: 'badge-primary',
    discount: 'badge-discount',
    new: 'inline-flex items-center gap-1 px-2.5 py-1 bg-brand-400/10 border border-brand-400/30 text-brand-400 text-[9px] font-semibold uppercase tracking-widest rounded-lg',
    sale: 'inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-400/10 border border-brand-400/30 text-brand-400 text-[10px] font-semibold uppercase tracking-widest rounded-full',
  };
  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}
