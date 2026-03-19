import { motion } from 'motion/react';

export default function Contact() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white"
    >
      <section className="px-6 md:px-20 py-24 md:py-40 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
              Let's<br />Build<br />Something.
            </h1>
            
            <div className="space-y-8 pt-12">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Email</p>
                <a href="mailto:hello@enricolorenzo.com" className="text-2xl md:text-4xl font-light hover:text-slate-500 transition-colors">
                  hello@enricolorenzo.com
                </a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Social</p>
                <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
                  <a href="#" className="hover:text-slate-500 transition-colors">Twitter</a>
                  <a href="#" className="hover:text-slate-500 transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-slate-500 transition-colors">Github</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 md:p-12 rounded-sm">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Name</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg resize-none"
                  placeholder="Tell me about your project"
                />
              </div>
              <button className="w-full bg-black text-white py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-colors">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
