import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { Navigate } from 'react-router-dom';
import AccessDenied from '../pages/AccessDenied';

export default function AdminRoute({ children, secretPath, lang }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'YOUREAMIL';

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsub();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-luxury-black"><div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to={secretPath} replace />;
  if (!user.email || user.email !== adminEmail) return <AccessDenied lang={lang} />;
  return children;
}
