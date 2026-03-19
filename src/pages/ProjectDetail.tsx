import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { projects as staticProjects } from '../data';
import { useState, useEffect } from 'react';
import type { Project } from '../data';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    setLoading(true);

    // Try API first, fall back to static data
    fetch(`/api/projects.php?id=${id}`)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => setProject(data))
      .catch(() => {
        const found = staticProjects.find(p => p.id === id) || null;
        setProject(found);
      })
      .finally(() => setLoading(false));

    // Also load all for "Similar Projects"
    fetch('/api/projects')
      .then(r => r.json())
      .then(data => setAllProjects(data.length > 0 ? data : staticProjects))
      .catch(() => setAllProjects(staticProjects));
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Project Not Found</h1>
          <Link to="/" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Return Home</Link>
        </div>
      </div>
    );
  }

  const similarProjects = allProjects.filter(p => p.id !== project.id).slice(0, 3);

  // Determine which buttons to show
  const ctaButtons = project.buttons && project.buttons.length > 0
    ? project.buttons.map(btn => ({ label: btn.label, url: btn.url, style: btn.style }))
    : [
        ...(project.liveUrl ? [{ label: 'View Live Project', url: project.liveUrl, style: 'primary' as const }] : []),
        ...(project.githubUrl ? [{ label: 'View on GitHub', url: project.githubUrl, style: 'outline' as const }] : []),
        // Fallback if neither
        ...(!project.liveUrl && !project.githubUrl
          ? [{ label: 'View Live Project', url: '#', style: 'primary' as const }, { label: 'View on GitHub', url: '#', style: 'outline' as const }]
          : []),
      ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      {/* Hero Image */}
      <div className="w-full px-6 md:px-20 py-8">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative w-full aspect-video md:h-[70vh] overflow-hidden rounded-sm bg-slate-100"
        >
          {project.detailImageUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${project.detailImageUrl})` }}
            />
          )}
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="px-6 md:px-20 max-w-6xl mx-auto py-12 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24">
          {/* Text Content */}
          <div className="flex-1 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-black text-5xl md:text-8xl font-black leading-none tracking-tighter mb-6 uppercase">
                {project.title}
              </h1>
              <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <span>{project.category}</span>
                <span className="size-1 bg-slate-200 rounded-full" />
                <span>{project.year}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8 text-lg md:text-xl leading-relaxed text-slate-600 font-light"
            >
              {/* Render HTML from rich text editor, or split plain text by paragraphs */}
              {project.fullDescription.startsWith('<') ? (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.fullDescription }}
                />
              ) : (
                project.fullDescription.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              )}
            </motion.div>

            {/* Resource Links */}
            {project.links && project.links.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4"
              >
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-0.5 hover:opacity-50 transition-opacity"
                  >
                    {link.label} ↗
                  </a>
                ))}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-8"
            >
              {ctaButtons.map((btn, i) => (
                <a
                  key={i}
                  href={btn.url}
                  target={btn.url !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`inline-block px-10 py-5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    btn.style === 'primary'
                      ? 'bg-black text-white hover:bg-slate-800'
                      : 'border-2 border-black text-black hover:bg-black hover:text-white'
                  }`}
                >
                  {btn.label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full md:w-1/3"
          >
            <div className="aspect-square bg-slate-100 overflow-hidden group">
              {project.imageUrl && (
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${project.imageUrl})` }}
                />
              )}
            </div>
            {project.tags && project.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/tag/${encodeURIComponent(tag.trim())}`}
                    className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-sm hover:bg-slate-200 hover:text-black transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Similar Projects Section */}
      <section className="bg-slate-50 py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-black text-2xl font-black tracking-tighter mb-16 uppercase">Similar Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {similarProjects.map((p) => (
              <Link key={p.id} to={`/project/${p.id}`} className="group block">
                <div className="aspect-[4/3] bg-slate-200 overflow-hidden mb-6">
                  {p.imageUrl && (
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url(${p.imageUrl})` }}
                    />
                  )}
                </div>
                <h4 className="text-black font-black uppercase tracking-tight text-lg group-hover:underline decoration-2 underline-offset-4">
                  {p.title}
                </h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
                  {p.category} / {p.year}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
