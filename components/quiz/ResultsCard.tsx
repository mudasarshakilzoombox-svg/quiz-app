"use client"
import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

type Props = {
  onGoHome: () => void
}

export default function ResultsCard({ onGoHome }: Props) {
  const [score, setScore] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('quiz_results')
    if (raw) {
      const obj = JSON.parse(raw)
      setScore(Number(obj.score))
      setTotal(Number(obj.total))
    }
  }, [])

  const handleGoHome = () => {
    onGoHome()
  }

  return (
    <div className="w-full max-w-3xl rounded-xl bg-white p-8 text-center shadow-lg">
      <h1 className="mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700">Quiz Completed!</h1>

      {score === null || total === null ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <>
          <p className="mb-6 text-2xl font-semibold text-gray-600">You answered {score} out of {total} questions correctly.</p>

          {score < 10 ? (
            <p className="mb-6 text-lg text-red-600">😞 Sorry, you failed — try again.</p>
          ) : (
            <p className="mb-6 text-lg text-green-600">🎉 Congratulations! You Passed the Quiz!</p>
          )}

          <div className="flex justify-center">
            <Button onClick={handleGoHome} className="text-sm sm:text-base md:text-lg lg:text-xl font-[400]  px-4 py-2 bg-[#dcdedc] border border-black rounded-md  hover:bg-[#9f9f9f] transition-colors cursor-pointer w-[200px]">Go to Home</Button>
          </div>
        </>
      )}
    </div>
  )
}
