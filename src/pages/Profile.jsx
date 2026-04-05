import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, TrendingUp, MessageSquare, UserPlus,
  Edit3, Building2, Shield, Image, Video, FileText, Clock, Briefcase, X, Lock,
  Share2, Check, Copy, ExternalLink
} from 'lucide-react';
import { getUserById, currentUser, users } from '../data/users';
import { deals } from '../data/deals';
import PostCard from '../components/PostCard';
import DealCard from '../components/DealCard';
import { posts } from '../data/posts';

const tagColors = {
  'Wholesaler': '#8b5cf6',
  'Fix N Flipper': '#ef4444',
  'Marketer': '#06b6d4',
  'Realtor': '#10b981',
  'Cash Buyer': '#f59e0b',
  'Hard Money Lender': '#f59e0b',
  'Private Lender': '#06b6d4',
  'Contractor': '#94a3b8',
  'Property Manager': '#10b981',
  'Agent/Broker': '#10b981',
};

const auditLog = [
  { id: 1, user: 'Carlos Cruz', action: 'Posted a deal', target: '2847 Peachtree Rd - Atlanta, GA', timestamp: '2026-04-04 14:22' },
  { id: 2, user: 'Maria Santos', action: 'Deleted a comment', target: 'Post #12 - Market Update', timestamp: '2026-04-04 11:45' },
  { id: 3, user: 'Jake Torres', action: 'Edited deal price', target: 'Phoenix Fixer → $18,000', timestamp: '2026-04-03 16:30' },
  { id: 4, user: 'Carlos Cruz', action: 'Sent message', target: 'Marcus Johnson', timestamp: '2026-04-03 09:15' },
  { id: 5, user: 'Maria Santos', action: 'Uploaded photo', target: 'Deal ID #4 - Houston', timestamp: '2026-04-02 15:00' },
  { id: 6, user: 'Jake Torres', action: 'Created post', target: '"Phoenix Market is HOT right now"', timestamp: '2026-04-02 10:22' },
];

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = getUserById(id) || getUserById(1);
  const isOwnProfile = profile.id === currentUser.id;
  const [activeTab, setActiveTab] = useState('posts');
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(profile.followers || 0);
  const [showFollowers, setShowFollowers] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileData, setProfileData] = useState({
    name: profile.name,
    bio: profile.bio || '',
    location: profile.location || '',
    tags: profile.tags || [],
    coverPhoto: profile.coverPhoto || '',
    avatar: profile.avatar || '',
  });
  const [editForm, setEditForm] = useState({ ...profileData });

  const joinedDate = profile.joinedDate ? new Date(profile.joinedDate).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '';

  const userDeals = deals.filter(d => d.sellerId === profile.id);
  const userPosts = posts.filter(p => p.userId === profile.id);

  const allTags = ['Wholesaler', 'Fix N Flipper', 'Marketer', 'Realtor', 'Cash Buyer', 'Hard Money Lender', 'Private Lender', 'Contractor', 'Property Manager', 'Agent/Broker'];

  const tabs = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'deals', label: 'Deals', icon: TrendingUp },
    { id: 'about', label: 'About', icon: Users },
    { id: 'photos', label: 'Photos', icon: Image },
    { id: 'videos', label: 'Videos', icon: Video },
    ...(profile.isBusinessProfile ? [{ id: 'audit', label: 'Activity Log', icon: Clock }] : []),
  ];

  function handleFollow() {
    if (following) {
      setFollowerCount(c => c - 1);
    } else {
      setFollowerCount(c => c + 1);
    }
    setFollowing(!following);
  }

  function handleSaveProfile() {
    setProfileData({ ...editForm });
    setShowEditModal(false);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://treim.app/profile/${profile.id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const photoSeeds = Array.from({ length: 12 }, (_, i) => `deal${i + 1}`);
  const videoSeeds = Array.from({ length: 6 }, (_, i) => `video${i + 1}`);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Cover Photo */}
      <div style={{
        height: '280px', position: 'relative',
        background: `linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.3)), url(${profileData.coverPhoto || profile.coverPhoto})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.8))' }} />
        {isOwnProfile && (
          <button style={{
            position: 'absolute', top: '16px', right: '16px',
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px', padding: '8px 14px',
            color: '#f8fafc', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            backdropFilter: 'blur(8px)',
          }}>
            <Image size={14} />
            Edit Cover
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          {/* Avatar */}
          <div style={{
            position: 'absolute', top: '-64px', left: 0,
            width: '128px', height: '128px', borderRadius: '50%',
            border: '4px solid #0a0a0f',
            overflow: 'hidden', background: '#12121e',
          }}>
            <img
              src={profileData.avatar || profile.avatar}
              alt={profileData.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', flexWrap: 'wrap' }}>
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => { setEditForm({ ...profileData }); setShowEditModal(true); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#f8fafc', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  <Edit3 size={15} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowShareModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  }}
                >
                  <Share2 size={15} />
                  Share
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  className={following ? '' : 'gradient-btn'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: following ? 'rgba(16,185,129,0.1)' : undefined,
                    border: following ? '1px solid rgba(16,185,129,0.3)' : 'none',
                    color: following ? '#10b981' : '#fff',
                    cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  {following ? <Check size={15} /> : <UserPlus size={15} />}
                  {following ? 'Following' : 'Follow'}
                </button>
                <Link
                  to="/messages"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#f8fafc', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  <MessageSquare size={15} />
                  Message
                </Link>
                <Link
                  to={`/marketplace?seller=${profile.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                    color: '#8b5cf6', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
                  }}
                >
                  <TrendingUp size={15} />
                  View Deals
                </Link>
                <button
                  onClick={() => setShowShareModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                    color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                  }}
                >
                  <Share2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Name / Info */}
        <div style={{ paddingTop: '80px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: '28px', margin: 0 }}>{profileData.name}</h1>
            {profile.isBusinessProfile && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 700,
              }}>
                <Building2 size={12} />
                Business Account
              </span>
            )}
          </div>
          <div style={{ color: '#475569', fontSize: '15px', marginBottom: '10px' }}>@{profile.username}</div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {profileData.tags.map(tag => {
              const color = tagColors[tag] || '#8b5cf6';
              return (
                <span key={tag} style={{
                  background: `${color}18`, color,
                  border: `1px solid ${color}30`,
                  borderRadius: '20px', padding: '4px 14px', fontSize: '13px', fontWeight: 700,
                }}>
                  {tag}
                </span>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '14px' }}>
              <MapPin size={14} />
              {profileData.location || profile.location}
            </div>
            {profile.isBusinessProfile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '14px' }}>
                <Briefcase size={14} />
                {profile.companyName}
              </div>
            )}
          </div>

          {(profileData.bio || profile.bio) && (
            <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '600px' }}>
              {profileData.bio || profile.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { value: followerCount?.toLocaleString(), label: 'Followers', clickable: 'followers' },
              { value: profile.following?.toLocaleString(), label: 'Following', clickable: 'following' },
              { value: profile.dealsPosted, label: 'Deals Posted' },
            ].map(({ value, label, clickable }) => (
              <button
                key={label}
                onClick={() => clickable && setShowFollowers(clickable)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: clickable ? 'pointer' : 'default', textAlign: 'center' }}
              >
                <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>{value}</div>
                <div style={{ color: '#475569', fontSize: '13px', marginTop: '2px' }}>{label}</div>
              </button>
            ))}
            {joinedDate && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px', paddingLeft: '8px', borderLeft: '1px solid #1e1e2e' }}>
                <Calendar size={13} /> Joined {joinedDate}
              </div>
            )}
          </div>
        </div>

        {/* Business CTA for other profiles */}
        {!isOwnProfile && userDeals.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '12px', padding: '14px 18px',
            marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>
                {profile.name} has {userDeals.length} active deal{userDeals.length !== 1 ? 's' : ''} on the market
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>Browse their listings and request address access</div>
            </div>
            <Link
              to={`/marketplace?seller=${profile.id}`}
              className="gradient-btn"
              style={{ padding: '9px 18px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}
            >
              View Active Deals →
            </Link>
          </div>
        )}

        {/* Business Profile: Team Members */}
        {profile.isBusinessProfile && profile.teamMembers && (
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} style={{ color: '#06b6d4' }} />
              Team Members
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {profile.teamMembers.map((member, i) => (
                <div key={i} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '14px', border: '1px solid #1e1e2e' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, color: '#fff', marginBottom: '10px',
                  }}>
                    {member.name.charAt(0)}
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '14px' }}>{member.name}</div>
                  <div style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 600 }}>{member.role}</div>
                  <div style={{ color: '#475569', fontSize: '12px', marginTop: '4px' }}>{member.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1e1e2e', marginBottom: '24px', overflowX: 'auto' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '12px 20px', background: 'none', border: 'none',
                cursor: 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap',
                color: activeTab === id ? '#8b5cf6' : '#475569',
                borderBottom: activeTab === id ? '2px solid #8b5cf6' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.2s',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {userPosts.length > 0 ? (
              userPosts.map(post => <PostCard key={post.id} post={post} />)
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px' }}>
                <FileText size={48} style={{ marginBottom: '16px', opacity: 0.3, color: '#8b5cf6' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No posts yet</h3>
                <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                  {isOwnProfile ? 'Share your first market update or deal insight' : `${profile.name} hasn't posted yet`}
                </p>
                {isOwnProfile && (
                  <Link to="/social" className="gradient-btn" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                    Create First Post
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'deals' && (
          <div>
            {userDeals.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {userDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px' }}>
                <TrendingUp size={48} style={{ marginBottom: '16px', opacity: 0.3, color: '#8b5cf6' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No deals posted yet</h3>
                <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                  {isOwnProfile ? 'Post your first deal and start getting address requests' : `${profile.name} hasn't listed any deals yet`}
                </p>
                {isOwnProfile && (
                  <Link to="/my-deals" className="gradient-btn" style={{ display: 'inline-block', padding: '10px 20px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                    Post Your First Deal
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>About {profileData.name}</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { label: 'Bio', value: profileData.bio || profile.bio },
                  { label: 'Location', value: profileData.location || profile.location },
                  { label: 'Email', value: profile.email },
                  { label: 'Phone', value: profile.phone },
                  { label: 'Member Since', value: profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : null },
                  ...(profile.isBusinessProfile ? [{ label: 'Company', value: profile.companyName }] : []),
                ].map(({ label, value }) => value && (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>{label}</span>
                    <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            {!isOwnProfile && (
              <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>Ready to connect with {profile.name.split(' ')[0]}?</h4>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>Send a message to discuss deals, partnerships, or market opportunities.</p>
                <Link to="/messages" className="gradient-btn" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: '10px', color: '#fff', fontWeight: 700, textDecoration: 'none' }}>
                  Send a Message
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
              {photoSeeds.map((seed, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={`https://picsum.photos/seed/${seed}/400/400`}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {videoSeeds.map((seed, i) => (
                <div key={i} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                    <img src={`https://picsum.photos/seed/${seed}vid/600/340`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139,92,246,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 0, height: 0, borderLeft: '18px solid #fff', borderTop: '11px solid transparent', borderBottom: '11px solid transparent', marginLeft: '4px' }} />
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>Deal Walkthrough #{i + 1}</div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>{(Math.random() * 10 + 1).toFixed(1)}k views • {i + 1}d ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'audit' && profile.isBusinessProfile && (
          <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: '#8b5cf6' }} />
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: 0 }}>Activity Audit Log</h3>
              <span style={{ color: '#475569', fontSize: '13px' }}>— {profile.companyName}</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#1a1a2e' }}>
                    {['User', 'Action', 'Target', 'Timestamp'].map(col => (
                      <th key={col} style={{
                        textAlign: 'left', padding: '12px 20px',
                        color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px',
                        borderBottom: '1px solid #1e1e2e', whiteSpace: 'nowrap',
                      }}>
                        {col.toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((entry, i) => (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #1e1e2e', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, color: '#fff', fontSize: '12px', flexShrink: 0,
                          }}>
                            {entry.user.charAt(0)}
                          </div>
                          <span style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>{entry.user}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                          border: '1px solid rgba(139, 92, 246, 0.2)',
                          borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
                        }}>
                          {entry.action}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '13px', maxWidth: '200px' }}>
                        <span className="line-clamp-1">{entry.target}</span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#475569', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {entry.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Followers/Following Modal */}
      {showFollowers && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowFollowers(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', width: '100%', maxWidth: '420px', maxHeight: '70vh', overflowY: 'auto' }}>
            <div style={{ padding: '18px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f8fafc', fontSize: '17px', fontWeight: 800, margin: 0, textTransform: 'capitalize' }}>{showFollowers}</h3>
              <button onClick={() => setShowFollowers(null)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '8px' }}>
              {profile.isPrivate && showFollowers === 'following' && !isOwnProfile ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                  <Lock size={24} style={{ color: '#f59e0b', marginBottom: '10px' }} />
                  <p style={{ fontSize: '14px', margin: 0 }}>This user's following list is private</p>
                </div>
              ) : (
                users.slice(1, 8).map(u => (
                  <Link key={u.id} to={`/profile/${u.id}`} onClick={() => setShowFollowers(null)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: '#f8fafc' }}>
                    <img src={u.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>{u.name}</div>
                      <div style={{ color: '#475569', fontSize: '12px' }}>@{u.username}</div>
                    </div>
                    <button className="gradient-btn" style={{ padding: '5px 12px', borderRadius: '6px', color: '#fff', fontSize: '11px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Follow</button>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowEditModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '19px', margin: 0 }}>Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Display Name', key: 'name', type: 'text' },
                { label: 'Location', key: 'location', type: 'text' },
                { label: 'Cover Photo URL', key: 'coverPhoto', type: 'text' },
                { label: 'Avatar URL', key: 'avatar', type: 'text' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="input-dark"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-dark"
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Investor Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allTags.map(tag => {
                    const active = editForm.tags.includes(tag);
                    const color = tagColors[tag] || '#8b5cf6';
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setEditForm(prev => ({
                            ...prev,
                            tags: active ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag],
                          }));
                        }}
                        style={{
                          padding: '5px 12px', borderRadius: '20px',
                          background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${active ? color : '#1e1e2e'}`,
                          color: active ? color : '#94a3b8',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                        }}
                      >
                        {active && '✓ '}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
                <button onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                  Cancel
                </button>
                <button onClick={handleSaveProfile} className="gradient-btn" style={{ flex: 2, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowShareModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '17px', margin: 0 }}>Share Profile</h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#1a1a2e', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#94a3b8', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  https://treim.app/profile/{profile.id}
                </span>
                <button
                  onClick={handleCopyLink}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.15)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.3)'}`, color: copied ? '#10b981' : '#8b5cf6', cursor: 'pointer', fontWeight: 600, fontSize: '13px', flexShrink: 0 }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Twitter/X', 'Facebook', 'LinkedIn'].map(s => (
                  <button key={s} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
