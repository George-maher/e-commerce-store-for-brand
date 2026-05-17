import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

export default function RelatedProducts({ currentProductId, category, lang }) {
  const isEn = lang === 'en';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProductId) return;
    const q = category
      ? query(collection(db, 'products'), where('category', '==', category), limit(8))
      : query(collection(db, 'products'), limit(8));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.id !== currentProductId).slice(0, 6));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [currentProductId, category]);

  if (loading) return (
    <div className="mt-12">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-6">{isEn ? 'Related Products' : 'منتجات ذات صلة'}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="animate-pulse bg-luxury-dark border border-gold-400/10 rounded-xl aspect-square" />)}
      </div>
    </div>
  );

  if (!products.length) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">{isEn ? 'Related' : 'منتجات ذات صلة'}</h2>
        <Link to="/" className="text-xs font-medium text-gold-400 hover:text-white transition-colors">{isEn ? 'VIEW ALL' : 'عرض الكل'}</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {products.map(p => (
          <Link key={p.id} to={`/product/${p.id}`} className="group">
            <div className="bg-luxury-black border border-gold-400/10 rounded-xl overflow-hidden hover:border-gold-400/30 transition-all card-luxury">
              <div className="aspect-square bg-luxury-dark overflow-hidden">
                <img src={(p.image || p.images?.[0])?.startsWith('http') ? (p.image || p.images?.[0]) : `/images/${p.image || 'placeholder.jpg'}`}
                  alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                {(p.discount || p.salePrice) && <span className="absolute top-2 left-2 bg-gold-400 text-luxury-black text-[8px] font-semibold px-2 py-0.5 rounded">SALE</span>}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-xs text-white mb-1 line-clamp-2">{p.name}</h3>
                <span className="text-xs font-semibold text-gold-400">{p.salePrice || p.price} EGP</span>
                {p.salePrice && <span className="text-[10px] text-luxury-white/30 line-through ml-1.5">{p.price} EGP</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
