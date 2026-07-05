import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileTabBar from './components/MobileTabBar';
import AuthPromptModal from './components/AuthPromptModal';
import DMShowcaseModal from './components/DMShowcaseModal';
import OnboardingModal from './components/OnboardingModal';
import { useIsMobile } from './hooks/useIsMobile';
// Hot path stays in the main bundle: browse → open a deal → sign up.
import Marketplace from './pages/Marketplace';
import DealDetail from './pages/DealDetail';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import { DMGuard, AuthGuard } from './components/RouteGuards';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

// Everything else loads on demand — cuts the first paint bundle massively.
const Landing        = lazy(() => import('./pages/Landing'));
const Social         = lazy(() => import('./pages/Social'));
const Profile        = lazy(() => import('./pages/Profile'));
const Messages       = lazy(() => import('./pages/Messages'));
const Contractors    = lazy(() => import('./pages/Contractors'));
const Meetups        = lazy(() => import('./pages/Meetups'));
const MyDeals        = lazy(() => import('./pages/MyDeals'));
const Groups         = lazy(() => import('./pages/Groups'));
const CityDiscussion = lazy(() => import('./pages/CityDiscussion'));
const Admin          = lazy(() => import('./pages/Admin'));
const Premium        = lazy(() => import('./pages/Premium'));
const GroupDetail    = lazy(() => import('./pages/GroupDetail'));
const SavedDeals     = lazy(() => import('./pages/SavedDeals'));
const Notifications  = lazy(() => import('./pages/Notifications'));
const BidRequest     = lazy(() => import('./pages/BidRequest'));
const HowTo          = lazy(() => import('./pages/HowTo'));
const PostDeal       = lazy(() => import('./pages/PostDeal'));
const LiveTours      = lazy(() => import('./pages/LiveTours'));
const LiveRoom       = lazy(() => import('./pages/LiveRoom'));
const SuperAdmin     = lazy(() => import('./pages/SuperAdmin'));
const SuperAdminUser = lazy(() => import('./pages/SuperAdminUser'));

function PageLoader() {
  return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        border: '3px solid #232925', borderTopColor: '#00c805',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  );
}

function AppLayout({ children, hideFooter, hideTabBar }) {
  const isMobile = useIsMobile();
  const showTabBar = isMobile && !hideTabBar;
  return (
    <div
      style={{
        backgroundColor: '#0a0b0a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
      }}
    >
      <Navbar />
      <main
        style={{
          flex: 1,
          /* Reserve space for the bottom tab bar on mobile so content isn't hidden */
          paddingBottom: showTabBar
            ? 'calc(72px + env(safe-area-inset-bottom))'
            : 0,
        }}
      >
        {children}
      </main>
      {!hideFooter && !isMobile && <Footer />}
      {showTabBar && <MobileTabBar />}
      <AuthPromptModal />
      <DMShowcaseModal />
      <OnboardingModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<AppLayout hideFooter><PageLoader /></AppLayout>}>
      <Routes>
        <Route path="/" element={<AppLayout hideFooter><Marketplace /></AppLayout>} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/marketplace" element={<AppLayout hideFooter><Marketplace /></AppLayout>} />
        <Route path="/marketplace/:id" element={<AppLayout><DealDetail /></AppLayout>} />
        <Route path="/my-deals" element={<AuthGuard reason="manage your deals"><AppLayout><MyDeals /></AppLayout></AuthGuard>} />
        <Route path="/social" element={<AppLayout><Social /></AppLayout>} />
        <Route path="/groups" element={<AppLayout><Groups /></AppLayout>} />
        <Route path="/city/:cityId" element={<AppLayout><CityDiscussion /></AppLayout>} />
        <Route path="/profile/:id" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/messages" element={<DMGuard placement="messages-route"><AppLayout hideFooter><Messages /></AppLayout></DMGuard>} />
        <Route path="/contractors" element={<AppLayout><Contractors /></AppLayout>} />
        <Route path="/meetups" element={<AppLayout><Meetups /></AppLayout>} />
        <Route path="/premium" element={<AppLayout><Premium /></AppLayout>} />
        <Route path="/admin" element={<AppLayout hideFooter><Admin /></AppLayout>} />
        <Route path="/groups/:groupId" element={<AppLayout><GroupDetail /></AppLayout>} />
        <Route path="/saved" element={<AuthGuard reason="see your saved deals"><AppLayout><SavedDeals /></AppLayout></AuthGuard>} />
        <Route path="/notifications" element={<AuthGuard reason="see your notifications"><AppLayout><Notifications /></AppLayout></AuthGuard>} />
        <Route path="/bid-request" element={<AppLayout hideFooter><BidRequest /></AppLayout>} />
        <Route path="/bid-request/:dealId" element={<AppLayout hideFooter><BidRequest /></AppLayout>} />
        <Route path="/how-to" element={<AppLayout><HowTo /></AppLayout>} />
        <Route path="/live" element={<AppLayout hideFooter><LiveTours /></AppLayout>} />
        <Route path="/live/broadcast" element={<AuthGuard reason="go live"><AppLayout hideFooter hideTabBar><LiveRoom broadcast /></AppLayout></AuthGuard>} />
        <Route path="/live/:id" element={<AppLayout hideFooter hideTabBar><LiveRoom /></AppLayout>} />
        <Route path="/post-deal" element={<AuthGuard reason="post a deal"><AppLayout hideFooter hideTabBar><PostDeal /></AppLayout></AuthGuard>} />
        <Route path="/super-admin" element={<AppLayout hideFooter><SuperAdmin /></AppLayout>} />
        <Route path="/super-admin/user/:id" element={<AppLayout hideFooter><SuperAdminUser /></AppLayout>} />
        <Route path="*" element={<AppLayout hideFooter><NotFound /></AppLayout>} />
      </Routes>
      </Suspense>
    </Router>
  );
}
