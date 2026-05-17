import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade, Parallax } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/parallax';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';

const samples = [
  {
    id: '1', title: 'New Collection', subtitle: 'Premium Streetwear',
    description: 'Discover the latest drops in our exclusive collection of luxury fashion.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
    badge: 'Limited Edition', ctaText: 'Explore', ctaLink: '/'
  },
  {
    id: '2', title: 'Summer Sale', subtitle: 'Up to 40% Off',
    description: 'Elevate your style with our premium selection at exclusive prices.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80',
    badge: 'Sale', ctaText: 'Shop Now', ctaLink: '/'
  },
  {
    id: '3', title: 'Luxury Basics', subtitle: 'Essential Wardrobe',
    description: 'Timeless pieces crafted for the modern wardrobe.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    badge: 'New Arrival', ctaText: 'Discover', ctaLink: '/'
  },
];

export default function OffersSlider() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const swiperRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    let m = true;
    try {
      const u = onSnapshot(
        collection(db, 'offers'),
        (s) => { if (m) { setOffers(s.docs.map(d => ({ id: d.id, ...d.data() })) || samples); setLoading(false); } },
        () => { if (m) { setOffers(samples); setLoading(false); } }
      );
      return () => { m = false; u(); };
    } catch {
      if (m) { setTimeout(() => { if (m) { setOffers(samples); setLoading(false); } }, 0); }
    }
  }, []);

  useEffect(() => {
    if (progressRef.current && offers.length > 0) {
      gsap.to(progressRef.current, {
        scaleX: 1,
        duration: 6,
        ease: 'linear',
        overwrite: true,
      });
    }
  }, [current, offers.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[70vh] md:h-[85vh] bg-luxury-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-luxury-dark via-luxury-black to-luxury-dark" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin mx-auto" />
            <p className="text-xs tracking-widest text-brand-400/50 animate-pulse uppercase">Loading</p>
          </div>
        </div>
      </section>
    );
  }

  if (!offers.length) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade, Parallax]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          loop
          parallax
          speed={1200}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          navigation={{ nextEl: '.hero-next', prevEl: '.hero-prev' }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !w-12 !h-0.5 !bg-white/20 !rounded-full !opacity-100 !transition-all',
            bulletActiveClass: '!bg-brand-400 !w-16',
          }}
          onSlideChange={(s) => setCurrent(s.realIndex)}
          onBeforeSlideChange={() => {
            if (progressRef.current) {
              gsap.set(progressRef.current, { scaleX: 0 });
            }
          }}
          className="w-full h-full">
          {offers.map(o => (
            <SwiperSlide key={o.id}>
              <div className="relative w-full h-full">
                <div className="absolute inset-0" data-swiper-parallax="40%">
                  <img src={o.image} alt={o.title}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-luxury-black/90 via-luxury-black/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-luxury-black/20" />
                </div>
                <div className="relative z-10 h-full flex items-center">
                  <div className="container-luxury w-full">
                    <div className="max-w-2xl">
                      {o.badge && (
                        <div className="mb-6" data-swiper-parallax="-100%">
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-400/10 border border-brand-400/30 text-brand-400 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full backdrop-blur-sm">
                            <Sparkles size={10} />
                            {o.badge}
                          </span>
                        </div>
                      )}
                      {o.subtitle && (
                        <div className="mb-2" data-swiper-parallax="-80%">
                          <p className="text-sm font-medium uppercase tracking-[0.25em] text-brand-400/70">{o.subtitle}</p>
                        </div>
                      )}
                      <h1 className="font-display text-fluid-4xl sm:text-fluid-5xl font-bold text-white mb-6 leading-none tracking-tight text-balance"
                        data-swiper-parallax="-60%">
                        {o.title}
                      </h1>
                      <div className="mb-8 max-w-lg" data-swiper-parallax="-40%">
                        <p className="text-sm md:text-base text-white/60 leading-relaxed">{o.description}</p>
                      </div>
                      {o.ctaText && (
                        <div data-swiper-parallax="-20%">
                          <a href={o.ctaLink || '#'}
                            className="btn-gold inline-flex group">
                            <span>{o.ctaText}</span>
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="hero-prev absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center glass rounded-full text-white/50 hover:text-brand-400 hover:border-brand-400/30 transition-all duration-300">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="hero-next absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center glass rounded-full text-white/50 hover:text-brand-400 hover:border-brand-400/30 transition-all duration-300">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="h-[2px] bg-white/5">
            <div ref={progressRef}
              className="h-full bg-gradient-to-r from-brand-400 to-brand-300 origin-left"
              style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>

        <div className="swiper-pagination !bottom-6 md:!bottom-8 !left-1/2 !-translate-x-1/2 !flex !items-center !gap-2" />
      </div>
    </section>
  );
}
