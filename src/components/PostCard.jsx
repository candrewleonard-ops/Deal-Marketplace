import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Send, X, Copy, Check } from 'lucide-react';

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
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState('');

  function handleLike() {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  }

  function handleSendComment() {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      userName: 'Marcus Johnson',
      userAvatar: 'https://picsum.photos/seed/user1/100/100',
      content: newComment,
      likes: 0,
      timestamp: 'Just now',
    };
    setLocalComments([...localComments, comment]);
    setNewComment('');
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(`https://treim.app/post/${post.id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            {localComments.length} comments
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
          { icon: MessageCircle, label: 'Comment', action: () => setCommentsOpen(!commentsOpen), active: commentsOpen, activeColor: '#8b5cf6' },
          { icon: Share2, label: 'Share', action: () => setShareOpen(true), active: false },
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
                onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                placeholder="Write a comment..."
                className="input-dark"
                style={{ flex: 1, borderRadius: '20px', padding: '8px 16px', fontSize: '13px' }}
              />
              <button
                onClick={handleSendComment}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  opacity: newComment.trim() ? 1 : 0.5,
                }}
              >
                <Send size={14} style={{ color: '#fff' }} />
              </button>
            </div>
          </div>

          {/* Comments list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {localComments.map(comment => (
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

      {/* Share Modal */}
      {shareOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setShareOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.7)' }}
          >
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '17px', margin: 0 }}>Share Post</h3>
              <button onClick={() => setShareOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Share to your feed</label>
                <textarea
                  value={shareText}
                  onChange={e => setShareText(e.target.value)}
                  placeholder="Add a thought before sharing..."
                  className="input-dark"
                  rows={3}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', resize: 'none' }}
                />
              </div>
              <button
                className="gradient-btn"
                style={{ padding: '11px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                onClick={() => setShareOpen(false)}
              >
                Share to Feed
              </button>
              <div style={{ borderTop: '1px solid #1e1e2e', paddingTop: '14px' }}>
                <div style={{ color: '#475569', fontSize: '12px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or share via</div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={handleCopyLink}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 16px', borderRadius: '10px', background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : '#1e1e2e'}`, color: copied ? '#10b981' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  {[
                    { label: 'Twitter/X', color: '#1DA1F2', bg: 'rgba(29,161,242,0.1)', border: 'rgba(29,161,242,0.2)' },
                    { label: 'Facebook', color: '#4267B2', bg: 'rgba(66,103,178,0.1)', border: 'rgba(66,103,178,0.2)' },
                    { label: 'LinkedIn', color: '#0077B5', bg: 'rgba(0,119,181,0.1)', border: 'rgba(0,119,181,0.2)' },
                  ].map(s => (
                    <button key={s.label} style={{ padding: '9px 14px', borderRadius: '10px', background: s.bg, border: `1px solid ${s.border}`, color: s.color, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
