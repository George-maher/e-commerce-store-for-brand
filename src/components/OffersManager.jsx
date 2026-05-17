import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useTranslation } from '../utils/translations';
import { uploadToCloudinary, validateImageFile, createImagePreview } from '../utils/cloudinary';

export default function OffersManager({ lang = 'en', offers, onDelete }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [form, setForm] = useState({ title: '', description: '', ctaText: '', ctaLink: '', image: null });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const ttl = form.title.trim(), desc = form.description.trim(), ctaT = form.ctaText.trim(), ctaL = form.ctaLink.trim();
    if (!ttl) { alert(isEn ? 'ENTER TITLE' : 'أدخل العنوان'); return; }
    if (!desc) { alert(isEn ? 'ENTER DESCRIPTION' : 'أدخل الوصف'); return; }
    if (!form.image) { alert(isEn ? 'SELECT IMAGE' : 'اختر صورة'); return; }
    setLoading(true);
    try {
      const url = (await uploadToCloudinary(form.image)).secure_url;
      if (!url) throw new Error('Upload failed');
      const user = getAuth().currentUser;
      if (!user) throw new Error('Not logged in');
      const data = { title: ttl, description: desc, ctaText: ctaT, ctaLink: ctaL, image: url, createdAt: serverTimestamp(), createdBy: user.email };
      try { await addDoc(collection(db, 'offers'), data); }
      catch (err) {
        if (err.code === 'permission-denied') {
          const ex = JSON.parse(localStorage.getItem('pendingOffers') || '[]');
          ex.push({ ...data, id: Date.now().toString(), status: 'pending' });
          localStorage.setItem('pendingOffers', JSON.stringify(ex));
          alert(isEn ? 'Saved locally.' : 'تم محلياً.');
          return;
        }
        throw err;
      }
      setForm({ title: '', description: '', ctaText: '', ctaLink: '', image: null }); setPreview('');
      alert(t.offerAddedSuccessfully);
    } catch (err) { alert(isEn ? `FAILED: ${err.message}` : `فشل: ${err.message}`); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: t.offerTitle+'*', val: form.title, key: 'title', ph: isEn ? 'SUMMER SALE' : 'تخفيضات الصيف' },
              { label: t.ctaButtonText, val: form.ctaText, key: 'ctaText', ph: isEn ? 'SHOP NOW' : 'تسوق الآن' },
              { label: t.ctaLink, val: form.ctaLink, key: 'ctaLink', ph: isEn ? '/products' : '/products' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{f.label}</label>
                <input type="text" value={f.val} onChange={e => setForm({...form, [f.key]: e.target.value})}
                  className="w-full px-4 py-2.5 bg-luxury-black border border-gold-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400/40 placeholder:text-luxury-white/20" placeholder={f.ph} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.offerDescription}*</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4}
                className="w-full px-4 py-2.5 bg-luxury-black border border-gold-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400/40 resize-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.offerImage}*</label>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gold-400/20 rounded-xl hover:border-gold-400/40 transition-colors">
              <div className="text-center">
                {preview ? (
                  <div className="relative inline-block">
                    <img src={preview} alt="" className="h-28 w-28 object-cover rounded-xl border border-gold-400/10" />
                    <button type="button" onClick={() => { setPreview(''); setForm({...form, image: null}); }}
                      className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500/80 text-white rounded-full text-[9px]">✕</button>
                  </div>
                ) : (
                  <svg className="mx-auto h-8 w-8 text-luxury-white/30" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} />
                  </svg>
                )}
                <label htmlFor="offer-img" className="block text-xs font-medium text-gold-400 cursor-pointer mt-2 hover:text-white transition-colors">
                  {t.uploadFile}
                  <input id="offer-img" type="file" className="sr-only" accept="image/*"
                    onChange={async (e) => { const f = e.target.files[0]; if (!f) return; const v = validateImageFile(f); if (!v.isValid) { alert(v.error); return; } setForm({...form, image: f}); const p = await createImagePreview(f); setPreview(p); }} />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => { setForm({ title: '', description: '', ctaText: '', ctaLink: '', image: null }); setPreview(''); }}
            className="px-6 py-2.5 border border-gold-400/20 rounded-lg text-xs font-medium text-luxury-white/50 hover:border-gold-400/40 hover:text-white transition-all">{t.clearForm}</button>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 btn-gold disabled:opacity-50">
            {loading ? t.adding : t.addOffer}
          </button>
        </div>
      </form>

      {offers?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-white/70 mb-4">{t.existingOffers}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map(o => (
              <div key={o.id} className="card-luxury overflow-hidden hover:border-gold-400/30 transition-colors">
                {o.image && <div className="h-24 bg-luxury-dark"><img src={o.image} alt={o.title} className="w-full h-full object-cover" /></div>}
                <div className="p-4">
                  <h4 className="font-semibold text-sm text-white mb-1">{o.title}</h4>
                  <p className="text-xs text-luxury-white/40 mb-2 line-clamp-2">{o.description}</p>
                  {o.ctaText && <span className="inline-block text-[10px] font-medium bg-gold-400/10 text-gold-400 px-2 py-0.5 rounded mb-2">{o.ctaText}</span>}
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-luxury-white/30">{o.createdAt?.toDate ? new Date(o.createdAt.toDate()).toLocaleDateString() : 'N/A'}</span>
                    <button onClick={() => onDelete?.(o.id)} className="text-red-400/70 hover:text-red-400 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
