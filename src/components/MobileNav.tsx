import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  SearchIcon,
  MessagesIcon,
  NotificationsIcon,
  MenuIcon,
  CloseIcon,
  LibraryIcon,
  CommunityIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from './Icons';

const libraryChildren = [
  { label: 'All Content', to: '/library' },
  { label: 'Videos', to: '/library?type=Video' },
  { label: 'Audio', to: '/library?type=Audio' },
  { label: 'Articles', to: '/library?type=Article' },
  { label: 'Programs', to: '/library?type=Program' },
  { label: 'Resources', to: '/library?type=Resource' },
  { label: 'Saved', to: '/saved' },
];

const communityChildren = [
  { label: 'Community Home', to: '/community' },
  { label: 'Sleep & Rest', to: '/community?space=sleep' },
  { label: 'Anxiety Support', to: '/community?space=anxiety' },
  { label: 'Mindful Movement', to: '/community?space=movement' },
  { label: 'Nutrition & Nourishment', to: '/community?space=nutrition' },
];

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleNavTo = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Full-screen menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-white z-[200] flex flex-col overflow-y-auto"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          <div className="flex-1 flex flex-col" style={{ padding: '24px 20px 120px 20px', gap: 4 }}>
            {/* Logo */}
            <div style={{ marginBottom: 16 }}>
              <span className="font-serif" style={{ fontSize: 24, color: '#3d5a3d' }}>Solace</span>
            </div>

            <MenuNavItem icon={HomeIcon} label="Home" active={isActive('/')} onClick={() => handleNavTo('/')} />
            <MenuNavItem icon={SearchIcon} label="Ask Solace" active={isActive('/search')} onClick={() => handleNavTo('/search')} />
            <MenuNavItem icon={MessagesIcon} label="Messages" active={isActive('/messages')} onClick={() => handleNavTo('/messages')} />
            <MenuNavItem icon={NotificationsIcon} label="Notifications" active={isActive('/notifications')} onClick={() => handleNavTo('/notifications')} />

            {/* Content Library expandable */}
            <button
              onClick={() => setLibraryOpen(!libraryOpen)}
              className="flex items-center border-none bg-transparent cursor-pointer w-full"
              style={{
                padding: '12px 8px',
                gap: 12,
                borderRadius: 8,
                backgroundColor: (location.pathname.startsWith('/library') || location.pathname === '/saved') ? '#e8f0e8' : 'transparent',
                color: (location.pathname.startsWith('/library') || location.pathname === '/saved') ? '#3d5a3d' : '#222',
              }}
            >
              <LibraryIcon style={{ width: 22, height: 22 }} />
              <span className="flex-1 text-left" style={{ fontSize: 18, fontWeight: 500 }}>Content Library</span>
              {libraryOpen ? <ChevronUpIcon style={{ width: 10, height: 5 }} /> : <ChevronDownIcon style={{ width: 10, height: 5 }} />}
            </button>
            {libraryOpen && (
              <div className="flex flex-col" style={{ paddingLeft: 42, gap: 2 }}>
                {libraryChildren.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => handleNavTo(t.to)}
                    className="text-left border-none bg-transparent cursor-pointer"
                    style={{ padding: '8px 8px', fontSize: 16, color: '#555', fontWeight: 400, borderRadius: 6 }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {/* Community expandable (includes Events) */}
            <button
              onClick={() => setCommunityOpen(!communityOpen)}
              className="flex items-center border-none bg-transparent cursor-pointer w-full"
              style={{
                padding: '12px 8px',
                gap: 12,
                borderRadius: 8,
                backgroundColor: location.pathname.startsWith('/community') ? '#e8f0e8' : 'transparent',
                color: location.pathname.startsWith('/community') ? '#3d5a3d' : '#222',
              }}
            >
              <CommunityIcon style={{ width: 22, height: 22 }} />
              <span className="flex-1 text-left" style={{ fontSize: 18, fontWeight: 500 }}>Community</span>
              {communityOpen ? <ChevronUpIcon style={{ width: 10, height: 5 }} /> : <ChevronDownIcon style={{ width: 10, height: 5 }} />}
            </button>
            {communityOpen && (
              <div className="flex flex-col" style={{ paddingLeft: 42, gap: 2 }}>
                {communityChildren.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleNavTo(s.to)}
                    className="text-left border-none bg-transparent cursor-pointer"
                    style={{ padding: '8px 8px', fontSize: 16, color: '#555', fontWeight: 400, borderRadius: 6 }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            <MenuNavItem icon={CalendarIcon} label="Events" active={isActive('/events')} onClick={() => handleNavTo('/events')} />

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#ebebeb', margin: '8px 0' }} />

            {/* User profile expandable */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center border-none bg-transparent cursor-pointer w-full"
              style={{
                padding: '12px 8px',
                gap: 12,
                borderRadius: 8,
              }}
            >
              <div
                className="rounded-full flex items-center justify-center font-serif shrink-0"
                style={{ width: 28, height: 28, backgroundColor: '#f5f0eb', fontSize: 12, color: '#3d5a3d' }}
              >
                M
              </div>
              <span className="flex-1 text-left" style={{ fontSize: 18, fontWeight: 500, color: '#222' }}>Maya</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#3d5a3d',
                  backgroundColor: '#e8f0e8',
                  padding: '2px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Admin
              </span>
              {profileOpen ? <ChevronUpIcon style={{ width: 10, height: 5, color: '#999' }} /> : <ChevronDownIcon style={{ width: 10, height: 5, color: '#999' }} />}
            </button>
            {profileOpen && (
              <div className="flex flex-col" style={{ paddingLeft: 42, gap: 2 }}>
                <button
                  onClick={() => handleNavTo('/settings')}
                  className="text-left border-none bg-transparent cursor-pointer"
                  style={{ padding: '8px 8px', fontSize: 16, color: '#555', fontWeight: 400, borderRadius: 6 }}
                >
                  Profile
                </button>
                <button
                  onClick={() => handleNavTo('/settings')}
                  className="text-left border-none bg-transparent cursor-pointer"
                  style={{ padding: '8px 8px', fontSize: 16, color: '#555', fontWeight: 400, borderRadius: 6 }}
                >
                  Account Settings
                </button>
                <button
                  onClick={() => handleNavTo('/admin')}
                  className="text-left border-none bg-transparent cursor-pointer"
                  style={{ padding: '8px 8px', fontSize: 16, color: '#3d5a3d', fontWeight: 500, borderRadius: 6 }}
                >
                  Admin Dashboard
                </button>
              </div>
            )}
          </div>

          {/* Close button at bottom center */}
          <div className="fixed bottom-0 left-0 right-0 flex justify-center" style={{ paddingBottom: 32, zIndex: 201 }}>
            <button
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center cursor-pointer border-none"
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: '#1a1a1a',
              }}
            >
              <CloseIcon style={{ width: 22, height: 22, color: '#fff' }} />
            </button>
          </div>
        </div>
      )}

      {/* Bottom floating nav bar */}
      {!menuOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center"
          style={{ paddingBottom: 24, zIndex: 100 }}
        >
          <div
            className="flex items-center bg-white"
            style={{
              borderRadius: 40,
              padding: '8px 16px',
              gap: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
          >
            <NavLink
              to="/"
              end
              className="flex items-center justify-center no-underline"
              style={{
                width: 40, height: 40,
                borderRadius: 20,
                backgroundColor: isActive('/') ? '#e8f0e8' : 'transparent',
                color: isActive('/') ? '#3d5a3d' : '#555',
              }}
            >
              <HomeIcon style={{ width: 26, height: 26 }} />
            </NavLink>
            <NavLink
              to="/search"
              className="flex items-center justify-center no-underline"
              style={{
                width: 40, height: 40,
                borderRadius: 20,
                backgroundColor: isActive('/search') ? '#e8f0e8' : 'transparent',
                color: isActive('/search') ? '#3d5a3d' : '#555',
              }}
            >
              <SearchIcon style={{ width: 26, height: 26 }} />
            </NavLink>
            <NavLink
              to="/messages"
              className="flex items-center justify-center no-underline"
              style={{
                width: 40, height: 40,
                borderRadius: 20,
                backgroundColor: isActive('/messages') ? '#e8f0e8' : 'transparent',
                color: isActive('/messages') ? '#3d5a3d' : '#555',
              }}
            >
              <MessagesIcon style={{ width: 26, height: 26 }} />
            </NavLink>
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center cursor-pointer border-none bg-transparent"
              style={{ width: 40, height: 40, color: '#555' }}
            >
              <MenuIcon style={{ width: 26, height: 26 }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function MenuNavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center border-none bg-transparent cursor-pointer w-full"
      style={{
        padding: '12px 8px',
        gap: 12,
        borderRadius: 8,
        backgroundColor: active ? '#e8f0e8' : 'transparent',
        color: active ? '#3d5a3d' : '#222',
      }}
    >
      <Icon style={{ width: 22, height: 22 }} />
      <span style={{ fontSize: 18, fontWeight: 500 }}>{label}</span>
    </button>
  );
}
