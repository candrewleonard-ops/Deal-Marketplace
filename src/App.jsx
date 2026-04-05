import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f', color: '#f8fafc' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/marketplace" element={<AppLayout><Marketplace /></AppLayout>} />
        <Route path="/marketplace/:id" element={<AppLayout><DealDetail /></AppLayout>} />
        <Route path="/my-deals" element={<AppLayout><MyDeals /></AppLayout>} />
        <Route path="/social" element={<AppLayout><Social /></AppLayout>} />
        <Route path="/groups" element={<AppLayout><Groups /></AppLayout>} />
        <Route path="/city/:cityId" element={<AppLayout><CityDiscussion /></AppLayout>} />
        <Route path="/profile/:id" element={<AppLayout><Profile /></AppLayout>} />
        <Route path="/messages" element={<AppLayout><Messages /></AppLayout>} />
        <Route path="/contractors" element={<AppLayout><Contractors /></AppLayout>} />
        <Route path="/meetups" element={<AppLayout><Meetups /></AppLayout>} />
        <Route path="/premium" element={<AppLayout><Premium /></AppLayout>} />
        <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
        <Route path="/groups/:groupId" element={<AppLayout><GroupDetail /></AppLayout>} />
      </Routes>
    </Router>
  );
}
