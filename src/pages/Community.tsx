import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCommunity } from '../context/CommunityContext';
import type { CommunitySpace, ReactionType } from '../context/CommunityContext';
import { REACTION_OPTIONS } from '../context/CommunityContext';
import { useToast } from '../components/Toast';
import PostOverflowMenu from '../components/PostOverflowMenu';
import PageTransition from '../components/PageTransition';

const spaceInfo: Record<string, { title: string; description: string }> = {
  sleep: {
    title: 'Sleep & Rest',
    description: 'Share tips, ask questions, and support one another on the journey to better sleep.',
  },
  anxiety: {
    title: 'Anxiety Support',
    description: 'A safe space to discuss anxiety management, share coping strategies, and find encouragement.',
  },
  movement: {
    title: 'Mindful Movement',
    description: 'Explore gentle movement practices, share your experiences, and motivate each other to keep moving.',
  },
  nutrition: {
    title: 'Nutrition & Nourishment',
    description: 'Discuss mindful eating, share recipes, and learn about nourishing your body with intention.',
  },
};

export default function Community() {
  const [searchParams] = useSearchParams();
  const space = searchParams.get('space') as CommunitySpace | null;
  const { posts, addPost, toggleLikePost, toggleReaction } = useCommunity();
  const { showToast } = useToast();
  const [newPost, setNewPost] = useState('');
  const [pickerOpenFor, setPickerOpenFor] = useState<string | null>(null);

  const filteredPosts = space
    ? posts.filter((p) => p.space === space)
    : posts;

  const pinnedPosts = filteredPosts.filter((p) => p.pinned);

  const info = space ? spaceInfo[space] : null;
  const title = info?.title || 'Community';
  const description = info?.description || 'Share your journey, ask questions, and support one another.';

  const handlePost = () => {
    const trimmed = newPost.trim();
    if (!trimmed) return;
    addPost(trimmed, space || undefined);
    setNewPost('');
    showToast('Post published');
  };

  return (
    <PageTransition variant="list">
      <div className="flex flex-col gap-8" style={{ maxWidth: 640, width: '100%' }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: 40, color: '#1a1a1a', fontWeight: 400 }}>{title}</h1>
        <p className="text-text-secondary mt-2" style={{ fontSize: 15 }}>{description}</p>
      </div>

      {/* Post composer */}
      <div className="bg-white rounded-xl border border-border" style={{ maxWidth: 640, width: '100%', padding: '16px 20px' }}>
        <div className="flex gap-3">
          <div className="rounded-full bg-surface-secondary shrink-0" style={{ width: 36, height: 36 }} />
          <div className="flex-1 flex flex-col" style={{ gap: 12 }}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder={space ? `Share something in ${title}...` : 'Share something with the community...'}
              className="w-full resize-none border-none outline-none placeholder-text-muted bg-transparent"
              style={{ fontSize: 14, minHeight: 48 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) handlePost();
              }}
            />
            <div className="flex justify-end">
              <button
                onClick={handlePost}
                disabled={!newPost.trim()}
                className="text-white font-semibold hover:opacity-90 transition cursor-pointer border-none disabled:opacity-40"
                style={{ fontSize: 13, borderRadius: 20, padding: '6px 20px', backgroundColor: '#7a9b7a' }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned posts carousel */}
      {pinnedPosts.length > 0 && (
        <div>
          <h3 className="font-semibold text-text-primary mb-3" style={{ fontSize: 16 }}>Pinned Posts</h3>
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
            {pinnedPosts.map((post) => (
              <Link
                key={post.id}
                to={`/community/${post.id}`}
                className="rounded-xl no-underline flex flex-col shrink-0"
                style={{ maxWidth: 312, width: '100%', height: 140, backgroundColor: '#f5f0eb', padding: 20 }}
              >
                <span className="font-medium text-brand" style={{ fontSize: 11 }}>Pinned</span>
                <span className="font-semibold text-text-primary mt-1" style={{ fontSize: 15 }}>{post.author}</span>
                <p className="text-text-secondary line-clamp-2 mt-1" style={{ fontSize: 13 }}>{post.content}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for spaces with no posts */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center" style={{ padding: '40px 0', gap: 12, textAlign: 'center' }}>
          <p className="font-semibold" style={{ fontSize: 16, color: '#222' }}>No posts yet</p>
          <p style={{ fontSize: 14, color: '#8c8c8c' }}>Be the first to share something in {title}.</p>
        </div>
      )}

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {filteredPosts.map((post) => {
          const previewReplies = post.replies.slice(0, 3);
          const hasMoreReplies = post.replies.length > 3;

          return (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-border hover:shadow-[0px_2px_8px_rgba(0,0,0,0.06)] transition-shadow"
              style={{ maxWidth: 640, width: '100%', padding: 24 }}
            >
              {/* Post author + content */}
              <div className="flex gap-3">
                <div className="rounded-full bg-surface-secondary shrink-0" style={{ width: 36, height: 36 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary" style={{ fontSize: 14 }}>{post.author}</span>
                      <span style={{ fontSize: 12, color: '#999' }}>{post.time}</span>
                    </div>
                    <PostOverflowMenu postId={post.id} />
                  </div>
                  <Link
                    to={`/community/${post.id}`}
                    className="no-underline"
                  >
                    <p className="text-text-primary line-clamp-3" style={{ fontSize: 14, lineHeight: '22px' }}>
                      {post.content}
                    </p>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center flex-wrap" style={{ gap: 6 }}>
                      {/* Existing reaction chips */}
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
                                padding: '3px 8px',
                                fontSize: 13,
                                color: isActive ? '#3d5a3d' : '#555',
                                lineHeight: '18px',
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
                            padding: '3px 8px',
                            fontSize: 13,
                            color: '#999',
                            lineHeight: '18px',
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
                    {/* Reply count — right side */}
                    <Link
                      to={`/community/${post.id}`}
                      className="font-medium no-underline shrink-0"
                      style={{ fontSize: 13, color: '#999' }}
                    >
                      💬 {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Inline replies (up to 3) */}
              {previewReplies.length > 0 && (
                <>
                  <div style={{ height: 1, backgroundColor: '#ebebeb', marginTop: 16, marginBottom: 12 }} />
                  <div className="flex flex-col" style={{ gap: 12 }}>
                    {previewReplies.map((reply) => (
                      <div key={reply.id} className="flex" style={{ paddingLeft: 8, gap: 10 }}>
                        <div
                          className="rounded-full bg-surface-secondary shrink-0"
                          style={{ width: 28, height: 28 }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center" style={{ gap: 6 }}>
                            <span className="font-semibold" style={{ fontSize: 13, color: '#1a1a1a', fontVariationSettings: "'opsz' 14" }}>
                              {reply.author}
                            </span>
                            <span style={{ fontSize: 12, color: '#bbb', fontVariationSettings: "'opsz' 14" }}>
                              {reply.time}
                            </span>
                          </div>
                          <p
                            className="line-clamp-2"
                            style={{
                              fontSize: 13,
                              color: '#555',
                              lineHeight: '20px',
                              marginTop: 1,
                              fontVariationSettings: "'opsz' 14",
                            }}
                          >
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {hasMoreReplies && (
                      <Link
                        to={`/community/${post.id}`}
                        className="no-underline font-medium"
                        style={{
                          fontSize: 13,
                          color: '#7a9b7a',
                          paddingLeft: 46,
                          fontVariationSettings: "'opsz' 14",
                        }}
                      >
                        View all {post.replies.length} replies
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </PageTransition>
  );
}
