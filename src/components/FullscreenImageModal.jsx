import { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FullscreenImageModal({ isOpen, onClose, images, currentIndex, onImageChange, productName }) {
  const [idx, setIdx] = useState(currentIndex);
  const prev = useCallback(() => { const n = idx === 0 ? images.length - 1 : idx - 1; setIdx(n); onImageChange(n); }, [idx, images.length, onImageChange]);
  const next = useCallback(() => { const n = idx === images.length - 1 ? 0 : idx + 1; setIdx(n); onImageChange(n); }, [idx, images.length, onImageChange]);
  useEffect(() => { setIdx(currentIndex); }, [currentIndex]);
  useEffect(() => {
    const h = (e) => { if (!isOpen) return; if (e.key === 'Escape') onClose(); if (e.key === 'ArrowLeft') prev(); if (e.key === 'ArrowRight') next(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isOpen, prev, next, onClose]);
  if (!isOpen) return null;
  const img = images[idx] || images[0];
  const src = (i) => i?.startsWith('http') ? i : i?.startsWith('/images/') ? i : `/images/${i}`;
  return (
    <div className="fixed inset-0 z-50 bg-luxury-black/98 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-luxury-black/80 border border-white/10 rounded-lg text-white hover:border-gold-400 hover:text-gold-400 transition-all"><X size={18} /></button>
      <div className="relative max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-center">
        {images.length > 1 && <>
          <button onClick={prev} className="absolute left-4 w-10 h-10 flex items-center justify-center bg-luxury-black/80 border border-white/10 rounded-lg text-white hover:border-gold-400 hover:text-gold-400 transition-all"><ChevronLeft size={18} /></button>
          <button onClick={next} className="absolute right-4 w-10 h-10 flex items-center justify-center bg-luxury-black/80 border border-white/10 rounded-lg text-white hover:border-gold-400 hover:text-gold-400 transition-all"><ChevronRight size={18} /></button>
        </>}
        <div className="flex items-center justify-center w-full h-full py-16"><img src={src(img)} alt={`${productName} - ${idx+1}`} className="max-w-full max-h-full object-contain" /></div>
        {images.length > 1 && <div className="absolute bottom-4 left-4 bg-luxury-black/80 border border-white/10 text-white px-3 py-1.5 rounded text-[10px] font-medium">{idx+1} / {images.length}</div>}
      </div>
      {images.length > 1 && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-luxury-black/80 border border-white/10 p-2 rounded-xl">
        {images.map((im, i) => (
          <button key={i} onClick={() => { setIdx(i); onImageChange(i); }}
            className={`rounded-lg overflow-hidden border transition-all ${i === idx ? 'border-gold-400 scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}>
            <img src={src(im)} alt={`Thumb ${i+1}`} className="w-10 h-10 object-cover" />
          </button>
        ))}
      </div>}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
