import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useToast } from '../../components/Toast';

type StatusFilter = 'all' | 'published' | 'draft';

export default function AdminContent() {
  const { content: allContent } = useContent();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();

  const contentWithStatus = allContent.map((item) => ({
    ...item,
    status: 'Published' as const,
  }));

  const filtered = contentWithStatus.filter((item) => {
    if (statusFilter === 'published' && item.status !== 'Published') return false;
    if (statusFilter === 'draft') return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const typeCount = allContent.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: 32, color: '#1a1a1a', fontWeight: 400 }}>
            Content Management
          </h1>
          <p style={{ fontSize: 14, color: '#8c8c8c', marginTop: 4 }}>
            {allContent.length} items across your library
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/content/new')}
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
          + Add Content
        </button>
      </div>

      {/* Type breakdown pills */}
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {Object.entries(typeCount).map(([type, count]) => (
          <span
            key={type}
            className="bg-white"
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              color: '#555',
              border: '1px solid #ebebeb',
            }}
          >
            {type}s: {count}
          </span>
        ))}
      </div>

      {/* Search and filters */}
      <div className="flex items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1 1 250px',
            height: 40,
            padding: '0 14px',
            border: '1px solid #ddd',
            borderRadius: 8,
            fontSize: 14,
            backgroundColor: '#fff',
            outline: 'none',
          }}
        />
        <div className="flex" style={{ gap: 4 }}>
          {(['all', 'published', 'draft'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="cursor-pointer border-none transition"
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                backgroundColor: statusFilter === s ? '#3d5a3d' : '#fff',
                color: statusFilter === s ? '#fff' : '#555',
                border: statusFilter === s ? 'none' : '1px solid #ebebeb',
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content table */}
      <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #ebebeb' }}>
        {/* Table header */}
        <div
          className="hidden md:grid items-center"
          style={{
            gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
            padding: '12px 20px',
            borderBottom: '1px solid #ebebeb',
            backgroundColor: '#fafafa',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Author</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8c8c8c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
        </div>

        {/* Table rows */}
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/admin/content/${item.id}`)}
            className="md:grid items-center hover:bg-gray-50 transition-colors cursor-pointer"
            style={{
              gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
              padding: '14px 20px',
              borderBottom: '1px solid #f5f5f5',
            }}
          >
            <div className="min-w-0">
              <p className="truncate" style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{item.title}</p>
              <p className="truncate md:hidden" style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                {item.type} · {item.author} · {item.duration}
              </p>
            </div>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{item.type}</span>
            <span className="hidden md:block truncate" style={{ fontSize: 13, color: '#555' }}>{item.author}</span>
            <span className="hidden md:block" style={{ fontSize: 13, color: '#555' }}>{item.duration}</span>
            <div>
              <span
                className="hidden md:inline-block"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 4,
                  backgroundColor: '#e8f0e8',
                  color: '#3d5a3d',
                }}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#999' }}>No content matches your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
