import React, { useState } from 'react';
import { X, Plus, Trash2, Edit3, Save, Lock, ShieldCheck, Database } from 'lucide-react';
import { saveTool, deleteTool } from '../lib/storage';

export function AdminModal({ isOpen, onClose, tools, onRefresh }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingTool, setEditingTool] = useState(null);

  const initialFormState = {
    title: '',
    description: '',
    url: '',
    github_url: '',
    category: 'Utility',
    tags: '',
    is_featured: false,
    is_visible: true
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleAuth = (e) => {
    e.preventDefault();
    if (pin === 'madi123' || pin === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('PIN Admin Salah! (Default PIN: madi123)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      alert('Judul dan URL wajib diisi.');
      return;
    }

    const payload = {
      ...formData,
      id: editingTool?.id,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
    };

    await saveTool(payload);
    setEditingTool(null);
    setFormData(initialFormState);
    onRefresh();
  };

  const handleEditClick = (tool) => {
    setEditingTool(tool);
    setFormData({
      ...tool,
      tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : ''
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Hapus tool ini dari database?')) {
      await deleteTool(id);
      onRefresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-gray-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#090d16]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-white font-mono">madi.hub Admin Control</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          <form onSubmit={handleAuth} className="p-8 text-center max-w-sm mx-auto w-full">
            <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Autentikasi Admin</h3>
            <p className="text-xs text-gray-400 mb-5">Masukkan PIN pengelola untuk mengakses database tools.</p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN Admin (Default: madi123)"
              className="w-full bg-[#090d16] border border-gray-700 text-white text-center py-2 px-4 rounded-lg outline-none focus:border-sky-500 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm rounded-lg transition"
            >
              Masuk Dashboard
            </button>
          </form>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Form Editor */}
            <form onSubmit={handleSubmit} className="bg-[#090d16] border border-gray-800 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
                  {editingTool ? 'Edit Tool' : 'Tambah Tool Baru'}
                </h4>
                {editingTool && (
                  <button
                    type="button"
                    onClick={() => { setEditingTool(null); setFormData(initialFormState); }}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Batal Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Judul Tool *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="misal: hue-helper"
                    className="w-full bg-[#0e1424] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-gray-400 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0e1424] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                  >
                    <option value="Utility">Utility</option>
                    <option value="Web App">Web App</option>
                    <option value="API">API</option>
                    <option value="Bot">Bot</option>
                    <option value="Experiment">Experiment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">URL App (Vercel) *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://app-name.vercel.app"
                  className="w-full bg-[#0e1424] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">GitHub Repo URL (Opsional)</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                  placeholder="https://github.com/user/repo"
                  className="w-full bg-[#0e1424] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  placeholder="Penjelasan fungsi tool..."
                  className="w-full bg-[#0e1424] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Tags (pisahkan koma)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, tailwind, vite"
                  className="w-full bg-[#0e1424] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="accent-sky-500 rounded"
                  />
                  Featured Tool
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={e => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="accent-sky-500 rounded"
                  />
                  Tampilkan di Landing Page
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingTool ? 'Simpan Perubahan' : 'Tambah Tool'}</span>
              </button>
            </form>

            {/* Existing List */}
            <div>
              <h4 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Daftar Tools Terdaftar ({tools.length})
              </h4>
              <div className="space-y-2">
                {tools.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-[#090d16] border border-gray-800 rounded-lg text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{t.title}</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 text-gray-400 rounded">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-gray-400 text-[11px] truncate max-w-xs">{t.url}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="p-1.5 text-gray-400 hover:text-sky-400 hover:bg-gray-800 rounded"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
