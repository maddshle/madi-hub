import React from 'react';
import { Terminal, Database } from 'lucide-react';
import { isDatabaseConfigured } from '../lib/supabase';

export function Navbar({ navigateTo }) {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/80 backdrop-blur-md border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => navigateTo('/')}
            className="flex items-center gap-3 text-left group transition"
          >
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400 group-hover:border-sky-500/40">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-white tracking-tight group-hover:text-sky-300 transition">madi.hub</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                  v1.1
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">Vercel Deployment Showcase</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-md font-mono">
              <Database className={`w-3.5 h-3.5 ${isDatabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="hidden sm:inline">{isDatabaseConfigured ? 'Supabase Database' : 'LocalStorage Mode'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
