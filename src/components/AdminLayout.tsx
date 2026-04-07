import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardIcon,
  ContentIcon,
  CalendarIcon,
  CommunityIcon,
  MembersIcon,
  GearIcon,
  ArrowLeftIcon,
} from './Icons';

const adminNav = [
  { to: '/admin', icon: DashboardIcon, label: 'Overview', end: true },
  { to: '/admin/content', icon: ContentIcon, label: 'Content', end: false },
  { to: '/admin/events', icon: CalendarIcon, label: 'Events', end: false },
  { to: '/admin/community', icon: CommunityIcon, label: 'Community', end: false },
  { to: '/admin/members', icon: MembersIcon, label: 'Members', end: false },
  { to: '/admin/settings', icon: GearIcon, label: 'Platform Settings', end: false },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f8f8' }}>
      {/* Admin sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 bg-white overflow-y-auto z-50 hidden md:flex flex-col"
        style={{ width: 260, borderRight: '1px solid #ebebeb' }}
      >
        {/* Header */}
        <div style={{ padding: '24px 20px 16px' }}>
          <NavLink
            to="/"
            className="flex items-center no-underline"
            style={{ gap: 8, color: '#555', fontSize: 13, fontWeight: 500 }}
          >
            <ArrowLeftIcon />
            <span>Back to Solace</span>
          </NavLink>
          <div className="flex items-center" style={{ marginTop: 20, gap: 10 }}>
            <span className="font-serif" style={{ fontSize: 24, color: '#3d5a3d' }}>Solace</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#fff',
                backgroundColor: '#3d5a3d',
                padding: '3px 8px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Admin
            </span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 flex flex-col" style={{ padding: '8px 14px', gap: 2 }}>
          {adminNav.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && item.to !== '/admin';
            const isOverviewActive = item.end && location.pathname === '/admin';

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="flex items-center no-underline transition-colors"
                style={{
                  gap: 10,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 8,
                  backgroundColor: (isActive || isOverviewActive) ? '#e8f0e8' : 'transparent',
                  color: (isActive || isOverviewActive) ? '#3d5a3d' : '#555',
                  fontWeight: (isActive || isOverviewActive) ? 600 : 500,
                  fontSize: 14,
                }}
              >
                <item.icon className="shrink-0" style={{ width: 18, height: 18 }} />
                <span style={{ fontVariationSettings: "'opsz' 14" }}>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User at bottom */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #ebebeb' }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <div
              className="rounded-full flex items-center justify-center font-serif shrink-0"
              style={{ width: 32, height: 32, backgroundColor: '#f5f0eb', fontSize: 14, color: '#3d5a3d' }}
            >
              M
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#222' }}>Maya Thompson</p>
              <p style={{ fontSize: 11, color: '#999' }}>Platform Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="flex md:hidden items-center justify-between bg-white"
        style={{ padding: '16px 20px', borderBottom: '1px solid #ebebeb', position: 'sticky', top: 0, zIndex: 50 }}
      >
        <div className="flex items-center" style={{ gap: 10 }}>
          <NavLink
            to="/"
            className="flex items-center no-underline"
            style={{ color: '#555' }}
          >
            <ArrowLeftIcon />
          </NavLink>
          <span className="font-serif" style={{ fontSize: 20, color: '#3d5a3d' }}>Admin</span>
        </div>
      </div>

      {/* Mobile nav tabs */}
      <div
        className="flex md:hidden overflow-x-auto bg-white"
        style={{ borderBottom: '1px solid #ebebeb', padding: '0 16px', gap: 4 }}
      >
        {adminNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="no-underline shrink-0"
            style={({ isActive }) => ({
              padding: '12px 14px',
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#3d5a3d' : '#555',
              borderBottom: isActive ? '2px solid #3d5a3d' : '2px solid transparent',
              whiteSpace: 'nowrap',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Content area */}
      <main>
        <div
          className="hidden md:block"
          style={{ marginLeft: 260 }}
        >
          <div style={{ maxWidth: 1100, padding: '40px 48px' }}>
            <Outlet />
          </div>
        </div>
        <div
          className="block md:hidden"
          style={{ padding: '24px 16px 40px' }}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
