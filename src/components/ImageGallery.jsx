import { useState, useRef } from 'react';
import FullscreenImageModal from './FullscreenImageModal';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageGallery({ images, selectedIndex, onImageSelect, productName }) {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedIndex || 0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);

  if (!images?.length) {
    return <div className="bg-luxury-dark border border-gold-400/10 rounded-xl aspect-square flex items-center justify-center">
      <span className="text-xs text-luxury-white/30">NO IMAGE</span>
    </div>;
  }

  const current = images[currentImageIndex] || images[0];
  const getSrc = (img) => img?.startsWith('http') ? img : img?.startsWith('/images/') ? img : `/images/${img}`;

  return (
    <div className="space-y-3">
      <div className="relative group">
        {images.length > 1 && (
          <>
            <button onClick={() => { const i = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1; setCurrentImageIndex(i); onImageSelect(i); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-luxury-black/80 border border-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 hover:border-gold-400 hover:text-gold-400 transition-all z-10">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => { const i = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1; setCurrentImageIndex(i); onImageSelect(i); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-luxury-black/80 border border-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 hover:border-gold-400 hover:text-gold-400 transition-all z-10">
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-luxury-black/80 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ZoomIn size={14} className="text-white" />
        </div>

        <div ref={imgRef}
          className="relative overflow-hidden rounded-xl bg-luxury-dark border border-gold-400/10 aspect-square cursor-zoom-in"
          onMouseMove={(e) => { if (!isZooming || !imgRef.current) return; const r = imgRef.current.getBoundingClientRect(); setZoomPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
          onMouseEnter={() => setIsZooming(true)} onMouseLeave={() => { setIsZooming(false); setZoomPos({ x: 50, y: 50 }); }}
          onClick={() => setIsFullscreenOpen(true)}>
          <img src={getSrc(current)} alt={`${productName} - ${currentImageIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${isZooming ? 'scale-150' : 'scale-100'}`}
            style={{ transformOrigin: isZooming ? `${zoomPos.x}% ${zoomPos.y}%` : 'center' }} loading="lazy" />
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-luxury-black/80 border border-white/10 text-white px-2.5 py-1 rounded text-[10px] font-medium">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => { setCurrentImageIndex(i); onImageSelect(i); }}
              className={`flex-shrink-0 relative overflow-hidden rounded-lg border transition-all ${
                i === currentImageIndex ? 'border-gold-400 scale-105' : 'border-gold-400/10 opacity-60 hover:opacity-100'
              }`}>
              <img src={getSrc(img)} alt={`Thumbnail ${i + 1}`} className="w-14 h-14 object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <FullscreenImageModal isOpen={isFullscreenOpen} onClose={() => setIsFullscreenOpen(false)} images={images}
        currentIndex={currentImageIndex} onImageChange={setCurrentImageIndex} productName={productName} />
    </div>
  );
}
