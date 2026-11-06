import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle, AlertCircle, Key, Layers } from 'lucide-react';
import { fetchVercelProjects } from '../lib/vercelApi';
import { bulkInsertTools } from '../lib/storage';

export function VercelSyncModal({ isOpen, onClose, onSynced }) {
  const [token, setToken] = useState(import.meta.env.VITE_VERCEL_API_TOKEN || '');
  const [teamId, setTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importedCount, setImportedCount] = useState(null);

  if (!isOpen) return null;

  const handleSync = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImportedCount(null);

    try {
      const projects = await fetchVercelProjects(token, teamId || null);
      if (projects.length === 0) {
        setError('Tidak ada proyek ditemukan di akun Vercel ini.');
      } else {
        await bulkInsertTools(projects);
        setImportedCount(projects.length);
        onSynced();
      }
    } catch (err) {
      setError(err.message || 'Gagal menyinkronkan dengan Vercel API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0e1424] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-[#090d16]">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-semibold text-white font-mono">Auto-Detect Vercel Tools</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSync} className="p-6 space-y-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            Masukkan Vercel Personal Access Token Anda untuk secara otomatis memindai dan mendeteksi semua deployment proyek Vercel Anda.
          </p>

          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-1 flex items-center gap-1">
              <Key className="w-3 h-3 text-sky-400" /> Vercel Access Token *
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="vercel_token_..."
              className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded-lg outline-none focus:border-sky-500 font-mono"
              required
            />
            <p className="text-[10px] text-gray-500 mt-1">Dapat dibuat di Dashboard Vercel &gt; Account Settings &gt; Tokens.</p>
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
              className="w-full bg-[#090d16] border border-gray-700 text-xs text-white px-3 py-2 rounded-lg outline-none focus:border-sky-500 font-mono"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {importedCount !== null && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Berhasil mendeteksi & mengimpor {importedCount} proyek Vercel!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Layers className="w-4 h-4" />
                <span>Pindai Proyek Vercel Sekarang</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
