import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useTranslation } from '../utils/translations';
import { ShoppingCart, Heart, Eye, Star, Zap, Sparkles, Check } from 'lucide-react';
import gsap from 'gsap';
import { useHoverTilt } from '../hooks/useAnimations';

export default function ProductCard({ product, lang }) {
  const { addToCart } = useCart();
  const t = useTranslation(lang);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const badgeRef = useRef(null);

  useHoverTilt(cardRef, { maxTilt: 5, scale: 1.01 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (imageLoaded && imageRef.current) {
      gsap.fromTo(imageRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [imageLoaded]);

  const getImageSrc = (p, idx = 0) => {
    if (p.images && p.images.length > 0 && p.images[idx]) return p.images[idx];
    if (p.image) return p.image.startsWith('http') ? p.image : p.image.startsWith('/images/') ? p.image : `/images/${p.image}`;
    return '/images/placeholder.jpg';
  };

  const hasDiscount = product.discount || product.salePrice;
  const displayPrice = hasDiscount ? product.salePrice : product.price;
  const originalPrice = hasDiscount ? product.price : null;
  const discountPct = product.discount || (originalPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    addToCart(product);
    if (cardRef.current) {
      gsap.fromTo(cardRef.current.querySelector('.add-btn'),
        { scale: 1 },
        { scale: [1, 0.95, 1], duration: 0.3, ease: 'power2.out' }
      );
    }
    setTimeout(() => setIsAddingToCart(false), 2000);
  };

  return (
    <Link to={`/product/${product.id}`} className="block group perspective-[1000px]">
      <div ref={cardRef}
        className="relative bg-luxury-black border border-brand-400/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-brand-400/30 hover:shadow-card-hover"
        style={{ transformStyle: 'preserve-3d' }}>

        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
            className="w-8 h-8 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm border border-white/10 rounded-lg hover:border-brand-400/40 transition-all duration-200"
            aria-label="Wishlist">
            <Heart size={12} className={`transition-all duration-200 ${isWishlisted ? 'text-brand-400 fill-brand-400' : 'text-white/60 hover:text-brand-400'}`} />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="w-8 h-8 flex items-center justify-center bg-luxury-black/80 backdrop-blur-sm border border-white/10 rounded-lg hover:border-brand-400/40 transition-all duration-200"
            aria-label="Quick view">
            <Eye size={12} className="text-white/60 hover:text-brand-400 transition-colors" />
          </button>
        </div>

        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {hasDiscount && discountPct > 0 && (
            <span ref={badgeRef}
              className="badge-discount inline-flex items-center gap-1">
              <Zap size={8} /> {discountPct}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-400/10 border border-brand-400/30 text-brand-400 text-[9px] font-semibold uppercase tracking-widest rounded-lg">
              <Sparkles size={8} /> NEW
            </span>
          )}
        </div>

        <div className="relative overflow-hidden bg-luxury-dark aspect-[3/4]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-gray/30 to-luxury-dark animate-pulse" />
          )}
          <img ref={imageRef} src={getImageSrc(product)} alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-0"
            loading="lazy" onLoad={() => setImageLoaded(true)} onError={() => setImageLoaded(true)} />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-4 space-y-2.5">
          {product.category && (
            <p className="text-[10px] font-medium uppercase tracking-widest text-brand-400/70">{product.category}</p>
          )}

          <h3 className="font-medium text-sm text-white line-clamp-2 group-hover:text-brand-400/90 transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={10} className={(product.rating || 0) >= s ? 'text-brand-400 fill-brand-400' : 'text-white/20'} />
            ))}
            <span className="text-[10px] text-white/40 ml-1">{product.rating > 0 ? `${product.rating}.0` : 'NEW'}</span>
          </div>

          {product.sizes?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map(size => (
                <span key={size}
                  className="text-[10px] px-2 py-0.5 border border-brand-400/20 text-white/40 rounded">
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] px-2 py-0.5 text-white/30">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{Number(displayPrice).toFixed(2)} EGP</span>
            {originalPrice && (
              <>
                <span className="text-xs text-white/40 line-through">{Number(originalPrice).toFixed(2)} EGP</span>
                <span className="text-[9px] font-semibold text-brand-400 bg-brand-400/10 border border-brand-400/30 px-1.5 py-0.5 rounded">-{discountPct}%</span>
              </>
            )}
          </div>

          <button onClick={handleAddToCart} disabled={isAddingToCart}
            className={`add-btn w-full py-2.5 px-4 rounded-lg text-[10px] font-semibold uppercase tracking-widest border transition-all duration-200 flex items-center justify-center gap-2 ${
              isAddingToCart
                ? 'bg-green-500/20 border-green-500/40 text-green-400'
                : 'bg-transparent border-brand-400/30 text-brand-400 hover:bg-brand-400 hover:text-luxury-black hover:shadow-gold-sm active:scale-[0.97]'
            }`}>
            {isAddingToCart ? (
              <><Check size={12} className="animate-bounce-in" /> ADDED!</>
            ) : (
              <><ShoppingCart size={12} /> {t.addToCart}</>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
