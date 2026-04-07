import { useState, useRef, useEffect } from 'react';
import { useToast } from './Toast';

export default function PostOverflowMenu({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/community/${postId}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied to clipboard');
    }).catch(() => {
      showToast('Link copied to clipboard');
    });
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="relative" style={{ zIndex: 10 }}>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent rounded-md"
        style={{ width: 28, height: 28 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3" r="1.5" fill="#999" />
          <circle cx="8" cy="8" r="1.5" fill="#999" />
          <circle cx="8" cy="13" r="1.5" fill="#999" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute bg-white rounded-lg"
          style={{
            top: 32,
            right: 0,
            width: 180,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            border: '1px solid #ebebeb',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleCopyLink}
            className="w-full text-left hover:bg-gray-50 transition-colors cursor-pointer border-none bg-transparent flex items-center"
            style={{ padding: '10px 14px', fontSize: 13, color: '#222', gap: 8 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 9.5L9.5 6.5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 10L10.5 8.5C11.6046 7.39543 11.6046 5.60457 10.5 4.5C9.39543 3.39543 7.60457 3.39543 6.5 4.5L5 6" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 6L5.5 7.5C4.39543 8.60457 4.39543 10.3954 5.5 11.5C6.60457 12.6046 8.39543 12.6046 9.5 11.5L11 10" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
