import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { projects as staticProjects } from '../data';
import { useState, useEffect } from 'react';
import type { Project } from '../data';

export default function Home() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>(staticProjects);

  // Load from API; fall back to static data if unavailable
  useEffect(() => {
    fetch('/api/projects.php')
      .then(r => r.json())
      .then(data => { if (data.length > 0) setProjects(data); })
      .catch(() => {});
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category.includes(filter));

  const categories = ['All', 'Code', 'Art', 'Exploration'];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center py-24 md:py-40 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h2 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.85] text-black uppercase">
              Art.<br />Code.<br />Exploration.
            </h2>
            <p className="mx-auto max-w-xl text-lg md:text-xl font-light text-slate-500">
              A minimalist space showcasing the intersection of generative aesthetics and functional software engineering.
            </p>
            <div className="pt-8">
              <button className="border-b-2 border-black pb-1 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-all">
                Explore Archive
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="container mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-y border-slate-100 py-6 mb-12 gap-6">
          <div className="flex items-center gap-8">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] font-bold uppercase tracking-widest transition-all pb-1 ${
                  filter === cat 
                    ? 'text-black border-b-2 border-black' 
                    : 'text-slate-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="text-slate-400">Displaying {filteredProjects.length} projects</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100 min-h-[600px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-square bg-white overflow-hidden"
              >
                <Link to={`/project/${project.id}`}>
                  <div 
                    className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-black bg-white px-3 py-1.5 shadow-sm">
                      {project.title}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-20 flex justify-center">
          <button className="border border-slate-200 px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all">
            View Full Archive
          </button>
        </div>
      </section>
    </div>
  );
}
