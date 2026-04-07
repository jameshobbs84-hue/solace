import { events } from '../../data/content';
import { useToast } from '../../components/Toast';

export default function AdminEvents() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: 32, color: '#1a1a1a', fontWeight: 400 }}>
            Event Management
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>
            {events.length} events scheduled
          </p>
        </div>
        <button
          onClick={() => showToast('Event creation coming soon')}
          className="cursor-pointer border-none hover:opacity-90 transition"
          style={{
            backgroundColor: '#7a9b7a',
            color: '#fff',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          + Create Event
        </button>
      </div>

      {/* Events table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #ebebeb' }}>
        {/* Header */}
        <div
          className="hidden md:grid items-center"
          style={{
            gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 100px',
            padding: '12px 20px',
            borderBottom: '1px solid #ebebeb',
            backgroundColor: '#fafafa',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Host</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attending</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
        </div>

        {/* Rows */}
        {events.map((event) => (
          <div
            key={event.id}
            className="md:grid items-center hover:bg-gray-50 transition-colors cursor-pointer"
            style={{
              gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 100px',
              padding: '14px 20px',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <div
              className="hidden md:flex flex-col items-center justify-center rounded-lg"
              style={{ width: 44, height: 44, backgroundColor: '#f5f0eb' }}
            >
              <span style={{ fontSize: 9, fontWeight: 600, color: '#3d5a3d', textTransform: 'uppercase' }}>{event.month}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#3d5a3d' }}>{event.day}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate" style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{event.title}</p>
              <p className="md:hidden" style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                {event.date} · {event.time} · {event.attending} attending
              </p>
            </div>
            <span className="hidden md:block truncate" style={{ fontSize: 13, color: '#555' }}>{event.host}</span>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{event.time}</span>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{event.attending} RSVPs</span>
            <div className="hidden md:block">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 4,
                  backgroundColor: '#e8f0e8',
                  color: '#3d5a3d',
                }}
              >
                Upcoming
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
