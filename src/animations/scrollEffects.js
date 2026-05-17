import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function parallaxSection(element, speed = 0.3) {
  if (!element) return;
  const ctx = gsap.context(() => {
    gsap.to(element, {
      y: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  });
  return ctx;
}

export function revealStagger(container, options = {}) {
  const { stagger = 0.1, y = 30, start = 'top 85%' } = options;
  if (!container?.children?.length) return;
  const ctx = gsap.context(() => {
    gsap.fromTo(container.children,
      { opacity: 0, y },
      {
        opacity: 1, y: 0, duration: 0.6, stagger, ease: 'power2.out',
        scrollTrigger: {
          trigger: container, start, toggleActions: 'play none none none',
        },
      }
    );
  });
  return ctx;
}

export function counterAnimation(element, end, duration = 2000) {
  if (!element) return;
  const ctx = gsap.context(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: duration / 1000,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element, start: 'top 85%', toggleActions: 'play none none none',
      },
      onUpdate: () => { element.textContent = Math.round(obj.val).toLocaleString(); },
    });
  });
  return ctx;
}
