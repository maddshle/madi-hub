import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, Plus, Trash2, Edit3, Save, RefreshCw, 
  CheckCircle, AlertCircle, Key, Layers, ArrowLeft, EyeOff 
} from 'lucide-react';
import { getTools, saveTool, deleteTool, bulkInsertTools } from '../lib/storage';
import { fetchVercelProjects } from '../lib/vercelApi';

export function AdminPage({ navigateTo }) {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');

  const [tools, setTools] = useState([]);
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

  const [token, setToken] = useState(import.meta.env.VITE_VERCEL_API_TOKEN || '');
  const [teamId, setTeamId] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(null);

  const loadAllTools = async () => {
    const data = await getTools(true);
    setTools(data);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllTools();
    }
  }, [isAuthenticated]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (pin === 'madi123' || pin === 'admin') {
      setIsAuthenticated(true);
    } else {
      alert('PIN Admin Salah! (Default PIN: madi123)');
    }
  };

  const handleSubmitTool = async (e) => {
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
    loadAllTools();
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
      loadAllTools();
    }
  };

  const handleVercelSync = async (e) => {
    e.preventDefault();
    setSyncLoading(true);
    setSyncError(null);
    setSyncSuccess(null);

    try {
      const projects = await fetchVercelProjects(token, teamId || null);
      if (projects.length === 0) {
        setSyncError('Tidak ada proyek ditemukan di akun Vercel ini.');
      } else {
        await bulkInsertTools(projects);
        setSyncSuccess(`Berhasil mendeteksi & mengimpor ${projects.length} proyek dari Vercel API!`);
        loadAllTools();
      }
    } catch (err) {
      setSyncError(err.message || 'Gagal terhubung dengan Vercel REST API');
    } fontally {
      setSyncLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-[#0e1424] border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-1 font-mono">/admin Control</h2>
          <p className="text-xs text-gray-400 mb-6">Masukkan PIN untuk membuka dashboard pengelola.</p>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN Admin (Default: madi123)"
              className="w-full bg-[#090d16] border border-gray-700 text-white text-center py-2.5 px-4 rounded-lg outline-none focus:border-sky-500 font-mono text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs rounded-lg transition"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-800">
            <button
              onClick={() => navigateTo('/')}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Landing Page
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-sky-400" />
            <h1 className="text-2xl font-bold text-white font-mono">madi.hub Admin Control</h1>
          </div>
          <p className="text-xs text-gray-400 mt-1">Panel pengelola database & pengaturan auto-detect Vercel</p>
        </div>

        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs rounded-lg border border-gray-700 transition font-mono self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Buka Landing Page
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 text-xs font-mono rounded-lg border transition ${
            activeTab === 'manage'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-gray-900/50 text-gray-400 border-gray-800 hover:text-white'
          }`}
        >
          Kelola Tools ({tools.length})
        </button>
        <button
          onClick={() => setActiveTab('vercel')}
          className={`px-4 py-2 text-xs font-mono rounded-lg border transition flex items-center gap-2 ${
            activeTab === 'vercel'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-gray-900/50 text-gray-400 border-gray-800 hover:text-white'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Pengaturan Auto-Detect Vercel
        </button>
      </div>

      {activeTab === 'manage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmitTool} className="bg-[#0e1424] border border-gray-800 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <h3 className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
                  {editingTool ? 'Edit Detail Tool' : 'Tambah Tool Baru'}
                </h3>
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

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Judul Tool *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="misal: hue-helper"
                  className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                >
                  <option value="Utility">Utility</option>
                  <option value="Web App">Web App</option>
                  <option value="API">API</option>
                  <option value="Bot">Bot</option>
                  <option value="Experiment">Experiment</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">URL App (Vercel) *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={e => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://app-name.vercel.app"
                  className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
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
                  className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  placeholder="Penjelasan fungsi..."
                  className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Tags (pisahkan koma)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, tailwind, vite"
                  className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded outline-none focus:border-sky-500"
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
                  Featured
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
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Daftar Tools Terdaftar ({tools.length})
            </h3>
            {tools.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-[#0e1424] border border-gray-800 rounded-xl text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{t.title}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-gray-900 text-sky-400 rounded border border-gray-800">
                      {t.category}
                    </span>
                    {!t.is_visible && (
                      <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded flex items-center gap-1">
                        <EyeOff className="w-3 h-3" /> Tersembunyi
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-[11px] truncate max-w-sm mt-1">{t.url}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(t)}
                    className="p-2 text-gray-400 hover:text-sky-400 hover:bg-gray-800 rounded-lg transition"
                    title="Edit Tool"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 text-gray-400 hover:text-rose-400 hover:bg-gray-800 rounded-lg transition"
                    title="Hapus Tool"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vercel' && (
        <div className="max-w-2xl bg-[#0e1424] border border-gray-800 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-base font-semibold text-white font-mono flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-sky-400" /> Vercel Auto-Detection Setup
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Konfigurasi ini hanya dapat diakses di panel Admin. Masukkan Vercel Personal Access Token Anda untuk memindai seluruh proyek Vercel secara otomatis dan mengimpornya ke database.
            </p>
          </div>

          <form onSubmit={handleVercelSync} className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-sky-400" /> Vercel Personal Access Token *
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="vercel_token_..."
                className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2.5 rounded-lg outline-none focus:border-sky-500 font-mono"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">Dapatkan token dari Dashboard Vercel &gt; Account Settings &gt; Tokens.</p>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-gray-400 mb-1">
                Vercel Team ID (Opsional)
              </label>
              <input
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="team_..."
                className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2.5 rounded-lg outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {syncError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{syncError}</span>
              </div>
            )}

            {syncSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{syncSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={syncLoading}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2"
            >
              {syncLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Jalankan Auto-Detect Proyek Vercel</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
