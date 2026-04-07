import { Link } from 'react-router-dom';
import { events } from '../data/content';
import PageTransition from '../components/PageTransition';

export default function Events() {
  return (
    <PageTransition variant="list">
      <div className="flex flex-col gap-8">
      <h1 className="font-serif" style={{ fontSize: 40, color: '#1a1a1a', fontWeight: 400 }}>Events</h1>

      <div className="flex flex-col gap-4" style={{ maxWidth: 980, width: '100%' }}>
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/events/${event.id}`}
            className="bg-white rounded-xl border border-border flex items-center no-underline hover:shadow-[0px_4px_12px_rgba(0,0,0,0.08)] transition-shadow"
            style={{ maxWidth: 980, width: '100%', padding: '16px', gap: 16 }}
          >
            {/* Date block */}
            <div className="bg-brand-light rounded-xl flex flex-col items-center justify-center shrink-0 w-[56px] h-[56px] md:w-[64px] md:h-[64px]">
              <span className="font-semibold text-brand uppercase" style={{ fontSize: 11 }}>{event.month}</span>
              <span className="font-semibold" style={{ fontSize: 24, color: '#3d5a3d' }}>{event.day}</span>
            </div>

            {/* Thumbnail — hidden on mobile */}
            <div className="bg-[#ddd] rounded-lg shrink-0 hidden md:block" style={{ width: 160, height: 112 }} />

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1 min-w-0">
              <h3 className="font-semibold text-text-primary" style={{ fontSize: 18 }}>{event.title}</h3>
              {event.description && (
                <p className="text-text-secondary line-clamp-2 hidden md:block" style={{ fontSize: 13, lineHeight: '20px', maxWidth: 500 }}>{event.description}</p>
              )}
              <p className="text-text-muted" style={{ fontSize: 12 }}>{event.date}  ·  {event.time}</p>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </PageTransition>
  );
}
