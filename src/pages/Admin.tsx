import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const PASSPHRASE = 'highdesert';
const SESSION_KEY = 'el_admin_auth';

interface ProjectRow {
  id: string;
  title: string;
  category: string;
  year: string;
  updatedAt: string;
}

function PassphraseModal({ onAuth }: { onAuth: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === PASSPHRASE) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onAuth();
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full px-8 text-center"
      >
        <div className="size-8 bg-black rounded-sm flex items-center justify-center mx-auto mb-6">
          <span className="text-[10px] text-white font-bold uppercase">ACE</span>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter mb-2">Admin Access</h1>
        <p className="text-slate-400 text-xs mb-8 uppercase tracking-widest">Enter passphrase to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Passphrase"
            autoFocus
            className={`w-full border-2 ${error ? 'border-red-400' : 'border-slate-200'} px-4 py-3 text-sm text-center tracking-[0.3em] focus:outline-none focus:border-black transition-colors`}
          />
          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">Incorrect passphrase</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            Enter
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [activeTab, setActiveTab] = useState<'projects' | 'journal'>('projects');
  
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authed) {
      if (activeTab === 'projects') loadProjects();
      else loadJournals();
    }
  }, [authed, activeTab]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects.php');
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadJournals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journal.php?all=true', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` }
      });
      const data = await res.json();
      setJournals(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string, type: 'project' | 'journal') => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const endpoint = type === 'project' ? `/api/projects.php?id=${id}` : `/api/journal.php?id=${id}`;
      await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` }
      });
      
      if (type === 'project') setProjects(prev => prev.filter(p => p.id !== id));
      else setJournals(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  if (!authed) return <PassphraseModal onAuth={() => setAuthed(true)} />;

  const items = activeTab === 'projects' ? projects : journals;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="size-6 bg-black rounded-sm flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">ACE</span>
              </div>
              <h1 className="text-sm font-black uppercase tracking-tighter mr-8">Admin</h1>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'projects' ? 'text-black border-b border-black' : 'text-slate-400 hover:text-black'}`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveTab('journal')}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'journal' ? 'text-black border-b border-black' : 'text-slate-400 hover:text-black'}`}
              >
                Journal
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
              ← View Site
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page title + New button */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">{activeTab === 'projects' ? 'Projects' : 'Journal'}</h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2 font-bold">
              {items.length} {activeTab === 'projects' ? 'project' : 'entry'}{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate(activeTab === 'projects' ? '/admin/new' : '/admin/journal/new')}
            className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
          >
            + New {activeTab === 'projects' ? 'Project' : 'Entry'}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-slate-200 rounded-sm">
            <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-4">No {activeTab} yet</p>
            <button
              onClick={() => navigate(activeTab === 'projects' ? '/admin/new' : '/admin/journal/new')}
              className="bg-black text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest"
            >
              Create your first {activeTab === 'projects' ? 'project' : 'entry'}
            </button>
          </div>
        ) : (
          <div className="border border-slate-100 divide-y divide-slate-100">
            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50">
              {['Title', activeTab === 'projects' ? 'Category' : 'Status', activeTab === 'projects' ? 'Year' : 'Published', ''].map((h, i) => (
                <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</span>
              ))}
            </div>

            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors group"
              >
                <div>
                  <p className="font-black uppercase tracking-tighter text-sm">{item.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    Updated {new Date(activeTab === 'journal' && item.updated_at ? item.updated_at : item.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                {activeTab === 'projects' ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                    {item.category}
                  </span>
                ) : (
                  <span className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap px-2 py-1 rounded-sm ${item.published ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                )}
                
                {activeTab === 'projects' ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {item.year}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {item.published && item.published_at ? new Date(item.published_at).toLocaleDateString() : '-'}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <Link
                    to={activeTab === 'projects' ? `/project/${item.id}` : `/journal/${item.id}`}
                    target="_blank"
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
                  >
                    View ↗
                  </Link>
                  <Link
                    to={activeTab === 'projects' ? `/admin/project/${item.id}` : `/admin/journal/${item.id}`}
                    className="text-[10px] font-bold uppercase tracking-widest text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.title, activeTab === 'projects' ? 'project' : 'journal')}
                    disabled={deletingId === item.id}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors"
                  >
                    {deletingId === item.id ? '…' : 'Del'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
