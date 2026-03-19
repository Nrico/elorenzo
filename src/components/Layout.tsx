import { ReactNode } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface LayoutProps {
  children?: ReactNode;
}

const navLinks = [
  { path: '/', label: 'Work' },
  { path: '/journal', label: 'Journal' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' }
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="size-6 bg-black flex items-center justify-center rounded-sm transition-transform group-hover:rotate-12">
                <span className="text-[10px] text-white font-bold uppercase tracking-tighter">ACE</span>
              </div>
              <h1 className="text-lg font-black tracking-tighter text-black uppercase">ENRICO LORENZO</h1>
            </Link>
            
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-bold transition-colors uppercase tracking-widest ${currentPath === link.path ? 'text-black border-b border-black' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/hire"
                className="bg-black text-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors"
              >
                Hire Me
              </Link>
            </nav>
            
            <button className="md:hidden text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children || <Outlet />}
      </main>

      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">
              © {new Date().getFullYear()} ARTIST & DEVELOPER. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-10">
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black transition-colors">Github</a>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black transition-colors">Behance</a>
              <a href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
