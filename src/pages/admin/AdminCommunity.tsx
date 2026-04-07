import { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import type { CommunitySpace } from '../../context/CommunityContext';
import { useToast } from '../../components/Toast';

const spaceLabels: Record<string, string> = {
  sleep: 'Sleep & Rest',
  anxiety: 'Anxiety Support',
  movement: 'Mindful Movement',
  nutrition: 'Nutrition & Nourishment',
};

export default function AdminCommunity() {
  const { posts } = useCommunity();
  const { showToast } = useToast();
  const [spaceFilter, setSpaceFilter] = useState<CommunitySpace | 'all'>('all');

  const filtered = spaceFilter === 'all'
    ? posts
    : posts.filter((p) => p.space === spaceFilter);

  const totalReplies = posts.reduce((sum, p) => sum + p.replies.length, 0);
  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const pinnedCount = posts.filter((p) => p.pinned).length;

  const spaceCounts = posts.reduce(
    (acc, p) => {
      const key = p.space || 'general';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: 32, color: '#1a1a1a', fontWeight: 400 }}>
          Community Management
        </h1>
        <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>
          Monitor and moderate community activity across all spaces.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Posts', value: posts.length },
          { label: 'Total Replies', value: totalReplies },
          { label: 'Total Likes', value: totalLikes },
          { label: 'Pinned Posts', value: pinnedCount },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg" style={{ padding: 16, border: '1px solid #ebebeb' }}>
            <p style={{ fontSize: 12, color: '#8c8c8c', fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', marginTop: 2 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Space filter */}
      <div className="flex flex-wrap" style={{ gap: 6 }}>
        {(['all', 'sleep', 'anxiety', 'movement', 'nutrition'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSpaceFilter(s)}
            className="cursor-pointer border-none transition"
            style={{
              padding: '7px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: spaceFilter === s ? '#3d5a3d' : '#fff',
              color: spaceFilter === s ? '#fff' : '#555',
              border: spaceFilter === s ? 'none' : '1px solid #ebebeb',
            }}
          >
            {s === 'all' ? `All (${posts.length})` : `${spaceLabels[s]} (${spaceCounts[s] || 0})`}
          </button>
        ))}
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #ebebeb' }}>
        <div
          className="hidden md:grid items-center"
          style={{
            gridTemplateColumns: '1fr 2.5fr 80px 80px 80px 100px',
            padding: '12px 20px',
            borderBottom: '1px solid #ebebeb',
            backgroundColor: '#fafafa',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Author</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Content</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Likes</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Replies</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Space</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</span>
        </div>

        {filtered.map((post) => (
          <div
            key={post.id}
            className="md:grid items-center hover:bg-gray-50 transition-colors"
            style={{
              gridTemplateColumns: '1fr 2.5fr 80px 80px 80px 100px',
              padding: '14px 20px',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <div className="flex items-center" style={{ gap: 8 }}>
              <div
                className="rounded-full shrink-0"
                style={{ width: 28, height: 28, backgroundColor: '#f5f0eb' }}
              />
              <span className="truncate" style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{post.author}</span>
            </div>
            <p className="truncate" style={{ fontSize: 13, color: '#555' }}>{post.content}</p>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{post.likes}</span>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{post.replies.length}</span>
            <span className="hidden md:block">
              {post.space ? (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 4,
                    backgroundColor: '#f5f0eb',
                    color: '#8c6d4f',
                  }}
                >
                  {spaceLabels[post.space] || post.space}
                </span>
              ) : (
                <span style={{ fontSize: 12, color: '#999' }}>General</span>
              )}
            </span>
            <div className="hidden md:flex" style={{ gap: 8 }}>
              <button
                onClick={() => showToast(post.pinned ? 'Post unpinned' : 'Post pinned')}
                className="cursor-pointer border-none bg-transparent transition"
                style={{ fontSize: 12, color: post.pinned ? '#7a9b7a' : '#999', fontWeight: 500, padding: 0 }}
              >
                {post.pinned ? '📌 Pinned' : 'Pin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
