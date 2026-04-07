import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { useUser } from '../context/UserContext';
import { useCommunity } from '../context/CommunityContext';
import { useToast } from '../components/Toast';
import PageTransition from '../components/PageTransition';

export default function ContentDetail() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { toggleSave, isSaved } = useUser();
  const { getComments, addComment, toggleLikeComment } = useCommunity();
  const { showToast } = useToast();
  const { content: allContent } = useContent();
  const [commentText, setCommentText] = useState('');
  const item = allContent.find((c) => c.id === id);
  const saved = item ? isSaved(item.id) : false;
  const comments = item ? getComments(item.id) : [];

  const handlePost = () => {
    const trimmed = commentText.trim();
    if (!trimmed || !item) return;
    addComment(item.id, trimmed);
    setCommentText('');
    showToast('Comment posted');
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-muted" style={{ fontSize: '16px' }}>Content not found</p>
        <Link to="/library" className="text-brand font-semibold mt-4 no-underline hover:underline">
          Back to library
        </Link>
      </div>
    );
  }

  // Program detail layout
  if (item.type === 'Program') {
    return <ProgramDetail item={item} saved={saved} />;
  }

  const relatedContent = allContent.filter((c) => c.id !== item.id).slice(0, 4);

  return (
    <PageTransition variant="detail">
      <div className="flex flex-col" style={{ gap: '32px' }}>
      {/* Top bar: back link + save button */}
      <div className="flex items-center justify-between">
        <Link
          to="/library"
          className="no-underline hover:underline"
          style={{ fontSize: '14px', fontWeight: 500, color: '#555' }}
        >
          &larr; Back to library
        </Link>
        <SaveButton item={item} saved={saved} />
      </div>

      {/* Title + meta */}
      <div className="flex flex-col" style={{ gap: '8px' }}>
        <h1
          className="font-serif"
          style={{ fontSize: '40px', color: '#1a1a1a', fontWeight: 400 }}
        >
          {item.title}
        </h1>
        <p style={{ fontSize: '14px', color: '#999', fontWeight: 400 }}>
          {item.author} &middot; {item.duration}
        </p>
      </div>

      {/* Hero image */}
      <div
        className="rounded-xl flex items-center justify-center"
        style={{ width: '980px', maxWidth: '100%', height: '400px', backgroundColor: '#ddd' }}
      >
        {(type === 'video' || type === 'audio') && (
          <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill="#3d5a3d"/>
            </svg>
          </button>
        )}
      </div>

      {/* Article body */}
      <div className="mx-auto" style={{ width: '640px', maxWidth: '100%' }}>
        <p style={{ fontSize: '16px', color: '#555', lineHeight: '26px', fontWeight: 400 }}>
          {item.description}
        </p>

        {item.type === 'Article' && (
          <>
            <h2
              className="font-serif mt-8 mb-4"
              style={{ fontSize: '28px', color: '#1a1a1a', fontWeight: 400 }}
            >
              Getting Started
            </h2>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: '26px', fontWeight: 400 }}>
              Creating a consistent routine is one of the most effective ways to improve your overall wellness.
              Start by identifying the areas of your life that feel most out of balance, then work on small,
              sustainable changes that you can maintain over time.
            </p>

            <h2
              className="font-serif mt-8 mb-4"
              style={{ fontSize: '28px', color: '#1a1a1a', fontWeight: 400 }}
            >
              Key Takeaways
            </h2>
            <p style={{ fontSize: '16px', color: '#555', lineHeight: '26px', fontWeight: 400 }}>
              Remember that progress is not always linear. Some days will feel easier than others, and that is
              completely normal. The important thing is to keep showing up for yourself and celebrating the
              small wins along the way.
            </p>
          </>
        )}

        {/* Discussion section */}
        <div className="mt-10" style={{ borderTop: '1px solid #d1d1d1', paddingTop: '32px' }}>
          <h2
            className="font-serif"
            style={{ fontSize: '24px', color: '#1a1a1a', fontWeight: 400 }}
          >
            Discussion ({comments.length})
          </h2>

          {/* Comment input */}
          <div className="mt-5 flex flex-col items-end" style={{ gap: '12px' }}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="resize-none"
              style={{
                width: '640px',
                maxWidth: '100%',
                height: '80px',
                backgroundColor: '#fff',
                border: '1px solid #d1d1d1',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '15px',
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) handlePost();
              }}
            />
            <button
              onClick={handlePost}
              disabled={!commentText.trim()}
              className="cursor-pointer hover:opacity-90 transition disabled:opacity-40"
              style={{
                backgroundColor: '#7a9b7a',
                borderRadius: '20px',
                padding: '6px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
                border: 'none',
              }}
            >
              Post
            </button>
          </div>

          {/* Comments */}
          <div className="mt-6 flex flex-col" style={{ gap: '20px' }}>
            {comments.map((comment) => (
              <div key={comment.id} className="flex" style={{ gap: '12px' }}>
                <div
                  className="rounded-full bg-surface-secondary shrink-0"
                  style={{ width: '32px', height: '32px' }}
                />
                <div className="flex flex-col" style={{ gap: '4px' }}>
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>
                      {comment.author}
                    </span>
                    <span style={{ fontSize: '12px', color: '#8c8c8c', fontWeight: 400 }}>
                      {comment.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '15px', color: '#222', lineHeight: '22px', fontWeight: 400 }}>
                    {comment.content}
                  </p>
                  <button
                    onClick={() => toggleLikeComment(item.id, comment.id)}
                    className="border font-medium cursor-pointer transition-colors self-start"
                    style={{
                      backgroundColor: comment.likedByUser ? '#e8f0e8' : '#f5f0eb',
                      borderColor: comment.likedByUser ? '#7a9b7a' : '#d1d1d1',
                      borderRadius: 12,
                      padding: '3px 8px',
                      fontSize: 12,
                      color: comment.likedByUser ? '#3d5a3d' : '#555',
                      marginTop: 4,
                    }}
                  >
                    {comment.likedByUser ? '❤️' : '🤍'} {comment.likes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related content */}
      {relatedContent.length > 0 && (
        <div style={{ borderTop: '1px solid #d1d1d1', paddingTop: '32px' }}>
          <h2
            className="font-serif mb-4"
            style={{ fontSize: '24px', color: '#1a1a1a', fontWeight: 400 }}
          >
            Related Content
          </h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {relatedContent.map((c) => {
              const routeType = c.type.toLowerCase();
              return (
                <Link
                  key={c.id}
                  to={`/content/${routeType}/${c.id}`}
                  className="bg-white rounded-lg overflow-hidden block hover:shadow-md transition-shadow no-underline"
                  style={{ boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)' }}
                >
                  <div className="relative" style={{ height: '120px', backgroundColor: '#ddd' }}>
                    <span
                      className="absolute"
                      style={{
                        top: '8px',
                        left: '8px',
                        backgroundColor: 'rgba(38,38,38,0.85)',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#fff',
                      }}
                    >
                      {c.type}
                    </span>
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>{c.title}</p>
                    <p style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                      {c.author}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Topics */}
      <div className="flex gap-2 pt-4" style={{ borderTop: '1px solid #ebebeb' }}>
        {item.topics.map((topic) => (
          <Link
            key={topic}
            to={`/library?topic=${topic}`}
            className="bg-surface-secondary no-underline hover:bg-brand-light transition"
            style={{
              color: '#555',
              fontSize: '13px',
              padding: '6px 12px',
              borderRadius: '9999px',
            }}
          >
            {topic}
          </Link>
        ))}
      </div>
      </div>
    </PageTransition>
  );
}

function SaveButton({ item, saved }: { item: { id: string; title: string }; saved: boolean }) {
  const { toggleSave } = useUser();
  const { showToast } = useToast();

  return (
    <button
      onClick={() => {
        const wasAdded = toggleSave(item.id);
        showToast(wasAdded ? `"${item.title}" saved` : `"${item.title}" removed from saved`);
      }}
      className="rounded-3xl cursor-pointer transition-colors flex items-center justify-center"
      style={{
        border: saved ? 'none' : '1px solid #ddd',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 600,
        color: saved ? '#fff' : '#222',
        backgroundColor: saved ? '#7a9b7a' : '#fff',
        fontVariationSettings: "'opsz' 14",
      }}
    >
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}

import type { ContentItem } from '../data/content';

function ProgramDetail({ item, saved }: { item: ContentItem; saved: boolean }) {
  const lessonsTotal = item.lessonsTotal || item.lessons?.length || 7;
  const lessonsCompleted = item.lessonsCompleted || 0;
  const progressPercent = (lessonsCompleted / lessonsTotal) * 100;
  const lessons = item.lessons || [];

  return (
    <PageTransition variant="detail">
      <div className="flex flex-col" style={{ gap: 32 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/library"
          className="no-underline hover:underline"
          style={{ fontSize: 14, fontWeight: 500, color: '#555' }}
        >
          &larr; Back
        </Link>
        <SaveButton item={item} saved={saved} />
      </div>

      {/* Program Header Banner */}
      <div
        className="bg-surface-secondary rounded-xl flex overflow-hidden"
        style={{ height: 340 }}
      >
        <div
          className="flex flex-col justify-center flex-1"
          style={{ paddingLeft: 40, paddingRight: 24, gap: 16 }}
        >
          {/* Type badge */}
          <span
            style={{
              backgroundColor: 'rgba(38,38,38,0.85)',
              borderRadius: 4,
              padding: '4px 8px',
              fontSize: 11,
              fontWeight: 500,
              color: '#fff',
              alignSelf: 'flex-start',
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Program
          </span>

          {/* Title */}
          <h1
            className="font-serif"
            style={{ fontSize: 36, color: '#1a1a1a', fontWeight: 400, lineHeight: 'normal' }}
          >
            {item.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 16,
              color: '#555',
              lineHeight: 'normal',
              maxWidth: 520,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            {item.description}
          </p>

          {/* Continue button */}
          <Link
            to="#"
            className="no-underline hover:opacity-90 transition"
            style={{
              backgroundColor: '#7a9b7a',
              borderRadius: 24,
              padding: '12px 24px',
              fontSize: 16,
              fontWeight: 600,
              color: '#fff',
              alignSelf: 'flex-start',
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Continue
          </Link>

          {/* Progress */}
          <div className="flex flex-col" style={{ gap: 8, width: 300 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: '#7a9b7a',
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {lessonsCompleted} of {lessonsTotal} completed
            </span>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#dedede',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#7a9b7a',
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Image placeholder */}
        <div
          className="shrink-0 hidden md:block"
          style={{
            width: 360,
            height: 340,
            backgroundColor: '#ddd',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
          }}
        />
      </div>

      {/* Two-column layout: Table of Contents + About sidebar */}
      <div className="flex" style={{ gap: 40 }}>
        {/* Left: Table of Contents */}
        <div className="flex-1" style={{ minWidth: 0 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: 16,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            Table of Contents
          </h2>
          <div className="flex flex-col" style={{ gap: 12 }}>
            {lessons.map((lesson, i) => {
              const isCompleted = i < lessonsCompleted;
              const isCurrent = i === lessonsCompleted;

              return (
                <div
                  key={i}
                  className="bg-white flex items-center"
                  style={{
                    border: '1px solid #d1d1d1',
                    borderRadius: 8,
                    padding: 16,
                    gap: 16,
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s, transform 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0px 4px 12px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Number circle */}
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: isCompleted ? '#7a9b7a' : '#e8f0e8',
                      border: isCurrent ? '2px solid #7a9b7a' : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                        <path d="M3.75 9.75L7.5 13.5L14.25 5.25" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#3d5a3d',
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>

                  {/* Lesson content */}
                  <div className="flex flex-col" style={{ gap: 4, flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: isCompleted ? '#8c8c8c' : '#1a1a1a',
                        fontVariationSettings: "'opsz' 14",
                      }}
                    >
                      {lesson.title}
                    </span>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(38,38,38,0.85)',
                          borderRadius: 4,
                          padding: '4px 8px',
                          fontSize: 11,
                          fontWeight: 500,
                          color: '#fff',
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        {lesson.type}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#555',
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        {lesson.author}  ·  {lesson.duration}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: About this program */}
        <div
          className="bg-white shrink-0 hidden md:block"
          style={{
            width: 340,
            padding: 24,
            borderRadius: 12,
            boxShadow: '0px 2px 8px 0px rgba(0,0,0,0.06)',
            alignSelf: 'flex-start',
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: 16,
              fontVariationSettings: "'opsz' 14",
            }}
          >
            About this program
          </h3>
          <div className="flex flex-col" style={{ gap: 16 }}>
            <InfoRow label="Instructor" value={item.author} />
            <InfoRow label="Duration" value={`${lessonsTotal} days`} />
            <InfoRow label="Lessons" value={String(lessonsTotal)} />
            <InfoRow label="Level" value="All levels" />
            <InfoRow label="Topics" value={item.topics.join(', ')} />
          </div>
        </div>
      </div>
      </div>
    </PageTransition>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex" style={{ gap: 8, fontSize: 14 }}>
      <span
        style={{
          fontWeight: 500,
          color: '#555',
          fontVariationSettings: "'opsz' 14",
        }}
      >
        {label}:
      </span>
      <span
        style={{
          color: '#1a1a1a',
          fontVariationSettings: "'opsz' 14",
        }}
      >
        {value}
      </span>
    </div>
  );
}
