import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import BlockEditor from '../components/admin/BlockEditor';
import ImageUploader from '../components/admin/ImageUploader';
import type { JournalPost } from '../types/journal';

const EMPTY_FORM: Omit<JournalPost, 'created_at' | 'updated_at'> = {
  id: '',
  title: '',
  cover_image_url: '',
  excerpt: '',
  tags: [],
  blocks: [],
  published: false,
  published_at: null,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

interface SectionProps { label: string; children: React.ReactNode }
function Section({ label, children }: SectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-3 mt-12">
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

export default function AdminJournalEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Load existing post
  useEffect(() => {
    if (!isNew && id) {
      fetch(`/api/journal.php?id=${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('admin_token') || ''}` }
      })
        .then(r => r.json())
        .then(data => {
          setForm({
            id: data.id,
            title: data.title,
            cover_image_url: data.cover_image_url || '',
            excerpt: data.excerpt || '',
            tags: data.tags || [],
            blocks: data.blocks || [],
            published: data.published,
            published_at: data.published_at,
          });
        })
        .catch(() => setError('Failed to load journal post'))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (key: keyof typeof EMPTY_FORM, val: any) => {
    setForm(f => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const handleSave = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const payload = {
        ...form,
        id: form.id || slugify(form.title),
        tags: Array.isArray(form.tags) ? form.tags : (form.tags as string).split(',').map(t => t.trim()).filter(Boolean),
        published: !isDraft,
      };

      const url = isNew ? '/api/journal.php' : `/api/journal.php?id=${id}`;
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
      const savedPost = await res.json();
      setSaved(true);
      
      // Update local state if it changed published status
      setForm(prev => ({ ...prev, published: savedPost.published, published_at: savedPost.published_at }));

      if (isNew) navigate(`/admin/journal/${savedPost.id}`, { replace: true });
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
    <form className="min-h-screen bg-white">
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
              {isNew ? 'New Entry' : form.title || 'Edit Entry'}
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
            
            {/* Action Buttons */}
            <button
              type="button"
              onClick={(e) => handleSave(e, true)}
              disabled={saving}
              className="bg-transparent text-black border-2 border-slate-200 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSave(e, false)}
              disabled={saving}
              className="bg-black text-white px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : (form.published ? 'Update Live Post' : 'Publish Now')}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-b border-red-100 px-6 py-3 text-xs text-red-600 font-bold uppercase tracking-widest">
          ⚠ {error}
        </div>
      )}

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Core Setup */}
        <div className="space-y-6">
          <Field label="Entry Title" required>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. My Creative Process"
              required
              className="w-full border-none px-0 py-2 text-4xl font-black uppercase tracking-tighter text-slate-800 placeholder-slate-200 focus:outline-none focus:ring-0"
            />
          </Field>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <Field label="URL Slug">
              <input
                value={form.id}
                onChange={e => set('id', e.target.value)}
                placeholder={form.title ? slugify(form.title) : 'auto-generated'}
                className={`${inputClass} font-mono text-xs text-slate-500`}
              />
            </Field>
            {form.published_at && (
              <Field label="Published On">
                <input
                  type="text"
                  value={new Date(form.published_at).toLocaleString()}
                  disabled
                  className={`${inputClass} bg-slate-50 cursor-not-allowed text-slate-500`}
                />
              </Field>
            )}
          </div>

          <Field label="Short Excerpt">
            <textarea
              value={form.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="A brief summary for the main journal listing page..."
              rows={3}
              className={`${inputClass} resize-y text-lg`}
            />
          </Field>

          <Field label="Tags (comma-separated)">
            <input
              value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="Design, React, Tutorial"
              className={inputClass}
            />
          </Field>

          <Section label="Cover Image">
            <ImageUploader
              label="Cover Art (Optional)"
              value={form.cover_image_url}
              onChange={url => set('cover_image_url', url)}
            />
          </Section>
        </div>

        {/* Content Builder */}
        <Section label="Content Blocks">
          <BlockEditor 
            blocks={form.blocks} 
            onChange={(blocks) => set('blocks', blocks)} 
          />
        </Section>

      </main>
    </form>
  );
}
