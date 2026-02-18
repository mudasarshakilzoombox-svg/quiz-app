"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function ResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quiz_results')
      if (raw) {
        const obj = JSON.parse(raw)
        setScore(Number(obj.score))
        setTotal(Number(obj.total))
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const handleRetake = () => {
    try {
      localStorage.removeItem('quiz_results')
    } catch (e) {}
    router.push('/quiz')
  }

  const getRemark = (score: number, total: number) => {
    const percentage = (score / total) * 100
    
    if (percentage >= 90) {
      return "Excellent! You're a quiz master!"
    } else if (percentage >= 75) {
      return "Great job! You really know your stuff."
    } else if (percentage >= 60) {
      return "Good effort! Keep learning and improving."
    } else if (percentage >= 40) {
      return "Not bad! But there's room for improvement."
    } else if (percentage >= 20) {
      return "Keep practicing! You'll do better next time."
    } else {
      return "You need to study more. Don't give up!"
    }
  }

  const getScoreMessage = (score: number, total: number) => {
    if (score < 8) {
      return "You failed. Better luck next time!"
    } else if (score >= 8 && score < 12) {
      return "Average performance. Keep practicing!"
    } else if (score >= 12 && score < 16) {
      return "Good job! You're above average."
    } else if (score >= 16 && score < 19) {
      return "Excellent work! Almost perfect!"
    } else if (score === 19) {
      return "Outstanding! Just one more for perfection!"
    } else if (score === 20) {
      return "PERFECT SCORE! You're a genius! 🎉"
    }
    return ""
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow">
        <h1 className="mb-4 text-4xl text-gray-800 font-bold">Quiz Completed!</h1>
        {score === null || total === null ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          <>
            <p className="mb-4 text-lg text-gray-700">You scored</p>
            <div className="mb-2 text-5xl font-extrabold text-gray-800">{score}/{total}</div>
            
            {/* Percentage display */}
            <div className="mb-4 text-xl font-semibold text-gray-600">
              {Math.round((score / total) * 100)}%
            </div>
            
            {/* Dynamic remarks based on score */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium text-gray-800">
                {getScoreMessage(score, total)}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                {getRemark(score, total)}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-4 w-full rounded-full bg-gray-200">
                <div 
                  className="h-4 rounded-full bg-gray-900 transition-all duration-500"
                  style={{ width: `${(score / total) * 100}%` }}
                />
              </div>
            </div>

            {/* Score interpretation */}
            <div className="mb-6 text-sm text-gray-500">
              {score >= 15 ? "🎉 Congratulations! " : "💪 Keep practicing! "}
              {score === total ? "Perfect score! You're amazing!" : ""}
            </div>
          </>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={handleRetake} className='cursor-pointer'>Retake Quiz</Button>
          <Button onClick={() => router.push('/')} className="bg-gray-600 text-white cursor-pointer hover:bg-gray-700">
            Home
          </Button>
        </div>
      </div>
    </main>
  )
}