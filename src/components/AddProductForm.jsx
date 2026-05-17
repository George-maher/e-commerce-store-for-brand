import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useTranslation } from '../utils/translations';
import { uploadToCloudinary, validateImageFile, createImagePreview } from '../utils/cloudinary';

const SIZES = ['M', 'L', 'XL', '2XL', '3XL'];

const AddProductForm = ({ lang = 'en' }) => {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sizes, setSizes] = useState([]);

  const handleFiles = (list) => {
    const valid = Array.from(list).filter(f => {
      const v = validateImageFile(f);
      if (!v.isValid) alert(isEn ? v.error : v.error);
      return v.isValid;
    });
    if (!valid.length) return;
    setFiles(valid);
    setPreviews([]);
    valid.forEach(async (f, i) => {
      const p = await createImagePreview(f);
      setPreviews(prev => { const n = [...prev]; n[i] = p; return n; });
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const n = name.trim(), p = price.trim(), c = category.trim();
    if (!files.length) { alert(isEn ? "SELECT AT LEAST ONE IMAGE" : "اختر صورة"); return; }
    if (!n) { alert(isEn ? "ENTER PRODUCT NAME" : "أدخل اسم المنتج"); return; }
    if (!p) { alert(isEn ? "ENTER PRICE" : "أدخل السعر"); return; }
    if (!c) { alert(isEn ? "SELECT CATEGORY" : "اختر فئة"); return; }
    setLoading(true);
    try {
      const urls = (await Promise.all(files.map(f => uploadToCloudinary(f, (v) => setProgress(v))))).map(r => { if (!r?.secure_url) throw new Error('Upload failed'); return r.secure_url; });
      const user = getAuth().currentUser;
      if (!user) throw new Error('Not logged in');
      const data = { name: n, price: parseFloat(p), description: description.trim(), category: c, images: urls, sizes, createdAt: serverTimestamp(), createdBy: user.email };
      try { await addDoc(collection(db, "products"), data); }
      catch (err) {
        if (err.code === 'permission-denied' || err.message.includes('Missing or insufficient permissions')) {
          const existing = JSON.parse(localStorage.getItem('pendingProducts') || '[]');
          existing.push({ ...data, id: Date.now().toString(), status: 'pending' });
          localStorage.setItem('pendingProducts', JSON.stringify(existing));
          alert(isEn ? "Saved locally. Configure Firebase permissions." : "تم محلياً. هيئ أذونات Firebase.");
          return;
        }
        throw err;
      }
      setName(""); setPrice(""); setDescription(""); setCategory(""); setFiles([]); setPreviews([]); setSizes([]); setProgress(0);
      alert(isEn ? "PRODUCT ADDED" : "تمت الإضافة");
    } catch (err) { alert(isEn ? `FAILED: ${err.message}` : `فشل: ${err.message}`); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { label: t.productNameRequired, val: name, set: setName, type: 'text', ph: isEn ? "e.g. PREMIUM TEE" : "مثال: تي شيرت" },
            { label: t.priceRequired, val: price, set: setPrice, type: 'number', ph: "299" },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{f.label}</label>
              <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                className="w-full px-4 py-2.5 bg-luxury-black border border-gold-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400/40 placeholder:text-luxury-white/20"
                placeholder={f.ph} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.description}</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
              className="w-full px-4 py-2.5 bg-luxury-black border border-gold-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400/40 resize-none placeholder:text-luxury-white/20"
              placeholder={isEn ? "Describe your product..." : "صف منتجك..."} />
          </div>
          <div>
            <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.selectCategory}</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-luxury-black border border-gold-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-gold-400/40">
              <option value="">{t.selectCategory}</option>
              <option value="Sweat pants">{isEn ? 'Sweat Pants' : 'سويت بانتس'}</option>
              <option value="T-shirts">{isEn ? 'T-Shirts' : 'تي شيرت'}</option>
              <option value="Uncategorized">{isEn ? 'Uncategorized' : 'غير مصنف'}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{isEn ? 'Sizes' : 'المقاسات'}</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button key={s} type="button" onClick={() => setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])}
                  className={`px-4 py-1.5 text-xs font-medium border rounded-lg transition-all ${
                    sizes.includes(s) ? 'bg-gold-400 border-gold-400 text-luxury-black' : 'border-gold-400/20 text-luxury-white/50 hover:border-gold-400/40'
                  }`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-medium text-luxury-white/50 mb-1.5">{t.productImageRequired}</label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gold-400/20 rounded-xl hover:border-gold-400/40 transition-colors cursor-pointer"
            onClick={() => document.getElementById('img-upload')?.click()}>
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-luxury-white/30" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} />
              </svg>
              <p className="text-xs text-luxury-white/30 mt-2">{isEn ? 'Upload Images' : 'رفع صور'}</p>
            </div>
            <input id="img-upload" type="file" className="sr-only" accept="image/*" multiple onChange={e => handleFiles(e.target.files)} />
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((p, i) => (
                <div key={i} className="relative group">
                  <img src={p} alt="" className="h-20 w-full object-cover rounded-lg border border-gold-400/10" />
                  <button type="button" onClick={() => { setFiles(prev => prev.filter((_, j) => j !== i)); setPreviews(prev => prev.filter((_, j) => j !== i)); }}
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500/80 text-white rounded-full text-[9px] opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="w-full bg-luxury-gray rounded-full h-1.5">
          <div className="bg-gold-400 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => { setName(""); setPrice(""); setDescription(""); setCategory(""); setFiles([]); setPreviews([]); setSizes([]); }}
          className="px-6 py-2.5 border border-gold-400/20 rounded-lg text-xs font-medium text-luxury-white/50 hover:border-gold-400/40 hover:text-white transition-all">{t.clearForm}</button>
        <button type="submit" disabled={loading}
          className="px-6 py-2.5 btn-gold disabled:opacity-50">
          {loading ? t.uploading : t.addProduct}
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
