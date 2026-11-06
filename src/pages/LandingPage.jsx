import React, { useState, useEffect } from 'react';
import { FilterBar } from '../components/FilterBar';
import { ToolCard } from '../components/ToolCard';
import { getTools } from '../lib/storage';
import { Code2, Sparkles } from 'lucide-react';

export function LandingPage() {
  const [tools, setTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await getTools(false);
    setTools(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = ['All', ...new Set(tools.map(t => t.category).filter(Boolean))];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tool.tags && tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono mb-4">
          <Sparkles className="w-3 h-3" /> Dedicated Vercel Showcase
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          madi<span className="text-sky-400 font-mono">.hub</span>
        </h1>
        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          Kumpulan aplikasi web, bot, API, dan alat bantu pengembang yang terdeploy langsung di infrastruktur Vercel.
        </p>
      </div>

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {loading ? (
        <div className="text-center py-20 text-xs font-mono text-gray-500">
          Memuat daftar tools...
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="text-center py-20 bg-[#0e1424]/40 border border-gray-800 rounded-2xl">
          <Code2 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Tidak ada tool yang cocok dengan kriteria pencarian.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTools.map(tool => (
            <div key={tool.id} className="bg-[#0e1424] border border-gray-800 hover:border-sky-500/40 rounded-xl p-4 flex items-center justify-between gap-4 transition">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">{tool.title}</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-sky-950/60 text-sky-400 border border-sky-800/40 rounded">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{tool.description}</p>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-md shrink-0 transition"
              >
                Buka App
              </a>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
