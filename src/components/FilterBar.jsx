import React from 'react';
import { Search, Grid, List, Filter } from 'lucide-react';

export function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  viewMode,
  setViewMode
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0e1424]/60 border border-gray-800 p-4 rounded-xl mb-6">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tool atau kata kunci..."
          className="w-full bg-[#090d16] border border-gray-700/70 focus:border-sky-500 text-xs text-white pl-9 pr-4 py-2 rounded-lg outline-none transition"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-gray-900/50 text-gray-400 border-gray-800 hover:text-white hover:bg-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* View Switcher */}
      <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 p-1 rounded-lg shrink-0">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-gray-800 text-sky-400' : 'text-gray-500 hover:text-white'}`}
          title="Grid View"
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-gray-800 text-sky-400' : 'text-gray-500 hover:text-white'}`}
          title="List View"
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
