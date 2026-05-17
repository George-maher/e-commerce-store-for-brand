export default function Card({ children, className = '', hover = true, glass = false, ...props }) {
  const base = glass ? 'card-glass' : 'card-luxury';
  const hoverEffect = hover ? 'hover:-translate-y-0.5' : '';
  return (
    <div className={`${base} ${hoverEffect} ${className}`} {...props}>
      {children}
    </div>
  );
}
