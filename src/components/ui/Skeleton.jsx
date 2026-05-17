export default function Skeleton({ className = '', variant = 'rect', width, height }) {
  const base = 'skeleton';
  const styles = {
    rect: '',
    circle: 'rounded-full',
    text: 'h-4 rounded',
    card: 'aspect-[3/4] rounded-xl',
  };
  return (
    <div
      className={`${base} ${styles[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="card" />
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  );
}
