import { useEffect, useState, useRef } from 'react'
import { Undo2, CheckCircle2, XCircle, PlusCircle } from 'lucide-react'
import { LevelHeader } from './Level1'
import { fetchQuestions } from '../lib/questionBank'
import { sfx } from '../lib/sounds'

export default function Level4({ onComplete, onExit }) {
  const [questions, setQuestions] = useState(null)
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState({ yellow: 0, red: 0 })
  const [feedback, setFeedback] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const startTime = useRef(Date.now())

  useEffect(() => {
    fetchQuestions(4).then(setQuestions)
  }, [])

  useEffect(() => {
    setPlaced({ yellow: 0, red: 0 })
    setFeedback(null)
  }, [index])

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-bold text-xl text-ink/50 animate-pulse">Menyiapkan soal...</p>
      </div>
    )
  }

  const q = questions[index]
  const total = placed.yellow * 5 + placed.red * 1

  function addBlock(color) {
    if (feedback) return
    sfx.drop()
    setPlaced((p) => ({ ...p, [color]: p[color] + 1 }))
  }

  function undoLast() {
    if (feedback) return
    sfx.click()
    setPlaced((p) => {
      if (p.red > 0) return { ...p, red: p.red - 1 }
      if (p.yellow > 0) return { ...p, yellow: p.yellow - 1 }
      return p
    })
  }

  function handleCheck() {
    if (feedback) return
    const isCorrect = total === q.target_number
    if (isCorrect) {
      sfx.correct()
      setFeedback('correct')
      setCorrectCount((c) => c + 1)
    } else {
      sfx.incorrect()
      setFeedback('wrong')
    }
    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1)
      } else {
        const finalCorrect = correctCount + (isCorrect ? 1 : 0)
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000)
        onComplete({
          score: finalCorrect * 10,
          correctCount: finalCorrect,
          starsEarned: finalCorrect >= 9 ? 3 : finalCorrect >= 7 ? 2 : 1,
          timeSpentSeconds: timeSpent,
        })
      }
    }, 1300)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const color = e.dataTransfer.getData('color')
    if (color === 'yellow' || color === 'red') addBlock(color)
  }

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center">
      <LevelHeader index={index} total={questions.length} onExit={onExit} title="Level 4 · Rakit Balokmu Sendiri!" color="coral" />

      <div className="w-full max-w-md bg-white/90 rounded-blob shadow-pop border-4 border-white p-6 mt-4 flex-1 flex flex-col items-center gap-5">
        <p className="font-display font-bold text-xl text-center text-ink/80">
          Susun balok sampai jumlahnya <span className="text-coral-dark">{q.target_number}</span>!
        </p>

        {/* Sumber balok yang bisa ditarik / diketuk */}
        <div className="flex items-center gap-6">
          <button
            draggable
            onDragStart={(e) => e.dataTransfer.setData('color', 'yellow')}
            onClick={() => addBlock('yellow')}
            disabled={!!feedback}
            className="btn-pop flex flex-col items-center gap-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-sun border-4 border-sun-dark flex items-center justify-center font-display font-extrabold text-2xl text-ink shadow-pop">
              5
            </div>
            <span className="flex items-center gap-0.5 text-xs font-bold text-ink/50">
              <PlusCircle size={12} /> tambah
            </span>
          </button>
          <button
            draggable
            onDragStart={(e) => e.dataTransfer.setData('color', 'red')}
            onClick={() => addBlock('red')}
            disabled={!!feedback}
            className="btn-pop flex flex-col items-center gap-1"
          >
            <div className="w-16 h-16 rounded-2xl bg-coral border-4 border-coral-dark flex items-center justify-center font-display font-extrabold text-2xl text-white shadow-pop">
              1
            </div>
            <span className="flex items-center gap-0.5 text-xs font-bold text-ink/50">
              <PlusCircle size={12} /> tambah
            </span>
          </button>
        </div>

        {/* Zona perakitan */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`w-full min-h-[120px] rounded-3xl border-4 border-dashed flex flex-wrap items-center justify-center gap-2 p-4 transition-colors ${
            dragOver ? 'border-sky-deep bg-sky-light/40' : 'border-sky-light bg-cloud'
          }`}
        >
          {placed.yellow === 0 && placed.red === 0 && (
            <p className="text-ink/30 font-bold text-sm">Tempat perakitan · tarik atau ketuk balok di atas</p>
          )}
          {Array.from({ length: placed.yellow }).map((_, i) => (
            <div key={`py-${i}`} className="w-11 h-11 rounded-xl bg-sun border-2 border-sun-dark flex items-center justify-center font-display font-bold text-ink animate-pop">
              5
            </div>
          ))}
          {Array.from({ length: placed.red }).map((_, i) => (
            <div key={`pr-${i}`} className="w-11 h-11 rounded-xl bg-coral border-2 border-coral-dark flex items-center justify-center font-display font-bold text-white animate-pop">
              1
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 font-display font-bold text-lg">
          Jumlah sekarang:
          <span className={`px-3 py-1 rounded-xl ${total === q.target_number ? 'bg-leaf-light text-leaf-dark' : 'bg-sky-light text-sky-deep'}`}>
            {total}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={undoLast}
            disabled={!!feedback}
            className="btn-pop flex items-center gap-1.5 bg-cloud border-2 border-sky-light font-display font-bold px-4 py-3 rounded-2xl text-ink/60"
          >
            <Undo2 size={18} /> Undo
          </button>
          <button
            onClick={handleCheck}
            disabled={!!feedback || (placed.yellow === 0 && placed.red === 0)}
            className="btn-pop flex-1 relative flex items-center justify-center gap-2 bg-coral text-white font-display font-bold text-lg py-3 rounded-2xl shadow-pop disabled:opacity-40 disabled:shadow-none"
          >
            {feedback === 'correct' && <CheckCircle2 size={20} />}
            {feedback === 'wrong' && <XCircle size={20} />}
            {!feedback ? 'Cek Jawaban' : feedback === 'correct' ? 'Benar!' : 'Belum Pas'}
          </button>
        </div>
      </div>
    </div>
  )
}
