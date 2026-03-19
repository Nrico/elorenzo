import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import RichTextEditor from '../components/admin/RichTextEditor';
import ImageUploader from '../components/admin/ImageUploader';
import ButtonEditor, { ButtonEntry } from '../components/admin/ButtonEditor';
import LinkEditor, { LinkEntry } from '../components/admin/LinkEditor';

interface ProjectForm {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  detailImageUrl: string;
  tags: string;
  liveUrl: string;
  githubUrl: string;
  buttons: ButtonEntry[];
  links: LinkEntry[];
  images: string[];
}

const EMPTY_FORM: ProjectForm = {
  id: '',
  title: '',
  category: '',
  year: new Date().getFullYear().toString(),
  description: '',
  fullDescription: '',
  imageUrl: '',
  detailImageUrl: '',
  tags: '',
  liveUrl: '',
  githubUrl: '',
  buttons: [],
  links: [],
  images: [],
};

const CATEGORIES = ['Code', 'Art', 'Exploration', 'Code / Art', 'Photography', 'Design'];

const SESSION_KEY = 'el_admin_auth';

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface SectionProps { label: string; children: React.ReactNode }
function Section({ label, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-3">
        {label}
      </h3>
      {children}
    </div>
  );
}

interface FieldProps { label: string; required?: boolean; children: React.ReactNode }
function Field({ label, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-black transition-colors";

export default function AdminProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Auth guard
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== '1') {
      navigate('/admin');
    }
  }, []);

  // Load existing project
  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/projects.php?id=${id}`)
        .then(r => r.json())
        .then(data => {
          setForm({
            id: data.id,
            title: data.title,
            category: data.category,
            year: data.year,
            description: data.description,
            fullDescription: data.fullDescription,
            imageUrl: data.imageUrl,
            detailImageUrl: data.detailImageUrl,
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            liveUrl: data.liveUrl || '',
            githubUrl: data.githubUrl || '',
            buttons: data.buttons || [],
            links: data.links || [],
            images: data.images || [],
          });
        })
        .catch(() => setError('Failed to load project'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = <K extends keyof ProjectForm>(key: K, val: ProjectForm[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        id: form.id || slugify(form.title),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = isNew ? '/api/projects.php' : `/api/projects.php?id=${id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');
      const saved = await res.json();
      setSaved(true);

      if (isNew) navigate(`/admin/project/${saved.id}`, { replace: true });
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <form onSubmit={handleSave} className="min-h-screen bg-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors shrink-0"
            >
              ← Back
            </button>
            <h1 className="text-sm font-black uppercase tracking-tighter truncate">
              {isNew ? 'New Project' : form.title || 'Edit Project'}
            </h1>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] text-green-600 font-bold uppercase tracking-widest"
              >
                ✓ Saved
              </motion.span>
            )}
            {!isNew && (
              <a
                href={`/project/${id}`}
                target="_blank"
                className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
              >
                View ↗
              </a>
            )}
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : isNew ? 'Publish' : 'Save Changes'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-3 text-xs text-red-600 font-bold uppercase tracking-widest">
          ⚠ {error}
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* ── BASICS ── */}
        <Section label="Project Info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Title" required>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="My Awesome Project"
                required
                className={inputClass}
              />
            </Field>
            <Field label="Slug / ID">
              <input
                value={form.id}
                onChange={e => set('id', e.target.value)}
                placeholder={form.title ? slugify(form.title) : 'auto-generated'}
                className={`${inputClass} font-mono text-xs text-slate-500`}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Category">
              <select
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className={inputClass}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Year">
              <input
                value={form.year}
                onChange={e => set('year', e.target.value)}
                placeholder={new Date().getFullYear().toString()}
                className={inputClass}
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="React, TypeScript, GLSL"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Short Description">
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="One-line description shown on the project card…"
              rows={2}
              className={`${inputClass} resize-y`}
            />
          </Field>
        </Section>

        {/* ── RICH TEXT ── */}
        <Section label="Full Description">
          <RichTextEditor
            value={form.fullDescription}
            onChange={html => set('fullDescription', html)}
            placeholder="Write the full project description here. Use the toolbar to format text, add headings, lists, and links…"
            minHeight="280px"
          />
        </Section>

        {/* ── IMAGES ── */}
        <Section label="Images">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImageUploader
              label="Hero / Grid Image"
              value={form.imageUrl}
              onChange={url => set('imageUrl', url)}
            />
            <ImageUploader
              label="Detail / Banner Image"
              value={form.detailImageUrl}
              onChange={url => set('detailImageUrl', url)}
            />
          </div>
        </Section>

        {/* ── LINKS ── */}
        <Section label="Links & CTAs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Field label="Live Project URL">
              <input
                type="url"
                value={form.liveUrl}
                onChange={e => set('liveUrl', e.target.value)}
                placeholder="https://myproject.com"
                className={inputClass}
              />
            </Field>
            <Field label="GitHub URL">
              <input
                type="url"
                value={form.githubUrl}
                onChange={e => set('githubUrl', e.target.value)}
                placeholder="https://github.com/user/repo"
                className={inputClass}
              />
            </Field>
          </div>
          <ButtonEditor value={form.buttons} onChange={btns => set('buttons', btns)} />
          <div className="mt-8">
            <LinkEditor value={form.links} onChange={links => set('links', links)} />
          </div>
        </Section>

        {/* ── SAVE (bottom) ── */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
          >
            ← Back to Dashboard
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-12 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : isNew ? 'Publish Project' : 'Save Changes'}
          </button>
        </div>
      </main>
    </form>
  );
}
