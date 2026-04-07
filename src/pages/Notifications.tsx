import { useState, useCallback } from 'react';
import PageTransition from '../components/PageTransition';

/* ── Types ── */
type NotificationType = 'community' | 'message' | 'content' | 'event';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  /** Who/what triggered it */
  actorName?: string;
  /** Link target (not wired to router, but useful for future) */
  href?: string;
}

/* ── Seed notifications ── */
const seedNotifications: Notification[] = [
  // Community
  {
    id: '1',
    type: 'community',
    title: 'Dr. Maya Chen replied to your post',
    body: 'Great insight! I\'d also recommend pairing breathwork with the Evening Wind-Down Meditation for even deeper relaxation.',
    time: '10 min ago',
    read: false,
    actorName: 'Dr. Maya Chen',
    href: '/community',
  },
  {
    id: '2',
    type: 'message',
    title: 'New message from Jordan Rivera',
    body: 'The morning stretch video was exactly what I needed. Any more like that?',
    time: '25 min ago',
    read: false,
    actorName: 'Jordan Rivera',
    href: '/messages',
  },
  {
    id: '3',
    type: 'event',
    title: 'Reminder: Introduction to Breathwork',
    body: 'Your RSVP\'d event with Dr. Maya Chen starts this Saturday, April 12 at 10:00 AM.',
    time: '1 hr ago',
    read: false,
    href: '/events/1',
  },
  {
    id: '4',
    type: 'content',
    title: 'New audio: Breathwork for Sleep',
    body: 'Based on your interest in Sleep and Mindfulness, we think you\'ll enjoy this new guided session by Dr. Maya Chen.',
    time: '2 hrs ago',
    read: false,
    href: '/content/breathwork-for-sleep',
  },
  {
    id: '5',
    type: 'community',
    title: 'Marcus T. liked your comment',
    body: 'On "Week 3 of Sleep Reset program" in Sleep & Rest',
    time: '3 hrs ago',
    read: true,
    actorName: 'Marcus T.',
    href: '/community',
  },
  {
    id: '6',
    type: 'message',
    title: 'New message in Mindfulness Circle',
    body: 'Aisha: Has anyone tried the new walking meditation audio?',
    time: '5 hrs ago',
    read: true,
    actorName: 'Aisha Patel',
    href: '/messages',
  },
  {
    id: '7',
    type: 'content',
    title: 'New article: The Science of Sleep Hygiene',
    body: 'A deep dive into evidence-based sleep practices — perfect for your Sleep Reset journey.',
    time: 'Yesterday',
    read: true,
    href: '/content/science-of-sleep-hygiene',
  },
  {
    id: '8',
    type: 'event',
    title: 'Mindful Movement Workshop is this Friday',
    body: 'Join Jordan Rivera for an interactive session on April 18. Spots are filling up!',
    time: 'Yesterday',
    read: true,
    href: '/events/2',
  },
  {
    id: '9',
    type: 'community',
    title: 'Priya K. replied to a thread you\'re following',
    body: '"Combining Meditation with Journaling" — I\'ve been doing this for a month and the clarity is incredible.',
    time: 'Yesterday',
    read: true,
    actorName: 'Priya K.',
    href: '/community',
  },
  {
    id: '10',
    type: 'content',
    title: 'New video: Calm Your Nervous System in 10 Minutes',
    body: 'A quick reset for stressful moments — guided by Jordan Rivera.',
    time: '2 days ago',
    read: true,
    href: '/content/calm-nervous-system',
  },
  {
    id: '11',
    type: 'community',
    title: 'Sarah Wells mentioned you in Sleep & Rest',
    body: '"@Maya have you tried the mountain lake sleep story? It\'s been a game-changer for me!"',
    time: '2 days ago',
    read: true,
    actorName: 'Sarah Wells',
    href: '/community',
  },
  {
    id: '12',
    type: 'event',
    title: 'Community Wellness Circle — Save the date',
    body: 'A new monthly gathering hosted by the Solace Team on April 25. Open to all members.',
    time: '3 days ago',
    read: true,
    href: '/events/3',
  },
  {
    id: '13',
    type: 'message',
    title: 'New message from Aisha Patel',
    body: 'I\'ll send you the updated meal planning template tomorrow!',
    time: '4 days ago',
    read: true,
    actorName: 'Aisha Patel',
    href: '/messages',
  },
  {
    id: '14',
    type: 'content',
    title: 'New program: Nourish — Nutrition Fundamentals',
    body: '8 lessons on mindful eating and meal planning with Aisha Patel. Matches your wellness goals.',
    time: '5 days ago',
    read: true,
    href: '/content/nourish',
  },
];

