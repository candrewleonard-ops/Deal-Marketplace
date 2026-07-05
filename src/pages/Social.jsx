import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image, Video, Link as LinkIcon, Smile, TrendingUp, UserPlus, Users, MapPin, Lock, X, Check, Rocket, Lightbulb } from 'lucide-react';
import PostCard from '../components/PostCard';
import { posts, stories } from '../data/posts';
import { users } from '../data/users';
import { getUserGroups } from '../data/groups';
import { cities } from '../data/cities';
import { useAuth } from '../context/AuthContext';

const trendingMarkets = [
  { city: 'Atlanta', slug: 'atlanta-ga', state: 'GA', growth: '+18%', deals: 47 },
  { city: 'Phoenix', slug: 'phoenix-az', state: 'AZ', growth: '+22%', deals: 38 },
  { city: 'Dallas', slug: 'dallas-tx', state: 'TX', growth: '+15%', deals: 55 },
  { city: 'Tampa', slug: 'tampa-fl', state: 'FL', growth: '+28%', deals: 29 },
  { city: 'Charlotte', slug: 'charlotte-nc', state: 'NC', growth: '+21%', deals: 34 },
];

const suggestedUsers = users.slice(2, 7);

export default function Social() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState('');
  const [activeStory, setActiveStory] = useState(null);
  const [feedFilter, setFeedFilter] = useState('all');
  const [feedPosts, setFeedPosts] = useState(posts);
  const [followedUsers, setFollowedUsers] = useState({});
  const myGroups = getUserGroups(currentUser.id);
  const topCities = cities.slice(0, 10);

  function handlePost() {
    if (!postContent.trim()) return;
    const newPost = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userTags: currentUser.tags || [],
      timestamp: 'Just now',
      content: postContent,
      image: null,
      likes: 0,
      liked: false,
      saved: false,
      comments: [],
      shares: 0,
    };
    setFeedPosts([newPost, ...feedPosts]);
    setPostContent('');
  }

  function toggleFollow(userId) {
    setFollowedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
  }

  return (
    <div style={{ background: '#0a0b0a', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Stories */}
        <div style={{
          background: '#131614', border: '1px solid #232925',
          borderRadius: '16px', padding: '20px',
          marginBottom: '24px', overflowX: 'auto',
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', minWidth: 'max-content' }}>
            {/* Add story */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00c805, #00e5a0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: 300, color: '#fff',
              }}>
                +
              </div>
              <span style={{ color: '#95a29b', fontSize: '12px', fontWeight: 500 }}>Your Story</span>
            </div>

            {stories.map(story => (
              <div
                key={story.id}
                onClick={() => setActiveStory(story)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div style={{
                  padding: '3px', borderRadius: '50%',
                  background: story.hasNew ? 'linear-gradient(135deg, #00c805, #00e5a0)' : '#232925',
                }}>
                  <div style={{ padding: '2px', borderRadius: '50%', background: '#131614' }}>
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      style={{ width: '58px', height: '58px', borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                </div>
                <span style={{ color: story.hasNew ? '#f8fafc' : '#95a29b', fontSize: '12px', fontWeight: 500 }}>
                  {story.userName}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: '20px', alignItems: 'flex-start' }}>
          {/* Left Sidebar */}
          <div style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Users size={16} style={{ color: '#00c805' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', margin: 0 }}>REI Custom Groups</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {myGroups.slice(0, 6).map((g, i) => (
                  <Link key={g.id} to="/groups" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', textDecoration: 'none', color: '#95a29b', fontSize: '12px' }}>
                    {g.isPrivate && <Lock size={10} style={{ color: '#f59e0b', flexShrink: 0 }} />}
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</span>
                    {i % 2 === 0 && <span style={{ background: '#00c805', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '9px', fontWeight: 700 }}>{i + 1}</span>}
                  </Link>
                ))}
                <Link to="/groups" style={{ color: '#00c805', fontSize: '11px', fontWeight: 700, textDecoration: 'none', marginTop: '4px', padding: '4px 8px' }}>See All →</Link>
              </div>
            </div>

            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '14px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <MapPin size={16} style={{ color: '#00e5a0' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '13px', margin: 0 }}>Public City Discussions</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '340px', overflowY: 'auto' }}>
                {topCities.map(c => (
                  <Link key={c.id} to={`/city/${c.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', textDecoration: 'none', color: '#95a29b', fontSize: '12px' }}>
                    <span>{c.name}, {c.state}</span>
                    <span style={{ color: '#5a675f', fontSize: '10px' }}>{(c.memberCount / 1000).toFixed(1)}k</span>
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
                <button key={f} onClick={() => setFeedFilter(f)} style={{ padding: '6px 14px', borderRadius: '20px', background: feedFilter === f ? 'rgba(0, 200, 5, 0.2)' : '#131614', border: `1px solid ${feedFilter === f ? '#00c805' : '#232925'}`, color: feedFilter === f ? '#00c805' : '#95a29b', cursor: 'pointer', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' }}>{f}</button>
              ))}
            </div>

            {/* Create Post */}
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <img
                  src={currentUser.avatar || 'https://picsum.photos/seed/user1/100/100'}
                  alt="You"
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder="What deals are you working on? Share an update, deal, or market insight..."
                  className="input-dark"
                  rows={3}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', fontSize: '15px', resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { icon: Image, label: 'Photo', color: '#10b981' },
                    { icon: Video, label: 'Video', color: '#ef4444' },
                    { icon: LinkIcon, label: 'Link', color: '#00e5a0' },
                    { icon: Smile, label: 'Emoji', color: '#f59e0b' },
                  ].map(({ icon: Icon, label, color }) => (
                    <button
                      key={label}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 12px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
                        color: '#95a29b', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                    >
                      <Icon size={15} style={{ color }} />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={handlePost}
                  className="gradient-btn"
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    color: '#fff', fontWeight: 700, fontSize: '14px',
                    opacity: postContent.trim() ? 1 : 0.5,
                    border: 'none', cursor: postContent.trim() ? 'pointer' : 'default',
                  }}
                >
                  Post
                </button>
              </div>
            </div>

            {/* Posts */}
            {feedPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>

          {/* Right Sidebar */}
          <div style={{ position: 'sticky', top: '84px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Business CTA */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 200, 5,0.12), rgba(0, 229, 160,0.08))',
              border: '1px solid rgba(0, 200, 5,0.3)',
              borderRadius: '16px', padding: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Rocket size={18} style={{ color: '#00c805' }} />
                <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>Post Your Next Deal</span>
              </div>
              <p style={{ color: '#95a29b', fontSize: '13px', margin: '0 0 12px', lineHeight: 1.5 }}>
                Join 10,000+ investors building wealth through real estate. Get your deal in front of active buyers.
              </p>
              <Link
                to="/marketplace"
                className="gradient-btn"
                style={{ display: 'block', padding: '9px', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}
              >
                Post a Deal Free →
              </Link>
            </div>

            {/* People You Might Know */}
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', marginBottom: '16px' }}>
                People You Might Know
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {suggestedUsers.map(user => {
                  const isFollowed = followedUsers[user.id];
                  return (
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
                              background: 'rgba(0, 200, 5, 0.1)', color: '#00c805',
                              borderRadius: '20px', padding: '1px 6px', fontSize: '10px', fontWeight: 600,
                            }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(user.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 10px', borderRadius: '20px',
                          background: isFollowed ? 'rgba(16,185,129,0.1)' : 'rgba(0, 200, 5, 0.1)',
                          border: isFollowed ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(0, 200, 5, 0.2)',
                          color: isFollowed ? '#10b981' : '#00c805',
                          cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                          transition: 'all 0.2s', flexShrink: 0,
                        }}
                      >
                        {isFollowed ? <Check size={12} /> : <UserPlus size={12} />}
                        {isFollowed ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trending Markets */}
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp size={18} style={{ color: '#10b981' }} />
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px', margin: 0 }}>Trending Markets</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {trendingMarkets.map(({ city, slug, state, growth, deals }) => (
                  <Link
                    key={city}
                    to={`/city/${slug}`}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', padding: '6px', borderRadius: '8px', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>{city}, {state}</div>
                      <div style={{ color: '#5a675f', fontSize: '12px' }}>{deals} active deals</div>
                    </div>
                    <span style={{
                      color: '#10b981', fontWeight: 800, fontSize: '14px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '20px', padding: '3px 10px',
                    }}>
                      {growth}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ background: '#131614', border: '1px solid #232925', borderRadius: '16px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Lightbulb size={14} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#95a29b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Explore Topics</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Wholesalers', 'Cash Buyers', 'Hard Money', 'Fix & Flip', 'Creative Finance', 'BRRRR', 'Short Term Rental', 'Commercial'].map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: 'rgba(255,255,255,0.04)', border: '1px solid #232925',
                      borderRadius: '20px', padding: '4px 12px',
                      color: '#95a29b', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#00c805'; e.currentTarget.style.color = '#f8fafc'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#232925'; e.currentTarget.style.color = '#95a29b'; }}
                  >
                    #{tag.replace(/\s/g, '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setActiveStory(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#131614', border: '1px solid #232925', borderRadius: '20px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}
          >
            {/* Progress bar */}
            <div style={{ height: '3px', background: '#232925' }}>
              <div style={{ height: '100%', background: 'linear-gradient(135deg, #00c805, #00e5a0)', width: '60%', transition: 'width 5s linear' }} />
            </div>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={activeStory.userAvatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>{activeStory.userName}</div>
                  <div style={{ color: '#5a675f', fontSize: '12px' }}>{activeStory.timestamp || '2h ago'}</div>
                </div>
              </div>
              <button onClick={() => setActiveStory(null)} style={{ background: 'none', border: 'none', color: '#95a29b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            {activeStory.image && (
              <img src={activeStory.image} alt="" style={{ width: '100%', maxHeight: '320px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '16px' }}>
              <p style={{ color: '#f8fafc', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
                {activeStory.content || 'Market update from ' + activeStory.userName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
