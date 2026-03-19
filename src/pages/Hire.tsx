import React, { useState } from 'react';
import { motion } from 'motion/react';

const SERVICES = [
  'Technical Architecture',
  'Frontend Engineering',
  'Generative Art',
  'Interactive Design',
  'Systems Integration',
  'Creative Coding'
];

export default function Hire() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });

  const toggleService = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service) 
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ ...formData, selectedServices });
    alert('Thank you for your inquiry. Enrico will be in touch shortly.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white"
    >
      <section className="px-6 md:px-20 py-24 md:py-40 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full mb-6">
                <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Available for New Projects</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                Start a<br />Project.
              </h1>
            </motion.div>
            
            <div className="space-y-8 text-xl font-light text-slate-500 leading-relaxed max-w-md">
              <p>
                I'm currently accepting new projects that challenge the boundaries of design and technology. 
              </p>
              <p>
                Please select the services you're interested in and tell me a bit about your vision. I'll get back to you within 24 hours.
              </p>
            </div>

            <div className="pt-12 border-t border-slate-100 hidden lg:block">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Based in New Mexico</span>
                <span>UTC-5</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-50 p-8 md:p-16 rounded-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Service Selection */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Services Needed</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICES.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`text-left px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        selectedServices.includes(service)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Project Vision</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg resize-none"
                  placeholder="Tell me about what you want to build..."
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">Phone (Texting Only)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-slate-200 py-4 focus:border-black outline-none transition-colors font-light text-lg"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-8 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-slate-800 transition-colors shadow-xl"
              >
                Submit Inquiry
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
