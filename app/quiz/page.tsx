"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import QuestionCard from '@/components/quiz/QuestionCard'

const decode = (s: string) => {
  try {
    return decodeURIComponent(s)
  } catch (e) {
    return s
  }
}

const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type RawQ = any

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((raw: RawQ[]) => {
        if (!mounted) return
        const mapped = raw.map((q, idx) => {
          const correct = decode(q.correct_answer || '')
          const incorrect = (q.incorrect_answers || []).map((x: string) => decode(x))
          const opts = shuffle([...incorrect, correct])
          const correctIndex = opts.findIndex((o) => o === correct)
          return {
            id: idx + 1,
            question: decode(q.question || ''),
            options: opts,
            correctIndex,
            category: q.category ? decode(q.category) : undefined,
            difficulty: q.difficulty,
          }
        })
        // shuffle the questions themselves and limit to 20 unique questions
        const shuffledQuestions = shuffle(mapped)
        const limit = Math.min(20, shuffledQuestions.length)
        setQuestions(shuffledQuestions.slice(0, limit))
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const q = questions[index] || { question: '', options: [], correctIndex: 0, category: '', difficulty: 'easy' }

  useEffect(() => {
    setSelected(null)
    setReveal(false)
  }, [index])

  const handleSelect = (i: number) => {
    if (reveal) return
    setSelected(i)
  }

  const handleNext = () => {
    // ensure user selected before moving on
    if (!reveal) {
      if (selected === null) return

      // reveal and update score
      if (selected === q.correctIndex) setScore((s) => s + 1)
      setReveal(true)
      return
    }

    const next = index + 1
    if (next >= questions.length) {
      // store results and navigate
      try {
        localStorage.setItem(
          'quiz_results',
          JSON.stringify({ score, total: questions.length })
        )
      } catch (e) {}
      router.push('/quiz/results')
    } else {
      setIndex(next)
    }
  }

  const answered = index // number of questions already shown before current
  const total = questions.length // FIXED: Changed from setQuestions.length to questions.length
  const scorePercent = Math.round((score / Math.max(1, total)) * 100)
  const maxPossible = Math.round(((score + (total - (index + 1))) / total) * 100)

  const difficultyStars = (d?: string) => {
    const n = d === 'hard' ? 3 : d === 'medium' ? 2 : 1
    return Array.from({ length: n }).map((_, i) => (
      <span key={i} className="inline-block text-black mr-1">★</span>
    ))
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <header className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Question {index + 1} of {total}</h2>
                <div className="text-sm text-gray-600">{q.category}</div>
                <div className="mt-2">{difficultyStars(q.difficulty)}</div>
              </div>
              <div className="text-sm text-gray-600">Score: {scorePercent}%</div>
            </div>
          </header>

          <QuestionCard question={q} selected={selected} onSelect={handleSelect} reveal={reveal} />

          <div className="mt-6 text-center">
            {reveal ? (
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800">{selected === q.correctIndex ? 'Correct!' : 'Sorry!'}</h3>
                <Button onClick={handleNext} className="bg-dark-100 text-gray-800">
                  {index + 1 >= total ? 'See Results' : 'Next Question'}
                </Button>
              </div>
            ) : (
              <div>
                <Button onClick={handleNext} disabled={selected === null} className="bg-gray-800">
                  Check Answer
                </Button>
              </div>
            )}
          </div>

          <footer className="mt-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <div>Score: {scorePercent}%</div>
              <div>Max Score: {maxPossible}%</div>
            </div>
            <div className="h-3 w-full rounded bg-gray-200">
              <div className="h-full bg-blue-500" style={{ width: `${scorePercent}%` }} />
            </div>
          </footer>
        </div>
      </div>
    </main>
  )
}