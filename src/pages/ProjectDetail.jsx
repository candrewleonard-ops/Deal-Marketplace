import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Plus, Check, MoreVertical, Users, Save, Download, X as XIcon, Trash2 } from 'lucide-react';
import { initialProjects, initialTemplates } from '../data/projects';
import { users, getUserById } from '../data/users';

function ProgressRing({ pct, size = 56 }) {
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

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [hideAssigned, setHideAssigned] = useState(false);
  const [showAssignUsers, setShowAssignUsers] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showSectionMenu, setShowSectionMenu] = useState(null);
  const [showTaskMenu, setShowTaskMenu] = useState(null);
  const [newSectionName, setNewSectionName] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [newTaskName, setNewTaskName] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const proj = initialProjects.find(p => p.id === parseInt(id));
    if (proj) {
      setProject(JSON.parse(JSON.stringify(proj)));
      const expanded = {};
      proj.sections.forEach(s => expanded[s.id] = true);
      setExpandedSections(expanded);
    }
  }, [id]);

  if (!project) return null;

  const getStats = () => {
    let total = 0, completed = 0;
    project.sections.forEach(s => s.tasks.forEach(t => { total++; if (t.completed) completed++; }));
    return { total, completed, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const stats = getStats();
  const assignees = project.assignedUsers.map(uid => getUserById(uid)).filter(Boolean);

  const toggleTaskComplete = (sectionId, taskId) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s, tasks: s.tasks.map(t => t.id === taskId ? {
          ...t, completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : null
        } : t)
      } : s),
      updatedAt: new Date().toISOString()
    }));
  };

  const assignTaskToUser = (sectionId, taskId, userId) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s, tasks: s.tasks.map(t => t.id === taskId ? { ...t, assignedTo: userId || null } : t)
      } : s),
      updatedAt: new Date().toISOString()
    }));
  };

  const addSection = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const newSection = {
      id: `s${Date.now()}`,
      name: newSectionName.trim(),
      collapsed: false,
      tasks: []
    };
    setProject(prev => ({ ...prev, sections: [...prev.sections, newSection], updatedAt: new Date().toISOString() }));
    setNewSectionName('');
    setShowAddSection(false);
  };

  const addTask = (sectionId) => {
    const name = newTaskName[sectionId]?.trim();
    if (!name) return;
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s, tasks: [...s.tasks, {
          id: `t${Date.now()}`,
          name, completed: false, assignedTo: null,
          completedAt: null, notes: ''
        }]
      } : s),
      updatedAt: new Date().toISOString()
    }));
    setNewTaskName(prev => ({ ...prev, [sectionId]: '' }));
  };

  const deleteSection = (sectionId) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
      updatedAt: new Date().toISOString()
    }));
    setShowSectionMenu(null);
  };

  const deleteTask = (sectionId, taskId) => {
    setProject(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? {
        ...s, tasks: s.tasks.filter(t => t.id !== taskId)
      } : s),
      updatedAt: new Date().toISOString()
    }));
    setShowTaskMenu(null);
  };

  const toggleAssignUser = (userId) => {
    setProject(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId]
    }));
  };

  const applyTemplate = (template) => {
    const newSections = template.sections.map(ts => ({
      id: `s${Date.now()}-${Math.random()}`,
      name: ts.name,
      collapsed: false,
      tasks: ts.tasks.map(tn => ({
        id: `t${Date.now()}-${Math.random()}`,
        name: tn, completed: false, assignedTo: null,
        completedAt: null, notes: ''
      }))
    }));
    setProject(prev => ({
      ...prev,
      sections: [...prev.sections, ...newSections],
      updatedAt: new Date().toISOString()
    }));
    setShowTemplates(false);
  };

  const saveAsTemplate = () => {
    if (!templateName.trim()) return;
    const tmpl = {
      id: `tmpl-${Date.now()}`,
      name: templateName.trim(),
      sections: project.sections.map(s => ({
        name: s.name,
        tasks: s.tasks.map(t => t.name)
      }))
    };
    console.log('Template saved:', tmpl);
    setTemplateName('');
    setShowSaveTemplate(false);
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{ background: '#0d0d1a', borderBottom: '1px solid #1e1e2e', padding: '20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: '#8b5cf6', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
            <ChevronLeft size={16} /> Projects
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <ProgressRing pct={stats.pct} size={64} />
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontWeight: 700, fontSize: '14px' }}>
                {stats.pct}%
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '26px', margin: 0 }}>{project.name}</h1>
              <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
                {stats.completed}/{stats.total} tasks completed · Last updated {new Date(project.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {new Date(project.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => setShowAssignUsers(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <Users size={14} /> Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={() => setHideCompleted(!hideCompleted)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: hideCompleted ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hideCompleted ? 'rgba(139,92,246,0.3)' : '#1e1e2e'}`, color: hideCompleted ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' }}>
          <XIcon size={14} /> Hide Completed Tasks
        </button>
        <button onClick={() => setHideAssigned(!hideAssigned)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: hideAssigned ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${hideAssigned ? 'rgba(139,92,246,0.3)' : '#1e1e2e'}`, color: hideAssigned ? '#8b5cf6' : '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s' }}>
          <XIcon size={14} /> Hide Assigned Tasks
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowTemplates(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <Download size={14} /> Load Template
          </button>
          <button onClick={() => setShowSaveTemplate(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            <Save size={14} /> Save as Template
          </button>
        </div>
      </div>

      {/* Add Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        {!showAddSection ? (
          <button onClick={() => setShowAddSection(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b5cf6', background: 'none', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>
            <Plus size={16} /> Add Section
          </button>
        ) : (
          <form onSubmit={addSection} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
            <input value={newSectionName} onChange={e => setNewSectionName(e.target.value)} placeholder="e.g. Kitchen, Bathroom, Exterior"
              className="input-dark" style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', fontSize: '14px' }} autoFocus required />
            <button type="submit" style={{ padding: '9px 16px', borderRadius: '8px', background: '#8b5cf6', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Add</button>
            <button type="button" onClick={() => setShowAddSection(false)} style={{ padding: '9px 16px', borderRadius: '8px', background: '#1e1e2e', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>Cancel</button>
          </form>
        )}
      </div>

      {/* Sections */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {project.sections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px' }}>
            <p style={{ color: '#475569', fontSize: '14px' }}>No sections yet. Add one to get started!</p>
          </div>
        ) : (
          project.sections.map(section => {
            const visibleTasks = section.tasks.filter(t => !(hideCompleted && t.completed) && !(hideAssigned && t.assignedTo));
            const isExpanded = expandedSections[section.id];
            return (
              <div key={section.id} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '12px', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !isExpanded }))}
                  style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: '#12121e', borderBottom: isExpanded ? '1px solid #1e1e2e' : 'none' }}>
                  {isExpanded ? <ChevronUp size={18} style={{ color: '#8b5cf6' }} /> : <ChevronDown size={18} style={{ color: '#94a3b8' }} />}
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '15px', margin: 0, flex: 1 }}>{section.name}</h3>
                  <span style={{ color: '#475569', fontSize: '12px', fontWeight: 600 }}>{section.tasks.filter(t => t.completed).length}/{section.tasks.length}</span>
                  <button onClick={e => { e.stopPropagation(); setShowSectionMenu(showSectionMenu === section.id ? null : section.id); }}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                    <MoreVertical size={16} />
                  </button>
                  {showSectionMenu === section.id && (
                    <div style={{ position: 'absolute', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '8px', zIndex: 50, top: '100%', right: '12px', marginTop: '4px', minWidth: '140px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                      <button onClick={() => deleteSection(section.id)} style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trash2 size={14} /> Delete Section
                      </button>
                    </div>
                  )}
                </div>
                {isExpanded && (
                  <div style={{ padding: '14px', borderTop: '1px solid #1e1e2e', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {visibleTasks.map(task => {
                      const assignee = task.assignedTo ? getUserById(task.assignedTo) : null;
                      return (
                        <div key={task.id} style={{ background: '#0d0d1a', border: '1px solid #1e1e2e', borderRadius: '10px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <button onClick={() => toggleTaskComplete(section.id, task.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0, marginTop: '2px' }}>
                            {task.completed ? <Check size={20} style={{ color: '#10b981' }} /> : <div style={{ width: '20px', height: '20px', border: '2px solid #475569', borderRadius: '50%' }} />}
                          </button>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: task.completed ? '#475569' : '#f8fafc', fontWeight: 600, fontSize: '14px', textDecoration: task.completed ? 'line-through' : 'none' }}>
                              {task.name}
                            </div>
                            {assignee && (
                              <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <img src={assignee.avatar} alt="" style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} />
                                {assignee.name} {task.completedAt && `· ${new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                              </div>
                            )}
                            {task.notes && (
                              <div style={{ color: '#8b5cf6', fontSize: '12px', marginTop: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {task.notes}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button onClick={() => setShowTaskMenu(showTaskMenu === task.id ? null : task.id)}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                              <MoreVertical size={14} />
                            </button>
                            {showTaskMenu === task.id && (
                              <div style={{ position: 'absolute', background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '8px', zIndex: 50, minWidth: '160px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                                <div style={{ padding: '8px 0' }}>
                                  <div style={{ color: '#475569', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', padding: '6px 12px', letterSpacing: '0.5px' }}>Assign to</div>
                                  {users.slice(0, 5).map(u => (
                                    <button key={u.id} onClick={() => { assignTaskToUser(section.id, task.id, u.id); setShowTaskMenu(null); }}
                                      style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: task.assignedTo === u.id ? 'rgba(139,92,246,0.1)' : 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}>
                                      <img src={u.avatar} alt="" style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} />
                                      {u.name}
                                      {task.assignedTo === u.id && <Check size={14} style={{ marginLeft: 'auto', color: '#8b5cf6' }} />}
                                    </button>
                                  ))}
                                  <button onClick={() => { assignTaskToUser(section.id, task.id, null); setShowTaskMenu(null); }}
                                    style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: task.assignedTo === null ? 'rgba(139,92,246,0.1)' : 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    Unassigned
                                    {task.assignedTo === null && <Check size={14} style={{ marginLeft: 'auto', color: '#8b5cf6' }} />}
                                  </button>
                                  <div style={{ borderTop: '1px solid #1e1e2e', marginTop: '4px', paddingTop: '4px' }}>
                                    <button onClick={() => { deleteTask(section.id, task.id); setShowTaskMenu(null); }} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <form onSubmit={e => { e.preventDefault(); addTask(section.id); }}
                      style={{ display: 'flex', gap: '8px' }}>
                      <input value={newTaskName[section.id] || ''} onChange={e => setNewTaskName(prev => ({ ...prev, [section.id]: e.target.value }))}
                        placeholder="Add a task..." className="input-dark" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', fontSize: '13px' }} />
                      <button type="submit" style={{ padding: '8px 12px', borderRadius: '8px', background: '#8b5cf6', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                        <Plus size={16} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Assign Users Modal */}
      {showAssignUsers && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowAssignUsers(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '380px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Assign Users to Project</h2>
              <button onClick={() => setShowAssignUsers(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><XIcon size={20} /></button>
            </div>
            <div style={{ padding: '16px', maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {users.map(u => (
                <button key={u.id} onClick={() => toggleAssignUser(u.id)}
                  style={{ padding: '12px', borderRadius: '10px', background: project.assignedUsers.includes(u.id) ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${project.assignedUsers.includes(u.id) ? 'rgba(139,92,246,0.3)' : '#1e1e2e'}`, color: '#f8fafc', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
                  <img src={u.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{u.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>@{u.username}</div>
                  </div>
                  {project.assignedUsers.includes(u.id) && <Check size={18} style={{ color: '#8b5cf6' }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Load Template Modal */}
      {showTemplates && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowTemplates(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Load Template</h2>
              <button onClick={() => setShowTemplates(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><XIcon size={20} /></button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {initialTemplates.map(tmpl => (
                <button key={tmpl.id} onClick={() => applyTemplate(tmpl)}
                  style={{ padding: '16px', borderRadius: '12px', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#f8fafc', cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'}>
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{tmpl.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{tmpl.sections.length} sections, {tmpl.sections.reduce((s, sec) => s + sec.tasks.length, 0)} tasks</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowSaveTemplate(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#12121e', border: '1px solid #1e1e2e', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1e1e2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#f8fafc', fontWeight: 800, fontSize: '18px', margin: 0 }}>Save as Template</h2>
              <button onClick={() => setShowSaveTemplate(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><XIcon size={20} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); saveAsTemplate(); }} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Template Name *</label>
                <input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="e.g. Master Bedroom Remodel"
                  className="input-dark" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', fontSize: '14px' }} autoFocus required />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowSaveTemplate(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e2e', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                <button type="submit" className="gradient-btn" style={{ flex: 2, padding: '12px', borderRadius: '10px', color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}>Save Template</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
