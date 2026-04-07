import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import SignUp from './pages/SignUp';
import SignUpDetails from './pages/SignUpDetails';
import Login from './pages/Login';
import OnboardingWelcome from './pages/OnboardingWelcome';
import OnboardingStage from './pages/OnboardingStage';
import OnboardingFocus from './pages/OnboardingFocus';
import OnboardingPreference from './pages/OnboardingPreference';
import OnboardingLoading from './pages/OnboardingLoading';
import ContentLibrary from './pages/ContentLibrary';
import Search from './pages/Search';
import Saved from './pages/Saved';
import ContentDetail from './pages/ContentDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Community from './pages/Community';
import CommunityThread from './pages/CommunityThread';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminContent from './pages/admin/AdminContent';
import AdminEvents from './pages/admin/AdminEvents';
import AdminCommunity from './pages/admin/AdminCommunity';
import AdminMembers from './pages/admin/AdminMembers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContentEdit from './pages/admin/AdminContentEdit';
import AdminContentNew from './pages/admin/AdminContentNew';

export default function App() {
  return (
    <Routes>
      {/* Auth — no sidebar */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signup/details" element={<SignUpDetails />} />
      <Route path="/login" element={<Login />} />

      {/* Onboarding — no sidebar */}
      <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
      <Route path="/onboarding/stage" element={<OnboardingStage />} />
      <Route path="/onboarding/focus" element={<OnboardingFocus />} />
      <Route path="/onboarding/preference" element={<OnboardingPreference />} />
      <Route path="/onboarding/loading" element={<OnboardingLoading />} />

      {/* Admin area — own layout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/content/new" element={<AdminContentNew />} />
        <Route path="/admin/content/:id" element={<AdminContentEdit />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/community" element={<AdminCommunity />} />
        <Route path="/admin/members" element={<AdminMembers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      {/* Main app — with sidebar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/library" element={<ContentLibrary />} />
        <Route path="/search" element={<Search />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/content/:type/:id" element={<ContentDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:threadId" element={<CommunityThread />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
