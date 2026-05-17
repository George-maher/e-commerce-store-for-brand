import { forwardRef } from 'react';

const variants = {
  gold: 'btn-gold',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold tracking-wide rounded-lg hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-200',
};

const sizes = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-2.5 text-xs',
  lg: 'px-8 py-3 text-sm',
};

const Button = forwardRef(({ variant = 'gold', size = 'lg', icon, children, className = '', ...props }, ref) => (
  <button ref={ref} className={`${variants[variant]} ${sizes[size]} ${className}`} {...props}>
    {icon && <span className="flex-shrink-0">{icon}</span>}
    {children}
  </button>
));

Button.displayName = 'Button';
export default Button;
