import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Eye, EyeOff, Check, User, Building2, ArrowRight, AlertCircle, Phone, Mail } from 'lucide-react';
import { validateUsername } from '../utils/username';
import { users } from '../data/users';
import { useAuth } from '../context/AuthContext';
import RoleSelectionModal from '../components/RoleSelectionModal';
import Logo from '../components/Logo';

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
  const [params] = useSearchParams();
  const initialTab = params.get('tab') === 'register' ? 'register' : 'login';
  const [tab, setTab] = useState(initialTab);
  const [showPw, setShowPw] = useState(false);
  const [profileType, setProfileType] = useState('personal');
  const [selectedTags, setSelectedTags] = useState([]);
  const [step, setStep] = useState(1);
  const [teamEmails, setTeamEmails] = useState(['']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);
  const [verifyError, setVerifyError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Password strength: 0 (empty) - 4 (strong)
  const pwStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const pwLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const pwColors = ['#1e1e2e', '#ef4444', '#f59e0b', '#06b6d4', '#10b981'];

  const usernameValidation = username ? validateUsername(username, users) : null;

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login('me');
    navigate('/marketplace');
  };

  // Step 1 (form) → Step 2 (verify code) → success → role modal → final landing
  const handleRegister = (e) => {
    e.preventDefault();
    if (step === 1) {
      // In a real backend this is where we'd POST and trigger an email/SMS code
      setStep(2);
      setVerifyError('');
      return;
    }
    // Step 2 — submit happens via Verify button below; this catch is safety
  };

  function handleVerify() {
    const code = verifyCode.join('');
    if (code.length !== 6) {
      setVerifyError('Enter the 6-digit code we sent to your email.');
      return;
    }
    // Mock: accept any 6 digits. Real backend would call /verify-email.
    login('me', {
      profile: {
        email, phone,
        name: [firstName, lastName].filter(Boolean).join(' ') || username,
        username,
        roles: [],
      },
    });
    setShowRoleModal(true);
  }

  function setCodeDigit(idx, v) {
    const cleaned = v.replace(/[^0-9]/g, '').slice(0, 1);
    const next = [...verifyCode];
    next[idx] = cleaned;
    setVerifyCode(next);
    if (cleaned && idx < 5) {
      const el = document.getElementById(`vc-${idx + 1}`);
      el?.focus();
    }
  }

  function handleCodePaste(e) {
    const pasted = (e.clipboardData?.getData('text') || '').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length === 6) {
      e.preventDefault();
      setVerifyCode(pasted.split(''));
    }
  }

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
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Logo size="lg" tagline />
          </Link>
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
                <p style={{ color: '#475569', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
                  Sign in to access your deals and network
                </p>

                {/* Social Sign-In */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { name: 'Google',   icon: '🔵' },
                    { name: 'Apple',    icon: '🍎' },
                    { name: 'Facebook', icon: '📘' },
                  ].map(({ name, icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => navigate('/marketplace')}
                      style={{
                        padding: '11px 16px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1e2e',
                        color: '#f8fafc', fontWeight: 600, fontSize: '13px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; }}
                    >
                      <span>{icon}</span> Continue with {name}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
                  <span style={{ color: '#475569', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px' }}>OR CONTINUE WITH EMAIL</span>
                  <div style={{ flex: 1, height: '1px', background: '#1e1e2e' }} />
                </div>

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
                  Sign In to All Street Live
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
                      Join 10,000+ real estate investors on All Street Live
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
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Marcus"
                            required
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
                        <div>
                          <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Johnson"
                            required
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
                        <div style={{ color: '#475569', fontSize: 11, marginTop: 5 }}>
                          We'll send a 6-digit verification code here.
                        </div>
                      </div>

                      <div>
                        <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Phone Number</label>
                        <div style={{ position: 'relative' }}>
                          <Phone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(555) 123-4567"
                            required
                            className="input-dark"
                            style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '10px', fontSize: '14px' }}
                          />
                        </div>
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
                            value={password}
                            onChange={e => setPassword(e.target.value)}
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
                        {/* Password strength meter */}
                        {password && (
                          <div style={{ marginTop: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                              {[1,2,3,4].map(n => (
                                <div key={n} style={{
                                  flex: 1, height: '4px', borderRadius: '2px',
                                  background: n <= pwStrength ? pwColors[pwStrength] : '#1e1e2e',
                                  transition: 'all 0.2s',
                                }} />
                              ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                              <span style={{ color: pwColors[pwStrength], fontWeight: 600 }}>
                                {pwLabels[pwStrength]}
                              </span>
                              <span style={{ color: '#475569' }}>
                                {password.length < 8 ? '8+ chars' : ''}
                                {password.length >= 8 && !/[A-Z]/.test(password) ? ' · uppercase' : ''}
                                {password.length >= 8 && !/[0-9]/.test(password) ? ' · number' : ''}
                                {password.length >= 8 && !/[^A-Za-z0-9]/.test(password) ? ' · symbol' : ''}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '22px', marginBottom: '8px', textAlign: 'center' }}>
                      Verify your email
                    </h2>
                    <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '13px', lineHeight: 1.55 }}>
                      We sent a 6-digit code to <strong style={{ color: '#f8fafc' }}>{email || 'your email'}</strong>. Enter it below to finish creating your account.
                    </p>

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                      {verifyCode.map((digit, i) => (
                        <input
                          key={i}
                          id={`vc-${i}`}
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => setCodeDigit(i, e.target.value)}
                          onPaste={i === 0 ? handleCodePaste : undefined}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && i > 0) {
                              document.getElementById(`vc-${i - 1}`)?.focus();
                            }
                          }}
                          style={{
                            width: 46, height: 56,
                            textAlign: 'center',
                            background: '#0d0d1a',
                            border: `1.5px solid ${digit ? '#8b5cf6' : '#1e1e2e'}`,
                            borderRadius: 10,
                            color: '#f8fafc',
                            fontSize: 22, fontWeight: 800,
                            outline: 'none',
                            transition: 'border-color 0.15s',
                          }}
                        />
                      ))}
                    </div>

                    {verifyError && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
                        color: '#ef4444', fontSize: 12, fontWeight: 600, marginBottom: 12,
                      }}>
                        <AlertCircle size={12} /> {verifyError}
                      </div>
                    )}

                    <div style={{ textAlign: 'center', marginBottom: 18 }}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        style={{
                          background: 'none', border: 'none',
                          color: '#64748b', fontSize: 12, fontWeight: 600,
                          cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
                        }}
                      >
                        Use a different email
                      </button>
                      <span style={{ color: '#1e1e2e', margin: '0 8px' }}>·</span>
                      <button
                        type="button"
                        onClick={() => { setVerifyCode(['','','','','','']); setVerifyError(''); }}
                        style={{
                          background: 'none', border: 'none',
                          color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        }}
                      >
                        Resend code
                      </button>
                    </div>

                    <div style={{
                      padding: '10px 14px', borderRadius: 8,
                      background: 'rgba(139,92,246,0.06)', border: '1px dashed rgba(139,92,246,0.2)',
                      color: '#a78bfa', fontSize: 11, lineHeight: 1.5,
                      textAlign: 'center',
                    }}>
                      <strong style={{ color: '#cbd5e1' }}>Mock mode:</strong> any 6 digits will work for now.
                    </div>
                  </>
                )}

                {step === 1 ? (
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
                    Send verification code
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="gradient-btn"
                    style={{
                      width: '100%', marginTop: '4px',
                      padding: '14px', borderRadius: '12px',
                      color: '#fff', fontWeight: 700, fontSize: '15px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}
                  >
                    Verify &amp; create account
                    <ArrowRight size={18} />
                  </button>
                )}

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

      <RoleSelectionModal
        open={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        contactInfo={{
          email, phone,
          name: [firstName, lastName].filter(Boolean).join(' ') || username,
          username,
        }}
      />
    </div>
  );
}
