import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommunity } from '../context/CommunityContext';
import type { ReactionType } from '../context/CommunityContext';
import { REACTION_OPTIONS } from '../context/CommunityContext';
import { useToast } from '../components/Toast';
import PostOverflowMenu from '../components/PostOverflowMenu';
import PageTransition from '../components/PageTransition';

export default function CommunityThread() {
  const { threadId } = useParams<{ threadId: string }>();
  const { getPost, addReply, toggleReaction, toggleReplyReaction } = useCommunity();
  const { showToast } = useToast();
  const [replyText, setReplyText] = useState('');
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);

  const post = getPost(threadId || '');

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-20" style={{ maxWidth: 640, width: '100%' }}>
        <p className="text-text-muted" style={{ fontSize: 16 }}>Post not found</p>
        <Link to="/community" className="text-brand font-semibold mt-4 no-underline hover:underline">
          Back to Community
        </Link>
      </div>
    );
  }

  const handleReply = () => {
    const trimmed = replyText.trim();
    if (!trimmed || !threadId) return;
    addReply(threadId, trimmed);
    setReplyText('');
    showToast('Reply posted');
  };

  return (
    <PageTransition variant="detail">
      <div className="flex flex-col gap-6" style={{ maxWidth: 640, width: '100%' }}>
      {/* Back link */}
      <Link to="/community" className="font-medium no-underline" style={{ fontSize: 14, color: '#555' }}>
        &larr; Back to Community
      </Link>

      {/* Original post */}
      <div className="bg-white rounded-xl border border-border" style={{ maxWidth: 640, width: '100%', padding: 24 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="bg-surface-secondary rounded-full shrink-0" style={{ width: 44, height: 44 }} />
              <div className="flex flex-col justify-center">
                <span className="font-semibold text-text-primary" style={{ fontSize: 16 }}>{post.author}</span>
                <span style={{ fontSize: 13, color: '#999' }}>{post.time}</span>
              </div>
            </div>
            <PostOverflowMenu postId={post.id} />
          </div>
          <p className="text-text-primary" style={{ fontSize: 15, lineHeight: '24px' }}>{post.content}</p>
          {/* Reaction chips */}
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
              {post.reactions && Object.entries(post.reactions)
                .filter(([, count]) => count && count > 0)
                .sort(([, a], [, b]) => (b || 0) - (a || 0))
                .map(([emoji, count]) => {
                  const isActive = post.userReactions?.includes(emoji as ReactionType);
                  return (
                    <button
                      key={emoji}
                      onClick={() => toggleReaction(post.id, emoji as ReactionType)}
                      className="border font-medium cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isActive ? '#e8f0e8' : '#f5f0eb',
                        borderColor: isActive ? '#7a9b7a' : 'transparent',
                        borderRadius: 16,
                        padding: '4px 10px',
                        fontSize: 13,
                        color: isActive ? '#3d5a3d' : '#555',
                      }}
                    >
                      {emoji} {count}
                    </button>
                  );
                })}
              {/* Add reaction button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setPickerOpenFor(pickerOpenFor === post.id ? null : post.id)}
                  className="border font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: '#f5f0eb',
                    borderColor: 'transparent',
                    borderRadius: 16,
                    padding: '4px 10px',
                    fontSize: 13,
                    color: '#999',
                  }}
                >
                  +
                </button>
                {pickerOpenFor === post.id && (
                  <div
                    className="bg-white border border-border rounded-xl shadow-lg"
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: 0,
                      marginBottom: 6,
                      padding: '6px 8px',
                      display: 'flex',
                      gap: 4,
                      zIndex: 10,
                    }}
                  >
                    {REACTION_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          toggleReaction(post.id, emoji);
                          setPickerOpenFor(null);
                        }}
                        className="cursor-pointer border-none bg-transparent hover:scale-125 transition-transform"
                        style={{
                          fontSize: 18,
                          padding: '4px 4px',
                          borderRadius: 8,
                          lineHeight: 1,
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <span className="font-medium shrink-0" style={{ fontSize: 13, color: '#999' }}>
              💬 {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
            </span>
          </div>
        </div>
      </div>

      {/* Reply count */}
      <h3 className="font-semibold text-text-primary" style={{ fontSize: 16 }}>
        {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
      </h3>

      {/* Reply composer */}
      <div className="bg-white rounded-xl border border-border flex gap-3" style={{ maxWidth: 640, width: '100%', padding: '12px 16px' }}>
        <div className="bg-surface-secondary rounded-full shrink-0" style={{ width: 32, height: 32 }} />
        <div className="flex-1 flex flex-col" style={{ gap: 8 }}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="w-full flex-1 resize-none border-none outline-none placeholder-text-muted bg-transparent"
            style={{ fontSize: 14, minHeight: 36 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleReply();
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className="text-white font-medium rounded-3xl hover:opacity-90 transition cursor-pointer border-none disabled:opacity-40"
              style={{ fontSize: 13, padding: '6px 16px', backgroundColor: '#7a9b7a' }}
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Reply cards */}
      <div className="flex flex-col gap-4">
        {post.replies.map((reply) => (
          <div key={reply.id} className="bg-white rounded-xl border border-border" style={{ maxWidth: 640, width: '100%', padding: '20px 24px' }}>
            <div className="flex gap-3">
              <div className="bg-surface-secondary rounded-full shrink-0" style={{ width: 36, height: 36 }} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text-primary" style={{ fontSize: 14 }}>{reply.author}</span>
                  <span style={{ fontSize: 12, color: '#999' }}>{reply.time}</span>
                </div>
                <p className="text-text-primary" style={{ fontSize: 14, lineHeight: '22px' }}>{reply.content}</p>
                {/* Reaction chips */}
                <div className="flex items-center flex-wrap mt-2" style={{ gap: 4 }}>
                  {reply.reactions && Object.entries(reply.reactions)
                    .filter(([, count]) => count && count > 0)
                    .sort(([, a], [, b]) => (b || 0) - (a || 0))
                    .map(([emoji, count]) => {
                      const isActive = reply.userReactions?.includes(emoji as ReactionType);
                      return (
                        <button
                          key={emoji}
                          onClick={() => toggleReplyReaction(post.id, reply.id, emoji as ReactionType)}
                          className="border font-medium cursor-pointer transition-colors"
                          style={{
                            backgroundColor: isActive ? '#e8f0e8' : '#f5f0eb',
                            borderColor: isActive ? '#7a9b7a' : 'transparent',
                            borderRadius: 12,
                            padding: '3px 8px',
                            fontSize: 12,
                            color: isActive ? '#3d5a3d' : '#555',
                          }}
                        >
                          {emoji} {count}
                        </button>
                      );
                    })}
                  {/* Add reaction button */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setPickerOpenFor(pickerOpenFor === reply.id ? null : reply.id)}
                      className="border font-medium cursor-pointer transition-colors"
                      style={{
                        backgroundColor: '#f5f0eb',
                        borderColor: 'transparent',
                        borderRadius: 12,
                        padding: '3px 8px',
                        fontSize: 12,
                        color: '#999',
                      }}
                    >
                      +
                    </button>
                    {pickerOpenFor === reply.id && (
                      <div
                        className="bg-white border border-border rounded-xl shadow-lg"
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: 0,
                          marginBottom: 6,
                          padding: '6px 8px',
                          display: 'flex',
                          gap: 4,
                          zIndex: 10,
                        }}
                      >
                        {REACTION_OPTIONS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              toggleReplyReaction(post.id, reply.id, emoji);
                              setPickerOpenFor(null);
                            }}
                            className="cursor-pointer border-none bg-transparent hover:scale-125 transition-transform"
                            style={{
                              fontSize: 16,
                              padding: '3px 3px',
                              borderRadius: 8,
                              lineHeight: 1,
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </PageTransition>
  );
}
