import { useEffect, useState, useRef } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import BlockVisual from './BlockVisual'
import { fetchQuestions } from '../lib/questionBank'
import { sfx } from '../lib/sounds'

function generateChoices(correct) {
  const choices = new Set([correct])
  while (choices.size < 4) {
    const candidate = Math.max(1, Math.min(10, correct + Math.floor(Math.random() * 7) - 3))
    choices.add(candidate)
  }
  return [...choices].sort(() => Math.random() - 0.5)
}

export default function Level1({ onComplete, onExit }) {
  const [questions, setQuestions] = useState(null)
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [correctCount, setCorrectCount] = useState(0)
  const [choices, setChoices] = useState([])
  const startTime = useRef(Date.now())

  useEffect(() => {
    fetchQuestions(1).then(setQuestions)
  }, [])

  useEffect(() => {
    if (questions && questions[index]) {
      setChoices(generateChoices(questions[index].target_number))
      setSelected(null)
      setFeedback(null)
    }
  }, [questions, index])

  if (!questions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-bold text-xl text-ink/50 animate-pulse">Menyiapkan soal...</p>
      </div>
    )
  }

  const q = questions[index]

  function handleChoice(value) {
    if (feedback) return
    setSelected(value)
    const isCorrect = value === q.target_number
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
    }, 1100)
  }

  return (
    <div className="min-h-screen px-4 py-6 flex flex-col items-center">
      <LevelHeader index={index} total={questions.length} onExit={onExit} title="Level 1 · Hitung & Isi Angka Balok" color="leaf" />

      <div className="w-full max-w-md bg-white/90 rounded-blob shadow-pop border-4 border-white p-6 mt-4 flex-1 flex flex-col items-center justify-center gap-6">
        <p className="font-display font-bold text-xl text-center text-ink/80">
          Ada berapa jumlahnya semua?
        </p>

        <BlockVisual
          yellow={q.yellow_blocks}
          red={q.red_blocks}
          handLeft={q.hand_left}
          handRight={q.hand_right}
        />

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {choices.map((c) => {
            const isSelected = selected === c
            const showCorrect = feedback && c === q.target_number
            const showWrong = feedback && isSelected && c !== q.target_number
            return (
              <button
                key={c}
                onClick={() => handleChoice(c)}
                disabled={!!feedback}
                className={`btn-pop relative rounded-3xl py-4 font-display font-extrabold text-2xl border-4 shadow-popSmall transition-colors
                  ${showCorrect ? 'bg-leaf-light border-leaf text-leaf-dark' : ''}
                  ${showWrong ? 'bg-coral-light border-coral text-coral-dark' : ''}
                  ${!feedback ? 'bg-cloud border-sky-light text-ink hover:border-sky-deep' : ''}
                `}
                style={{ clipPath: 'none' }}
              >
                {c}
                {showCorrect && <CheckCircle2 className="absolute -top-2 -right-2 text-leaf-dark bg-white rounded-full" size={26} />}
                {showWrong && <XCircle className="absolute -top-2 -right-2 text-coral-dark bg-white rounded-full" size={26} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function LevelHeader({ index, total, onExit, title, color }) {
  const colorMap = {
    leaf: 'bg-leaf',
    sky: 'bg-sky-deep',
    sun: 'bg-sun',
    coral: 'bg-coral',
  }
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <button onClick={onExit} className="text-ink/50 font-bold text-sm hover:text-ink">
          ← Keluar
        </button>
        <span className="font-display font-bold text-sm text-ink/60">
          Soal {index + 1} / {total}
        </span>
      </div>
      <p className="font-display font-bold text-center text-ink/70 mb-1.5 text-sm sm:text-base">{title}</p>
      <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner border-2 border-white">
        <div
          className={`h-full ${colorMap[color]} transition-all duration-500 rounded-full`}
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
