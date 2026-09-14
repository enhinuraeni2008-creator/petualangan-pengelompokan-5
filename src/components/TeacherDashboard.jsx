import { useEffect, useMemo, useState } from 'react'
import { Search, RotateCcw, Download, LogOut, Star, Users, Trophy, Clock, ShieldAlert } from 'lucide-react'
import { fetchAllScores, resetStudentScores, resetAllScores } from '../lib/scoreService'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { sfx } from '../lib/sounds'

export default function TeacherDashboard({ role, onLogout }) {
  const isTeacher = role === 'teacher'
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [confirmReset, setConfirmReset] = useState(null) // studentName | 'ALL' | null

  async function load() {
    setLoading(true)
    const data = await fetchAllScores()
    setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchName = r.student_name.toLowerCase().includes(search.toLowerCase())
      const matchLevel = levelFilter === 'all' || String(r.level_completed) === levelFilter
      return matchName && matchLevel
    })
  }, [rows, search, levelFilter])

  const stats = useMemo(() => {
    const uniqueStudents = new Set(rows.map((r) => r.student_name))
    const avgScore = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0
    const totalStars = rows.reduce((s, r) => s + (r.stars_earned || 0), 0)
    return { totalStudents: uniqueStudents.size, avgScore, totalStars }
  }, [rows])

  async function handleResetStudent(name) {
    sfx.click()
    await resetStudentScores(name)
    setConfirmReset(null)
    load()
  }

  async function handleResetAll() {
    sfx.click()
    await resetAllScores()
    setConfirmReset(null)
    load()
  }

  function exportCSV() {
    const header = ['Nama Siswa', 'Level', 'Skor', 'Bintang', 'Waktu (detik)', 'Selesai Pada']
    const lines = filtered.map((r) => [
      r.student_name,
      r.level_completed,
      r.score,
      r.stars_earned,
      r.time_spent_seconds,
      new Date(r.completed_at).toLocaleString('id-ID'),
    ])
    const csv = [header, ...lines].map((l) => l.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'rekap_nilai_siswa.csv'
    link.click()
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink">
              {isTeacher ? 'Dashboard Guru' : 'Dashboard Pengunjung'}
            </h1>
            <p className="text-ink/50 font-semibold text-sm">
              {isTeacher ? 'Monitoring hasil belajar siswa secara real-time' : 'Mode lihat saja (read-only)'}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="btn-pop flex items-center gap-1.5 bg-white border-2 border-sky-light font-display font-bold px-4 py-2.5 rounded-2xl text-ink/60 shadow-popSmall"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 flex items-start gap-2 bg-sun-light/60 border-2 border-sun rounded-2xl px-4 py-3 text-sm font-semibold text-ink/70">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            Supabase belum dikonfigurasi — data ditampilkan dari penyimpanan lokal perangkat ini saja (mode demo).
          </div>
        )}

        {/* Kartu Statistik */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatCard icon={Users} label="Total Siswa Bermain" value={stats.totalStudents} color="sky" />
          <StatCard icon={Trophy} label="Rata-rata Skor" value={stats.avgScore} color="leaf" />
          <StatCard icon={Star} label="Bintang Terkumpul" value={stats.totalStars} color="sun" />
        </div>

        {/* Filter & Pencarian */}
        <div className="bg-white/90 rounded-3xl border-4 border-white shadow-pop p-4 mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-sky-light font-semibold outline-none focus:border-sky-deep"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-2xl border-2 border-sky-light px-4 py-2.5 font-semibold outline-none focus:border-sky-deep bg-white"
          >
            <option value="all">Semua Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
          <button
            onClick={exportCSV}
            className="btn-pop flex items-center justify-center gap-1.5 bg-leaf text-white font-display font-bold px-4 py-2.5 rounded-2xl shadow-popSmall shrink-0"
          >
            <Download size={16} /> Export
          </button>
          {isTeacher && (
            <button
              onClick={() => setConfirmReset('ALL')}
              className="btn-pop flex items-center justify-center gap-1.5 bg-coral text-white font-display font-bold px-4 py-2.5 rounded-2xl shadow-popSmall shrink-0"
            >
              <RotateCcw size={16} /> Reset Semua
            </button>
          )}
        </div>

        {/* Tabel Rekap */}
        <div className="bg-white/90 rounded-3xl border-4 border-white shadow-pop overflow-hidden">
          <div className="overflow-x-auto scrollbar-fun">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-light/50 text-ink/70 font-display font-bold text-left">
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Skor</th>
                  <th className="px-4 py-3">Bintang</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Waktu</th>
                  <th className="px-4 py-3 hidden md:table-cell">Selesai</th>
                  {isTeacher && <th className="px-4 py-3">Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-ink/40 font-semibold">
                      Memuat data...
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-ink/40 font-semibold">
                      Belum ada data siswa yang cocok.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((r, i) => (
                    <tr key={r.id || i} className="border-t border-sky-light/50 hover:bg-sky-light/20">
                      <td className="px-4 py-3 font-bold text-ink">{r.student_name}</td>
                      <td className="px-4 py-3">Level {r.level_completed}</td>
                      <td className="px-4 py-3">{r.score}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-0.5 text-sun-dark font-bold">
                          {r.stars_earned} <Star size={14} className="fill-sun-dark" />
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-ink/60">
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> {r.time_spent_seconds}s
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-ink/50">
                        {new Date(r.completed_at).toLocaleDateString('id-ID')}
                      </td>
                      {isTeacher && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setConfirmReset(r.student_name)}
                            className="text-coral-dark font-bold text-xs hover:underline"
                          >
                            Reset
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {confirmReset && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-pop border-4 border-coral-light animate-pop">
            <h3 className="font-display font-bold text-lg mb-2">Yakin ingin reset?</h3>
            <p className="text-ink/60 font-semibold text-sm mb-5">
              {confirmReset === 'ALL'
                ? 'Semua histori skor seluruh siswa akan dihapus permanen.'
                : `Histori skor milik "${confirmReset}" akan dihapus permanen.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(null)}
                className="btn-pop flex-1 bg-cloud border-2 border-sky-light font-display font-bold py-2.5 rounded-2xl"
              >
                Batal
              </button>
              <button
                onClick={() => (confirmReset === 'ALL' ? handleResetAll() : handleResetStudent(confirmReset))}
                className="btn-pop flex-1 bg-coral text-white font-display font-bold py-2.5 rounded-2xl"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colorMap = {
    sky: 'bg-sky-light text-sky-deep',
    leaf: 'bg-leaf-light text-leaf-dark',
    sun: 'bg-sun-light text-sun-dark',
  }
  return (
    <div className="bg-white/90 rounded-3xl border-4 border-white shadow-pop p-4 flex flex-col items-center text-center gap-1">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <p className="font-display font-extrabold text-xl sm:text-2xl text-ink">{value}</p>
      <p className="text-ink/50 font-semibold text-[11px] sm:text-xs leading-tight">{label}</p>
    </div>
  )
}
