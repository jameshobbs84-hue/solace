import { Link } from 'react-router-dom';
import { events } from '../../data/content';
import { useContent } from '../../context/ContentContext';
import { useCommunity } from '../../context/CommunityContext';

export default function AdminDashboard() {
  const { posts } = useCommunity();
  const { content: allContent } = useContent();

  const stats = [
    { label: 'Total Content', value: allContent.length, change: '+3 this week', to: '/admin/content' },
    { label: 'Upcoming Events', value: events.length, change: `Next: ${events[0]?.title}`, to: '/admin/events' },
    { label: 'Community Posts', value: posts.length, change: '+5 this week', to: '/admin/community' },
    { label: 'Active Members', value: 247, change: '+12 this month', to: '/admin/members' },
  ];

  const recentContent = allContent.slice(0, 5);
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="flex flex-col" style={{ gap: 32 }}>
      <div>
        <h1 className="font-serif" style={{ fontSize: 32, color: '#1a1a1a', fontWeight: 400 }}>
          Admin Overview
        </h1>
        <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>
          Manage your Solace platform content, events, and community.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="bg-white rounded-xl no-underline"
            style={{ padding: 20, border: '1px solid #ebebeb' }}
          >
            <p style={{ fontSize: 13, color: '#8c8c8c', fontWeight: 500 }}>{stat.label}</p>
            <p style={{ fontSize: 32, fontWeight: 600, color: '#1a1a1a', marginTop: 4 }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: '#7a9b7a', marginTop: 4 }}>{stat.change}</p>
          </Link>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Recent content */}
        <div className="bg-white rounded-xl" style={{ border: '1px solid #ebebeb', padding: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Recent Content</h2>
            <Link to="/admin/content" className="no-underline" style={{ fontSize: 13, color: '#7a9b7a', fontWeight: 500 }}>
              View all
            </Link>
          </div>
          <div className="flex flex-col" style={{ gap: 0 }}>
            {recentContent.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
                style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate" style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: '#999' }}>{item.type} · {item.author}</p>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '3px 8px',
                    borderRadius: 4,
                    backgroundColor: '#e8f0e8',
                    color: '#3d5a3d',
                    whiteSpace: 'nowrap',
                    marginLeft: 12,
                  }}
                >
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent community activity */}
        <div className="bg-white rounded-xl" style={{ border: '1px solid #ebebeb', padding: 24 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Community Activity</h2>
            <Link to="/admin/community" className="no-underline" style={{ fontSize: 13, color: '#7a9b7a', fontWeight: 500 }}>
              View all
            </Link>
          </div>
          <div className="flex flex-col" style={{ gap: 0 }}>
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between"
                style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate" style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{post.author}</p>
                  <p className="truncate" style={{ fontSize: 12, color: '#999' }}>{post.content}</p>
                </div>
                <div className="flex items-center shrink-0" style={{ gap: 8, marginLeft: 12 }}>
                  <span style={{ fontSize: 12, color: '#999' }}>❤️ {post.likes}</span>
                  <span style={{ fontSize: 12, color: '#999' }}>💬 {post.replies.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
