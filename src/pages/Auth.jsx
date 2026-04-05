import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Eye, EyeOff, Check, User, Building2, ArrowRight, AlertCircle } from 'lucide-react';
import { validateUsername } from '../utils/username';
import { users } from '../data/users';

const userTags = [
  'Fix N Flipper', 'Wholesaler', 'Marketer', 'Realtor', 'Cash Buyer',
  'Hard Money Lender', 'Private Lender', 'Contractor', 'Property Manager', 'Agent/Broker',
];

const tagColors = {
  'Fix N Flipper': '#ef4444',
  'Wholesaler': '#8b5cf6',
  'Marketer': '#06b6d4',
  'Realtor': '#10b981',
  'Cash Buyer': '#f59e0b',
  'Hard Money Lender': '#f59e0b',
  'Private Lender': '#06b6d4',
  'Contractor': '#94a3b8',
  'Property Manager': '#10b981',
  'Agent/Broker': '#10b981',
};

export default function Auth() {
  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [profileType, setProfileType] = useState('personal');
  const [selectedTags, setSelectedTags] = useState([]);
  const [step, setStep] = useState(1);
  const [teamEmails, setTeamEmails] = useState(['']);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const usernameValidation = username ? validateUsername(username, users) : null;

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/marketplace');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    navigate('/marketplace');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)',
      }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            }}>
              <Home size={24} style={{ color: '#fff' }} />
            </div>
            <span className="gradient-text" style={{ fontSize: '28px', fontWeight: 900 }}>TREIM</span>
          </Link>
          <p style={{ color: '#475569', marginTop: '8px', fontSize: '14px' }}>The #1 Marketplace for Real Estate Investors</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#12121e', border: '1px solid #1e1e2e',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #1e1e2e' }}>
            {['login', 'register'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setStep(1); }}
                style={{
                  flex: 1, padding: '16px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: '15px', transition: 'all 0.2s',
                  color: tab === t ? '#8b5cf6' : '#475569',
                  borderBottom: tab === t ? '2px solid #8b5cf6' : '2px solid transparent',
                  marginBottom: '-1px',
                }}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div style={{ padding: '32px' }}>
            {tab === 'login' ? (
              <form onSubmit={handleLogin}>
                <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '24px', marginBottom: '8px', textAlign: 'center' }}>
                  Welcome Back
                </h2>
                <p style={{ color: '#475569', textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>
                  Sign in to access your deals and network
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email Address</label>
                    <input
                      type="email"
                      defaultValue="marcus@reiatlanta.com"
                      className="input-dark"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px' }}
                    />
                  </div>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw ? 'text' : 'password'}
                        defaultValue="password123"
                        className="input-dark"
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', paddingRight: '44px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#475569', cursor: 'pointer',
                        }}
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: '#8b5cf6' }} />
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>Remember me</span>
                    </label>
                    <a href="#" style={{ color: '#8b5cf6', fontSize: '13px', textDecoration: 'none' }}>Forgot password?</a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="gradient-btn"
                  style={{
                    width: '100%', marginTop: '24px',
                    padding: '14px', borderRadius: '12px',
                    color: '#fff', fontWeight: 700, fontSize: '15px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  Sign In to TREIM
                  <ArrowRight size={18} />
                </button>

                <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', marginTop: '20px' }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                  >
                    Create one free
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                {step === 1 ? (
                  <>
                    <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '8px', textAlign: 'center' }}>
                      Create Your Account
                    </h2>
                    <p style={{ color: '#475569', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
                      Join 10,000+ real estate investors on TREIM
                    </p>

                    {/* Profile Type */}
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '10px' }}>Account Type</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                          { value: 'personal', label: 'Personal', icon: User, desc: 'Individual investor' },
                          { value: 'business', label: 'Business', icon: Building2, desc: 'Company / Team' },
                        ].map(({ value, label, icon: Icon, desc }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setProfileType(value)}
                            style={{
                              background: profileType === value ? 'rgba(139, 92, 246, 0.1)' : '#1a1a2e',
                              border: `2px solid ${profileType === value ? '#8b5cf6' : '#1e1e2e'}`,
                              borderRadius: '12px', padding: '16px 12px',
                              cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                            }}
                          >
                            <Icon size={24} style={{ color: profileType === value ? '#8b5cf6' : '#475569', marginBottom: '6px' }} />
                            <div style={{ color: profileType === value ? '#f8fafc' : '#94a3b8', fontWeight: 700, fontSize: '14px' }}>{label}</div>
                            <div style={{ color: '#475569', fontSize: '12px' }}>{desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {profileType === 'business' && (
                        <div>
                          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Company Name</label>
                          <input
                            type="text"
                            placeholder="Your Company LLC"
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>First Name</label>
                          <input
                            type="text"
                            placeholder="Marcus"
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Last Name</label>
                          <input
                            type="text"
                            placeholder="Johnson"
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email Address</label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          className="input-dark"
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                        />
                      </div>

                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Username</label>
                        <input
                          type="text"
                          value={username}
                          onChange={e => setUsername(e.target.value)}
                          placeholder="your_username"
                          className="input-dark"
                          style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', borderColor: usernameValidation && !usernameValidation.valid ? '#ef4444' : undefined }}
                        />
                        {usernameValidation && !usernameValidation.valid && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
                            <AlertCircle size={12} /> {usernameValidation.error}
                          </div>
                        )}
                        {usernameValidation && usernameValidation.valid && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#10b981', fontSize: '12px', fontWeight: 600 }}>
                            <Check size={12} /> Username is available
                          </div>
                        )}
                      </div>

                      {profileType === 'business' && (
                        <div>
                          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                            Team Member Emails
                          </label>
                          {teamEmails.map((email, i) => (
                            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                              <input
                                type="email"
                                placeholder={`teammate${i + 1}@company.com`}
                                value={email}
                                onChange={e => {
                                  const updated = [...teamEmails];
                                  updated[i] = e.target.value;
                                  setTeamEmails(updated);
                                }}
                                className="input-dark"
                                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', fontSize: '13px' }}
                              />
                              {teamEmails.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setTeamEmails(teamEmails.filter((_, idx) => idx !== i))}
                                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', padding: '0 12px' }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setTeamEmails([...teamEmails, ''])}
                            style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', fontSize: '13px', fontWeight: 600, padding: 0 }}
                          >
                            + Add team member
                          </button>
                        </div>
                      )}

                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPw ? 'text' : 'password'}
                            placeholder="Min 8 characters"
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', paddingRight: '44px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(!showPw)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}
                          >
                            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '8px', textAlign: 'center' }}>
                      Select Your Investor Tags
                    </h2>
                    <p style={{ color: '#475569', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
                      Select all that apply. This helps others find and connect with you.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
                      {userTags.map(tag => {
                        const active = selectedTags.includes(tag);
                        const color = tagColors[tag] || '#8b5cf6';
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              padding: '8px 16px', borderRadius: '20px',
                              background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
                              border: `2px solid ${active ? color : '#1e1e2e'}`,
                              color: active ? color : '#94a3b8',
                              cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                              transition: 'all 0.2s',
                            }}
                          >
                            {active && <Check size={14} />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>

                    {selectedTags.length > 0 && (
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '10px', padding: '12px 16px',
                        marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                      }}>
                        <Check size={16} style={{ color: '#10b981' }} />
                        <span style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected: {selectedTags.join(', ')}
                        </span>
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="gradient-btn"
                  style={{
                    width: '100%', marginTop: step === 1 ? '24px' : '0',
                    padding: '14px', borderRadius: '12px',
                    color: '#fff', fontWeight: 700, fontSize: '15px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                >
                  {step === 1 ? 'Continue' : 'Complete Registration'}
                  <ArrowRight size={18} />
                </button>

                {step === 1 && (
                  <p style={{ textAlign: 'center', color: '#475569', fontSize: '12px', marginTop: '16px' }}>
                    By creating an account you agree to our{' '}
                    <a href="#" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: '#8b5cf6', textDecoration: 'none' }}>Privacy Policy</a>
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
