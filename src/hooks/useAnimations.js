import { useEffect, useRef, useCallback } from 'react';
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
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: el, start: 'top 85%', toggleActions: 'play none none none',
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
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: {
            trigger: el, start: 'top 85%', toggleActions: 'play none none none',
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
          opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el, start: 'top 85%', toggleActions: 'play none none none',
            ...options.scrollTrigger,
          },
          ...options,
        }
      );
    });
    return () => ctx.revert();
  }, [ref, options]);
}

export function useParallax(ref, options = {}) {
  const { speed = 0.3, direction = 'y' } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        [direction]: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top bottom', end: 'bottom top',
          scrub: 1.5, invalidateOnRefresh: true,
          ...options.scrollTrigger,
        },
      });
    });
    return () => ctx.revert();
  }, [ref, speed, direction, options]);
}

export function useHoverTilt(ref, options = {}) {
  const { maxTilt = 8, scale = 1.02, perspective = 1000 } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        gsap.to(el, {
          rotationY: (x - 0.5) * maxTilt * 2,
          rotationX: (0.5 - y) * maxTilt * 2,
          scale: scale,
          transformPerspective: perspective,
          duration: 0.4, ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          rotationY: 0, rotationX: 0, scale: 1,
          duration: 0.6, ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        });
      });
    });
    return () => ctx.revert();
  }, [ref, maxTilt, scale, perspective]);
}

export function useCounter(end, duration = 2000, start = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: start };
    gsap.to(obj, {
      val: end,
      duration: duration / 1000,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el, start: 'top 85%', toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString();
      },
    });
  }, [end, duration, start]);
  return ref;
}

export function usePageEnter() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);
  return ref;
}

export function useHeroTimeline(ref, options = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.children;
    if (!children.length) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
      tl.fromTo(children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [ref, options]);
}

export function useMagneticEffect(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
      });
    });
    return () => ctx.revert();
  }, [ref]);
}

export default function useScrollAnimation(trigger) {
  const animate = useCallback((target, vars) => {
    return gsap.fromTo(target, { opacity: 0, y: 30 }, {
      ...vars,
      scrollTrigger: {
        trigger: trigger || target,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  }, [trigger]);
  return animate;
}
