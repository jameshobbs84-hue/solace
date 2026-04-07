import { useState, useEffect } from 'react';

interface FilterState {
  topic: string;
  contentType: string;
  program: string;
  duration: string;
  sortBy: string;
}

const topicOptions = ['All Topics', 'Sleep', 'Anxiety', 'Movement', 'Relationships', 'Nutrition', 'Mindfulness', 'Stress', 'Self-Care'];
const contentTypeOptions = ['All Types', 'Articles', 'Videos', 'Audio', 'Programs', 'Resources', 'Discussions'];
const programOptions = ['All Programs', 'The Sleep Reset', 'Mindful Mornings', 'Nourish: Nutrition', 'Movement for Anxiety'];
const durationOptions = ['Any Length', 'Under 5 min', '5–15 min', '15–30 min', '30+ min'];
const sortByOptions = ['Most Recent', 'Most Popular', 'Recommended'];

const defaultFilters: FilterState = {
  topic: 'All Topics',
  contentType: 'All Types',
  program: 'All Programs',
  duration: 'Any Length',
  sortBy: 'Most Recent',
};

export default function FilterModal({
  open,
  onClose,
  onApply,
  initialFilters,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || defaultFilters);

  useEffect(() => {
    if (open && initialFilters) setFilters(initialFilters);
  }, [open, initialFilters]);

  if (!open) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.topic !== 'All Topics' ||
    filters.contentType !== 'All Types' ||
    filters.program !== 'All Programs' ||
    filters.duration !== 'Any Length' ||
    filters.sortBy !== 'Most Recent';

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease-out',
        }}
      />
      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 400,
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
          zIndex: 101,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInRight 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0"
          style={{ padding: '24px 24px 0 24px' }}
        >
          <h2 className="font-serif" style={{ fontSize: 28, color: '#1a1a1a', fontWeight: 400 }}>
            Filters
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border-none bg-transparent"
            style={{ width: 36, height: 36, borderRadius: 18 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflow: 'auto', padding: '24px 24px 32px 24px', flex: 1 }}>
          <div className="flex flex-col" style={{ gap: 28 }}>
            {/* Topic */}
            <FilterSection label="TOPIC" options={topicOptions} value={filters.topic} onChange={(v) => setFilters(f => ({ ...f, topic: v }))} />

            <Divider />

            {/* Content Type */}
            <FilterSection label="CONTENT TYPE" options={contentTypeOptions} value={filters.contentType} onChange={(v) => setFilters(f => ({ ...f, contentType: v }))} />

            <Divider />

            {/* Program */}
            <FilterSection label="PROGRAM" options={programOptions} value={filters.program} onChange={(v) => setFilters(f => ({ ...f, program: v }))} />

            <Divider />

            {/* Duration */}
            <FilterSection label="DURATION" options={durationOptions} value={filters.duration} onChange={(v) => setFilters(f => ({ ...f, duration: v }))} />

            <Divider />

            {/* Sort By */}
            <FilterSection label="SORT BY" options={sortByOptions} value={filters.sortBy} onChange={(v) => setFilters(f => ({ ...f, sortBy: v }))} />

            <Divider />

            {/* Footer */}
            <div className="flex" style={{ gap: 8 }}>
              <button
                onClick={handleApply}
                className="flex-1 text-white font-semibold cursor-pointer border-none hover:opacity-90 transition"
                style={{ backgroundColor: '#3d5a3d', borderRadius: 24, padding: '14px 32px', fontSize: 15 }}
              >
                Apply Filters
              </button>
              <button
                onClick={handleClear}
                className="flex-1 font-medium cursor-pointer hover:bg-gray-50 transition"
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #d1d1d1',
                  borderRadius: 24,
                  padding: '14px 24px',
                  fontSize: 15,
                  color: '#545454',
                  opacity: hasActiveFilters ? 1 : 0.4,
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterSection({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col" style={{ gap: 14 }}>
      <p className="font-semibold" style={{ fontSize: 12, color: '#999', letterSpacing: '0.05em', fontVariationSettings: "'opsz' 14" }}>
        {label}
      </p>
      <div className="flex flex-wrap" style={{ gap: 8 }}>
        {options.map(option => {
          const selected = value === option;
          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className="cursor-pointer transition-colors"
              style={{
                backgroundColor: selected ? '#3d5a3d' : '#fff',
                color: selected ? '#fff' : '#545454',
                border: selected ? 'none' : '1px solid #d1d1d1',
                borderRadius: 24,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 500,
                fontVariationSettings: "'opsz' 14",
              }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#ede8e3' }} />;
}

export type { FilterState };
