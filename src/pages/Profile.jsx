import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Calendar, Users, TrendingUp, MessageSquare, UserPlus,
  Edit3, Building2, Shield, Image, Video, FileText, Clock, Briefcase, X, Lock
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
  const profile = getUserById(id) || getUserById(1);
  const isOwnProfile = profile.id === currentUser.id;
  const [activeTab, setActiveTab] = useState('posts');
  const [following, setFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(null); // 'followers' | 'following' | null

  const joinedDate = profile.joinedDate ? new Date(profile.joinedDate).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : '';

  const userDeals = deals.filter(d => d.sellerId === profile.id);
  const userPosts = posts.filter(p => p.userId === profile.id);

  const tabs = [
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'deals', label: 'Deals', icon: TrendingUp },
    { id: 'about', label: 'About', icon: Users },
    ...(profile.isBusinessProfile ? [{ id: 'audit', label: 'Activity Log', icon: Clock }] : []),
  ];

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Cover Photo */}
      <div style={{
        height: '280px', position: 'relative',
        background: `linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(6, 182, 212, 0.3)), url(${profile.coverPhoto})`,
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
              src={profile.avatar}
              alt={profile.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '16px', flexWrap: 'wrap' }}>
            {isOwnProfile ? (
              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 18px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e',
                color: '#f8fafc', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                transition: 'all 0.2s',
              }}>
                <Edit3 size={15} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setFollowing(!following)}
                  className={following ? '' : 'gradient-btn'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '9px 18px', borderRadius: '10px',
                    background: following ? 'rgba(255,255,255,0.05)' : undefined,
                    border: following ? '1px solid #1e1e2e' : 'none',
                    color: following ? '#94a3b8' : '#fff',
                    cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    transition: 'all 0.2s',
                  }}
                >
                  <UserPlus size={15} />
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
              </>
            )}
          </div>
        </div>

        {/* Name / Info */}
        <div style={{ paddingTop: '80px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <h1 style={{ color: '#f8fafc', fontWeight: 900, fontSize: '28px', margin: 0 }}>{profile.name}</h1>
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
            {profile.tags.map(tag => {
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
              {profile.location}
            </div>
            {profile.isBusinessProfile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '14px' }}>
                <Briefcase size={14} />
                {profile.companyName}
              </div>
            )}
          </div>

          {profile.bio && (
            <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px', maxWidth: '600px' }}>
              {profile.bio}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { value: profile.followers?.toLocaleString(), label: 'Followers', clickable: 'followers' },
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
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
                <FileText size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                <p>No posts yet</p>
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
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
                <TrendingUp size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                <p>No deals posted yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '20px' }}>About {profile.name}</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { label: 'Bio', value: profile.bio },
                  { label: 'Location', value: profile.location },
                  { label: 'Email', value: profile.email },
                  { label: 'Phone', value: profile.phone },
                  { label: 'Member Since', value: new Date(profile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) },
                  ...(profile.isBusinessProfile ? [{ label: 'Company', value: profile.companyName }] : []),
                ].map(({ label, value }) => value && (
                  <div key={label} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#475569', fontSize: '14px', fontWeight: 600 }}>{label}</span>
                    <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{value}</span>
                  </div>
                ))}
              </div>
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
    </div>
  );
}
