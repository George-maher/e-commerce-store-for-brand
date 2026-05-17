import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import OffersSlider from '../components/OffersSlider';
import { useTranslation } from '../utils/translations';
import { Search, Sparkles, Zap, Heart, Package, Filter, SlidersHorizontal } from 'lucide-react';
import gsap from 'gsap';
import { useGsapStagger, useGsapFadeIn } from '../hooks/useAnimations';

export default function Home({ lang }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const headerRef = useRef(null);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);

  const CATEGORIES = [
    { key: 'All', label: isEn ? 'All' : 'الكل' },
    { key: 'Sweat pants', label: isEn ? 'Pants' : 'بنطلونات' },
    { key: 'T-shirts', label: isEn ? 'Tees' : 'تيشيرتات' },
  ];

  useEffect(() => {
    let m = true;
    const u = onSnapshot(
      collection(db, 'products'),
      (s) => { if (m) { setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))); setIsLoading(false); } },
      () => { if (m) { setProducts([]); setIsLoading(false); } }
    );
    return () => { m = false; u(); };
  }, []);

  useGsapStagger(headerRef, { scrollTrigger: { start: 'top 80%' } });
  useGsapStagger(featuresRef, { scrollTrigger: { start: 'top 85%' } });

  useEffect(() => {
    if (productsRef.current && !isLoading) {
      const ctx = gsap.context(() => {
        gsap.fromTo(productsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power2.out',
            scrollTrigger: { trigger: productsRef.current, start: 'top 90%', toggleActions: 'play none none none' },
          }
        );
      });
      return () => ctx.revert();
    }
  }, [isLoading, products.length]);

  const filtered = products
    .filter(p => p.name?.toLowerCase().includes(filter.toLowerCase()))
    .filter(p => categoryFilter === 'All' ? true : (p.category || 'Uncategorized') === categoryFilter)
    .sort((a, b) => {
      const tm = (t) => { if (!t) return 0; if (typeof t === 'number') return t; if (t.toMillis) return t.toMillis(); if (t.seconds) return t.seconds * 1000; return 0; };
      return sortBy === 'latest' ? tm(b.createdAt) - tm(a.createdAt) : tm(a.createdAt) - tm(b.createdAt);
    });

  return (
    <main className={`${!isEn ? 'rtl' : ''} min-h-screen bg-luxury-black`}>
      <OffersSlider lang={lang} />

      <section className="section-padding">
        <div className="container-luxury">
          <div ref={headerRef} className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-brand-400/20 rounded-full mb-6 bg-brand-400/5">
              <Sparkles size={12} className="text-brand-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-400">
                {isEn ? 'New Collection' : 'مجموعة جديدة'}
              </span>
            </div>
            <h1 className="font-display text-fluid-3xl sm:text-fluid-4xl font-bold text-white mb-4 tracking-tight">
              {isEn ? 'Latest Drops' : 'أحدث المنتجات'}
            </h1>
            <div className="gold-divider" />
            <p className="text-sm sm:text-base text-white/40 max-w-xl mx-auto mt-6 leading-relaxed">
              {isEn
                ? 'Discover our exclusive collection of premium streetwear and luxury basics, crafted for the modern individualist.'
                : 'اكتشف مجموعتنا الحصرية من الملابس الراقية والأساسيات الفاخرة.'}
            </p>
          </div>

          <div className="mb-10">
            <div className="card-luxury p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="relative flex-1 w-full sm:max-w-sm">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={filter} onChange={e => setFilter(e.target.value)}
                    placeholder={isEn ? 'Search products...' : 'البحث عن المنتجات...'}
                    className={`w-full pl-10 pr-4 py-2.5 bg-luxury-black border border-brand-400/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand-400/40 transition-all ${!isEn ? 'text-right' : ''}`} />
                </div>
                <button onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white/50 hover:text-brand-400 border border-white/10 hover:border-brand-400/30 rounded-lg transition-all duration-200 lg:hidden">
                  <SlidersHorizontal size={14} />
                  {isEn ? 'Filters' : 'الفلاتر'}
                </button>
              </div>

              <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c.key} onClick={() => setCategoryFilter(c.key)}
                        className={`px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                          categoryFilter === c.key
                            ? 'bg-brand-400 text-luxury-black shadow-gold-sm'
                            : 'bg-luxury-gray text-white/50 hover:text-white border border-brand-400/10 hover:border-brand-400/30'
                        }`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-luxury-gray border border-brand-400/10 rounded-lg text-xs text-white/70 focus:outline-none focus:border-brand-400/40 transition-all">
                    <option value="latest">{isEn ? 'Latest' : 'الأحدث'}</option>
                    <option value="oldest">{isEn ? 'Oldest' : 'الأقدم'}</option>
                  </select>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-400/10">
                  <p className="text-xs text-white/30">
                    {isEn ? `Showing ${filtered.length} of ${products.length} products` : `عرض ${filtered.length} من ${products.length} منتج`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="bg-luxury-gray/50 animate-pulse rounded-xl aspect-[3/4]" />
                  <div className="h-3 bg-luxury-gray/30 animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-luxury-gray/30 animate-pulse rounded w-2/3" />
                  <div className="h-4 bg-luxury-gray/30 animate-pulse rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div ref={productsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map(p => <ProductCard key={p.id} product={p} lang={lang} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 flex items-center justify-center border border-brand-400/20 rounded-xl mx-auto mb-5 bg-brand-400/5">
                <Package size={20} className="text-brand-400/50" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isEn ? 'No products found' : 'لم يتم العثور على منتجات'}
              </h3>
              <p className="text-sm text-white/40">
                {isEn ? 'Try adjusting your search or filter criteria' : 'حاول تعديل معايير البحث أو الفلترة'}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-luxury-dark border-t border-brand-400/5">
        <div className="container-luxury">
          <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Sparkles, title: isEn ? 'Premium Quality' : 'جودة فاخرة', desc: isEn ? 'Crafted with the finest materials for exceptional comfort and style' : 'مصنوعة من أجود المواد للراحة والأناقة' },
              { icon: Zap, title: isEn ? 'Fast Shipping' : 'شحن سريع', desc: isEn ? 'Fast delivery to all governorates with real-time tracking' : 'توصيل سريع لجميع المحافظات مع تتبع مباشر' },
              { icon: Heart, title: isEn ? 'Customer Care' : 'رعاية العملاء', desc: isEn ? 'Dedicated 24/7 support via WhatsApp and phone' : 'دعم مخصص على مدار الساعة عبر واتساب والهاتف' },
            ].map((feat, i) => (
              <div key={i} className="group text-center p-6 sm:p-8 rounded-xl border border-brand-400/5 hover:border-brand-400/20 transition-all duration-500 hover:bg-brand-400/[0.02]">
                <div className="w-14 h-14 flex items-center justify-center border border-brand-400/20 rounded-xl mx-auto mb-5 bg-brand-400/5 group-hover:bg-brand-400/10 group-hover:border-brand-400/40 transition-all duration-300 group-hover:scale-110 group-hover:shadow-gold-sm">
                  <feat.icon size={18} className="text-brand-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-brand-400/90 transition-colors">{feat.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
