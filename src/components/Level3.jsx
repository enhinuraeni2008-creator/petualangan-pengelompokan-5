import { useEffect, useState, useRef } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import BlockVisual from './BlockVisual'
import { LevelHeader } from './Level1'
import { fetchQuestions, animalMeta } from '../lib/questionBank'
import { sfx } from '../lib/sounds'

function toHands(n) {
  const hand_left = n > 5 ? 5 : 0
  const hand_right = n > 5 ? n - 5 : n
  return { hand_left, hand_right }
}

function generateHandChoices(correct) {
  const set = new Map()
  set.set(correct, toHands(correct))
  while (set.size < 4) {
    const candidate = Math.max(1, Math.min(10, correct + Math.floor(Math.random() * 7) - 3))
    if (!set.has(candidate)) set.set(candidate, toHands(candidate))
  }
  return [...set.entries()].sort(() => Math.random() - 0.5)
}

export default function Level3({ onComplete, onExit }) {
  const [questions, setQuestions] = useState(null)
  const [index, setIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [selectedValue, setSelectedValue] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [choices, setChoices] = useState([])
  const startTime = useRef(Date.now())

  useEffect(() => {
    fetchQuestions(3).then(setQuestions)
  }, [])

  useEffect(() => {
    if (questions && questions[index]) {
      setChoices(generateHandChoices(questions[index].target_number))
      setFeedback(null)
      setSelectedValue(null)
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
  const animal = animalMeta(q.animal_type)

  function handlePick(value) {
    if (feedback) return
    setSelectedValue(value)
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
      <LevelHeader index={index} total={questions.length} onExit={onExit} title="Level 3 · Tebak Isian Balon Kata & Jari" color="sun" />

      <div className="w-full max-w-md bg-white/90 rounded-blob shadow-pop border-4 border-white p-6 mt-4 flex-1 flex flex-col items-center justify-center gap-5">
        <p className="font-display font-bold text-xl text-center text-ink/80">
          Pilih tangan yang jumlah jarinya sama dengan balok ini!
        </p>

        <div className="flex flex-col items-center gap-2 bg-sun-light/50 rounded-3xl p-4 w-full">
          <BlockVisual yellow={q.yellow_blocks} red={q.red_blocks} showHands={false} />
          <p className="text-3xl">{animal.emoji.repeat(Math.min(q.target_number, 6))}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {choices.map(([value, hands]) => {
            const isSelected = selectedValue === value
            const showCorrect = feedback && value === q.target_number
            const showWrong = feedback && isSelected && value !== q.target_number
            return (
              <button
                key={value}
                onClick={() => handlePick(value)}
                disabled={!!feedback}
                className={`btn-pop relative rounded-3xl p-3 border-4 shadow-popSmall flex items-center justify-center min-h-[92px]
                  ${showCorrect ? 'bg-leaf-light border-leaf' : ''}
                  ${showWrong ? 'bg-coral-light border-coral' : ''}
                  ${!feedback ? 'bg-cloud border-sky-light hover:border-sky-deep' : ''}
                `}
              >
                <BlockVisual handLeft={hands.hand_left} handRight={hands.hand_right} showBlocks={false} size="small" />
                {showCorrect && <CheckCircle2 className="absolute -top-2 -right-2 text-leaf-dark bg-white rounded-full" size={24} />}
                {showWrong && <XCircle className="absolute -top-2 -right-2 text-coral-dark bg-white rounded-full" size={24} />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
