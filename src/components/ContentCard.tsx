import { Link } from 'react-router-dom';
import type { ContentItem } from '../data/content';
import { useUser } from '../context/UserContext';
import { useToast } from './Toast';

function typeToRoute(type: string): string {
  switch (type) {
    case 'Audio': return 'audio';
    case 'Video': return 'video';
    case 'Article': return 'article';
    case 'Program': return 'program';
    case 'Resource': return 'resource';
    case 'Discussion': return 'discussion';
    default: return 'article';
  }
}

export default function ContentCard({
  item,
  showProgress = false,
  className = '',
}: {
  item: ContentItem;
  showProgress?: boolean;
  className?: string;
}) {
  const { toggleSave, isSaved } = useUser();
  const { showToast } = useToast();
  const saved = isSaved(item.id);
  const progress = item.progress ?? 0;
  const hasProgress = showProgress && progress > 0;
  const route = `/content/${typeToRoute(item.type)}/${item.id}`;

  return (
    <div className={`bg-white rounded-lg overflow-hidden relative ${className}`} style={{ boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)', height: '280px', transition: 'box-shadow 0.2s, transform 0.2s' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={e => { e.currentTarget.style.boxShadow = '0px 2px 8px 0px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
      <Link
        to={route}
        className="block no-underline h-full"
      >
      {/* Thumbnail */}
      <div className="relative" style={{ height: '160px', backgroundColor: '#ddd' }}>
        <span
          className="absolute"
          style={{
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(38,38,38,0.85)',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '11px',
            fontWeight: 500,
            color: '#fff',
          }}
        >
          {item.type}
        </span>
      </div>

      {/* Progress bar overlay */}
      {hasProgress && (
        <div className="bg-border-medium" style={{ height: '3px' }}>
          <div
            className="h-full bg-brand rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Text area */}
      <div className="flex flex-col" style={{ padding: '12px 16px', gap: '8px' }}>
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#222', lineHeight: 'normal' }}>
          {item.title}
        </p>
        <p style={{ fontSize: '13px', color: '#8c8c8c', fontWeight: 400 }}>
          {item.author}  ·  {item.duration}
        </p>
        {hasProgress && (
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#7a9b7a' }}>
            {progress}% complete
          </p>
        )}
      </div>
      </Link>
      {/* Bookmark button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const wasAdded = toggleSave(item.id);
          showToast(wasAdded ? `"${item.title}" saved` : `"${item.title}" removed from saved`);
        }}
        className="absolute cursor-pointer border-none flex items-center justify-center transition-opacity hover:opacity-80"
        style={{
          top: 12,
          right: 12,
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: saved ? '#7a9b7a' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 18 18" fill={saved ? '#fff' : 'none'}>
          <path d="M13.5 15.75L9 12.375L4.5 15.75V3.375C4.5 3.17609 4.57902 2.98532 4.71967 2.84467C4.86032 2.70402 5.05109 2.625 5.25 2.625H12.75C12.9489 2.625 13.1397 2.70402 13.2803 2.84467C13.421 2.98532 13.5 3.17609 13.5 3.375V15.75Z" stroke={saved ? '#fff' : '#555'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
