import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileTabBar from './components/MobileTabBar';
import AuthPromptModal from './components/AuthPromptModal';
import DMShowcaseModal from './components/DMShowcaseModal';
import OnboardingModal from './components/OnboardingModal';
import { useIsMobile } from './hooks/useIsMobile';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import DealDetail from './pages/DealDetail';
import Social from './pages/Social';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Contractors from './pages/Contractors';
import Meetups from './pages/Meetups';
import Auth from './pages/Auth';
import MyDeals from './pages/MyDeals';
import Groups from './pages/Groups';
import CityDiscussion from './pages/CityDiscussion';
import Admin from './pages/Admin';
import Premium from './pages/Premium';
import GroupDetail from './pages/GroupDetail';
import SavedDeals from './pages/SavedDeals';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import BidRequest from './pages/BidRequest';
import HowTo from './pages/HowTo';
import PostDeal from './pages/PostDeal';
import { DMGuard, AuthGuard } from './components/RouteGuards';
import './index.css';

function AppLayout({ children, hideFooter, hideTabBar }) {
  const isMobile = useIsMobile();
  const showTabBar = isMobile && !hideTabBar;
  return (
    <div
      style={{
        backgroundColor: '#0a0a0f',
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
        <Route path="/post-deal" element={<AuthGuard reason="post a deal"><AppLayout hideFooter hideTabBar><PostDeal /></AppLayout></AuthGuard>} />
        <Route path="*" element={<AppLayout hideFooter><NotFound /></AppLayout>} />
      </Routes>
    </Router>
  );
}
