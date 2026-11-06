import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const isAdminRoute = currentPath === '/admin' || currentPath.startsWith('/admin/');

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-gray-100">
      <Navbar navigateTo={navigateTo} />

      {isAdminRoute ? (
        <AdminPage navigateTo={navigateTo} />
      ) : (
        <LandingPage />
      )}

      <footer className="border-t border-gray-800/80 bg-[#090d16] py-6 text-center text-xs text-gray-500 font-mono">
        <p>madi.hub &copy; {new Date().getFullYear()} — Powered by Vite & Supabase</p>
      </footer>
    </div>
  );
}
