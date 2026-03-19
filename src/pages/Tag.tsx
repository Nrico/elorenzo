import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import type { JournalPost } from '../types/journal';

// Mimic the type from Admin Project
interface Project {
  id: string;
  title: string;
  category: string;
  tags: string[];
  imageUrl: string;
  year: string;
}

export default function Tag() {
  const { id } = useParams<{ id: string }>(); // e.g. "React"
  const decodedTag = id ? decodeURIComponent(id) : '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [journals, setJournals] = useState<JournalPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decodedTag) return;

    setLoading(true);

    Promise.all([
      fetch('/api/projects.php').then(r => r.json()),
      fetch('/api/journal.php').then(r => r.json()) // Only gets published ones
    ])
      .then(([projData, jourData]) => {
        // Filter projects by tag
        const filteredProjects = (projData as Project[]).filter(p => 
          p.tags?.some(t => t.toLowerCase() === decodedTag.toLowerCase())
        );
        // Filter journals by tag
        const filteredJournals = (jourData as JournalPost[]).filter(j => 
          j.tags?.some(t => t.toLowerCase() === decodedTag.toLowerCase())
        );

        setProjects(filteredProjects);
        setJournals(filteredJournals);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
      
  }, [decodedTag]);

  return (
    <Layout>
      <main className="max-w-4xl mx-auto px-6 py-24 md:py-32 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Tag Results
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            # {decodedTag}
          </h1>
          <p className="text-slate-500 font-serif italic text-lg max-w-xl">
            Found {projects.length} project(s) and {journals.length} entry(s).
          </p>
        </motion.div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 && journals.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nothing found for this tag.</p>
          </div>
        ) : (
          <div className="space-y-24">
            
            {/* Projects Section */}
            {projects.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-2 border-black inline-block pb-1">
                  Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link to={`/project/${project.id}`} className="group block">
                        <div className="aspect-[4/3] bg-slate-100 mb-4 overflow-hidden">
                          {project.imageUrl && (
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-black text-xl uppercase tracking-tighter group-hover:text-amber-600 transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mt-1">
                              {project.category} · {project.year}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Journal Section */}
            {journals.length > 0 && (
              <section>
                <h2 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-2 border-black inline-block pb-1">
                  Journal Entries
                </h2>
                <div className="space-y-12">
                  {journals.map((post, i) => (
                    <motion.article 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative"
                    >
                      <Link to={`/journal/${post.id}`} className="block">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 items-start">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 md:pt-2">
                            {post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                          </div>
                          <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-amber-600 transition-colors mb-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-slate-600 font-serif italic leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>
    </Layout>
  );
}
