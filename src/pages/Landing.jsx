import { Link } from 'react-router-dom';
import { ArrowRight, Home, Users, MapPin, Zap, TrendingUp, Shield, CheckCircle, Star } from 'lucide-react';
import Logo from '../components/Logo';

const stats = [
  { value: '10,000+', label: 'Active Investors' },
  { value: '5,000+', label: 'Deals Posted' },
  { value: '200+', label: 'Cities Covered' },
  { value: '$2.1B+', label: 'Deal Volume' },
];

const features = [
  {
    icon: Zap,
    title: 'Free to Post Deals',
    desc: 'List your wholesale deals at no cost. Get your properties in front of thousands of ready buyers instantly.',
    color: '#8b5cf6',
  },
  {
    icon: Users,
    title: 'Built-in Buyer Network',
    desc: 'Access our massive network of cash buyers, hard money lenders, and active investors in every market.',
    color: '#06b6d4',
  },
  {
    icon: MapPin,
    title: 'Local Market Focus',
    desc: 'Connect with investors in your specific city and state. Hyper-local deal matching for faster closings.',
    color: '#f59e0b',
  },
  {
    icon: TrendingUp,
    title: 'Social REI Network',
    desc: 'Share deals, strategies, and wins with the nation\'s largest real estate investor social community.',
    color: '#10b981',
  },
  {
    icon: Shield,
    title: 'Vetted Community',
    desc: 'Investor profiles with verified tags, deal history, and community reputation scores.',
    color: '#ef4444',
  },
  {
    icon: Star,
    title: 'Deal Promotion Tools',
    desc: 'Boost your deals to the top with our sponsored placement system. From $2/day to #1 Featured.',
    color: '#f59e0b',
  },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up free and tell us who you are. Select your investor tags and market areas.' },
  { step: '02', title: 'Post or Browse Deals', desc: 'Wholesalers post deals in under 2 minutes. Buyers search by market, type, and price.' },
  { step: '03', title: 'Connect & Close', desc: 'Message sellers directly, request assignment contracts, and close deals fast.' },
];

const testimonials = [
  { name: 'Marcus Johnson', role: 'Wholesaler · Atlanta, GA', text: 'I\'ve closed 12 deals in the last 6 months through All Street Live buyers. This platform changed my business.', avatar: 'https://picsum.photos/seed/user1/100/100', rating: 5 },
  { name: 'Sarah Mitchell', role: 'Creative Finance · Houston, TX', text: 'The social network helps me stay connected with investors nationwide. My buyer list doubled.', avatar: 'https://picsum.photos/seed/user4/100/100', rating: 5 },
  { name: 'Kevin Washington', role: 'Buy & Hold · Memphis, TN', text: 'Found 8 rental properties through All Street Live in one year. The deal quality here is unmatched.', avatar: 'https://picsum.photos/seed/user5/100/100', rating: 5 },
];

export default function Landing() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh' }}>
      {/* Hero */}
      <section className="hero-bg" style={{ position: 'relative', overflow: 'hidden', padding: '100px 20px 80px' }}>
        {/* Orbs */}
        <div className="orb" style={{
          position: 'absolute', top: '10%', left: '5%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="orb-2" style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
            <Logo size="lg" tagline />
          </div>

          {/* Headline */}
          <h1 style={{ color: '#f8fafc', fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' }}>
            The <span className="gradient-text">#1 Marketplace</span><br />
            for Real Estate Investors
          </h1>

          <p style={{ color: '#94a3b8', fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Connect wholesalers, cash buyers, hard money lenders, and investors nationwide.
            Find deals, close faster, and grow your REI business.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            <Link
              to="/marketplace"
              className="gradient-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 32px', borderRadius: '12px',
                color: '#fff', textDecoration: 'none',
                fontSize: '16px', fontWeight: 700,
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
              }}
            >
              Browse Deals
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/auth"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 32px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', textDecoration: 'none',
                fontSize: '16px', fontWeight: 700,
                transition: 'all 0.2s',
              }}
            >
              Post a Deal Free
              <Zap size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
            {stats.map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div className="gradient-text" style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1 }}>{value}</div>
                <div style={{ color: '#475569', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#f8fafc', fontSize: '36px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Everything You Need to <span className="gradient-text">Scale Your REI</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            One platform. Every tool. All investors.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="card-hover"
              style={{
                background: '#12121e', border: '1px solid #1e1e2e',
                borderRadius: '16px', padding: '28px',
              }}
            >
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `${color}18`, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '20px',
              }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{title}</h3>
              <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: 0, fontSize: '14px' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 20px', background: 'rgba(139, 92, 246, 0.03)', borderTop: '1px solid #1e1e2e', borderBottom: '1px solid #1e1e2e' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ color: '#f8fafc', fontSize: '36px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              How <span className="gradient-text">All Street Live</span> Works
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>Get started in minutes. Close deals in days.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontWeight: 900, fontSize: '20px', color: '#fff',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.3)',
                }}>
                  {step}
                </div>
                <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, fontSize: '14px', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ color: '#f8fafc', fontSize: '36px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
            Trusted by <span className="gradient-text">10,000+ Investors</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {testimonials.map(({ name, role, text, avatar, rating }) => (
            <div
              key={name}
              className="card-hover"
              style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px', padding: '28px' }}
            >
              <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                {[...Array(rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={avatar} alt={name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <p style={{ color: '#f8fafc', fontWeight: 700, margin: 0, fontSize: '14px' }}>{name}</p>
                  <p style={{ color: '#475569', margin: 0, fontSize: '12px' }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '24px', padding: '60px 40px',
        }}>
          <h2 style={{ color: '#f8fafc', fontSize: '36px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Ready to Scale Your REI?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '32px', lineHeight: 1.7 }}>
            Join 10,000+ investors already using All Street Live to find deals,<br />connect with buyers, and grow their portfolios.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/auth"
              className="gradient-btn"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 32px', borderRadius: '12px',
                color: '#fff', textDecoration: 'none',
                fontSize: '16px', fontWeight: 700,
              }}
            >
              Create Free Account
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/marketplace"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '16px 32px', borderRadius: '12px',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
                color: '#f8fafc', textDecoration: 'none',
                fontSize: '16px', fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              Browse Deals First
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0d0d1a', borderTop: '1px solid #1e1e2e', padding: '60px 20px 30px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Logo size="md" />
              </div>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                The #1 Marketplace for Real Estate Investors. Connecting deals, investors, and opportunities nationwide.
              </p>
            </div>
            {[
              { title: 'Platform', links: ['Marketplace', 'Social Feed', 'Contractors', 'Meetups', 'Messages'] },
              { title: 'Investors', links: ['Wholesalers', 'Cash Buyers', 'Hard Money', 'Property Managers', 'Agents'] },
              { title: 'Company', links: ['About All Street Live', 'Blog', 'Press', 'Careers', 'Contact'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '16px', fontSize: '14px' }}>{title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" style={{ color: '#475569', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #1e1e2e', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <p style={{ color: '#334155', fontSize: '13px', margin: 0 }}>
              © 2026 All Street Live. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                <a key={l} href="#" style={{ color: '#334155', fontSize: '13px', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
