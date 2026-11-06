# madi.hub 🚀

Hub showcase modern untuk menampilkan aplikasi & tools yang terdeploy di Vercel, dilengkapi dengan integrasi database Supabase dan otomatisasi Vercel API.

## Fitur Utama

- **Live Auto-Discovery Vercel**: Deteksi dan impor otomatis proyek dari akun/team Vercel via Vercel REST API.
- **Database Dual-Layer**: Mendukung Supabase dengan fallback otomatis ke `localStorage` jika kredensial belum disetel.
- **Admin Management Panel**: Dashboard terlindungi PIN/password untuk menambah, mengedit, menyembunyikan, dan memprioritaskan tools.
- **Kategori & Pencarian Real-Time**: Filtering cepat berdasarkan kategori, kata kunci, serta penanda status deployment.
- **Anti AI-Slop Code Standard**: Arsitektur bersih, bebas boilerplate berlebihan, dan komentar teknis efisien.

## Cara Install & Jalankan Lokal

1. Clone / extract repositori ini.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Salin `.env.example` ke `.env` dan isi kredensial Supabase Anda.
4. Jalankan server pengembang:
   ```bash
   npm run dev
   ```

## Setup Database Supabase

Jalankan script SQL di file `supabase/schema.sql` pada Query Editor dashboard Supabase Anda.

## Deploy ke Vercel

1. Push repositori ke GitHub / GitLab.
2. Import ke Vercel.
3. Tambahkan Environment Variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` di Dashboard Vercel.
4. Deploy!
