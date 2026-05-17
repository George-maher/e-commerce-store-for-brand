import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { onSnapshot, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import AddProductForm from '../components/AddProductForm';
import OffersManager from '../components/OffersManager';
import { useTranslation } from '../utils/translations';
import { getAuth } from 'firebase/auth';
import { Package, Plus, Edit2, Trash2, Settings, ShoppingBag, Sparkles, X } from 'lucide-react';

export default function Dashboard({ lang = 'en' }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [activeTab, setActiveTab] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', category: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'YOUREMAIL';
    const unsub1 = onSnapshot(collection(db, 'products'), (s) => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))), () => {});
    const unsub2 = onSnapshot(collection(db, 'offers'), (s) => setOffers(s.docs.map(d => ({ id: d.id, ...d.data() }))), () => {});
    return () => { unsub1(); unsub2(); };
  }, []);

  const handleDeleteOffer = async (id) => {
    if (!confirm(isEn ? 'Delete this offer?' : 'حذف هذا العرض؟')) return;
    try { await deleteDoc(doc(db, 'offers', id)); } catch { alert(isEn ? 'Failed to delete offer' : 'فشل في حذف العرض'); }
  };

  const handleDelete = async (id) => {
    if (!confirm(isEn ? 'Delete this product?' : 'حذف هذا المنتج؟')) return;
    try { await deleteDoc(doc(db, 'products', id)); } catch { alert(isEn ? 'Failed to delete' : 'فشل في الحذف'); }
  };

  const handleEdit = (p) => { setEditingProduct(p); setEditForm({ name: p.name || '', price: p.price || '', description: p.description || '', category: p.category || '' }); };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setEditLoading(true);
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), { name: editForm.name, price: editForm.price, description: editForm.description, category: editForm.category, updatedAt: new Date() });
      setEditingProduct(null); setEditForm({ name: '', price: '', description: '', category: '' });
      alert(isEn ? 'Product updated successfully' : 'تم تحديث المنتج بنجاح');
    } catch { alert(isEn ? 'Failed to update product' : 'فشل في تحديث المنتج'); }
    finally { setEditLoading(false); }
  };

  const getImg = (p) => {
    if (p.images?.length > 0) return p.images[0];
    if (p.image) return p.image.startsWith('http') ? p.image : `/images/${p.image}`;
    return '/images/placeholder.jpg';
  };

  return (
    <main className={`min-h-screen bg-luxury-black ${!isEn ? 'rtl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-brand-400/20 rounded-full mb-6 bg-brand-400/5">
            <Settings size={12} className="text-brand-400" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-400">
              {isEn ? 'ADMIN PANEL' : 'لوحة التحكم'}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-4 tracking-tight">{t.adminDashboard}</h1>
          <div className="w-16 h-px bg-brand-400/50 mx-auto mb-6" />
          <p className="text-sm text-luxury-white/40 max-w-xl mx-auto">
            {isEn ? 'Manage products & offers' : 'إدارة المنتجات والعروض'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            { icon: Package, value: products.length, label: t.totalProducts },
            { icon: ShoppingBag, value: offers.length, label: t.totalOffers },
          ].map((stat, i) => (
            <div key={i} className="card-luxury p-6 text-center hover:border-brand-400/30 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center border border-brand-400/20 rounded-lg mx-auto mb-3 bg-brand-400/5">
                <stat.icon size={18} className="text-brand-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-luxury-white/40">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { key: 'add', icon: Plus, label: t.addNewProduct },
            { key: 'manage', icon: Settings, label: t.manageProducts },
            { key: 'offers', icon: Sparkles, label: t.manageOffers || (isEn ? 'MANAGE OFFERS' : 'إدارة العروض') },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium border rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-brand-400 border-brand-400 text-luxury-black'
                  : 'border-brand-400/20 text-luxury-white/50 hover:border-brand-400/40 hover:text-white'
              }`}>
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'add' && (
          <div className="card-luxury p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 flex items-center justify-center border border-brand-400/20 rounded-lg mx-auto mb-4 bg-brand-400/5">
                <Plus size={20} className="text-brand-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">{t.addNewProduct}</h2>
              <p className="text-sm text-luxury-white/40">
                {isEn ? 'Add new products to your inventory' : 'إضافة منتجات جديدة إلى مخزونك'}
              </p>
            </div>
            <AddProductForm lang={lang} />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="card-luxury p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 flex items-center justify-center border border-brand-400/20 rounded-lg mx-auto mb-4 bg-brand-400/5">
                <Settings size={20} className="text-brand-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">{t.manageProducts}</h2>
              <p className="text-sm text-luxury-white/40">
                {isEn ? 'View and manage your product catalog' : 'عرض وإدارة كتالوج المنتجات'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(p => (
                <div key={p.id} className="card-luxury overflow-hidden group hover:border-brand-400/30 transition-colors">
                  <div className="aspect-square bg-luxury-dark">
                    <img src={getImg(p)} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-white mb-1 truncate">{p.name}</h3>
                    <div className="text-sm font-medium text-brand-400 mb-3">EGP {p.price}</div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)}
                        className="flex-1 py-2 border border-brand-400/20 rounded-lg text-xs font-medium text-luxury-white/50 hover:border-brand-400/40 hover:text-white transition-all">
                        <Edit2 size={10} className="inline mr-1" /> {t.edit}
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="flex-1 py-2 border border-red-400/20 rounded-lg text-xs font-medium text-red-400/70 hover:border-red-400/40 hover:text-red-400 transition-all">
                        <Trash2 size={10} className="inline mr-1" /> {t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="card-luxury p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 flex items-center justify-center border border-brand-400/20 rounded-lg mx-auto mb-4 bg-brand-400/5">
                <Sparkles size={20} className="text-brand-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">
                {t.manageOffers || (isEn ? 'MANAGE OFFERS' : 'إدارة العروض')}
              </h2>
              <p className="text-sm text-luxury-white/40">
                {isEn ? 'Create and manage promotional offers' : 'إنشاء وإدارة العروض الترويجية'}
              </p>
            </div>
            <OffersManager lang={lang} offers={offers} onDelete={handleDeleteOffer} />
          </div>
        )}
      </div>

      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-luxury-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-luxury max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-white tracking-tight">{t.editProduct || 'EDIT PRODUCT'}</h2>
                <button onClick={() => { setEditingProduct(null); setEditForm({ name: '', price: '', description: '', category: '' }); }}
                  className="w-8 h-8 flex items-center justify-center border border-brand-400/20 rounded-lg hover:border-brand-400/40 transition-colors">
                  <X size={14} className="text-luxury-white/50" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="space-y-4">
                {[
                  { label: t.productNameRequired || 'NAME*', value: editForm.name, set: (v) => setEditForm({...editForm, name: v}), type: 'text', req: true },
                  { label: t.priceRequired || 'PRICE*', value: editForm.price, set: (v) => setEditForm({...editForm, price: v}), type: 'number', req: true },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{f.label}</label>
                    <input type={f.type} value={f.value} onChange={(e) => f.set(e.target.value)} required={f.req}
                      className="w-full px-4 py-2.5 bg-luxury-black border border-brand-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400/40" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.description || 'DESCRIPTION'}</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows={3}
                    className="w-full px-4 py-2.5 bg-luxury-black border border-brand-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400/40 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.category || 'CATEGORY'}</label>
                  <select value={editForm.category} onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-luxury-black border border-brand-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400/40">
                    <option value="">{t.selectCategory || 'SELECT CATEGORY'}</option>
                    {['Sweat pants', 'T-shirts', 'Uncategorized'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => { setEditingProduct(null); setEditForm({ name: '', price: '', description: '', category: '' }); }}
                    className="flex-1 py-2.5 border border-brand-400/20 rounded-lg text-xs font-medium text-luxury-white/50 hover:border-brand-400/40 hover:text-white transition-all">
                    {t.cancel || 'CANCEL'}
                  </button>
                  <button type="submit" disabled={editLoading}
                    className="flex-1 py-2.5 btn-gold disabled:opacity-50 text-xs">
                    {editLoading ? (isEn ? 'UPDATING...' : 'جاري التحديث...') : (t.updateProduct || 'UPDATE')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
