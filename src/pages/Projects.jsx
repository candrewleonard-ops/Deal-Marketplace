import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, CheckCircle2, Users, X as XIcon, Clock } from 'lucide-react';
import { initialProjects } from '../data/projects';
import { getUserById } from '../data/users';

function getProjectStats(project) {
  let total = 0, completed = 0;
  project.sections.forEach(s => {
    s.tasks.forEach(t => {
      total++;
      if (t.completed) completed++;
    });
  });
  return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ProgressRing({ pct, size = 48 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e1e2e" strokeWidth={5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#8b5cf6" strokeWidth={5}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
    </svg>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const proj = {
      id: Date.now(),
      name: newName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedUsers: [],
      sections: [],
    };
    setProjects(prev => [proj, ...prev]);
    setNewName('');
    setShowNew(false);
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '24px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '28px', margin: 0 }}>Projects</h1>
            <p style={{ color: '#475569', margin: '4px 0 0', fontSize: '14px' }}>Manage your fix &amp; flip checklists</p>
          </div>
          <button onClick={() => setShowNew(true)} className="gradient-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 18px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
            <Plus size={16} /> New Project
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>
        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '16px' }}>
            <FolderKanban size={48} style={{ color: '#8b5cf6', marginBottom: '16px', opacity: 0.3 }} />
            <h3 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: '8px' }}>No projects yet</h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>Create your first project to start tracking rehab tasks.</p>
            <button onClick={() => setShowNew(true)} className="gradient-btn"
              style={{ padding: '11px 24px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              Create Project
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {projects.map(proj => {
            const stats = getProjectStats(proj);
            const assignees = proj.assignedUsers.map(id => getUserById(id)).filter(Boolean);
            return (
              <Link to={`/projects/${proj.id}`} key={proj.id}
                style={{ textDecoration: 'none', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf640'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <ProgressRing pct={stats.pct} size={52} />
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontWeight: 700, fontSize: '12px' }}>
                    {stats.pct}%
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '16px' }}>{proj.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> {stats.completed}/{stats.total} tasks
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FolderKanban size={13} /> {proj.sections.length} sections
                    </span>
                    <span style={{ color: '#475569', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {formatDate(proj.updatedAt)}
                    </span>
                  </div>
                </div>
                {assignees.length > 0 && (
                  <div style={{ display: 'flex', flexShrink: 0 }}>
                    {assignees.slice(0, 3).map((u, i) => (
                      <img key={u.id} src={u.avatar} alt={u.name}
                        style={{ width: '30px', height: '30px', borderRadius: '50%', border: '2px solid #12121e', marginLeft: i > 0 ? '-8px' : 0, objectFit: 'cover' }}
                        title={u.name} />
                    ))}
                    {assignees.length > 3 && (
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1e1e2e', border: '2px solid #12121e', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>
                        +{assignees.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* New Project Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowNew(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '440px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '19px', margin: 0 }}>New Project</h2>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><XIcon size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Project Name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. 123 Main St Kitchen Rehab"
                  className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} autoFocus required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowNew(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="gradient-btn" style={{ flex: 2, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
