import { useState, useEffect, type ReactNode } from 'react';

/**
 * Skeleton primitives — reusable across pages.
 */
export function SkeletonBlock({
  width,
  height,
  radius = 8,
  style,
}: {
  width: string | number;
  height: number;
  radius?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: '#e8e4df',
        ...style,
      }}
    />
  );
}

export function SkeletonText({ width, height = 14 }: { width: string | number; height?: number }) {
  return <SkeletonBlock width={width} height={height} radius={4} />;
}

/**
 * Generic page skeleton — heading + rows of content blocks.
 * Variants: 'list' (rows), 'grid' (cards), 'detail' (single hero + text).
 */
function PageSkeleton({ variant = 'list' }: { variant?: 'list' | 'grid' | 'detail' | 'settings' }) {
  if (variant === 'detail') {
    return (
      <div className="flex flex-col" style={{ gap: 24, maxWidth: 640, width: '100%' }}>
        <SkeletonText width={100} height={14} />
        <SkeletonBlock width="100%" height={320} radius={12} />
        <SkeletonText width="60%" height={28} />
        <div className="flex flex-col" style={{ gap: 10 }}>
          <SkeletonText width="100%" height={14} />
          <SkeletonText width="90%" height={14} />
          <SkeletonText width="75%" height={14} />
        </div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="flex flex-col" style={{ gap: 24 }}>
        <SkeletonText width={200} height={40} />
        <div className="flex" style={{ gap: 16 }}>
          <SkeletonBlock width={160} height={36} radius={20} />
          <SkeletonBlock width={120} height={36} radius={20} />
          <SkeletonBlock width={140} height={36} radius={20} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col" style={{ gap: 10 }}>
              <SkeletonBlock width="100%" height={160} radius={8} />
              <SkeletonText width="40%" height={10} />
              <SkeletonText width="80%" height={16} />
              <SkeletonText width="55%" height={12} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'settings') {
    return (
      <div className="flex flex-col" style={{ gap: 32 }}>
        <SkeletonText width={260} height={40} />
        <div className="flex items-center" style={{ gap: 16 }}>
          <SkeletonBlock width={64} height={64} radius={999} />
          <div className="flex flex-col" style={{ gap: 6 }}>
            <SkeletonText width={120} height={16} />
            <SkeletonText width={180} height={14} />
          </div>
        </div>
        <div className="flex" style={{ gap: 16 }}>
          <SkeletonBlock width={480} height={48} radius={8} />
          <SkeletonBlock width={480} height={48} radius={8} />
        </div>
        <SkeletonBlock width="100%" height={1} radius={0} />
        <SkeletonText width={140} height={20} />
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {[0, 1, 2].map(i => <SkeletonBlock key={i} width={140} height={36} radius={999} />)}
        </div>
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {[0, 1, 2, 3, 4, 5].map(i => <SkeletonBlock key={i} width={110} height={36} radius={999} />)}
        </div>
      </div>
    );
  }

  // Default: 'list'
  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <SkeletonText width={200} height={40} />
      <SkeletonText width={340} height={16} />
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="flex" style={{ gap: 16, alignItems: 'center' }}>
          <SkeletonBlock width={64} height={64} radius={12} />
          <div className="flex-1 flex flex-col" style={{ gap: 8 }}>
            <SkeletonText width="50%" height={16} />
            <SkeletonText width="80%" height={13} />
            <SkeletonText width="30%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Wraps page content with a skeleton → fade-in transition.
 *
 * @param delay  How long to show skeleton (ms). Default 400.
 * @param variant  Skeleton layout shape.
 * @param children  The real page content.
 */
export default function PageTransition({
  delay = 400,
  variant = 'list',
  children,
}: {
  delay?: number;
  variant?: 'list' | 'grid' | 'detail' | 'settings';
  children: ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (loading) {
    return <PageSkeleton variant={variant} />;
  }

  return <div className="page-fade-in">{children}</div>;
}
