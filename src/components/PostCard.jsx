import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send } from 'lucide-react';

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

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  function handleLike() {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  }

  return (
    <div style={{
      background: '#12121e',
      border: '1px solid #1e1e2e',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <img
          src={post.userAvatar}
          alt={post.userName}
          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px' }}>{post.userName}</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {post.userTags.slice(0, 2).map(tag => (
                <span key={tag} style={{
                  background: `${tagColors[tag] || '#8b5cf6'}18`,
                  color: tagColors[tag] || '#8b5cf6',
                  border: `1px solid ${tagColors[tag] || '#8b5cf6'}30`,
                  borderRadius: '20px', padding: '1px 8px', fontSize: '11px', fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <span style={{ color: '#475569', fontSize: '13px' }}>{post.timestamp}</span>
        </div>
        <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: '4px' }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 14px' }}>
        <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>
          {post.content}
        </p>
      </div>

      {/* Image */}
      {post.image && (
        <div style={{ marginBottom: '0' }}>
          <img
            src={post.image}
            alt="Post"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* Stats */}
      <div style={{
        padding: '10px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: post.image ? '1px solid #1e1e2e' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#475569', fontSize: '13px' }}>
            {likeCount.toLocaleString()} likes
          </span>
          <button
            onClick={() => setCommentsOpen(!commentsOpen)}
            style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '13px', padding: 0 }}
          >
            {post.comments.length} comments
          </button>
        </div>
        <span style={{ color: '#475569', fontSize: '13px' }}>{post.shares} shares</span>
      </div>

      {/* Action buttons */}
      <div style={{
        padding: '4px 8px 8px',
        display: 'flex', borderTop: '1px solid #1e1e2e',
      }}>
        {[
          { icon: Heart, label: 'Like', action: handleLike, active: liked, activeColor: '#ef4444' },
          { icon: MessageCircle, label: 'Comment', action: () => setCommentsOpen(!commentsOpen), active: false },
          { icon: Share2, label: 'Share', action: () => {}, active: false },
          { icon: Bookmark, label: 'Save', action: () => setSaved(!saved), active: saved, activeColor: '#8b5cf6' },
        ].map(({ icon: Icon, label, action, active, activeColor }) => (
          <button
            key={label}
            onClick={action}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', padding: '8px', background: 'none', border: 'none',
              color: active ? (activeColor || '#8b5cf6') : '#475569',
              cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            <Icon size={16} fill={active ? (activeColor || '#8b5cf6') : 'none'} />
            {label}
          </button>
        ))}
      </div>

      {/* Comments Section */}
      {commentsOpen && (
        <div style={{ borderTop: '1px solid #1e1e2e', padding: '12px 16px' }}>
          {/* Comment input */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <img
              src="https://picsum.photos/seed/user1/100/100"
              alt="You"
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input-dark"
                style={{ flex: 1, borderRadius: '20px', padding: '8px 16px', fontSize: '13px' }}
              />
              <button
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <Send size={14} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {post.comments.map(comment => (
              <div key={comment.id} style={{ display: 'flex', gap: '10px' }}>
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: '#1a1a2e', borderRadius: '12px', padding: '10px 14px',
                    border: '1px solid #1e1e2e',
                  }}>
                    <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '13px' }}>{comment.userName} </span>
                    <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{comment.content}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', padding: '4px 8px' }}>
                    <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '12px', padding: 0, fontWeight: 500 }}>
                      Like ({comment.likes})
                    </button>
                    <button style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '12px', padding: 0, fontWeight: 500 }}>
                      Reply
                    </button>
                    <span style={{ color: '#334155', fontSize: '12px' }}>{comment.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
