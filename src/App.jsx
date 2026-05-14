import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileTabBar from './components/MobileTabBar';
import AuthPromptModal from './components/AuthPromptModal';
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
import MarketplacePreview from './preview/MarketplacePreview';
import './index.css';

function AppLayout({ children, hideFooter }) {
  const isMobile = useIsMobile();
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
          paddingBottom: isMobile
            ? 'calc(72px + env(safe-area-inset-bottom))'
            : 0,
        }}
      >
        {children}
      </main>
      {!hideFooter && !isMobile && <Footer />}
      {isMobile && <MobileTabBar />}
      <AuthPromptModal />
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
        {/* Preview-only marketplace redesign — does not affect live /marketplace */}
        <Route path="/marketplace-preview" element={<MarketplacePreview />} />
        <Route path="/marketplace" element={<AppLayout hideFooter><Marketplace /></AppLayout>} />
        <Route path="/marketplace/:id" element={<AppLayout><DealDetail /></AppLayout>} />
        <Route path="/my-deals" element={<AppLayout><MyDeals /></AppLayout>} />
        <Route path="/social" element={<AppLayout><Social /></AppLayout>} />
        <Route path="/groups" element={<AppLayout><Groups /></AppLayout>} />
        <Route path="/city/:cityId" element={<AppLayout><CityDiscussion /></AppLayout>} />
        <Route path="/profile/:id" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/messages" element={<AppLayout hideFooter><Messages /></AppLayout>} />
        <Route path="/contractors" element={<AppLayout><Contractors /></AppLayout>} />
        <Route path="/meetups" element={<AppLayout><Meetups /></AppLayout>} />
        <Route path="/premium" element={<AppLayout><Premium /></AppLayout>} />
        <Route path="/admin" element={<AppLayout hideFooter><Admin /></AppLayout>} />
        <Route path="/groups/:groupId" element={<AppLayout><GroupDetail /></AppLayout>} />
        <Route path="/saved" element={<AppLayout><SavedDeals /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
        <Route path="*" element={<AppLayout hideFooter><NotFound /></AppLayout>} />
      </Routes>
    </Router>
  );
}
