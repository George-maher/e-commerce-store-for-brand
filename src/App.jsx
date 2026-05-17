import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ToastProvider } from './components/ToastProvider';
import { CartProvider } from './components/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CartPage from './pages/CartPage';
import ProductDetail from './pages/ProductDetail';
import AdminRoute from './components/AdminRoute';

const SECRET = import.meta.env.VITE_SECRET_PATH || '/SECRET PATH';
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/YOURADMIN PATH';
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'youreamil';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('dark') === 'true'; } catch { return false; }
  });
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try { localStorage.setItem('dark', darkMode ? 'true' : 'false'); } catch {}
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className={`${darkMode ? 'dark' : ''} ${!lang || lang === 'ar' ? 'rtl' : ''}`}>
      <div className="min-h-screen bg-luxury-black">
        <BrowserRouter>
          <ToastProvider>
            <CartProvider>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                lang={lang}
                setLang={setLang}
                onSearch={setGlobalSearch}
              />

              <main className="pt-[84px]">
                <Routes>
                  <Route path="/" element={<Home lang={lang} />} />
                  <Route path="/product/:id" element={<ProductDetail lang={lang} />} />
                  <Route path="/cart" element={<CartPage lang={lang} />} />
                  <Route
                    path={SECRET}
                    element={
                      loading ? (
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-12 h-12 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin mx-auto" />
                            <p className="text-brand-400/70 text-xs uppercase tracking-widest">Loading...</p>
                          </div>
                        </div>
                      ) : user && user.email === ADMIN_EMAIL ? (
                        <Navigate to={ADMIN_PATH} />
                      ) : (
                        <Login lang={lang} />
                      )
                    }
                  />
                  <Route
                    path={ADMIN_PATH}
                    element={
                      <AdminRoute secretPath={SECRET} lang={lang}>
                        <Dashboard lang={lang} />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center max-w-md px-4">
                          <div className="w-16 h-16 flex items-center justify-center border border-brand-400/20 rounded-xl mx-auto mb-5 bg-brand-400/5">
                            <span className="text-2xl font-bold text-brand-400/50">404</span>
                          </div>
                          <h2 className="text-xl font-bold text-white mb-2">
                            {lang === 'en' ? 'Page Not Found' : 'الصفحة غير موجودة'}
                          </h2>
                          <p className="text-sm text-white/40 mb-8">
                            {lang === 'en'
                              ? 'The page you are looking for does not exist or has been moved.'
                              : 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'}
                          </p>
                          <a href="/" className="btn-outline inline-flex">
                            {lang === 'en' ? 'Go Home' : 'العودة للرئيسية'}
                          </a>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </main>

              <Footer lang={lang} />
            </CartProvider>
          </ToastProvider>
        </BrowserRouter>
      </div>
    </div>
  );
}
