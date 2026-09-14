import { supabase, isSupabaseConfigured } from './supabaseClient'

export const ANIMALS = [
  { type: 'ikan', emoji: '🐟', label: 'Ikan' },
  { type: 'kucing', emoji: '🐱', label: 'Kucing' },
  { type: 'kelinci', emoji: '🐰', label: 'Kelinci' },
  { type: 'burung', emoji: '🐦', label: 'Burung' },
  { type: 'bebek', emoji: '🦆', label: 'Bebek' },
  { type: 'kupu-kupu', emoji: '🦋', label: 'Kupu-kupu' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestion(level, order, target) {
  const hand_left = target > 5 ? 5 : 0
  const hand_right = target > 5 ? target - 5 : target
  const yellow_blocks = hand_left / 5
  const red_blocks = hand_right
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return {
    id: `local-${level}-${order}`,
    level_id: level,
    question_order: order,
    target_number: target,
    yellow_blocks,
    red_blocks,
    hand_left,
    hand_right,
    animal_type: animal.type,
    correct_answer: String(target),
  }
}

// Menghasilkan 10 soal acak & tidak berulang (angka 1-10) untuk satu level.
export function generateLocalQuestions(level) {
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  return numbers.map((n, i) => buildQuestion(level, i + 1, n))
}

export async function fetchQuestions(level) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('level_id', level)
        .order('question_order', { ascending: true })

      if (!error && data && data.length >= 10) {
        return shuffle(data).slice(0, 10)
      }
    } catch (err) {
      console.warn('[questionBank] Gagal mengambil soal dari Supabase, memakai soal lokal.', err)
    }
  }
  return generateLocalQuestions(level)
}

export function animalMeta(type) {
  return ANIMALS.find((a) => a.type === type) || ANIMALS[0]
}
