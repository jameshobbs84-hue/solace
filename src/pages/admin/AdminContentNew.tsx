import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useToast } from '../../components/Toast';
import type { ContentItem, ContentType, ProgramLesson } from '../../data/content';

const contentTypes: ContentType[] = ['Audio', 'Video', 'Article', 'Program', 'Resource', 'Discussion'];
const allTopics = ['Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness'];

export default function AdminContentNew() {
  const navigate = useNavigate();
  const { addContent, content } = useContent();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState<ContentType>('Article');
  const [description, setDescription] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [lessons, setLessons] = useState<ProgramLesson[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProgram = type === 'Program';
  const hasFile = type === 'Audio' || type === 'Video' || type === 'Resource';

  const availableContent = content.filter(c =>
    c.type !== 'Program' && c.type !== 'Discussion' && !lessons.some(l => l.title === c.title)
  );

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const addLesson = (contentItem: ContentItem) => {
    setLessons(prev => [...prev, {
      title: contentItem.title,
      type: contentItem.type,
      author: contentItem.author,
      duration: contentItem.duration,
    }]);
  };

  const removeLesson = (index: number) => {
    setLessons(prev => prev.filter((_, i) => i !== index));
  };

  const moveLessonUp = (index: number) => {
    if (index === 0) return;
    setLessons(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveLessonDown = (index: number) => {
    setLessons(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleCreate = () => {
    const id = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const newItem: ContentItem = {
      id,
      title: title.trim(),
      author: author.trim(),
      duration: isProgram ? `${lessons.length} lessons` : duration.trim(),
      type,
      description: description.trim(),
      topics: selectedTopics,
    };
    if (isProgram) {
      newItem.lessons = lessons;
      newItem.lessonsTotal = lessons.length;
      newItem.lessonsCompleted = 0;
    }
    addContent(newItem);
    showToast(`"${newItem.title}" created`);
    navigate('/admin/content');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    border: '1px solid #d1d1d1',
    borderRadius: 8,
    fontSize: 15,
    backgroundColor: '#fff',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: '#555',
    marginBottom: 6,
    display: 'block',
    fontVariationSettings: "'opsz' 14",
  };

  return (
    <div className="flex flex-col" style={{ gap: 0 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between" style={{ marginBottom: 32 }}>
        <Link
          to="/admin/content"
          className="no-underline hover:underline"
          style={{ fontSize: 14, fontWeight: 500, color: '#555' }}
        >
          &larr; Back to content
        </Link>
        <div className="flex items-center" style={{ gap: 12 }}>
          <button
            onClick={() => navigate('/admin/content')}
            className="cursor-pointer transition hover:bg-gray-50"
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              color: '#555',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || !author.trim()}
            className="cursor-pointer border-none hover:opacity-90 transition disabled:opacity-40"
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#7a9b7a',
            }}
          >
            Create Content
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif" style={{ fontSize: 28, color: '#1a1a1a', fontWeight: 400, marginBottom: 32 }}>
        New Content
      </h1>

      {/* Two-column layout */}
      <div className="flex" style={{ gap: 40 }}>
        {/* Left column */}
        <div className="flex-1 flex flex-col" style={{ gap: 24, minWidth: 0 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter content title..."
              style={inputStyle}
            />
          </div>

          {/* Type + Duration */}
          <div className="flex" style={{ gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Content Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ContentType)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {contentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {!isProgram && (
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder={type === 'Article' ? 'e.g. 8 min read' : type === 'Resource' ? 'e.g. PDF' : 'e.g. 15 min'}
                  style={inputStyle}
                />
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <label style={labelStyle}>Author / Instructor</label>
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Enter author name..."
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe this content..."
              className="resize-none"
              style={{
                ...inputStyle,
                height: 120,
                padding: '12px 14px',
                lineHeight: '22px',
              }}
            />
          </div>

          {/* File upload */}
          {hasFile && (
            <div>
              <label style={labelStyle}>
                {type === 'Audio' ? 'Audio File' : type === 'Video' ? 'Video File' : 'Resource File'}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={type === 'Audio' ? 'audio/*' : type === 'Video' ? 'video/*' : '*/*'}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div
                onClick={handleFileSelect}
                className="cursor-pointer transition"
                style={{
                  border: '2px dashed #d1d1d1',
                  borderRadius: 12,
                  padding: fileName ? '16px 20px' : '32px 20px',
                  textAlign: 'center',
                  backgroundColor: '#fafafa',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7a9b7a'; e.currentTarget.style.backgroundColor = '#f5f9f5'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d1d1'; e.currentTarget.style.backgroundColor = '#fafafa'; }}
              >
                {fileName ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: 12 }}>
                      <div
                        className="flex items-center justify-center"
                        style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#e8f0e8' }}
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3.75 9.75L7.5 13.5L14.25 5.25" stroke="#3d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{fileName}</p>
                        <p style={{ fontSize: 12, color: '#8c8c8c' }}>Click to replace</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 18 18" fill="none" style={{ color: '#999', marginBottom: 8 }}>
                      <path d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5.25 7.5L9 3.75L12.75 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 3.75V11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#555' }}>
                      Click to upload {type === 'Audio' ? 'an audio file' : type === 'Video' ? 'a video file' : 'a file'}
                    </p>
                    <p style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
                      {type === 'Audio' ? 'MP3, WAV, M4A up to 200MB' : type === 'Video' ? 'MP4, MOV, WebM up to 2GB' : 'PDF, DOCX, or any file up to 50MB'}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Program lessons */}
          {isProgram && (
            <div>
              <label style={labelStyle}>Program Lessons ({lessons.length})</label>

              {lessons.length > 0 && (
                <div className="flex flex-col" style={{ gap: 8, marginBottom: 16 }}>
                  {lessons.map((lesson, i) => (
                    <div
                      key={i}
                      className="bg-white flex items-center"
                      style={{ border: '1px solid #d1d1d1', borderRadius: 8, padding: '12px 16px', gap: 12 }}
                    >
                      <div
                        className="shrink-0 flex items-center justify-center"
                        style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e8f0e8', fontSize: 12, fontWeight: 600, color: '#3d5a3d' }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1" style={{ minWidth: 0 }}>
                        <p className="truncate" style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>{lesson.title}</p>
                        <div className="flex items-center" style={{ gap: 6, marginTop: 2 }}>
                          <span style={{ backgroundColor: 'rgba(38,38,38,0.85)', borderRadius: 3, padding: '2px 6px', fontSize: 10, fontWeight: 500, color: '#fff' }}>{lesson.type}</span>
                          <span style={{ fontSize: 12, color: '#8c8c8c' }}>{lesson.author} · {lesson.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center shrink-0" style={{ gap: 4 }}>
                        <button onClick={() => moveLessonUp(i)} disabled={i === 0} className="flex items-center justify-center border-none cursor-pointer transition disabled:opacity-20" style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#f5f5f5' }}>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 5L5 1L9 5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => moveLessonDown(i)} disabled={i === lessons.length - 1} className="flex items-center justify-center border-none cursor-pointer transition disabled:opacity-20" style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#f5f5f5' }}>
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <button onClick={() => removeLesson(i)} className="flex items-center justify-center border-none cursor-pointer transition hover:bg-red-50" style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: '#f5f5f5' }}>
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#999" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lessons.length === 0 && (
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ padding: '32px 20px', border: '1px dashed #d1d1d1', borderRadius: 12, marginBottom: 16 }}
                >
                  <p style={{ fontSize: 14, color: '#999' }}>No lessons added yet</p>
                  <p style={{ fontSize: 12, color: '#bbb', marginTop: 4 }}>Add existing content from your library as lessons</p>
                </div>
              )}

              <AddLessonPicker availableContent={availableContent} onAdd={addLesson} />
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="shrink-0 hidden md:flex flex-col" style={{ width: 300, gap: 24 }}>
          {/* Topics */}
          <div className="bg-white" style={{ padding: 20, borderRadius: 12, border: '1px solid #ebebeb' }}>
            <label style={labelStyle}>Topics</label>
            <div className="flex flex-wrap" style={{ gap: 8, marginTop: 4 }}>
              {allTopics.map(topic => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className="cursor-pointer transition"
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500,
                      border: isSelected ? '1px solid #7a9b7a' : '1px solid #d1d1d1',
                      backgroundColor: isSelected ? '#e8f0e8' : '#fff',
                      color: isSelected ? '#3d5a3d' : '#555',
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white" style={{ padding: 20, borderRadius: 12, border: '1px solid #ebebeb' }}>
            <label style={labelStyle}>Status</label>
            <p style={{ fontSize: 13, color: '#8c8c8c', marginTop: 4 }}>
              Will be published immediately on creation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddLessonPicker({
  availableContent,
  onAdd,
}: {
  availableContent: ContentItem[];
  onAdd: (item: ContentItem) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filtered = availableContent.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer transition flex items-center"
        style={{
          padding: '10px 16px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          color: '#3d5a3d',
          backgroundColor: '#e8f0e8',
          border: '1px solid #c5d8c5',
          gap: 8,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="#3d5a3d" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Lesson from Library
      </button>

      {isOpen && (
        <div className="bg-white" style={{ marginTop: 8, border: '1px solid #d1d1d1', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '12px 12px 0 12px' }}>
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              style={{ width: '100%', height: 38, padding: '0 12px', border: '1px solid #d1d1d1', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 240, padding: 8, marginTop: 4 }}>
            {filtered.length === 0 && (
              <p style={{ padding: '12px 8px', fontSize: 13, color: '#999', textAlign: 'center' }}>No matching content found</p>
            )}
            {filtered.map(item => (
              <div
                key={item.id}
                onClick={() => { onAdd(item); setSearchQuery(''); }}
                className="flex items-center cursor-pointer transition"
                style={{ padding: '10px 12px', borderRadius: 8, gap: 12 }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ backgroundColor: 'rgba(38,38,38,0.85)', borderRadius: 3, padding: '2px 6px', fontSize: 10, fontWeight: 500, color: '#fff', flexShrink: 0 }}>{item.type}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="truncate" style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: '#8c8c8c' }}>{item.author} · {item.duration}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '8px 12px 12px', borderTop: '1px solid #f0f0f0' }}>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer border-none" style={{ fontSize: 13, color: '#999', backgroundColor: 'transparent', padding: 4 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
