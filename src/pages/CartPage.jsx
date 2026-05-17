import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useTranslation } from '../utils/translations';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, MessageCircle, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import gsap from 'gsap';

const WHATSAPP_NUMBER = '+201153792996';

function formatPrice(n) { return Number(n).toFixed(2); }

export default function CartPage({ lang = 'en' }) {
  const isEn = lang === 'en';
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const t = useTranslation(lang);
  const headerRef = useRef(null);
  const itemsRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!itemsRef.current || cart.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(itemsRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
      );
    });
    return () => ctx.revert();
  }, [cart.length]);

  useEffect(() => {
    if (summaryRef.current && cart.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(summaryRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', delay: 0.3 }
        );
      });
      return () => ctx.revert();
    }
  }, [cart.length]);

  function handleCartOrder() {
    if (!cart?.length) return;
    const greeting = isEn ? 'Hello, I would like to order:' : 'اهلا و سهلا انا حابب اطلب من عندك الحاجات دي:';
    const lines = cart.map((it, i) => `${i + 1}. ${it.name}${it.selectedSize ? ` (Size: ${it.selectedSize})` : ''} — Qty: ${it.quantity} — EGP ${formatPrice(it.price)}`);
    const msg = [greeting, '', ...lines, '', `Total: EGP ${formatPrice(total)}`].join('\n');
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <main className={`min-h-screen bg-luxury-black py-12 sm:py-16 ${!isEn ? 'rtl' : ''}`}>
      <div className="container-luxury">
        <div ref={headerRef} className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-brand-400/20 rounded-full mb-6 bg-brand-400/5">
            <ShoppingCart size={12} className="text-brand-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-400">
              {isEn ? 'Shopping Cart' : 'سلة التسوق'}
            </span>
          </div>
          <h1 className="font-display text-fluid-3xl sm:text-fluid-4xl font-bold text-white mb-4 tracking-tight">{t.yourCart}</h1>
          <div className="gold-divider" />
          <p className="text-sm text-white/40 max-w-xl mx-auto mt-6">
            {isEn ? 'Review your items and order via WhatsApp' : 'راجع عناصرك وتقدم إلى الدفع عبر واتساب'}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-20 h-20 flex items-center justify-center border border-brand-400/20 rounded-xl mx-auto mb-6 bg-brand-400/5">
              <Package size={28} className="text-brand-400/50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.cartEmpty}</h3>
            <p className="text-sm text-white/40 mb-8">
              {isEn ? 'Start shopping to add items to your cart' : 'ابدأ التسوق لإضافة منتجات إلى سلتك'}
            </p>
            <Link to="/">
              <Button variant="outline" icon={<ArrowLeft size={14} />}>
                {isEn ? 'Continue Shopping' : 'متابعة التسوق'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div ref={itemsRef} className="card-luxury overflow-hidden divide-y divide-brand-400/10">
              <div className="p-4 sm:p-5 bg-luxury-dark/50 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70">
                  {isEn ? 'Order Items' : 'عناصر الطلب'}
                </h3>
                <span className="text-xs text-white/40">
                  {cart.length} {isEn ? 'item' : 'منتج'}{cart.length > 1 ? 's' : ''}
                </span>
              </div>

              {cart.map((item) => {
                const key = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id;
                return (
                  <div key={key} className="p-4 sm:p-5 hover:bg-luxury-dark/30 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-brand-400/10 bg-luxury-dark">
                        <img src={item.image || '/images/placeholder.jpg'} alt={item.name}
                          className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-white mb-1 truncate">{item.name}</h4>
                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {item.selectedSize && (
                            <span className="text-[10px] px-2 py-0.5 border border-brand-400/30 text-brand-400 rounded">
                              {item.selectedSize}
                            </span>
                          )}
                          {item.category && (
                            <span className="text-[10px] px-2 py-0.5 border border-white/20 text-white/40 rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-white">EGP {formatPrice(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedSize)}
                          className="w-7 h-7 flex items-center justify-center border border-brand-400/20 rounded hover:border-brand-400/40 hover:text-brand-400 transition-all text-white/60">
                          <Minus size={10} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                          className="w-7 h-7 flex items-center justify-center border border-brand-400/20 rounded hover:border-brand-400/40 hover:text-brand-400 transition-all text-white/60">
                          <Plus size={10} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">EGP {formatPrice(item.price * item.quantity)}</div>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.selectedSize)}
                        className="w-7 h-7 flex items-center justify-center border border-brand-400/20 rounded hover:border-red-400/40 hover:text-red-400 transition-all flex-shrink-0 text-white/40"
                        aria-label="Remove">
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div ref={summaryRef} className="card-luxury p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                <div>
                  <div className="text-xs text-white/40 mb-1">
                    {isEn ? 'Total Amount' : 'المبلغ الإجمالي'}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-brand-400">
                    EGP {formatPrice(total)}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={clearCart}
                    className="px-6 py-3 border border-brand-400/20 rounded-lg text-xs font-medium text-white/50 hover:border-brand-400/40 hover:text-white transition-all duration-200">
                    {t.clear}
                  </button>
                  <button onClick={handleCartOrder}
                    className="btn-gold">
                    <MessageCircle size={14} />
                    {t.orderNow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
