import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import type { JournalPost, JournalBlock } from '../types/journal';

function BlockRenderer({ block }: { block: JournalBlock }) {
  switch (block.type) {
    case 'text':
      return (
        <div 
          className="prose prose-slate max-w-none prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );
    case 'image':
      return (
        <figure className="my-12">
          <img src={block.url} alt={block.caption || 'Journal image'} className="w-full" />
          {block.caption && (
            <figcaption className="mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'quote':
      return (
        <blockquote className="my-12 pl-6 border-l-4 border-amber-500">
          <p className="text-2xl md:text-3xl font-serif italic text-slate-800 leading-tight">
            "{block.text}"
          </p>
          {block.author && (
            <footer className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );
    case 'button':
      return (
        <div className="my-12 flex justify-center">
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:-translate-y-1 ${
              block.style === 'primary' 
                ? 'bg-black text-white hover:bg-amber-600 hover:shadow-xl'
                : 'border-2 border-black text-black hover:bg-black hover:text-white'
            }`}
          >
            {block.label}
          </a>
        </div>
      );
    default:
      return null;
  }
}

export default function JournalPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<JournalPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/journal.php?id=${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setPost(data);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-32 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Post Not Found</h1>
        <Link to="/journal" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black hover:underline">
          ← Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-24 pb-32"
      >
        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 mb-16 text-center">
          <Link to="/journal" className="inline-block mb-12 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
            ← Back to Journal
          </Link>
          
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-6">
            {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl md:text-2xl font-serif italic text-slate-500 max-w-2xl mx-auto mb-8">
              {post.excerpt}
            </p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/tag/${encodeURIComponent(tag.trim())}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-700 transition-colors rounded-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="max-w-6xl mx-auto px-6 mb-16 md:mb-24">
            <img src={post.cover_image_url} alt="" className="w-full h-auto aspect-[21/9] object-cover" />
          </div>
        )}

        {/* Blocks Content */}
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          {post.blocks.map((block) => (
            <div key={block.id}>
              <BlockRenderer block={block} />
            </div>
          ))}
        </div>
        
        {/* Footer info */}
        <footer className="max-w-3xl mx-auto px-6 mt-24 pt-12 border-t border-slate-100 text-center">
          <Link to="/journal" className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest hover:text-amber-600 transition-colors">
            <span className="size-8 rounded-full border border-black flex items-center justify-center">←</span>
            More Entries
          </Link>
        </footer>

      </motion.article>
  );
}
