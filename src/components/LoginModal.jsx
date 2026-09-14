import { useState } from 'react'
import { User, GraduationCap, Eye, ArrowRight, Lock } from 'lucide-react'
import { sfx } from '../lib/sounds'

const KELOMPOK_OPTIONS = ['Kelompok Kucing', 'Kelompok Kelinci', 'Kelompok Burung', 'Kelompok Ikan']
const TEACHER_PIN = import.meta.env.VITE_TEACHER_PIN || '2024'

const TABS = [
  { id: 'student', label: 'Siswa', icon: User, color: 'leaf' },
  { id: 'teacher', label: 'Guru', icon: GraduationCap, color: 'sky' },
  { id: 'guest', label: 'Pengunjung', icon: Eye, color: 'sun' },
]

export default function LoginModal({ onLogin }) {
  const [tab, setTab] = useState('student')
  const [name, setName] = useState('')
  const [kelompok, setKelompok] = useState(KELOMPOK_OPTIONS[0])
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  function handleStudentSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    sfx.correct()
    onLogin({ role: 'student', name: name.trim(), kelompok })
  }

  function handleTeacherSubmit(e) {
    e.preventDefault()
    if (pin === TEACHER_PIN) {
      sfx.correct()
      setPinError('')
      onLogin({ role: 'teacher', name: 'Guru' })
    } else {
      sfx.incorrect()
      setPinError('PIN salah. Coba lagi, ya!')
    }
  }

  function handleGuestSubmit() {
    sfx.correct()
    onLogin({ role: 'guest', name: 'Pengunjung' })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-pop">
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-floaty">🧱</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-ink leading-tight">
            Petualangan
            <br />
            Pengelompokan 5
          </h1>
          <p className="text-ink/60 font-semibold mt-1">Ayo belajar berhitung sambil bermain!</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-blob shadow-pop p-5 sm:p-7 border-4 border-white">
          <div className="grid grid-cols-3 gap-2 mb-6">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  sfx.click()
                  setTab(id)
                }}
                className={`btn-pop flex flex-col items-center gap-1 py-3 rounded-2xl font-display font-bold text-sm transition-colors ${
                  tab === id
                    ? 'bg-sky text-white shadow-popSmall'
                    : 'bg-cloud text-ink/50 hover:text-ink/80'
                }`}
              >
                <Icon size={22} />
                {label}
              </button>
            ))}
          </div>

          {tab === 'student' && (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-sm mb-1.5 text-ink/70">Nama Lengkap</label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tulis namamu di sini..."
                  className="w-full rounded-2xl border-2 border-sky-light px-4 py-3 font-body font-semibold text-lg focus:border-sky-deep outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-sm mb-1.5 text-ink/70">Pilih Kelompok</label>
                <select
                  value={kelompok}
                  onChange={(e) => setKelompok(e.target.value)}
                  className="w-full rounded-2xl border-2 border-sky-light px-4 py-3 font-body font-semibold text-lg outline-none focus:border-sky-deep bg-white"
                >
                  {KELOMPOK_OPTIONS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!name.trim()}
                className="btn-pop w-full flex items-center justify-center gap-2 bg-leaf text-white font-display font-bold text-lg py-3.5 rounded-2xl shadow-pop disabled:opacity-40 disabled:shadow-none"
              >
                Mulai Bermain <ArrowRight size={20} />
              </button>
            </form>
          )}

          {tab === 'teacher' && (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-sm mb-1.5 text-ink/70 flex items-center gap-1.5">
                  <Lock size={14} /> PIN Guru
                </label>
                <input
                  autoFocus
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value)
                    setPinError('')
                  }}
                  placeholder="••••"
                  className="w-full rounded-2xl border-2 border-sky-light px-4 py-3 font-body font-semibold text-lg tracking-widest outline-none focus:border-sky-deep"
                />
                {pinError && <p className="text-coral-dark text-sm font-semibold mt-1">{pinError}</p>}
              </div>
              <button
                type="submit"
                className="btn-pop w-full flex items-center justify-center gap-2 bg-sky-deep text-white font-display font-bold text-lg py-3.5 rounded-2xl shadow-pop"
              >
                Masuk Dashboard <ArrowRight size={20} />
              </button>
            </form>
          )}

          {tab === 'guest' && (
            <div className="space-y-4 text-center">
              <p className="text-ink/60 font-semibold">
                Coba simulasi 4 level permainan (mode demo) dan lihat rekap nilai siswa tanpa perlu masuk.
              </p>
              <button
                onClick={handleGuestSubmit}
                className="btn-pop w-full flex items-center justify-center gap-2 bg-sun text-ink font-display font-bold text-lg py-3.5 rounded-2xl shadow-pop"
              >
                Masuk sebagai Pengunjung/Tamu <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
