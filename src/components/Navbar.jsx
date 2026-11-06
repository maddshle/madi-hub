import React from 'react';
import { Terminal, Shield, Database, ExternalLink, RefreshCw } from 'lucide-react';
import { isDatabaseConfigured } from '../lib/supabase';

export function Navbar({ onOpenAdmin, onOpenSync, totalTools }) {
  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/80 backdrop-blur-md border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-lg text-sky-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-white tracking-tight">madi.hub</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-gray-400 hidden sm:block">Vercel Deployment Showcase & Control Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-md">
              <Database className={`w-3.5 h-3.5 ${isDatabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{isDatabaseConfigured ? 'Supabase Live' : 'LocalStorage Mode'}</span>
            </div>

            <button
              onClick={onOpenSync}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 bg-sky-950/40 hover:bg-sky-900/50 border border-sky-800/50 rounded-md transition"
              title="Auto-Detect Vercel Projects"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sync Vercel</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-200 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md transition"
            >
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
