-- Seed 40 soal (10 soal x 4 level) untuk tabel public.questions
-- Jalankan setelah schema.sql. Aman dijalankan berulang (ON CONFLICT DO NOTHING
-- tidak digunakan karena tabel tidak punya unique constraint komposit;
-- jika ingin re-seed bersih, TRUNCATE dulu: TRUNCATE public.questions;

INSERT INTO public.questions
  (level_id, question_order, target_number, yellow_blocks, red_blocks, hand_left, hand_right, animal_type, correct_answer)
VALUES
(1, 1, 1, 0, 1, 0, 1, 'kucing', '1'),
(1, 2, 2, 0, 2, 0, 2, 'kelinci', '2'),
(1, 3, 3, 0, 3, 0, 3, 'burung', '3'),
(1, 4, 4, 0, 4, 0, 4, 'bebek', '4'),
(1, 5, 5, 0, 5, 0, 5, 'kupu-kupu', '5'),
(1, 6, 6, 1, 1, 5, 1, 'ikan', '6'),
(1, 7, 7, 1, 2, 5, 2, 'kucing', '7'),
(1, 8, 8, 1, 3, 5, 3, 'kelinci', '8'),
(1, 9, 9, 1, 4, 5, 4, 'burung', '9'),
(1, 10, 10, 1, 5, 5, 5, 'bebek', '10'),
(2, 1, 1, 0, 1, 0, 1, 'kelinci', '1'),
(2, 2, 2, 0, 2, 0, 2, 'burung', '2'),
(2, 3, 3, 0, 3, 0, 3, 'bebek', '3'),
(2, 4, 4, 0, 4, 0, 4, 'kupu-kupu', '4'),
(2, 5, 5, 0, 5, 0, 5, 'ikan', '5'),
(2, 6, 6, 1, 1, 5, 1, 'kucing', '6'),
(2, 7, 7, 1, 2, 5, 2, 'kelinci', '7'),
(2, 8, 8, 1, 3, 5, 3, 'burung', '8'),
(2, 9, 9, 1, 4, 5, 4, 'bebek', '9'),
(2, 10, 10, 1, 5, 5, 5, 'kupu-kupu', '10'),
(3, 1, 1, 0, 1, 0, 1, 'burung', '1'),
(3, 2, 2, 0, 2, 0, 2, 'bebek', '2'),
(3, 3, 3, 0, 3, 0, 3, 'kupu-kupu', '3'),
(3, 4, 4, 0, 4, 0, 4, 'ikan', '4'),
(3, 5, 5, 0, 5, 0, 5, 'kucing', '5'),
(3, 6, 6, 1, 1, 5, 1, 'kelinci', '6'),
(3, 7, 7, 1, 2, 5, 2, 'burung', '7'),
(3, 8, 8, 1, 3, 5, 3, 'bebek', '8'),
(3, 9, 9, 1, 4, 5, 4, 'kupu-kupu', '9'),
(3, 10, 10, 1, 5, 5, 5, 'ikan', '10'),
(4, 1, 1, 0, 1, 0, 1, 'bebek', '1'),
(4, 2, 2, 0, 2, 0, 2, 'kupu-kupu', '2'),
(4, 3, 3, 0, 3, 0, 3, 'ikan', '3'),
(4, 4, 4, 0, 4, 0, 4, 'kucing', '4'),
(4, 5, 5, 0, 5, 0, 5, 'kelinci', '5'),
(4, 6, 6, 1, 1, 5, 1, 'burung', '6'),
(4, 7, 7, 1, 2, 5, 2, 'bebek', '7'),
(4, 8, 8, 1, 3, 5, 3, 'kupu-kupu', '8'),
(4, 9, 9, 1, 4, 5, 4, 'ikan', '9'),
(4, 10, 10, 1, 5, 5, 5, 'kucing', '10');

