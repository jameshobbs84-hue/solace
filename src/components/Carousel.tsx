import { useRef, useState, useEffect, type ReactNode } from 'react';

export default function Carousel({
  title,
  children,
  titleSize,
  smallArrows = false,
}: {
  title: string;
  children: ReactNode;
  titleSize?: string;
  smallArrows?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentDot, setCurrentDot] = useState(0);
  const [totalDots, setTotalDots] = useState(3);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateDots = () => {
      const scrollWidth = track.scrollWidth - track.clientWidth;
      if (scrollWidth <= 0) {
        setTotalDots(1);
        setCurrentDot(0);
        return;
      }
      const dots = Math.ceil(scrollWidth / track.clientWidth) + 1;
      setTotalDots(Math.min(dots, 5));
      const progress = track.scrollLeft / scrollWidth;
      setCurrentDot(Math.round(progress * (Math.min(dots, 5) - 1)));
    };

    updateDots();
    track.addEventListener('scroll', updateDots);
    return () => track.removeEventListener('scroll', updateDots);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;
    const amount = track.clientWidth * 0.8;
    track.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  const btnSize = smallArrows ? 32 : 40;
  const btnRadius = smallArrows ? 16 : 20;

  return (
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between" style={{ height: 44 }}>
        <h2
          className="font-serif text-text-primary leading-normal"
          style={{ fontSize: titleSize === 'text-[24px]' ? 24 : 28 }}
        >
          {title}
        </h2>
        <div className="flex" style={{ gap: 8 }}>
          <button
            onClick={() => scroll('left')}
            className="flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
            style={{
              width: btnSize,
              height: btnSize,
              borderRadius: btnRadius,
              backgroundColor: 'white',
              border: '1px solid #d1d1d1',
            }}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path d="M7.5 1L1.5 7L7.5 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex items-center justify-center hover:opacity-80 transition-colors cursor-pointer border-none"
            style={{
              width: btnSize,
              height: btnSize,
              borderRadius: btnRadius,
              backgroundColor: '#1a1a1a',
            }}
          >
            <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
              <path d="M1.5 1L7.5 7L1.5 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Card Track — 12px gap after header */}
      <div
        ref={trackRef}
        className="flex overflow-x-auto hide-scrollbar scroll-smooth"
        style={{ gap: 20, marginTop: 12, paddingBottom: 12, paddingLeft: 4, paddingRight: 4, marginLeft: -4, marginRight: -4 }}
      >
        {children}
      </div>

      {/* Dots */}
      {totalDots > 1 && (
        <div className="flex justify-center" style={{ gap: 8, marginTop: 16 }}>
          {Array.from({ length: totalDots }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentDot ? '#7a9b7a' : '#d1d1d1',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
