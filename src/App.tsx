import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Hire from './pages/Hire';
import Journal from './pages/Journal';
import JournalPostPage from './pages/JournalPost';
import Tag from './pages/Tag';
import Admin from './pages/Admin';
import AdminProjectEditor from './pages/AdminProjectEditor';
import AdminJournalEditor from './pages/AdminJournalEditor';
import Login from './pages/Login';
import React, { useState, useEffect } from 'react';

// Simple protected route wrapper
function ProtectedRoute({ children, token }: { children: React.ReactNode, token: string | null }) {
  if (!token) return <Login onLogin={() => window.location.reload()} />;
  return <>{children}</>;
}

export default function App() {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setAdminToken(token);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Admin routes (no public Layout) */}
        <Route path="/admin" element={<ProtectedRoute token={adminToken}><Admin /></ProtectedRoute>} />
        <Route path="/admin/new" element={<ProtectedRoute token={adminToken}><AdminProjectEditor /></ProtectedRoute>} />
        <Route path="/admin/project/:id" element={<ProtectedRoute token={adminToken}><AdminProjectEditor /></ProtectedRoute>} />
        <Route path="/admin/journal/:id" element={<ProtectedRoute token={adminToken}><AdminJournalEditor /></ProtectedRoute>} />
        <Route path="/admin/journal/new" element={<ProtectedRoute token={adminToken}><AdminJournalEditor /></ProtectedRoute>} />


        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:id" element={<JournalPostPage />} />
          <Route path="/tag/:id" element={<Tag />} />
        </Route>
      </Routes>
    </Router>
  );
}
