import { Sun, Moon, Instagram, MessageCircle, Video, ShoppingCart, Menu, X, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from './CartContext';
import gsap from 'gsap';

export default function Navbar({ darkMode, setDarkMode, lang, setLang, onSearch }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isEn = lang === 'en';
  const { cart } = useCart();
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const navRef = useRef(null);
  const mobileRef = useRef(null);
  const menuBtnRef = useRef(null);
  const badgeRef = useRef(null);
  const cartBtnRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (mobileOpen && mobileRef.current) {
      gsap.fromTo(mobileRef.current,
        { opacity: 0, clipPath: 'circle(0% at 100% 0%)' },
        { opacity: 1, clipPath: 'circle(150% at 100% 0%)', duration: 0.5, ease: 'power3.out' }
      );
      gsap.fromTo(mobileRef.current.querySelectorAll('.mobile-item'),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        0.2
      );
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (badgeRef.current && count > 0) {
      gsap.fromTo(badgeRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }
  }, [count]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    setSearchOpen(false);
  }, [searchQuery, onSearch]);

  const socialLinks = {
    desktop: [
      { icon: Instagram, href: 'https://www.instagram.com/mintalitat_outlet?igsh=ZnVka29rZXBvbDNv' },
      { icon: Video, href: 'https://www.tiktok.com/@mintalitat_outlet?_r=1&_t=ZS-94uMwo7y54h' },
      { icon: MessageCircle, href: 'https://wa.me/+201153792996' },
    ],
    mobile: [
      { icon: Instagram, href: 'https://www.instagram.com/d.e.g.o.y?igsh=MTlqN2Q5M3ViczV3bg==' },
      { icon: Video, href: 'https://www.tiktok.com/@degoy411?_r=1&_t=ZS-948SuJznuoj' },
      { icon: MessageCircle, href: 'https://wa.me/+201031149646' },
    ],
  };

  const navLinks = [
    { label: isEn ? 'Home' : 'الرئيسية', to: '/' },
    { label: isEn ? 'Shop' : 'المتجر', to: '/' },
    { label: isEn ? 'Contact' : 'اتصل بنا', to: '/' },
  ];

  return (
    <>
      <div className="bg-luxury-dark border-b border-brand-400/10 text-center py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-400/80 relative z-50">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles size={10} className="text-brand-400" />
          {isEn ? 'Free Shipping On Orders Over 1000 EGP' : 'الشحن مجاني للطلبات فوق 1000 جنيه'}
          <Sparkles size={10} className="text-brand-400" />
        </span>
      </div>

      <nav ref={navRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-luxury-black/80 backdrop-blur-glass-lg shadow-elevation-2 border-b border-brand-400/5'
            : 'bg-transparent'
        } ${!isEn ? 'rtl' : ''}`}
        style={{ marginTop: '36px' }}>

        <div className="container-luxury">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link to="/" className="group flex items-center gap-2">
              <span className="font-display font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-brand-400 transition-colors duration-300">
                Zalabya
              </span>
              <span className="hidden sm:block text-[8px] uppercase tracking-[0.3em] text-brand-400/60 font-medium">Store</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.label} to={link.to}
                  className="px-3 py-2 text-xs font-medium text-white/60 hover:text-brand-400 transition-colors duration-200 tracking-wide">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-0.5 md:gap-1">
              <button onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-brand-400/10 text-white/60 hover:text-brand-400 transition-all duration-200"
                aria-label={isEn ? 'Search' : 'بحث'}>
                <Search size={15} />
              </button>

              <div className="hidden md:flex items-center gap-0.5">
                {socialLinks.desktop.map(({ icon: Icon, href }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-lg text-white/40 hover:text-brand-400 hover:bg-brand-400/10 transition-all duration-200"
                    aria-label="Social link">
                    <Icon size={14} />
                  </a>
                ))}
              </div>

              <Link to="/cart" ref={cartBtnRef}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-brand-400 hover:bg-brand-400/10 transition-all duration-200 group"
                aria-label={isEn ? 'Cart' : 'السلة'}>
                <ShoppingCart size={15} />
                {count > 0 && (
                  <span ref={badgeRef}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-400 text-luxury-black text-[9px] font-bold px-1 rounded-full flex items-center justify-center shadow-glow-gold">
                    {count}
                  </span>
                )}
              </Link>

              <button onClick={() => setLang(isEn ? 'ar' : 'en')}
                className="w-9 h-9 text-[10px] font-semibold uppercase tracking-widest rounded-lg text-white/60 hover:text-brand-400 hover:bg-brand-400/10 transition-all duration-200">
                {isEn ? 'AR' : 'EN'}
              </button>

              <button onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-white/60 hover:text-brand-400 hover:bg-brand-400/10 transition-all duration-200"
                aria-label={isEn ? 'Toggle theme' : 'تغيير المظهر'}>
                {darkMode ? <Sun size={13} /> : <Moon size={13} />}
              </button>

              <button ref={menuBtnRef} onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-brand-400 hover:border-brand-400/40 transition-all duration-200"
                aria-label={isEn ? 'Menu' : 'القائمة'}>
                {mobileOpen ? <X size={15} /> : <Menu size={15} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div ref={mobileRef}
            className="md:hidden fixed inset-0 top-[84px] z-50 bg-luxury-black/95 backdrop-blur-glass-lg overflow-y-auto">
            <div className="container-luxury py-8 space-y-6">
              <div className="space-y-2">
                {navLinks.map(link => (
                  <Link key={link.label} to={link.to} onClick={() => setMobileOpen(false)}
                    className="mobile-item block py-3 text-base font-medium text-white/70 hover:text-brand-400 transition-colors tracking-wide border-b border-white/5">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mobile-item space-y-3 pt-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  {isEn ? 'Follow Us' : 'تابعنا'}
                </p>
                <div className="flex items-center gap-3">
                  {socialLinks.mobile.map(({ icon: Icon, href }) => (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-brand-400 hover:border-brand-400/40 transition-all duration-200">
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-luxury-black/90 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}>
          <div className="container-luxury pt-24 sm:pt-32" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="max-w-xl mx-auto">
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-400 transition-colors" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isEn ? 'Search products...' : 'البحث عن المنتجات...'}
                  autoFocus
                  className="w-full pl-12 pr-12 py-4 bg-luxury-dark border border-brand-400/20 rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-brand-400/40 focus:ring-1 focus:ring-brand-400/20 transition-all"
                />
                <button type="button" onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-brand-400 hover:border-brand-400/40 transition-all">
                  <X size={14} />
                </button>
              </div>
              <p className="text-center mt-4 text-xs text-white/20">
                {isEn ? 'Press Enter to search or Esc to close' : 'اضغط Enter للبحث أو Esc للإغلاق'}
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
