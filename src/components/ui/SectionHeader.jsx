export default function SectionHeader({ badge, title, description, align = 'center', className = '' }) {
  const alignClasses = {
    center: 'text-center',
    left: 'text-left',
  };
  return (
    <div className={`mb-12 sm:mb-16 ${alignClasses[align]} ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-4 py-2 border border-brand-400/20 rounded-full mb-6 bg-brand-400/5 ${align === 'left' ? '' : 'mx-auto'}`}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-400">{badge}</span>
        </div>
      )}
      {title && (
        <h2 className={`font-display text-fluid-3xl sm:text-fluid-4xl font-bold text-white mb-4 tracking-tight text-balance ${align === 'left' ? '' : 'mx-auto max-w-3xl'}`}>
          {title}
        </h2>
      )}
      <div className={`gold-divider ${align === 'left' ? 'ml-0' : ''}`} />
      {description && (
        <p className={`text-sm sm:text-base text-white/40 mt-6 leading-relaxed max-w-2xl ${align === 'left' ? '' : 'mx-auto'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
