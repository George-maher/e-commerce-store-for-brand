import { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import gsap from 'gsap';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: { bg: 'bg-green-500/10 border-green-500/30 text-green-400', icon: 'text-green-400' },
  error: { bg: 'bg-red-500/10 border-red-500/30 text-red-400', icon: 'text-red-400' },
  warning: { bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400', icon: 'text-amber-400' },
  info: { bg: 'bg-brand-400/10 border-brand-400/30 text-brand-400', icon: 'text-brand-400' },
};

export function ToastContainer({ toasts, onRemove }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || toasts.length === 0) return;
    const latest = containerRef.current.lastElementChild;
    if (!latest) return;
    gsap.fromTo(latest,
      { opacity: 0, x: 50, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
    );
  }, [toasts.length]);

  return (
    <div ref={containerRef}
      className="fixed top-20 right-4 sm:right-6 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        const colors_ = colors[toast.type] || colors.info;
        return (
          <div key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border backdrop-blur-glass ${colors_.bg} shadow-elevation-3`}>
            <Icon size={16} className={`flex-shrink-0 mt-0.5 ${colors_.icon}`} />
            <p className="text-xs font-medium flex-1">{toast.message}</p>
            <button onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
