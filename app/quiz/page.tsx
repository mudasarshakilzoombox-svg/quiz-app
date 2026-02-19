"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import QuestionCard from '@/components/quiz/QuestionCard'
import type { RawQuestion } from '@/types/quiz'
import { decode, shuffle } from '@/utils/quiz'

export default function QuizPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [reveal, setReveal] = useState(false)

  useEffect(() => {
    let mounted = true
    const savedQuestions = localStorage.getItem('quiz_questions')
    if (savedQuestions) {
      const parsed = JSON.parse(savedQuestions)
      if (mounted) setQuestions(parsed)
      return
    }
    
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then((raw: RawQuestion[]) => {
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
        const shuffledQuestions = shuffle(mapped)
        const limit = Math.min(20, shuffledQuestions.length)
        const finalQuestions = shuffledQuestions.slice(0, limit)
        setQuestions(finalQuestions)
        try {
          localStorage.setItem('quiz_questions', JSON.stringify(finalQuestions))
        } catch (e) {}
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('quiz_state')
    if (saved) {
      const state = JSON.parse(saved)
      setIndex(state.index || 0)
      setScore(state.score || 0)
      setSelected(state.selected || null)
      setReveal(state.reveal || false)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'quiz_state',
      JSON.stringify({ index, score, selected, reveal })
    )
  }, [index, score, selected, reveal])

  const q = questions[index] || { question: '', options: [], correctIndex: 0, category: '', difficulty: 'easy' }

  useEffect(() => {
    setSelected(null)
    setReveal(false)
  }, [index])

  const handleSelect = (i: number) => {
    if (reveal) return
    setSelected(i)
    if (i === q.correctIndex) setScore((s) => s + 1)
    setReveal(true)
  }

  const handleNext = () => {
    if (!reveal) {
      if (selected === null) return
      if (selected === q.correctIndex) setScore((s) => s + 1)
      setReveal(true)
      return
    }

    const next = index + 1
    if (next >= questions.length) {
      localStorage.setItem(
        'quiz_results',
        JSON.stringify({ score, total: questions.length })
      )
      localStorage.removeItem('quiz_state')
      localStorage.removeItem('quiz_questions')
      router.push('/quiz/results')
    } else {
      setIndex(next)
    }
  }

  const total = questions.length
  const answeredCount = reveal ? index + 1 : index
  const wrongCount = Math.max(0, answeredCount - score)

  const scorePercent = total ? Math.round((score / total) * 100) : 0
  const wrongPercent = total ? Math.round((wrongCount / total) * 100) : 0
  const remainingPercent = Math.max(0, 100 - scorePercent - wrongPercent)

  const maxPossible = total ? Math.round(((score + (total - (index + 1))) / total) * 100) : 0

  const topProgressPercent = total ? Math.round(((index + 1) / total) * 100) : 0

  const difficultyStars = (d?: string) => {
    const n = d === 'hard' ? 3 : d === 'medium' ? 2 : 1
    return Array.from({ length: n }).map((_, i) => (
      <span key={i} className="inline-block text-black mr-1">★</span>
    ))
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="h-4 w-full bg-gray-50">
          <div
            className="h-full bg-[#6a7282] transition-all"
            style={{ width: `${topProgressPercent}%` }}
            role="progressbar"
            aria-valuenow={topProgressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-2xl">
          <div className="rounded-xl bg-white p-8 shadow-xl">
          <header className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-700">Question {index + 1} of {total}</h2>
                <div className="text-lg text-gray-600">{q.category}</div>
                <div className="text-xl">{difficultyStars(q.difficulty)}</div>
              </div>
            </div>
          </header>

          <QuestionCard question={q} selected={selected} onSelect={handleSelect} reveal={reveal} />

          <div className="mt-4 text-center">
            {reveal && (
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800">{selected === q.correctIndex ? 'Correct!' : 'Sorry!'}</h3>
                <Button onClick={handleNext} className="bg-dark-100 text-gray-800">
                  {index + 1 >= total ? 'See Results' : 'Next Question'}
                </Button>
              </div>
            )}
          </div>

          <footer className="mt-8">
            <div className="flex items-center justify-between text-md font-bold text-gray-900 mb-2">
              <div>Score: {scorePercent}%</div>
              <div>Max Score: {maxPossible}%</div>
            </div>
            <div className="h-8 w-full rounded-md bg-gray-200 overflow-hidden border border-gray-200">
              <div className="flex h-full w-full">
                <div
                  className="h-full"
                  style={{
                    width: `${scorePercent}%`,
                    background: '#0f1724'
                  }}
                />
                <div
                  className="h-full"
                  style={{
                    width: `${wrongPercent}%`,
                    background: '#9aa3b2'
                  }}
                />

                <div
                  className="h-full"
                  style={{
                    width: `${remainingPercent}%`,
                    background: '#f3f4f6'
                  }}
                />
              </div>
            </div>
          </footer>
          </div>
        </div>
      </main>
    </>
  )
}