/* ── Icons per notification type ── */
const typeIcons: Record<NotificationType, { icon: React.ReactNode; bg: string; color: string }> = {
  community: {
    bg: '#f0e8e8',
    color: '#8b5a5a',
    icon: (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M6.75 11.25C8.82107 11.25 10.5 9.57107 10.5 7.5C10.5 5.42893 8.82107 3.75 6.75 3.75C4.67893 3.75 3 5.42893 3 7.5C3 9.57107 4.67893 11.25 6.75 11.25Z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M12 3.93C13.07 4.46 13.8 5.59 13.8 6.9C13.8 8.21 13.07 9.34 12 9.87" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M1.5 14.25C1.5 12.45 3.85 11.25 6.75 11.25C9.65 11.25 12 12.45 12 14.25" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M12 11.25C14.08 11.25 15.75 12.17 15.75 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  message: {
    bg: '#e8f0e8',
    color: '#3d5a3d',
    icon: (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M9 15.75C12.73 15.75 15.75 12.73 15.75 9C15.75 5.27 12.73 2.25 9 2.25C5.27 2.25 2.25 5.27 2.25 9C2.25 10.16 2.54 11.25 3.05 12.21L2.25 15.75L5.79 14.95C6.75 15.46 7.84 15.75 9 15.75Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  content: {
    bg: '#e8e8f0',
    color: '#5a5a8b',
    icon: (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M9 2.25L11.25 6.75L15.75 7.5L12.375 10.875L13.125 15.75L9 13.5L4.875 15.75L5.625 10.875L2.25 7.5L6.75 6.75L9 2.25Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  event: {
    bg: '#f0ece8',
    color: '#7a6b5a',
    icon: (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <rect x="2.25" y="3.75" width="13.5" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2.25 7.5H15.75" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 2.25V4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M12 2.25V4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
};

const typeLabels: Record<NotificationType, string> = {
  community: 'Community',
  message: 'Messages',
  content: 'New Content',
  event: 'Events',
};

/* ── Filter pills ── */
type FilterKey = 'all' | NotificationType;

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'community', label: 'Community' },
  { key: 'message', label: 'Messages' },
  { key: 'content', label: 'Content' },
  { key: 'event', label: 'Events' },
];

/* ── Components ── */

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const { icon, bg, color } = typeIcons[notification.type];

  return (
    <div
      className="flex items-start cursor-pointer transition-colors"
      style={{
        padding: '16px 20px',
        gap: 14,
        backgroundColor: !notification.read
          ? hovered ? '#f0ece8' : '#f8f5f1'
          : hovered ? '#faf8f5' : 'transparent',
        borderBottom: '1px solid #f0ece8',
        borderRadius: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (!notification.read) onMarkRead(notification.id);
      }}
    >
      {/* Type icon */}
      <div
        className="rounded-full flex items-center justify-center shrink-0"
        style={{
          width: 36,
          height: 36,
          backgroundColor: bg,
          color,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0" style={{ gap: 2 }}>
        <div className="flex items-start justify-between" style={{ gap: 12 }}>
          <div className="flex-1 min-w-0">
            <p
              style={{
                fontSize: 14,
                fontWeight: notification.read ? 400 : 600,
                color: '#1a1a1a',
                lineHeight: '20px',
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {notification.title}
            </p>
            <p
              className="line-clamp-2"
              style={{
                fontSize: 13,
                color: notification.read ? '#999' : '#666',
                lineHeight: '19px',
                marginTop: 3,
                fontVariationSettings: "'opsz' 14",
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {notification.body}
            </p>
          </div>

          <div className="flex items-center shrink-0" style={{ gap: 8, paddingTop: 2 }}>
            <span
              style={{
                fontSize: 12,
                color: notification.read ? '#bbb' : '#999',
                whiteSpace: 'nowrap',
              }}
            >
              {notification.time}
            </span>
            {!notification.read && (
              <div
                className="rounded-full shrink-0"
                style={{ width: 8, height: 8, backgroundColor: '#7a9b7a' }}
              />
            )}
          </div>
        </div>

        {/* Type badge */}
        <div
          className="inline-flex items-center"
          style={{
            marginTop: 6,
            gap: 4,
            fontSize: 11,
            color: color,
            fontWeight: 500,
            fontVariationSettings: "'opsz' 14",
          }}
        >
          <span
            className="rounded-full"
            style={{
              width: 5,
              height: 5,
              backgroundColor: color,
              display: 'inline-block',
              opacity: 0.5,
            }}
          />
          {typeLabels[notification.type]}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <PageTransition variant="list">
      <div className="flex flex-col" style={{ gap: 0 }}>
      {/* Header area */}
      <div className="flex items-end justify-between" style={{ marginBottom: 20 }}>
        <div className="flex items-center" style={{ gap: 14 }}>
          <h1
            className="font-serif"
            style={{ fontSize: 40, color: '#1a1a1a', fontWeight: 400 }}
          >
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span
              className="flex items-center justify-center font-semibold"
              style={{
                minWidth: 22,
                height: 22,
                padding: '0 7px',
                borderRadius: 11,
                backgroundColor: '#3d5a3d',
                color: '#fff',
                fontSize: 12,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="border-none bg-transparent cursor-pointer font-semibold transition-opacity hover:opacity-70"
            style={{
              fontSize: 13,
              color: '#3d5a3d',
              padding: '6px 0',
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex overflow-x-auto" style={{ gap: 8, marginBottom: 16, WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {filters.map((f) => {
          const isActive = activeFilter === f.key;
          const count =
            f.key === 'all'
              ? notifications.filter((n) => !n.read).length
              : notifications.filter((n) => n.type === f.key && !n.read).length;

          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className="border-none cursor-pointer transition-colors shrink-0"
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? '#3d5a3d' : '#fff',
                color: isActive ? '#fff' : '#555',
                border: isActive ? 'none' : '1px solid #e0dcd7',
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {f.label}
              {count > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 11,
                    opacity: isActive ? 0.8 : 0.7,
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div
        className="bg-white overflow-hidden"
        style={{
          borderRadius: 12,
          border: '1px solid #ebebeb',
        }}
      >
        {filtered.length > 0 ? (
          filtered.map((notif) => (
            <NotificationRow
              key={notif.id}
              notification={notif}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{ padding: '60px 24px', gap: 8 }}
          >
            <svg width="44" height="44" viewBox="0 0 18 18" fill="none" style={{ color: '#d1d1d1' }}>
              <path d="M13.5 6.75C13.5 5.55653 13.0259 4.41193 12.182 3.56802C11.3381 2.72411 10.1935 2.25 9 2.25C7.80653 2.25 6.66193 2.72411 5.81802 3.56802C4.97411 4.41193 4.5 5.55653 4.5 6.75C4.5 12 2.25 13.5 2.25 13.5H15.75C15.75 13.5 13.5 12 13.5 6.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.2975 15.75C10.1657 15.9773 9.97614 16.166 9.74831 16.2968C9.52048 16.4277 9.2625 16.4963 9 16.4963C8.7375 16.4963 8.47952 16.4277 8.25169 16.2968C8.02386 16.166 7.83434 15.9773 7.7025 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="font-semibold" style={{ fontSize: 15, color: '#222' }}>
              No {activeFilter === 'all' ? '' : typeLabels[activeFilter as NotificationType].toLowerCase() + ' '}notifications
            </p>
            <p style={{ fontSize: 13, color: '#8c8c8c', fontVariationSettings: "'opsz' 14" }}>
              You're all caught up!
            </p>
          </div>
        )}
      </div>
      </div>
    </PageTransition>
  );
}
