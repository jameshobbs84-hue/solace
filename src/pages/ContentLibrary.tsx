import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentCard from '../components/ContentCard';
import FilterModal, { type FilterState } from '../components/FilterModal';
import { libraryFilters } from '../data/content';
import { useContent } from '../context/ContentContext';
import PageTransition from '../components/PageTransition';

const ITEMS_PER_PAGE = 12;

const defaultFilters: FilterState = {
  topic: 'All Topics',
  contentType: 'All Types',
  program: 'All Programs',
  duration: 'Any Length',
  sortBy: 'Most Recent',
};

function parseDurationMinutes(duration: string): number | null {
  const match = duration.match(/(\d+)\s*min/);
  if (match) return parseInt(match[1], 10);
  return null;
}

function matchesDuration(item: { duration: string }, filter: string): boolean {
  if (filter === 'Any Length') return true;
  const mins = parseDurationMinutes(item.duration);
  if (mins === null) return filter === '30+ min'; // PDFs, lessons, replies → bucket into 30+
  if (filter === 'Under 5 min') return mins < 5;
  if (filter === '5–15 min') return mins >= 5 && mins <= 15;
  if (filter === '15–30 min') return mins > 15 && mins <= 30;
  if (filter === '30+ min') return mins > 30;
  return true;
}

export default function ContentLibrary() {
  const { content: allContent } = useContent();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get('type');
  const [activeFilter, setActiveFilter] = useState('All Topics');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);

  // Reset page when type filter changes from URL
  useEffect(() => {
    setCurrentPage(1);
  }, [typeFilter]);

  const filteredContent = allContent.filter((item) => {
    // URL type filter
    if (typeFilter && item.type !== typeFilter) return false;
    // Topic pill filter
    if (activeFilter !== 'All Topics') {
      if (activeFilter === 'Discussions') {
        if (item.type !== 'Discussion') return false;
      } else if (!item.topics.includes(activeFilter)) return false;
    }
    // Modal filters
    if (appliedFilters.topic !== 'All Topics' && !item.topics.includes(appliedFilters.topic)) return false;
    if (appliedFilters.contentType !== 'All Types') {
      const typeMap: Record<string, string> = { Articles: 'Article', Videos: 'Video', Audio: 'Audio', Programs: 'Program', Resources: 'Resource', Discussions: 'Discussion' };
      if (item.type !== typeMap[appliedFilters.contentType]) return false;
    }
    if (appliedFilters.program !== 'All Programs') {
      const programMap: Record<string, string> = { 'The Sleep Reset': 'sleep-reset', 'Mindful Mornings': 'mindful-mornings', 'Nourish: Nutrition': 'nourish-nutrition', 'Movement for Anxiety': 'movement-anxiety-relief' };
      if (item.id !== programMap[appliedFilters.program]) return false;
    }
    if (!matchesDuration(item, appliedFilters.duration)) return false;
    return true;
  });

  // Sort
  const sortedContent = [...filteredContent].sort((a, b) => {
    if (appliedFilters.sortBy === 'Most Popular') return (b.progress ?? 0) - (a.progress ?? 0);
    if (appliedFilters.sortBy === 'Recommended') {
      const aScore = (a.progress && a.progress > 0 ? 1 : 0) + a.topics.length;
      const bScore = (b.progress && b.progress > 0 ? 1 : 0) + b.topics.length;
      return bScore - aScore;
    }
    return 0; // Most Recent = default order
  });

  const activeFilterCount = [appliedFilters.topic, appliedFilters.contentType, appliedFilters.program, appliedFilters.duration, appliedFilters.sortBy]
    .filter((v, i) => v !== ['All Topics', 'All Types', 'All Programs', 'Any Length', 'Most Recent'][i]).length;

  const totalPages = Math.max(1, Math.ceil(sortedContent.length / ITEMS_PER_PAGE));
  const paginatedContent = sortedContent.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const pageNumbers = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  return (
    <PageTransition variant="grid">
      <div>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1
          className="font-serif"
          style={{ fontSize: '40px', color: '#1a1a1a', fontWeight: 400 }}
        >
          {typeFilter
            ? typeFilter === 'Audio' ? 'Audio' : `${typeFilter}s`
            : 'Content Library'}
        </h1>
        <button
          onClick={() => setFilterModalOpen(true)}
          className="bg-white rounded-3xl cursor-pointer hover:bg-gray-50 flex items-center"
          style={{
            border: '1px solid #ddd',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#222',
            gap: 8,
          }}
        >
          Filters
          {activeFilterCount > 0 && (
            <span
              className="text-white flex items-center justify-center"
              style={{ backgroundColor: '#3d5a3d', borderRadius: 10, minWidth: 20, height: 20, fontSize: 11, fontWeight: 700, padding: '0 6px' }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap" style={{ gap: 8, marginTop: 20, marginBottom: 26 }}>
        {libraryFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => handleFilterChange(filter)}
            className="rounded-3xl cursor-pointer transition"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: activeFilter === filter ? '#7a9b7a' : '#fff',
              color: activeFilter === filter ? '#fff' : '#222',
              border: activeFilter === filter ? 'none' : '1px solid #ebebeb',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', columnGap: 24, rowGap: 20 }}>
        {paginatedContent.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center" style={{ gap: 12, marginTop: 40 }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="bg-white rounded-lg flex items-center justify-center text-text-primary disabled:opacity-40 cursor-pointer"
          style={{ width: '40px', height: '40px', border: '1px solid #ebebeb', fontSize: '14px', fontWeight: 500 }}
        >
          &#8249;
        </button>
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className="rounded-lg flex items-center justify-center cursor-pointer"
            style={{
              width: '40px',
              height: '40px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: currentPage === page ? '#7a9b7a' : '#fff',
              color: currentPage === page ? '#fff' : '#222',
              border: currentPage === page ? 'none' : '1px solid #ebebeb',
            }}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="bg-white rounded-lg flex items-center justify-center text-text-primary disabled:opacity-40 cursor-pointer"
          style={{ width: '40px', height: '40px', border: '1px solid #ebebeb', fontSize: '14px', fontWeight: 500 }}
        >
          &#8250;
        </button>
      </div>

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(filters) => {
          setAppliedFilters(filters);
          setCurrentPage(1);
        }}
        initialFilters={appliedFilters}
      />
      </div>
    </PageTransition>
  );
}
