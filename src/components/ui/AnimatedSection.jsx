import { useRef } from 'react';
import { useGsapFadeIn } from '../../hooks/useAnimations';

export default function AnimatedSection({ children, className = '', as: Tag = 'section', options = {} }) {
  const ref = useRef(null);
  useGsapFadeIn(ref, options);
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
