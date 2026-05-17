import gsap from 'gsap';

export function pageEnter(element) {
  const ctx = gsap.context(() => {
    gsap.fromTo(element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  });
  return ctx;
}

export function pageLeave(element) {
  const ctx = gsap.context(() => {
    gsap.to(element, {
      opacity: 0, y: -10, duration: 0.2, ease: 'power2.in',
    });
  });
  return ctx;
}

export function heroReveal(container) {
  const children = container?.children;
  if (!children?.length) return;
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    tl.fromTo(container, { opacity: 1 }, { opacity: 1, duration: 0 })
      .fromTo(children, { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.15 }, 0.2);
  });
  return ctx;
}

export function cardStaggerIn(grid, staggerAmount = 0.06) {
  if (!grid?.children?.length) return;
  const ctx = gsap.context(() => {
    gsap.fromTo(grid.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.5, stagger: staggerAmount, ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 90%', toggleActions: 'play none none none' },
      }
    );
  });
  return ctx;
}
