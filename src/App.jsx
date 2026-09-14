import { useEffect, useState } from 'react'
import { Star, Play, Award, PartyPopper } from 'lucide-react'
import LoginModal from './components/LoginModal'
import TeacherDashboard from './components/TeacherDashboard'
import Level1 from './components/Level1'
import Level2 from './components/Level2'
import Level3 from './components/Level3'
import Level4 from './components/Level4'
import Certificate from './components/Certificate'
import { registerStudent, submitScore } from './lib/scoreService'
import { sfx } from './lib/sounds'

const LEVEL_META = [
  { id: 1, title: 'Hitung & Isi Angka Balok', color: 'leaf', emoji: '🧱' },
  { id: 2, title: 'Pasangkan Balok dengan Hewan', color: 'sky', emoji: '🐾' },
  { id: 3, title: 'Tebak Balon Kata & Jari', color: 'sun', emoji: '✋' },
  { id: 4, title: 'Rakit Balokmu Sendiri!', color: 'coral', emoji: '🏗️' },
]

const LEVEL_COMPONENTS = { 1: Level1, 2: Level2, 3: Level3, 4: Level4 }

export default function App() {
  const [session, setSession] = useState(null) // { role, name, kelompok }
  const [view, setView] = useState('map') // 'map' | number(level) | 'certificate'
  const [results, setResults] = useState({}) // { [levelId]: {score, starsEarned, correctCount} }
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const saved = sessionStorage.getItem('ppg5_session')
    if (saved) {
      try {
        setSession(JSON.parse(saved))
      } catch {
        /* ignore */
      }
    }
  }, [])

  async function handleLogin(data) {
    if (data.role === 'student') {
      await registerStudent(data.name)
    }
    setSession(data)
    setResults({})
    setView('map')
    sessionStorage.setItem('ppg5_session', JSON.stringify(data))
  }

  function handleLogout() {
    setSession(null)
    setResults({})
    setView('map')
    sessionStorage.removeItem('ppg5_session')
  }

  async function handleLevelComplete(levelId, result) {
    setResults((prev) => ({ ...prev, [levelId]: result }))
    sfx.levelUp()
    if (session.role === 'student') {
      await submitScore({
        student_name: session.name,
        level_completed: levelId,
        score: result.score,
        stars_earned: result.starsEarned,
        time_spent_seconds: result.timeSpentSeconds,
      })
    }
    setToast({ levelId, ...result })
    setView('map')
    setTimeout(() => setToast(null), 3200)
  }

  if (!session) {
    return <LoginModal onLogin={handleLogin} />
  }

  if (session.role === 'teacher' || session.role === 'guest') {
    return <TeacherDashboard role={session.role} onLogout={handleLogout} />
  }

  // ----- Alur Siswa / Tamu bermain -----
  if (typeof view === 'number') {
    const LevelComponent = LEVEL_COMPONENTS[view]
    return (
      <LevelComponent
        onExit={() => setView('map')}
        onComplete={(result) => handleLevelComplete(view, result)}
      />
    )
  }

  if (view === 'certificate') {
    const totalScore = Object.values(results).reduce((s, r) => s + r.score, 0)
    const totalStars = Object.values(results).reduce((s, r) => s + r.starsEarned, 0)
    return (
      <Certificate
        studentName={session.name}
        totalScore={totalScore}
        totalStars={totalStars}
        onRestart={() => setView('map')}
      />
    )
  }

  const completedCount = Object.keys(results).length
  const allDone = completedCount === 4

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-ink/50 font-bold text-sm">Halo,</p>
            <h1 className="font-display font-extrabold text-2xl text-ink">{session.name} 👋</h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-pop bg-white border-2 border-sky-light font-display font-bold px-4 py-2 rounded-2xl text-ink/60 text-sm shadow-popSmall"
          >
            Keluar
          </button>
        </div>

        <div className="grid gap-4">
          {LEVEL_META.map((lvl) => {
            const result = results[lvl.id]
            const colorClasses = {
              leaf: 'bg-leaf-light border-leaf',
              sky: 'bg-sky-light border-sky-deep',
              sun: 'bg-sun-light border-sun-dark',
              coral: 'bg-coral-light border-coral',
            }[lvl.color]
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  sfx.click()
                  setView(lvl.id)
                }}
                className={`btn-pop w-full flex items-center gap-4 rounded-3xl border-4 p-4 shadow-pop text-left ${colorClasses}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shrink-0">
                  {lvl.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-display font-extrabold text-lg text-ink">
                    Level {lvl.id} · {lvl.title}
                  </p>
                  {result ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3].map((i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i <= result.starsEarned ? 'fill-sun-dark text-sun-dark' : 'text-ink/20'}
                          />
                        ))}
                      </div>
                      <span className="text-ink/50 font-bold text-xs">Skor {result.score}</span>
                    </div>
                  ) : (
                    <p className="text-ink/50 font-semibold text-sm mt-0.5">10 soal · Sentuh untuk mulai</p>
                  )}
                </div>
                <Play className="shrink-0 text-ink/40" size={22} />
              </button>
            )
          })}
        </div>

        {allDone && (
          <button
            onClick={() => {
              sfx.star()
              setView('certificate')
            }}
            className="btn-pop w-full mt-6 flex items-center justify-center gap-2 bg-ink text-white font-display font-extrabold text-lg py-4 rounded-3xl shadow-pop animate-wiggle"
          >
            <Award size={22} /> Lihat Sertifikat Kelulusanmu!
          </button>
        )}

        {!allDone && (
          <p className="text-center text-ink/40 font-semibold text-sm mt-6">
            Selesaikan ke-4 level untuk membuka sertifikat digitalmu ✨
          </p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-pop border-4 border-leaf px-6 py-4 flex items-center gap-3 animate-pop z-50 max-w-[90vw]">
          <PartyPopper className="text-leaf-dark shrink-0" size={28} />
          <div>
            <p className="font-display font-bold text-ink">Level {toast.levelId} selesai!</p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Star key={i} size={14} className={i <= toast.starsEarned ? 'fill-sun-dark text-sun-dark' : 'text-ink/20'} />
                ))}
              </div>
              <span className="text-ink/50 font-bold text-xs">Skor {toast.score}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
