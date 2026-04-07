import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content — single Outlet with responsive padding via CSS */}
      <main className="min-h-screen" style={{ minWidth: 0 }}>
        <div className="layout-content">
          <div style={{ maxWidth: 980, margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <div className="block md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
