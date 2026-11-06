import React from 'react';
import { ExternalLink, Github, Star, Sparkles, Layers, CheckCircle2 } from 'lucide-react';

export function ToolCard({ tool }) {
  return (
    <div className="group relative bg-[#0e1424] hover:bg-[#12192e] border border-gray-800/80 hover:border-sky-500/40 rounded-xl p-5 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-sky-500/5">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-sky-950/60 text-sky-400 border border-sky-800/40 font-medium">
              {tool.category || 'Utility'}
            </span>
            {tool.is_featured && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Featured
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            {tool.github_url && (
              <a
                href={tool.github_url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:text-white hover:bg-gray-800 rounded transition"
                title="View Repository"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-sky-400 hover:text-sky-300 hover:bg-sky-950/60 rounded transition"
              title="Launch Application"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <h3 className="text-base font-semibold text-white group-hover:text-sky-300 transition-colors flex items-center gap-2">
          {tool.title}
        </h3>

        <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
          {tool.description || 'Tidak ada deskripsi tersedia.'}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          <span>Vercel Live</span>
        </div>

        {tool.tags && tool.tags.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {tool.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] font-mono text-gray-400 bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
