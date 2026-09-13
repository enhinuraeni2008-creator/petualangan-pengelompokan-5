# 🧱 Petualangan Pengelompokan 5

Game matematika interaktif untuk siswa **Kelas 1 SD** (usia 6–7 tahun) yang mengajarkan konsep pengelompokan/penjumlahan dasar (basis 5 & 1) lewat 4 level permainan, dengan Dashboard Monitoring untuk Guru dan mode Pengunjung/Tamu.

Dibangun sesuai PRD v2.0 dengan **Rp 0,- biaya infrastruktur**:
React (Vite) + Tailwind CSS + Lucide React + Web Audio API di frontend, Supabase (Postgres + RLS) sebagai backend, dan Netlify sebagai hosting — semuanya di tier gratis.

## ✨ Fitur

- **3 Peran Pengguna:** Siswa (login nama + kelompok, tanpa password), Guru (login PIN), Pengunjung/Tamu (read-only).
- **4 Level Permainan**, masing-masing 10 soal acak & tidak berulang per sesi:
  1. **Hitung & Isi Angka Balok** — pilih angka yang tepat dari balok kuning (5) + merah (1) & ilustrasi jari.
  2. **Pasangkan Balok dengan Hewan** — cocokkan jumlah hewan dengan kombinasi balok yang benar.
  3. **Tebak Balon Kata & Jari** — cocokkan visual balok dengan jumlah jari tangan yang tepat.
  4. **Rakit Balokmu Sendiri!** — tarik/ketuk balok kuning & merah untuk menyusun angka target.
- **Sertifikat digital** yang bisa diunduh (PNG) setelah menyelesaikan 4 level.
- **Dashboard Guru**: rekap real-time, filter & cari nama siswa, export CSV, reset skor.
- **Dashboard Pengunjung**: tampilan sama tapi tombol reset dinonaktifkan (read-only), plus ringkasan statistik.
- Semua suara dibuat langsung oleh **Web Audio API** (tanpa file audio) dan ikon dari **Lucide React** (SVG) — hemat kuota Storage Supabase.
- Responsif untuk laptop, tablet, dan smartphone (Windows/macOS/Chromebook/iPadOS/Android/iOS).
- Tetap bisa dicoba secara lokal (mode demo, skor tersimpan di `localStorage`) meski `.env` Supabase belum diisi.

## 📁 Struktur Berkas

```
├── src/
│   ├── lib/
│   │   ├── supabaseClient.js   (Konfigurasi client Supabase)
│   │   ├── questionBank.js     (Ambil soal dari Supabase / generator lokal fallback)
│   │   ├── scoreService.js     (Simpan/ambil skor siswa)
│   │   └── sounds.js           (Efek suara via Web Audio API)
│   ├── components/
│   │   ├── LoginModal.jsx        (Login Siswa, Guru, & Pengunjung)
│   │   ├── TeacherDashboard.jsx  (Dashboard Hasil Siswa untuk Guru/Tamu)
│   │   ├── Level1.jsx … Level4.jsx
│   │   ├── BlockVisual.jsx       (Komponen Vektor Balok & Jari)
│   │   └── Certificate.jsx       (Sertifikat Kelulusan Digital)
│   ├── App.jsx
│   └── main.jsx
├── sql/
│   ├── schema.sql               (Buat tabel + RLS di Supabase)
│   └── seed_questions.sql       (Isi 40 soal: 10 soal x 4 level)
├── .env.example
└── package.json
```

## 🚀 Menjalankan secara lokal

```bash
npm install
cp .env.example .env   # lalu isi VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
npm run dev
```

Buka `http://localhost:5173`. Jika `.env` belum diisi, aplikasi tetap berjalan dalam **mode demo lokal** (skor disimpan di `localStorage` browser, bukan di Supabase) sehingga Anda tetap bisa mencoba seluruh alur permainan.

## 🗄️ Setup Database Supabase (Gratis)

1. Buat project baru di [supabase.com](https://supabase.com) (Free Tier).
2. Buka **SQL Editor** → jalankan isi `sql/schema.sql` (membuat tabel `students`, `questions`, `student_scores` + Row Level Security).
3. Jalankan isi `sql/seed_questions.sql` untuk mengisi 40 soal (10 soal × 4 level). Anda bebas mengganti/menambah soal langsung lewat **Table Editor**.
4. Buka **Project Settings → API**, salin `Project URL` dan `anon public key` ke file `.env`:
   ```
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_TEACHER_PIN=2024
   ```

> **Catatan keamanan:** Login Guru pada aplikasi ini memakai PIN sederhana yang dicek di sisi klien (`VITE_TEACHER_PIN`) agar sesuai kebutuhan PRD ("kata sandi sederhana"). Kebijakan RLS publik pada `student_scores` mengizinkan DELETE agar fitur reset guru berfungsi tanpa Supabase Auth penuh. Untuk deployment ke sekolah dengan kebutuhan keamanan lebih tinggi, pertimbangkan mengganti login guru dengan **Supabase Auth** dan mempersempit policy RLS sesuai `auth.uid()`.

## ☁️ Deploy Gratis ke Netlify

1. Push seluruh folder proyek ini ke repositori **GitHub**.
2. Login ke [Netlify](https://netlify.com) → **Add new site → Import an existing project** → pilih repo GitHub Anda.
3. Build command: `npm run build`, Publish directory: `dist` (Netlify otomatis mendeteksi ini dari Vite).
4. Tambahkan **Environment Variables** di Netlify (Site settings → Environment variables):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_TEACHER_PIN`
5. Klik **Deploy Site**. Dalam waktu kurang dari 2 menit, game sudah tayang publik dan siap dimainkan serentak oleh ±30 siswa di kelas menggunakan HP, tablet, maupun laptop — dengan **total biaya Rp 0,-**.

## 🎮 Cara Bermain (Siswa)

1. Buka aplikasi → pilih tab **Siswa** → isi nama lengkap → pilih kelompok → **Mulai Bermain**.
2. Pilih salah satu dari 4 level di peta petualangan.
3. Jawab 10 soal per level; skor dan bintang (⭐1–3) langsung tersimpan.
4. Setelah 4 level selesai, tombol **Lihat Sertifikat Kelulusanmu** muncul — unduh sertifikat PNG untuk dibagikan/dicetak.

## 👩‍🏫 Cara Menggunakan Dashboard (Guru/Pengunjung)

- **Guru:** tab **Guru** → masukkan PIN (default `2024`, ubah lewat `VITE_TEACHER_PIN`) → lihat rekap real-time, filter per level, cari nama siswa, export ke CSV, dan reset skor per siswa atau semua siswa.
- **Pengunjung/Tamu:** tab **Pengunjung** → langsung masuk tanpa kredensial → bisa mencoba simulasi 4 level (mode demo) dan melihat dashboard rekap yang sama, namun tombol reset dinonaktifkan.

---

Dibuat mengikuti **PRD v2.0 — Petualangan Pengelompokan 5**.
