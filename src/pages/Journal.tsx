import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import type { JournalPost } from '../types/journal';

export default function Journal() {
  const [posts, setPosts] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/journal.php')
      .then(r => r.json())
      .then(data => setPosts(data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 md:py-32 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            Journal
          </h1>
          <p className="text-slate-500 font-serif italic text-lg max-w-xl">
            Thoughts, processes, and explorations in code and art.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No entries yet</p>
          </div>
        ) : (
          <div className="space-y-16">
            {posts.map((post, i) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <Link to={`/journal/${post.id}`} className="block">
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
                    
                    {/* Date Column */}
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 md:pt-2">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
                    </div>
                    
                    {/* Content Column */}
                    <div>
                      {post.cover_image_url && (
                        <div className="mb-6 overflow-hidden aspect-[2/1] bg-slate-50">
                          <img 
                            src={post.cover_image_url} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                          />
                        </div>
                      )}
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter group-hover:text-amber-600 transition-colors mb-4">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-slate-600 font-serif italic text-lg leading-relaxed max-w-2xl mb-6">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-black border-b border-black pb-1 group-hover:border-amber-600 group-hover:text-amber-600 transition-colors">
                        Read Entry <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>

                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </main>
  );
}
