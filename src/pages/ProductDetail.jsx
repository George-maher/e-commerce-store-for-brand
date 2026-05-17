import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useCart } from '../components/CartContext';
import { useToast } from '../components/ToastProvider';
import { useTranslation } from '../utils/translations';
import ImageGallery from '../components/ImageGallery';
import RelatedProducts from '../components/RelatedProducts';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import { ShoppingCart, Package, Heart, Share2, Star, Truck, Shield, RefreshCw, ArrowLeft, Check, Minus, Plus } from 'lucide-react';
import gsap from 'gsap';

export default function ProductDetail({ lang }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();
  const t = useTranslation(lang);
  const isEn = lang === 'en';
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState(id ? '' : 'Product ID not provided');
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const infoRef = useRef(null);
  const pageRef = useRef(null);
  const ctaRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, 'products', id), (docSnapshot) => {
      if (docSnapshot.exists()) { setProduct({ id: docSnapshot.id, ...docSnapshot.data() }); setError(null); }
      else { setError('Product not found'); }
      setLoading(false);
    }, () => { setError('Failed to load product'); setLoading(false); });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (pageRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(pageRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      });
      return () => ctx.revert();
    }
  }, [product]);

  useEffect(() => {
    if (product && infoRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.5 } });
        tl.fromTo(infoRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.06 }
        );
      });
      return () => ctx.revert();
    }
  }, [product]);

  useEffect(() => {
    if (featuresRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(featuresRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out',
            scrollTrigger: { trigger: featuresRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });
      return () => ctx.revert();
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error(isEn ? 'Please select a size' : 'يرجى اختيار مقاس');
      return;
    }
    for (let i = 0; i < quantity; i++) addToCart({ ...product, selectedSize: selectedSize || null });
    setAddedToCart(true);
    toast.success(isEn ? 'Added to cart!' : 'تمت الإضافة للسلة!');
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current,
        { scale: 1 },
        { scale: [1, 0.95, 1], duration: 0.3, ease: 'power2.out' }
      );
    }
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const productImages = product?.images || [product?.image].filter(Boolean) || [];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-white/30 uppercase tracking-widest">Loading</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 flex items-center justify-center border border-brand-400/20 rounded-xl mx-auto mb-5 bg-brand-400/5">
            <Package size={28} className="text-brand-400/50" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white mb-2">{isEn ? 'Product not found' : 'المنتج غير موجود'}</h2>
          <p className="text-sm text-white/40 mb-8">{error || t.productDoesNotExist}</p>
          <Button variant="outline" icon={<ArrowLeft size={14} />} onClick={() => navigate(-1)}>
            {t.goBack}
          </Button>
        </div>
      </main>
    );
  }

  const hasOffer = product.discount || product.salePrice;
  const displayPrice = hasOffer ? product.salePrice : product.price;
  const originalPrice = hasOffer ? product.price : null;

  return (
    <main ref={pageRef} className="min-h-screen bg-luxury-black pt-6 sm:pt-8">
      <div className="container-luxury pb-8 sm:pb-16">
        <nav className="flex items-center gap-2 text-xs text-white/40 mb-8 sm:mb-10">
          <button onClick={() => navigate('/')} className="hover:text-brand-400 transition-colors">{t.home}</button>
          <span className="text-white/20">/</span>
          {product.category && (
            <>
              <span className="text-white/50">{product.category}</span>
              <span className="text-white/20">/</span>
            </>
          )}
          <span className="text-white/80 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ImageGallery images={productImages} selectedIndex={0} onImageSelect={() => {}} productName={product.name} />
          </div>

          <div ref={infoRef} className="space-y-6">
            <div>
              {product.category && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-400 mb-2">{product.category}</p>
              )}
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} className={(product.rating || 0) >= s ? 'text-brand-400 fill-brand-400' : 'text-white/20'} />
                  ))}
                </div>
                <span className="text-xs text-white/40">
                  {product.rating > 0 ? `${product.rating}.0` : 'NEW'}
                  {product.reviews > 0 && ` (${product.reviews})`}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-white">{Number(displayPrice).toFixed(2)} EGP</span>
                {originalPrice && (
                  <>
                    <span className="text-base sm:text-lg text-white/40 line-through">{Number(originalPrice).toFixed(2)} EGP</span>
                    <span className="text-[10px] font-semibold text-brand-400 bg-brand-400/10 border border-brand-400/30 px-2.5 py-1 rounded-full">
                      {t.save} {Number(originalPrice - displayPrice).toFixed(2)} EGP
                    </span>
                  </>
                )}
              </div>

              {hasOffer && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-400/10 border border-brand-400/30 text-brand-400 text-[10px] font-semibold uppercase tracking-widest rounded-full">
                  {t.sale} {product.discount && `${product.discount}% OFF`}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">{t.description}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{product.description || t.noDescription}</p>
            </div>

            <div className="space-y-4">
              {product.sizes?.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-3">
                    {isEn ? 'Select Size' : 'اختر المقاس'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-brand-400 border-brand-400 text-luxury-black scale-105 shadow-gold-sm'
                            : 'border-brand-400/20 text-white/50 hover:border-brand-400/40 hover:text-white'
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-white/70">{t.quantityLabel}</label>
                <div className="flex items-center border border-brand-400/20 rounded-lg overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-white/50 hover:text-brand-400 hover:bg-brand-400/10 transition-all text-sm"
                    disabled={quantity <= 1}>
                    <Minus size={14} />
                  </button>
                  <input type="number" value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center border-0 bg-transparent text-white text-sm font-medium outline-none" min="1" />
                  <button onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-white/50 hover:text-brand-400 hover:bg-brand-400/10 transition-all text-sm">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button ref={ctaRef} onClick={handleAddToCart} disabled={addedToCart}
                  className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                    addedToCart
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                      : 'btn-gold'
                  }`}>
                  {addedToCart ? (
                    <><Check size={14} className="animate-bounce-in" /> {t.addedToCart}</>
                  ) : (
                    <><ShoppingCart size={14} /> {t.addToCart}</>
                  )}
                </button>
                <button onClick={() => setIsWishlisted(!isWishlisted)}
                  className="px-4 py-3.5 border border-brand-400/20 rounded-lg hover:border-brand-400/40 transition-all duration-200"
                  aria-label="Wishlist">
                  <Heart size={16} className={isWishlisted ? 'text-brand-400 fill-brand-400' : 'text-white/40 hover:text-brand-400'} />
                </button>
                <button onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success(isEn ? 'Link copied!' : 'تم نسخ الرابط');
                }}
                  className="px-4 py-3.5 border border-brand-400/20 rounded-lg hover:border-brand-400/40 transition-all duration-200"
                  aria-label="Share">
                  <Share2 size={16} className="text-white/40 hover:text-brand-400 transition-colors" />
                </button>
              </div>
            </div>

            <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-5 border-t border-brand-400/10">
              {[
                { icon: Truck, text: t.freeShipping },
                { icon: Shield, text: t.securePayment },
                { icon: RefreshCw, text: t.easyReturns },
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/40">
                  <feat.icon size={14} className="text-brand-400/70" />
                  <span>{feat.text}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-400/10 pt-5 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70">{t.productDetails}</h3>
              <div className="space-y-1">
                {[
                  { label: t.sku, value: product.sku || product.id },
                  { label: t.category, value: product.category || t.uncategorized },
                ].map((d, i) => (
                  <div key={i} className="flex justify-between text-xs text-white/40">
                    <span>{d.label}</span>
                    <span className="text-white/80">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24">
          <RelatedProducts currentProductId={product.id} category={product.category} lang={lang} />
        </div>
      </div>
    </main>
  );
}
