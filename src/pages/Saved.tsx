import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useContent } from '../context/ContentContext';
import ContentCard from '../components/ContentCard';
import PageTransition from '../components/PageTransition';

export default function Saved() {
  const { user } = useUser();
  const { content: allContent } = useContent();
  const savedItems = allContent.filter(item => user.savedContent.includes(item.id));

  return (
    <PageTransition variant="grid">
      <div>
      <h1
        className="font-serif"
        style={{ fontSize: 40, color: '#1a1a1a', fontWeight: 400 }}
      >
        Saved
      </h1>

      {savedItems.length > 0 ? (
        <div className="grid mt-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', columnGap: 24, rowGap: 20 }}>
          {savedItems.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center"
          style={{ width: '400px', maxWidth: '100%', margin: '80px auto 0', gap: '16px', textAlign: 'center' }}
        >
          {/* Illustration placeholder */}
          <div
            className="flex items-center justify-center"
            style={{
              width: '120px',
              height: '100px',
              backgroundColor: '#f2f2f2',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '80px',
                backgroundColor: '#ebebeb',
                borderRadius: '8px',
              }}
            />
          </div>

          <h2
            className="font-serif"
            style={{ fontSize: '24px', color: '#222', fontWeight: 400 }}
          >
            No saved items yet
          </h2>

          <p style={{ fontSize: '15px', color: '#6c6c6c', lineHeight: '22px', fontWeight: 400 }}>
            Browse the library and save content you&apos;d like to revisit.
          </p>

          <Link
            to="/library"
            className="no-underline hover:opacity-90 transition flex items-center justify-center"
            style={{
              width: '200px',
              height: '48px',
              backgroundColor: '#7a9b7a',
              borderRadius: '9999px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            Browse library
          </Link>
        </div>
      )}
      </div>
    </PageTransition>
  );
}
