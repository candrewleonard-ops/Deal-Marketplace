import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image, Video, Link as LinkIcon, Smile, TrendingUp, UserPlus, Users, MapPin, Lock } from 'lucide-react';
import PostCard from '../components/PostCard';
import { posts, stories } from '../data/posts';
import { users } from '../data/users';
import { getUserGroups } from '../data/groups';
import { cities } from '../data/cities';
import { useAuth } from '../context/AuthContext';

const trendingMarkets = [
  { city: 'Atlanta, GA', growth: '+18%', deals: 47 },
  { city: 'Phoenix, AZ', growth: '+22%', deals: 38 },
  { city: 'Dallas, TX', growth: '+15%', deals: 55 },
  { city: 'Tampa, FL', growth: '+28%', deals: 29 },
  { city: 'Charlotte, NC', growth: '+21%', deals: 34 },
];

const suggestedUsers = users.slice(2, 7);

export default function Social() {
  const { currentUser } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const [feedFilter, setFeedFilter] = useState('all');
  const myGroups = getUserGroups(currentUser.id);
  const topCities = cities.slice(0, 10);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Stories */}
        <div style={{
          background: '#12121e', border: '1px solid #1e1e2e',
          borderRadius: '16px', padding: '20px',
          marginBottom: '24px', overflowX: 'auto',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', minWidth: 'max-content' }}>
            {/* Add story */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 300, color: '#fff',
              }}>
                +
              </div>
              <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>Your Story</span>
            </div>

            {stories.map(story => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div style={{
                  padding: '3px', borderRadius: '50%',
                  background: story.hasNew ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)' : '#1e1e2e',
                }}>
                  <div style={{
                    padding: '2px', borderRadius: '50%',
                    background: '#12121e',
                  }}>
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
                <span style={{ color: story.hasNew ? '#f8fafc' : '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
                  {story.userName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Layout with left sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: '20px', alignItems: 'flex-start' }}>
          {/* Left Sidebar */}
          <div style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Users size={16} style={{ color: '#8b5cf6' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', margin: 0 }}>REI Custom Groups</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {myGroups.slice(0, 6).map((g, i) => (
                  <Link key={g.id} to="/groups" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', textDecoration: 'none', color: '#94a3b8', fontSize: '12px' }}>
                    {g.isPrivate && <Lock size={10} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</span>
                    {i % 2 === 0 && <span style={{ background: '#8b5cf6', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '9px', fontWeight: 700 }}>{i + 1}</span>}
                  </Link>
                ))}
                <Link to="/groups" style={{ color: '#8b5cf6', fontSize: '11px', fontWeight: 700, textDecoration: 'none', marginTop: '4px', padding: '4px 8px' }}>See All →</Link>
              </div>
            </div>

            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <MapPin size={16} style={{ color: '#06b6d4' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', margin: 0 }}>Public City Discussions</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '340px', overflowY: 'auto' }}>
                {topCities.map(c => (
                  <Link key={c.id} to={`/city/${c.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', textDecoration: 'none', color: '#94a3b8', fontSize: '12px' }}>
                    <span>{c.name}, {c.state}</span>
                    <span style={{ color: '#475569', fontSize: '10px' }}>{(c.memberCount / 1000).toFixed(1)}k</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['all', 'my groups', 'following'].map(f => (
                <button key={f} onClick={() => setFeedFilter(f)} style={{ padding: '6px 14px', borderRadius: '20px', background: feedFilter === f ? 'rgba(139, 92, 246, 0.2)' : '#12121e', border: `1px solid ${feedFilter === f ? '#8b5cf6' : '#1e1e2e'}`, color: feedFilter === f ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>
            {/* Create Post */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <img
                  src="https://picsum.photos/seed/user1/100/100"
                  alt="You"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="What deals are you working on? Share an update, deal, or market insight..."
                  className="input-dark"
                  rows={3}
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: '12px',
                    fontSize: '15px', resize: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { icon: Image, label: 'Photo', color: '#10b981' },
                    { icon: Video, label: 'Video', color: '#ef4444' },
                    { icon: LinkIcon, label: 'Link', color: '#06b6d4' },
                    { icon: Smile, label: 'Emoji', color: '#f59e0b' },
                  ].map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 12px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                        color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={15} style={{ color }} />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
                <button
                  className="gradient-btn"
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    opacity: postContent ? 1 : 0.5,
                  }}
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>

          {/* Right Sidebar */}
          <div style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* People You Might Know */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
                People You Might Know
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {suggestedUsers.map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={user.avatar}
                      alt={user.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }} className="line-clamp-1">{user.name}</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {user.tags.slice(0, 1).map(tag => (
                          <span key={tag} style={{
                            background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
                            borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      padding: '6px 10px', borderRadius: '20px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                      transition: 'all 0.2s', flexShrink: 0,
                    }}>
                      <UserPlus size={12} />
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Markets */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp size={18} style={{ color: '#10b981' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: 0 }}>Trending Markets</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trendingMarkets.map(({ city, growth, deals }) => (
                  <div key={city} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>{city}</div>
                      <div style={{ color: '#475569', fontSize: '12px' }}>{deals} active deals</div>
                    </div>
                    <span style={{
                      color: '#10b981', fontWeight: 800, fontSize: '14px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '20px', padding: '3px 10px',
                    }}>
                      {growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Wholesalers', 'Cash Buyers', 'Hard Money', 'Fix & Flip', 'Creative Finance', 'BRRRR', 'Short Term Rental', 'Commercial'].map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                      borderRadius: '20px', padding: '4px 12px',
                      color: '#94a3b8', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    #{tag.replace(/\s/g, '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
