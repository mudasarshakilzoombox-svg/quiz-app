"use client"
import React from 'react'
import Button from '@/components/ui/Button'

interface ResultsCardProps {
  score: number
  total: number
  onRetake: () => void
  onHome: () => void
}

export default function ResultsCard({ score, total, onHome }: ResultsCardProps) {
  const totalQuestions = 20

  return (
    <div className="w-full max-w-3xl rounded-xl bg-white p-8 text-center shadow-lg">
      <h1 className="mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-700">
        Quiz Completed!
      </h1>

      <p className="mb-6 text-2xl font-semibold text-gray-600">
        You answered {score} out of {total} questions correctly.
      </p>

      {score < 10 ? (
        <p className="mb-6 text-lg text-red-600">
          Sorry! You Failed. Better luck next time 😊
        </p>
      ) : (
        <p className="mb-6 text-lg text-green-600">
          🎉 Congratulations! You Passed the Quiz!
        </p>
      )}

      <div className="flex justify-center gap-4">
        <Button onClick={onHome} size="lg" className="text-sm sm:text-base md:text-lg lg:text-xl font-[400]  px-4 py-2 bg-[#dcdedc] border border-black rounded-md  hover:bg-[#9f9f9f] transition-colors cursor-pointer w-[200px]">
          Go To Home
        </Button>
      </div>
    </div>
  )
}