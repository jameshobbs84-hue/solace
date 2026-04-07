import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { events } from '../data/content';
import { useToast } from '../components/Toast';
import PageTransition from '../components/PageTransition';

export default function EventDetail() {
  const [activeTab, setActiveTab] = useState<'details' | 'discussion'>('details');
  const [showRSVP, setShowRSVP] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const event = events.find((e) => e.id === id);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/events/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard');
    } catch {
      // Fallback for sandboxed or insecure contexts
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Link copied to clipboard');
    }
  }, [id, showToast]);

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted">Event not found</p>
        <Link to="/events" className="text-brand font-semibold mt-4 inline-block no-underline">Back to events</Link>
      </div>
    );
  }

  return (
    <PageTransition variant="detail">
      <div className="flex flex-col gap-8">
      {/* Back link */}
      <Link to="/events" className="font-medium no-underline" style={{ fontSize: 14, color: '#555' }}>
        &larr; Back to Events
      </Link>

      {/* Two-column layout */}
      <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
        {/* Main content */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {/* Title row with date block */}
          <div className="flex items-center gap-4">
            <div className="bg-brand-light flex flex-col items-center justify-center shrink-0" style={{ width: 72, height: 72, borderRadius: 14 }}>
              <span className="font-semibold text-brand uppercase" style={{ fontSize: 12 }}>{event.month}</span>
              <span className="font-semibold" style={{ fontSize: 28, color: '#3d5a3d' }}>{event.day}</span>
            </div>
            <h1 className="font-serif text-text-primary text-[24px] md:text-[36px]">{event.title}</h1>
          </div>

          {/* Attendees row */}
          <div className="flex items-center gap-2">
            <div className="flex" style={{ marginLeft: 0 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-surface-secondary rounded-full border-2 border-white" style={{ width: 28, height: 28, marginLeft: i > 0 ? -8 : 0 }} />
              ))}
            </div>
            <span className="font-medium" style={{ fontSize: 13, color: '#555' }}>{event.attending} attending</span>
          </div>

          {/* Event image */}
          <div className="bg-[#ddd] rounded-xl" style={{ maxWidth: 620, width: '100%', height: 340 }} />

          {/* Tab pills */}
          <div className="flex gap-2">
            {(['details', 'discussion'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-medium transition rounded-3xl ${
                  activeTab === tab
                    ? 'bg-brand text-white'
                    : 'bg-surface-secondary text-text-muted hover:text-text-secondary'
                }`}
                style={{ fontSize: 14, padding: '8px 20px' }}
              >
                {tab === 'details' ? 'Event Details' : 'Discussion'}
              </button>
            ))}
          </div>

          {activeTab === 'details' ? (
            <div className="flex flex-col gap-4">
              <h2 className="font-semibold text-text-primary" style={{ fontSize: 20 }}>About this event</h2>
              <p className="text-text-secondary" style={{ fontSize: 14, lineHeight: '24px', maxWidth: 620, width: '100%' }}>{event.description}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Post composer — matches Community style */}
              <div className="bg-white rounded-xl border border-border" style={{ padding: '16px 20px' }}>
                <div className="flex" style={{ gap: 12 }}>
                  <div className="rounded-full bg-surface-secondary shrink-0" style={{ width: 36, height: 36 }} />
                  <div className="flex-1 flex flex-col" style={{ gap: 12 }}>
                    <textarea
                      placeholder="Share your thoughts about this event..."
                      className="w-full resize-none border-none outline-none placeholder-text-muted bg-transparent"
                      style={{ fontSize: 14, minHeight: 48, fontVariationSettings: "'opsz' 14" }}
                    />
                    <div className="flex justify-end">
                      <button
                        className="font-semibold border-none text-white hover:opacity-90 transition"
                        style={{
                          backgroundColor: '#7a9b7a',
                          fontSize: 13,
                          padding: '6px 20px',
                          borderRadius: 20,
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty state */}
              <div
                className="flex flex-col items-center justify-center"
                style={{ padding: '48px 24px', gap: 8 }}
              >
                <svg width="40" height="40" viewBox="0 0 18 18" fill="none" style={{ color: '#d1d1d1' }}>
                  <path d="M9 15.75C12.73 15.75 15.75 12.73 15.75 9C15.75 5.27 12.73 2.25 9 2.25C5.27 2.25 2.25 5.27 2.25 9C2.25 10.16 2.54 11.25 3.05 12.21L2.25 15.75L5.79 14.95C6.75 15.46 7.84 15.75 9 15.75Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6.375 8.25H11.625M6.375 10.5H9.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="font-semibold" style={{ fontSize: 15, color: '#222' }}>No comments yet</p>
                <p style={{ fontSize: 13, color: '#8c8c8c', fontVariationSettings: "'opsz' 14" }}>Be the first to start the discussion!</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="bg-white border border-border rounded-xl flex flex-col self-start" style={{ maxWidth: 310, width: '100%', padding: 24, gap: 20 }}>
          {/* Date info */}
          <div className="flex items-center gap-3">
            <div className="bg-brand-light rounded-lg flex items-center justify-center shrink-0" style={{ width: 40, height: 40 }}>
              <span style={{ fontSize: 16 }}>📅</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-text-primary" style={{ fontSize: 14 }}>{event.date}</span>
              <span style={{ fontSize: 13, color: '#999' }}>{event.time}</span>
            </div>
          </div>

          {/* Location info */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg flex items-center justify-center shrink-0" style={{ width: 40, height: 40, backgroundColor: '#f5f0eb' }}>
              <span style={{ fontSize: 16 }}>📍</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-text-primary" style={{ fontSize: 14 }}>Virtual (Zoom)</span>
              <span style={{ fontSize: 13, color: '#999' }}>Online event</span>
            </div>
          </div>

          {/* Host section */}
          <div className="flex items-center gap-3">
            <div className="bg-surface-secondary rounded-full shrink-0" style={{ width: 44, height: 44 }} />
            <div className="flex flex-col">
              <span className="font-semibold text-text-primary" style={{ fontSize: 14 }}>{event.host}</span>
              <span style={{ fontSize: 13, color: '#999' }}>Host</span>
            </div>
          </div>

          {/* RSVP button */}
          <button
            onClick={() => setShowRSVP(true)}
            className="w-full bg-brand text-white font-semibold rounded-3xl hover:opacity-90 transition"
            style={{ padding: '12px 24px', fontSize: 15 }}
          >
            RSVP
          </button>

          {/* Copy link button */}
          <button
            onClick={handleCopyLink}
            className="w-full bg-white border rounded-3xl font-medium text-text-primary hover:bg-gray-50 transition"
            style={{ padding: '12px 24px', fontSize: 14, borderColor: '#ddd' }}
          >
            Copy link
          </button>
        </div>
      </div>

      {showRSVP && (
        <RSVPModal
          event={event}
          onClose={(goToDiscussion) => {
            setShowRSVP(false);
            if (goToDiscussion) setActiveTab('discussion');
          }}
        />
      )}
      </div>
    </PageTransition>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative shrink-0 border-none cursor-pointer transition-colors"
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: checked ? '#7a9b7a' : '#d1d1d1',
        padding: 0,
      }}
    >
      <div
        className="absolute bg-white rounded-full transition-all"
        style={{
          width: 20,
          height: 20,
          top: 2,
          left: checked ? 22 : 2,
        }}
      />
    </button>
  );
}

function RSVPModal({ event, onClose }: { event: typeof events[number]; onClose: (goToDiscussion?: boolean) => void }) {
  const [name, setName] = useState('Sarah Johnson');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [sendReminder, setSendReminder] = useState(true);
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    border: '1px solid #d1d1d1',
    borderRadius: 8,
    padding: '12px 16px',
    fontSize: 14,
    color: '#1a1a1a',
    fontFamily: "'DM Sans', sans-serif",
    fontVariationSettings: "'opsz' 14",
    outline: 'none',
    backgroundColor: '#fff',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: '#545454',
    fontVariationSettings: "'opsz' 14",
  };

  /* ── Success state ── */
  if (confirmed) return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100]"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={() => onClose()}
    >
      <div
        className="bg-white relative flex flex-col items-center text-center"
        style={{
          width: 440,
          maxWidth: '90vw',
          borderRadius: 16,
          padding: '40px 36px 32px',
          gap: 16,
          boxShadow: '0px 8px 32px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success checkmark */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 64, height: 64, backgroundColor: '#e8f0e8' }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 16.5L13.5 22L24 11" stroke="#3d593d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="font-serif" style={{ fontSize: 26, color: '#1a1a1a', margin: 0 }}>
          You're all set!
        </h2>

        <p style={{ fontSize: 14, color: '#666', lineHeight: '22px', fontVariationSettings: "'opsz' 14", maxWidth: 320 }}>
          Your RSVP for <strong style={{ color: '#1a1a1a' }}>{event.title}</strong> has been confirmed.
        </p>

        {/* Event summary card */}
        <div
          className="flex items-center w-full"
          style={{ backgroundColor: '#f5f0eb', borderRadius: 10, padding: '14px 16px', gap: 14, marginTop: 4 }}
        >
          <div
            className="flex flex-col items-center justify-center shrink-0 font-semibold"
            style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: '#e8f0e8' }}
          >
            <span style={{ fontSize: 9, color: '#7a9b7a', fontVariationSettings: "'opsz' 14" }}>{event.month}</span>
            <span style={{ fontSize: 16, color: '#3d593d', fontVariationSettings: "'opsz' 14" }}>{event.day}</span>
          </div>
          <div className="flex flex-col text-left" style={{ gap: 2 }}>
            <span className="font-semibold" style={{ fontSize: 14, color: '#1a1a1a', fontVariationSettings: "'opsz' 14" }}>{event.date}</span>
            <span style={{ fontSize: 12, color: '#999', fontVariationSettings: "'opsz' 14" }}>
              {event.time} – {getEndTime(event.time)} &middot; Virtual (Zoom)
            </span>
          </div>
        </div>

        {/* Confirmation details */}
        <div className="flex flex-col w-full" style={{ gap: 8, marginTop: 4 }}>
          {addToCalendar && (
            <div className="flex items-center" style={{ gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 7.5L7 10.5L12 5" stroke="#3d593d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 13, color: '#666', fontVariationSettings: "'opsz' 14" }}>Added to your calendar</span>
            </div>
          )}
          {sendReminder && (
            <div className="flex items-center" style={{ gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 7.5L7 10.5L12 5" stroke="#3d593d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 13, color: '#666', fontVariationSettings: "'opsz' 14" }}>Reminder set for 30 min before</span>
            </div>
          )}
          <div className="flex items-center" style={{ gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 7.5L7 10.5L12 5" stroke="#3d593d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 13, color: '#666', fontVariationSettings: "'opsz' 14" }}>Confirmation sent to {email}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col w-full" style={{ gap: 10, marginTop: 8 }}>
          <button
            onClick={() => onClose(true)}
            className="w-full font-semibold border-none cursor-pointer hover:opacity-90 transition"
            style={{
              backgroundColor: '#3d593d',
              color: '#fff',
              fontSize: 15,
              padding: '14px 32px',
              borderRadius: 24,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Join the discussion
          </button>
          <button
            onClick={() => onClose()}
            className="w-full font-medium border-none cursor-pointer hover:opacity-70 transition"
            style={{
              backgroundColor: 'transparent',
              color: '#666',
              fontSize: 14,
              padding: '10px 32px',
              borderRadius: 24,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Done
          </button>
        </div>

        <p style={{ fontSize: 12, color: '#999', margin: 0, fontVariationSettings: "'opsz' 14" }}>
          You'll receive the Zoom link via email before the event.
        </p>
      </div>
    </div>
  );

  /* ── RSVP form ── */
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100]"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={() => onClose()}
    >
      <div
        className="bg-white relative flex flex-col"
        style={{
          width: 480,
          maxWidth: '90vw',
          borderRadius: 16,
          padding: '28px 32px',
          gap: 16,
          boxShadow: '0px 8px 32px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss button — pill style matching dashboard tour */}
        <button
          onClick={() => onClose()}
          className="absolute border-none cursor-pointer font-medium hover:opacity-70 transition"
          style={{
            top: 12,
            right: 12,
            backgroundColor: 'rgba(0,0,0,0.06)',
            color: '#545454',
            fontSize: 13,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 6,
            paddingBottom: 6,
            borderRadius: 16,
          }}
        >
          × Dismiss
        </button>

        {/* Title */}
        <h2 className="font-serif" style={{ fontSize: 26, color: '#1a1a1a', margin: 0 }}>
          RSVP to Event
        </h2>

        {/* Event summary card — compact */}
        <div
          className="flex items-center"
          style={{
            backgroundColor: '#f5f0eb',
            borderRadius: 10,
            padding: '14px 16px',
            gap: 14,
          }}
        >
          <div
            className="flex flex-col items-center justify-center shrink-0 font-semibold"
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: '#e8f0e8',
            }}
          >
            <span style={{ fontSize: 9, color: '#7a9b7a', fontVariationSettings: "'opsz' 14" }}>
              {event.month}
            </span>
            <span style={{ fontSize: 16, color: '#3d593d', fontVariationSettings: "'opsz' 14" }}>
              {event.day}
            </span>
          </div>
          <div className="flex flex-col" style={{ gap: 2 }}>
            <span className="font-semibold" style={{ fontSize: 14, color: '#1a1a1a', fontVariationSettings: "'opsz' 14" }}>
              {event.title}
            </span>
            <span style={{ fontSize: 12, color: '#999', fontVariationSettings: "'opsz' 14" }}>
              {event.date} &middot; {event.time} – {getEndTime(event.time)} &middot; Virtual
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#ede8e3' }} />

        {/* Name and Email — side by side */}
        <div className="flex gap-3">
          <div className="flex flex-col flex-1" style={{ gap: 6 }}>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div className="flex flex-col flex-1" style={{ gap: 6 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Calendar toggle */}
        <div className="flex items-center justify-between">
          <span className="font-medium" style={{ fontSize: 14, color: '#545454', fontVariationSettings: "'opsz' 14" }}>
            Add to my calendar
          </span>
          <Toggle checked={addToCalendar} onChange={setAddToCalendar} />
        </div>

        {/* Reminder toggle */}
        <div className="flex items-center justify-between">
          <span className="font-medium" style={{ fontSize: 14, color: '#545454', fontVariationSettings: "'opsz' 14" }}>
            Send me a reminder (30 min before)
          </span>
          <Toggle checked={sendReminder} onChange={setSendReminder} />
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: '#ede8e3' }} />

        {/* Note to host */}
        <div className="flex flex-col" style={{ gap: 6 }}>
          <label style={labelStyle}>Note to host (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a message for the host..."
            style={{
              ...inputStyle,
              height: 64,
              resize: 'none',
            }}
          />
        </div>

        {/* Confirm button */}
        <button
          onClick={() => setConfirmed(true)}
          className="w-full font-semibold border-none cursor-pointer hover:opacity-90 transition"
          style={{
            backgroundColor: '#3d593d',
            color: '#fff',
            fontSize: 16,
            padding: '14px 32px',
            borderRadius: 24,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          Confirm RSVP
        </button>

        {/* Footer text */}
        <p className="text-center" style={{ fontSize: 12, color: '#999', margin: 0, fontVariationSettings: "'opsz' 14" }}>
          By confirming, you'll receive event updates and the Zoom link via email.
        </p>
      </div>
    </div>
  );
}

function getEndTime(startTime: string): string {
  const match = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return '';
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  hours += 1;
  if (hours === 12) return `12:${minutes} ${period === 'AM' ? 'PM' : 'PM'}`;
  if (hours === 13) return `1:${minutes} PM`;
  return `${hours}:${minutes} ${period}`;
}
