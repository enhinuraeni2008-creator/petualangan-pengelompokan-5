-- =========================================================
-- Petualangan Pengelompokan 5 — Setup Database Supabase
-- Salin & jalankan seluruh script ini di SQL Editor Supabase.
-- Catatan: "TIMESTAMP WITH TIMEZONE" pada draf PRD diperbaiki
-- menjadi "TIMESTAMPTZ" (nama tipe yang benar di PostgreSQL).
-- =========================================================

-- 1. Tabel Master Data Siswa
CREATE TABLE IF NOT EXISTS public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Bank Soal 4 Level
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level_id INT NOT NULL,               -- Level 1 s.d. 4
    question_order INT NOT NULL,         -- Soal 1 s.d. 10 per level
    target_number INT NOT NULL,
    yellow_blocks INT DEFAULT 0,         -- Nilai 5
    red_blocks INT DEFAULT 0,            -- Nilai 1
    hand_left INT DEFAULT 0,             -- 0 atau 5
    hand_right INT DEFAULT 0,            -- 0 s.d. 5
    animal_type VARCHAR(50),             -- ikan, kucing, kelinci, burung, dll.
    correct_answer VARCHAR(50) NOT NULL
);

-- 3. Tabel Skor & Progres Siswa (Dapat diakses Guru & Tamu)
CREATE TABLE IF NOT EXISTS public.student_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    level_completed INT NOT NULL,
    score INT NOT NULL,
    stars_earned INT CHECK (stars_earned BETWEEN 1 AND 3),
    time_spent_seconds INT DEFAULT 0,    -- Durasi pengerjaan
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) - Akses Gratis Publik Tanpa Login Rumit
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_scores ENABLE ROW LEVEL SECURITY;

-- Policy Publik (Read & Insert)
CREATE POLICY "Public Read Students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Public Insert Students" ON public.students FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public Read Scores" ON public.student_scores FOR SELECT USING (true);
CREATE POLICY "Public Insert Scores" ON public.student_scores FOR INSERT WITH CHECK (true);

-- Policy tambahan (dibutuhkan aplikasi ini): guru perlu bisa menghapus/reset skor.
-- Karena login guru bukan Supabase Auth (hanya PIN di sisi klien), policy publik
-- dipakai juga untuk DELETE/UPSERT agar fitur reset & upsert nama siswa berjalan.
-- Untuk keamanan produksi yang lebih ketat, pertimbangkan memindahkan aksi ini
-- ke Supabase Edge Function yang memvalidasi PIN guru di sisi server.
CREATE POLICY "Public Delete Scores" ON public.student_scores FOR DELETE USING (true);
CREATE POLICY "Public Upsert Students" ON public.students FOR UPDATE USING (true);

-- Setelah menjalankan file ini, lanjutkan dengan seed_questions.sql
-- untuk mengisi 40 soal (10 soal x 4 level).
