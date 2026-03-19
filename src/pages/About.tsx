import { motion } from 'motion/react';

export default function About() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white"
    >
      <section className="px-6 md:px-20 py-24 md:py-40 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase mb-12">
              The<br />Intersection<br />of Logic<br />& Art.
            </h1>
            <div className="aspect-[3/4] bg-slate-100 overflow-hidden rounded-sm">
              <img 
                src="https://picsum.photos/seed/portrait/1200/1600" 
                alt="Enrico Lorenzo" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12 pt-12 lg:pt-48"
          >
            <div className="space-y-6 text-xl md:text-2xl font-light text-slate-600 leading-relaxed">
              <p>
                I am Enrico Lorenzo, a software engineer and generative artist based in the digital ether. My work lives at the boundary where rigid computational logic meets the fluid unpredictability of organic aesthetics.
              </p>
              <p>
                With over a decade of experience in full-stack development, I've dedicated my practice to building systems that aren't just functional, but expressive. I believe that code is a medium for exploration—a way to map the unseen topographies of data and thought.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-100">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black mb-6">Expertise</h3>
                <ul className="space-y-3 text-sm text-slate-500 font-medium uppercase tracking-widest">
                  <li>Systems Architecture</li>
                  <li>Generative Art (GLSL)</li>
                  <li>React Ecosystem</li>
                  <li>Data Visualization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black mb-6">Philosophy</h3>
                <ul className="space-y-3 text-sm text-slate-500 font-medium uppercase tracking-widest">
                  <li>Minimalism</li>
                  <li>Functional Beauty</li>
                  <li>Open Source</li>
                  <li>Continuous Iteration</li>
                </ul>
              </div>
            </div>

            <div className="pt-12">
              <p className="text-sm font-bold uppercase tracking-widest text-black mb-4">Currently Reading</p>
              <p className="text-slate-400 italic">"The Architecture of Happiness" — Alain de Botton</p>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
