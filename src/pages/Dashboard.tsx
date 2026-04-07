import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import ContentCard from '../components/ContentCard';
import { useUser } from '../context/UserContext';
import { events } from '../data/content';
import { useContent } from '../context/ContentContext';

/* ── Skeleton primitives ── */
function SkeletonBlock({ width, height, radius = 8, style }: { width: string | number; height: number; radius?: number; style?: React.CSSProperties }) {
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

function SkeletonText({ width, height = 14 }: { width: string | number; height?: number }) {
  return <SkeletonBlock width={width} height={height} radius={4} />;
}

function SkeletonCard() {
  return (
    <div className="shrink-0" style={{ width: 295 }}>
      <SkeletonBlock width="100%" height={160} />
      <div className="flex flex-col" style={{ padding: '12px 0', gap: 8 }}>
        <SkeletonText width="40%" height={10} />
        <SkeletonText width="85%" height={16} />
        <SkeletonText width="60%" height={12} />
      </div>
    </div>
  );
}

function SkeletonCarousel({ titleWidth = 140 }: { titleWidth?: number }) {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <SkeletonText width={titleWidth} height={28} />
      <div className="flex" style={{ gap: 20, overflow: 'hidden' }}>
        {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      {/* Header skeleton */}
      <SkeletonText width={320} height={48} />

      {/* Banner skeleton */}
      <SkeletonBlock width="100%" height={320} radius={12} />

      {/* Programs skeleton */}
      <div>
        <SkeletonText width={140} height={28} />
        <div className="flex" style={{ gap: 24, marginTop: 16 }}>
          <SkeletonBlock width="50%" height={260} radius={8} />
          <SkeletonBlock width="50%" height={260} radius={8} />
        </div>
      </div>

      {/* Carousel skeletons */}
      <SkeletonCarousel titleWidth={100} />
      <SkeletonCarousel titleWidth={180} />
    </div>
  );
}

export default function Dashboard() {
  const { user, dismissTour } = useUser();
  const { content: allContent } = useContent();
  const [justDismissedTour, setJustDismissedTour] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Content with actual progress (for "Continue where you left off")
  const continueItems = allContent.filter(c => (c.progress ?? 0) > 0);
  const hasStartedContent = continueItems.length > 0 && user.hasSeenTour && !justDismissedTour;

  // "For you" rail: filter by user's stage affinity + focus areas + content preference
  // Falls back to a diverse mix if no focus areas or preferences are set
  const forYouItems = (() => {
    if (user.focusAreas.length === 0 && (!user.contentPreference || user.contentPreference === '')) {
      // No preferences set — return a diverse mix of content types
      const types = ['Audio', 'Video', 'Article', 'Program'];
      const mixed: typeof allContent = [];
      for (const type of types) {
        const ofType = allContent.filter(c => c.type === type);
        mixed.push(...ofType.slice(0, 2));
      }
      return mixed.slice(0, 6);
    }
    const filtered = allContent.filter(item => {
      const matchesFocus = user.focusAreas.length === 0 || item.topics.some(t => user.focusAreas.includes(t));
      const matchesPreference =
        !user.contentPreference || user.contentPreference === '' ||
        user.contentPreference === 'A mix of everything' ||
        item.type === user.contentPreference;
      return matchesFocus && matchesPreference;
    }).slice(0, 6);
    // If filtering is too narrow, fall back to a general mix
    return filtered.length > 0 ? filtered : allContent.filter(c => c.type !== 'Discussion').slice(0, 6);
  })();

  // Stage-based rail: content appropriate for the user's stage
  // Falls back to beginner-friendly content if no stage is selected
  const stageItems = (() => {
    switch (user.stage) {
      case 'Just starting out':
        return allContent.filter(item =>
          ['starting-wellness-journey', 'body-scan-beginners', 'morning-stretch-routine', 'guided-body-scan', 'breathing-techniques-calm'].includes(item.id)
        );
      case 'Finding my footing':
        return allContent.filter(item =>
          ['sleep-reset', 'starting-wellness-journey', 'body-scan-beginners', 'morning-stretch-routine'].includes(item.id)
        );
      case 'Ready to go deeper':
        return allContent.filter(item =>
          ['mindful-mornings', 'sleep-reset', 'intro-body-awareness', 'meditation-journaling', 'walking-mindfulness'].includes(item.id)
        );
      default:
        // No stage selected — show popular / beginner-friendly content
        return allContent.filter(item =>
          ['sleep-reset', 'guided-body-scan', 'starting-wellness-journey', 'morning-stretch-routine', 'breathing-techniques-calm'].includes(item.id)
        );
    }
  })();

  // Dynamic focus area rails based on user's selected focus areas
  const focusRails = user.focusAreas.map(area => ({
    title: area,
    items: allContent.filter(item => item.topics.includes(area)).slice(0, 5),
  })).filter(rail => rail.items.length > 0);

  const topics = ['Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness'];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-10 dashboard-fade-in">
      {/* 1. Header */}
      <div>
        <h1 className="font-serif" style={{ fontSize: 40, color: '#1a1a1a', fontWeight: 400 }}>
          Welcome, {user.name}
        </h1>
      </div>

      {/* 2. Tour Banner (first-run only, hidden once dismissed) */}
      {!user.hasSeenTour && !justDismissedTour && (
        <div className="bg-brand-light rounded-xl flex overflow-hidden relative" style={{ minHeight: 240 }}>
          <button
            onClick={() => { dismissTour(); setJustDismissedTour(true); }}
            className="absolute font-medium text-[13px] hover:opacity-70 transition cursor-pointer border-none rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)', color: '#545454', top: 16, right: 16, paddingLeft: 12, paddingRight: 12, paddingTop: 6, paddingBottom: 6 }}
          >
            × Dismiss
          </button>
          <div className="flex flex-col justify-center flex-1" style={{ padding: '32px 24px', gap: 12 }}>
            <h2 className="font-serif text-[28px] text-text-primary" style={{ lineHeight: '34px' }}>
              Get started with the Solace platform
            </h2>
            <p className="text-[14px]" style={{ lineHeight: '22px', color: '#666', maxWidth: 400 }}>
              Take a quick tour to learn how to make the most of your membership.
            </p>
            <button
              onClick={() => setVideoOpen(true)}
              className="bg-brand-dark text-white font-semibold rounded-3xl w-fit hover:opacity-90 transition border-none cursor-pointer"
              style={{ fontSize: 14, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
            >
              Watch Intro Video
            </button>
          </div>
          <div
            className="rounded-r-xl shrink-0 hidden md:block"
            style={{ width: 320, height: 320, backgroundColor: '#d1ded1' }}
          />
        </div>
      )}

      {/* Continue where you left off (returning user only, not right after dismissing tour) */}
      {hasStartedContent && (
        <Carousel title="Continue where you left off" titleSize="text-[24px]" smallArrows>
          {continueItems.map(item => (
            <ContentCard key={item.id} item={item} showProgress className="w-[295px] shrink-0" />
          ))}
        </Carousel>
      )}

      {/* 3. Featured Card — hidden during tour, fades in after dismiss */}
      {(hasStartedContent || justDismissedTour) && (
      <div
        className="bg-surface-secondary rounded-xl flex overflow-hidden"
        style={{
          minHeight: 280,
          animation: justDismissedTour ? 'fadeIn 0.5s ease-out' : undefined,
        }}
      >
        <div className="flex flex-col justify-center flex-1" style={{ padding: '32px 24px', gap: 16 }}>
          <span className="bg-badge-bg text-white text-[11px] font-medium rounded w-fit" style={{ paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}>
            Featured
          </span>
          <h2 className="font-serif text-[28px] md:text-[32px] leading-tight" style={{ color: '#1a1a1a' }}>
            The Sleep Reset
          </h2>
          <p className="text-[14px]" style={{ lineHeight: '22px', color: '#666' }}>
            A 7-day guided program to rebuild your relationship with sleep. Includes audio guides, journaling prompts, and expert-led video sessions.
          </p>
          <Link
            to="/content/program/sleep-reset"
            className="bg-brand text-white font-semibold text-[16px] rounded-3xl w-fit no-underline hover:opacity-90 transition"
            style={{ paddingLeft: 24, paddingRight: 24, paddingTop: 12, paddingBottom: 12 }}
          >
            Start learning
          </Link>
        </div>
        <div className="bg-[#ddd] flex-1 rounded-r-xl hidden md:block" />
      </div>
      )}

      {/* 4. Programs — no progress bars in default view */}
      <div>
        <h2 className="font-serif text-[28px] text-text-primary mb-4">Programs</h2>
        <div className="flex" style={{ gap: 24, flexWrap: 'wrap' }}>
          <Link to="/content/program/mindful-mornings" className="bg-white overflow-hidden flex flex-col flex-1 no-underline hover:shadow-md transition-shadow" style={{ height: 260, borderRadius: 8, boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)', minWidth: 260 }}>
            <div style={{ height: 140 }} className="bg-[#ddd]" />
            <div className="flex flex-col flex-1" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 16, gap: 4 }}>
              <p className="font-semibold text-[16px]" style={{ color: '#1a1a1a' }}>Mindful Mornings</p>
              <p className="text-[13px]" style={{ lineHeight: '18px', color: '#666' }}>Start your day with intention through guided meditation and breathwork.</p>
            </div>
          </Link>

          <Link to="/content/program/movement-anxiety-relief" className="bg-white overflow-hidden flex flex-col flex-1 no-underline hover:shadow-md transition-shadow" style={{ height: 260, borderRadius: 8, boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)', minWidth: 260 }}>
            <div style={{ height: 140 }} className="bg-[#ddd]" />
            <div className="flex flex-col flex-1" style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 16, gap: 4 }}>
              <p className="font-semibold text-[16px]" style={{ color: '#1a1a1a' }}>Movement for Anxiety Relief</p>
              <p className="text-[13px]" style={{ lineHeight: '18px', color: '#666' }}>Gentle movement practices designed to calm your nervous system.</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. For you (dynamic based on focus + preference) */}
      {forYouItems.length > 0 && (
        <Carousel title="For you">
          {forYouItems.map(item => (
            <ContentCard key={item.id} item={item} className="w-[295px] shrink-0" />
          ))}
        </Carousel>
      )}

      {/* 6. Stage rail (dynamic title based on user's stage) */}
      {stageItems.length > 0 && (
        <Carousel title={user.stage || 'Recommended for you'}>
          {stageItems.map(item => (
            <ContentCard key={item.id} item={item} className="w-[295px] shrink-0" />
          ))}
        </Carousel>
      )}

      {/* 7. Focus area rails (dynamic based on user's selected focus areas) */}
      {focusRails.map(rail => (
        <Carousel key={rail.title} title={rail.title}>
          {rail.items.map(item => (
            <ContentCard key={item.id} item={item} className="w-[295px] shrink-0" />
          ))}
        </Carousel>
      ))}

      {/* 8. Browse by topics */}
      <div>
        <h2 className="font-serif text-text-primary" style={{ fontSize: 28, lineHeight: 'normal' }}>Browse by topics</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', rowGap: 16, columnGap: 24, marginTop: 12 }}>
          {topics.map(topic => (
            <Link
              key={topic}
              to={`/library?topic=${topic}`}
              className="bg-white border border-border rounded-xl flex items-center justify-center no-underline hover:bg-gray-50 transition"
              style={{ height: 64, fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>

      {/* 9. Community CTA */}
      <div className="bg-surface-secondary rounded-xl flex overflow-hidden" style={{ minHeight: 240 }}>
        <div className="flex flex-col justify-center flex-1" style={{ padding: '32px 24px', gap: 12 }}>
          <h2 className="font-serif text-[24px] md:text-[28px] text-text-primary" style={{ lineHeight: '34px' }}>
            Join the Solace Community
          </h2>
          <p className="text-[14px]" style={{ lineHeight: '22px', color: '#666', maxWidth: 400 }}>
            Connect with fellow members, share your journey, and find support in a welcoming space.
          </p>
          <Link
            to="/community"
            className="bg-brand-dark text-white font-semibold rounded-3xl w-fit no-underline hover:opacity-90 transition"
            style={{ fontSize: 14, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10 }}
          >
            Join the conversation
          </Link>
        </div>
        <div
          className="rounded-r-xl shrink-0 hidden md:block"
          style={{ width: 320, height: 320, backgroundColor: '#e0d6cc' }}
        />
      </div>

      {/* 10. Upcoming events */}
      <Carousel title="Upcoming events">
        {events.map(event => (
          <Link
            to={`/events/${event.id}`}
            key={event.id}
            className="shrink-0 bg-white border border-border-medium rounded-xl overflow-hidden no-underline"
            style={{ width: 300, transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0px 4px 16px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0px 2px 8px 0px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div className="relative h-[140px] bg-[#ddd]">
              <div className="absolute bg-white flex flex-col items-center justify-center" style={{ top: 12, left: 12, width: 48, height: 48, borderRadius: 8, boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.1)' }}>
                <span className="text-[10px] text-brand font-semibold leading-tight">{event.month}</span>
                <span className="text-[20px] text-brand-dark font-semibold leading-tight">{event.day}</span>
              </div>
            </div>
            <div className="flex flex-col" style={{ padding: 16, gap: 6 }}>
              <p className="text-[15px] font-semibold" style={{ color: '#1a1a1a' }}>{event.title}</p>
              <p className="text-[13px]" style={{ color: '#555' }}>{event.host}</p>
              <p className="text-[12px]" style={{ color: '#999' }}>{event.date} · {event.time}</p>
              <p className="text-[12px] font-medium text-brand">{event.attending} attending</p>
            </div>
          </Link>
        ))}
      </Carousel>

      {/* Intro Video Modal */}
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </div>
  );
}

function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.7)', animation: 'fadeIn 0.2s ease-out' }}
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-2xl overflow-hidden"
        style={{ width: '90vw', maxWidth: 880, aspectRatio: '16/9' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center border-none cursor-pointer hover:opacity-80 transition"
          style={{
            top: 16,
            right: 16,
            zIndex: 10,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Video placeholder with play button */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}
        >
          <button
            className="flex items-center justify-center border-none cursor-pointer hover:scale-105 transition-transform"
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill="#fff" />
            </svg>
          </button>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 16 }}>
            Welcome to Solace
          </p>
        </div>
      </div>
    </div>
  );
}
