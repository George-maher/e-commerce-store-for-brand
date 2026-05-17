import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '../utils/translations';
import { ShieldAlert } from 'lucide-react';

export default function Login({ lang = 'en' }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "YOUREMAIL";
      if (user?.email === ADMIN_EMAIL) navigate("/LOGINPATH");
      else { await signOut(auth); setError(isEn ? "ACCESS DENIED: NOT AN ADMIN" : "تم رفض الوصول: لست مشرفاً"); }
    } catch (err) {
      setError(isEn ? "LOGIN FAILED: " + (err?.message || "") : "فشل تسجيل الدخول: " + (err?.message || ""));
    } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-luxury-black ${!isEn ? 'rtl' : ''}`}>
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-14 h-14 flex items-center justify-center border border-brand-400/20 rounded-xl mx-auto mb-5 bg-brand-400/5">
            <ShieldAlert size={20} className="text-brand-400" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-2 tracking-tight">{t.adminLogin}</h1>
          <div className="w-12 h-px bg-brand-400/50 mx-auto" />
        </div>

        <div className="card-luxury p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-xs font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-luxury-white/50 mb-2">{t.email}</label>
              <input type="email" placeholder={t.email}
                className={`w-full px-4 py-2.5 bg-luxury-black border border-brand-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400/40 placeholder:text-luxury-white/20 ${!isEn ? 'text-right' : ''}`}
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-luxury-white/50 mb-2">{t.password}</label>
              <input type="password" placeholder={t.password}
                className={`w-full px-4 py-2.5 bg-luxury-black border border-brand-400/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-400/40 placeholder:text-luxury-white/20 ${!isEn ? 'text-right' : ''}`}
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 btn-gold disabled:opacity-50 text-xs">
              {loading ? (isEn ? 'SIGNING IN...' : 'جاري الدخول...') : t.login}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
