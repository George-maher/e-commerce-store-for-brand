import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapFadeIn(ref, options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
          ...options,
        }
      );
    });
    return () => ctx.revert();
  }, [ref, options]);
}

export function useGsapStagger(ref, options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
          ...options,
        }
      );
    });
    return () => ctx.revert();
  }, [ref, options]);
}

export function useGsapScaleIn(ref, options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            ...options.scrollTrigger,
          },
          ...options,
        }
      );
    });
    return () => ctx.revert();
  }, [ref, options]);
}
