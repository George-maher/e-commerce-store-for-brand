import { Link } from 'react-router-dom';
import { useTranslation } from '../utils/translations';
import { Instagram, Video, MapPin, MessageCircle, Phone, Sparkles } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useGsapStagger } from '../hooks/useAnimations';

export default function Footer({ lang = 'en' }) {
  const isEn = lang === 'en';
  const t = useTranslation(lang);
  const contentRef = useRef(null);

  useGsapStagger(contentRef, { stagger: 0.08, scrollTrigger: { start: 'top 90%' } });

  return (
    <footer className={`relative bg-luxury-dark border-t border-brand-400/5 overflow-hidden ${!isEn ? 'rtl' : ''}`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent" />

      <div className="container-luxury py-12 sm:py-16">
        <div ref={contentRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-lg tracking-tight text-white">{t.storeName}</h3>
              <Sparkles size={12} className="text-brand-400" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              {isEn ? 'Your destination for premium fashion and accessories' : 'وجهتك للملابس والإكسسوارات المميزة'}
            </p>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <MapPin size={14} className="text-brand-400/70" />
              <span>{isEn ? 'Cairo, Egypt' : 'القاهرة، مصر'}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400/80">
              {isEn ? 'Quick Links' : 'روابط سريعة'}
            </h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: isEn ? 'Home' : 'الرئيسية' },
                { to: '/cart', label: t.cart },
                { to: '/', label: isEn ? 'All Products' : 'جميع المنتجات' }
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.to}
                    className="text-sm text-white/50 hover:text-brand-400 transition-colors duration-200 hover:translate-x-0.5 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400/80">
              {isEn ? 'Customer Service' : 'خدمة العملاء'}
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="https://wa.me/201153792996" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-brand-400 transition-colors duration-200 flex items-center gap-2">
                  <MessageCircle size={14} className="text-brand-400/70" />
                  {isEn ? 'Contact Us' : 'اتصل بنا'}
                </a>
              </li>
              <li>
                <a href="tel:+201153792996"
                  className="text-sm text-white/50 hover:text-brand-400 transition-colors duration-200 flex items-center gap-2">
                  <Phone size={14} className="text-brand-400/70" />
                  {isEn ? 'Call Us' : 'اتصل بنا'}
                </a>
              </li>
              <li className="text-sm text-white/30 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400/50" />
                {isEn ? '24/7 Support' : 'دعم على مدار الساعة'}
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400/80">
              {isEn ? 'Follow Us' : 'تابعنا'}
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://www.instagram.com/zalabyaa_store?igsh=MTFkcG1vaDNleTliOQ==' },
                { icon: Video, href: 'https://www.tiktok.com/@zalabya_store?_r=1&_t=ZS-95RgeE2JEKl' },
                { icon: MessageCircle, href: 'https://wa.me/201153792996' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="group w-10 h-10 flex items-center justify-center rounded-lg border border-brand-400/20 text-white/50 hover:text-brand-400 hover:border-brand-400 hover:shadow-gold-sm transition-all duration-300">
                  <Icon size={15} className="group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-brand-400/10 mt-10 sm:mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 tracking-wide">
            &copy; {new Date().getFullYear()} {t.storeName}. {isEn ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
          </p>
          <p className="text-[10px] text-white/20 tracking-wider uppercase">
            {isEn ? 'Premium Fashion Since 2024' : 'أزياء فاخرة منذ 2024'}
          </p>
        </div>
      </div>
    </footer>
  );
}
