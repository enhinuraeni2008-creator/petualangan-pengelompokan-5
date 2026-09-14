import { supabase, isSupabaseConfigured } from './supabaseClient'

const LOCAL_KEY = 'ppg5_local_scores'
const LOCAL_STUDENTS_KEY = 'ppg5_local_students'

function readLocal(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export async function registerStudent(name) {
  const trimmed = name.trim()
  if (!trimmed) throw new Error('Nama tidak boleh kosong')

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('students')
      .upsert({ student_name: trimmed }, { onConflict: 'student_name' })
    if (error && error.code !== '23505') {
      console.warn('[scoreService] upsert student gagal', error)
    }
  } else {
    const list = readLocal(LOCAL_STUDENTS_KEY)
    if (!list.includes(trimmed)) {
      list.push(trimmed)
      writeLocal(LOCAL_STUDENTS_KEY, list)
    }
  }
  return trimmed
}

export async function submitScore({ student_name, level_completed, score, stars_earned, time_spent_seconds }) {
  const row = {
    student_name,
    level_completed,
    score,
    stars_earned,
    time_spent_seconds,
  }

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('student_scores').insert(row)
    if (error) console.warn('[scoreService] gagal menyimpan skor ke Supabase', error)
    return
  }

  const list = readLocal(LOCAL_KEY)
  list.push({ ...row, id: crypto.randomUUID(), completed_at: new Date().toISOString() })
  writeLocal(LOCAL_KEY, list)
}

export async function fetchAllScores() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('student_scores')
      .select('*')
      .order('completed_at', { ascending: false })
    if (!error && data) return data
    console.warn('[scoreService] gagal mengambil skor dari Supabase', error)
    return []
  }
  return readLocal(LOCAL_KEY).sort(
    (a, b) => new Date(b.completed_at) - new Date(a.completed_at)
  )
}

export async function resetStudentScores(studentName) {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('student_scores')
      .delete()
      .eq('student_name', studentName)
    if (error) console.warn('[scoreService] gagal reset skor', error)
    return
  }
  const list = readLocal(LOCAL_KEY).filter((r) => r.student_name !== studentName)
  writeLocal(LOCAL_KEY, list)
}

export async function resetAllScores() {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('student_scores')
      .delete()
      .neq('student_name', '__never__')
    if (error) console.warn('[scoreService] gagal reset semua skor', error)
    return
  }
  writeLocal(LOCAL_KEY, [])
}
