import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  HomeIcon,
  SearchIcon,
  MessagesIcon,
  NotificationsIcon,
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

function NavItem({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={`flex items-center rounded-lg transition-colors no-underline`}
      style={({ isActive }) => ({
        width: 232,
        gap: 10,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 8,
        backgroundColor: isActive ? '#e8f0e8' : 'transparent',
        color: isActive ? '#3d5a3d' : '#555',
        fontWeight: isActive ? 600 : 500,
      })}
    >
      <Icon className="shrink-0" style={{ width: 18, height: 18 }} />
      <span style={{ fontSize: 15, lineHeight: 'normal', fontVariationSettings: "'opsz' 14" }}>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [communityOpen, setCommunityOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const isLibraryActive = location.pathname.startsWith('/library') || location.pathname === '/saved';
  const isCommunityActive = location.pathname.startsWith('/community');

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 bg-white overflow-y-auto z-50 flex flex-col"
      style={{ width: 280, borderRight: '1px solid #ebebeb' }}
    >
      {/* Logo */}
      <div style={{ paddingLeft: 23, paddingTop: 31 }}>
        <NavLink
          to="/"
          className="font-serif no-underline"
          style={{ fontSize: 28, color: '#3d5a3d', lineHeight: 'normal' }}
        >
          Solace
        </NavLink>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 flex flex-col" style={{ paddingLeft: 23, paddingTop: 16 }}>
        <div className="flex flex-col" style={{ gap: 2 }}>
          <NavItem to="/" icon={HomeIcon} label="Home" end />
          <NavItem to="/search" icon={SearchIcon} label="Ask Solace" />
          <NavItem to="/messages" icon={MessagesIcon} label="Messages" />
          <NavItem to="/notifications" icon={NotificationsIcon} label="Notifications" />
          {/* Content Library with sub-types */}
          <button
            onClick={() => setLibraryOpen(!libraryOpen)}
            className="flex items-center transition-colors text-left cursor-pointer border-none"
            style={{
              width: 232,
              gap: 10,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 8,
              backgroundColor: isLibraryActive ? '#e8f0e8' : 'transparent',
              color: isLibraryActive ? '#3d5a3d' : '#555',
              fontWeight: isLibraryActive ? 600 : 500,
            }}
          >
            <LibraryIcon className="shrink-0" style={{ width: 18, height: 18 }} />
            <span className="flex-1" style={{ fontSize: 15, lineHeight: 'normal', fontVariationSettings: "'opsz' 14" }}>
              Content Library
            </span>
            {libraryOpen ? (
              <ChevronUpIcon style={{ width: 8, height: 4 }} />
            ) : (
              <ChevronDownIcon style={{ width: 8, height: 4 }} />
            )}
          </button>

          {libraryOpen && (
            <div className="flex flex-col" style={{ paddingLeft: 16, gap: 2 }}>
              {libraryChildren.map((child) => (
                <NavLink
                  key={child.label}
                  to={child.to}
                  className="flex items-center no-underline transition-colors hover:bg-gray-50"
                  style={{
                    width: 216,
                    height: 32,
                    paddingLeft: 26,
                    paddingRight: 12,
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#555',
                    fontWeight: 400,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* Community with sub-spaces and events */}
          <button
            onClick={() => setCommunityOpen(!communityOpen)}
            className="flex items-center transition-colors text-left cursor-pointer border-none"
            style={{
              width: 232,
              gap: 10,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 8,
              backgroundColor: isCommunityActive ? '#e8f0e8' : 'transparent',
              color: isCommunityActive ? '#3d5a3d' : '#555',
              fontWeight: isCommunityActive ? 600 : 500,
            }}
          >
            <CommunityIcon className="shrink-0" style={{ width: 18, height: 18 }} />
            <span className="flex-1" style={{ fontSize: 15, lineHeight: 'normal', fontVariationSettings: "'opsz' 14" }}>
              Community
            </span>
            {communityOpen ? (
              <ChevronUpIcon style={{ width: 8, height: 4 }} />
            ) : (
              <ChevronDownIcon style={{ width: 8, height: 4 }} />
            )}
          </button>

          {communityOpen && (
            <div className="flex flex-col" style={{ paddingLeft: 16, gap: 2 }}>
              {communityChildren.map((child) => (
                <NavLink
                  key={child.label}
                  to={child.to}
                  className="flex items-center no-underline transition-colors hover:bg-gray-50"
                  style={{
                    width: 216,
                    height: 32,
                    paddingLeft: 26,
                    paddingRight: 12,
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#555',
                    fontWeight: 400,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          )}

          <NavItem to="/events" icon={CalendarIcon} label="Events" />
        </div>
      </nav>

      {/* User profile section */}
      <div className="mt-auto" style={{ paddingLeft: 23, paddingBottom: 24 }}>
        <div style={{ borderTop: '1px solid #ebebeb', paddingTop: 12 }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center border-none bg-transparent cursor-pointer w-full"
            style={{
              width: 232,
              gap: 10,
              paddingLeft: 0,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              borderRadius: 8,
            }}
          >
            <div
              className="rounded-full flex items-center justify-center font-serif shrink-0"
              style={{ width: 32, height: 32, backgroundColor: '#f5f0eb', fontSize: 14, color: '#3d5a3d' }}
            >
              M
            </div>
            <div className="flex-1 flex items-center" style={{ gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#222' }}>Maya</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: '#3d5a3d',
                  backgroundColor: '#e8f0e8',
                  padding: '2px 6px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Admin
              </span>
            </div>
            {profileOpen ? (
              <ChevronUpIcon style={{ width: 8, height: 4, color: '#999' }} />
            ) : (
              <ChevronDownIcon style={{ width: 8, height: 4, color: '#999' }} />
            )}
          </button>

          {profileOpen && (
            <div className="flex flex-col" style={{ paddingLeft: 16, gap: 2, marginTop: 2 }}>
              {[
                { label: 'Account Settings', to: '/settings' },
              ].map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="flex items-center no-underline transition-colors hover:bg-gray-50"
                  style={{
                    width: 216,
                    height: 32,
                    paddingLeft: 26,
                    paddingRight: 12,
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#555',
                    fontWeight: 400,
                    fontVariationSettings: "'opsz' 14",
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className="flex items-center no-underline transition-colors hover:bg-gray-50"
                style={{
                  width: 216,
                  height: 32,
                  paddingLeft: 26,
                  paddingRight: 12,
                  borderRadius: 6,
                  fontSize: 13,
                  color: '#3d5a3d',
                  fontWeight: 500,
                  fontVariationSettings: "'opsz' 14",
                }}
              >
                Admin Dashboard
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
