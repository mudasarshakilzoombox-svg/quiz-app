"use client"
import React from 'react'
import type { QuizQuestion } from '@/types/quiz'

type Props = {
  question: QuizQuestion
  selected: number | null
  onSelect: (index: number) => void
  reveal?: boolean
}

export default function QuestionCard({ question, selected, onSelect, reveal = false }: Props) {
  return (
    <div className="w-full rounded-2xl bg-white pt-4">
      <h2 className="mb-6 text-2xl text-gray-800">{question.question}</h2>

      <div className="grid mt-8 grid-cols-1 gap-4 sm:grid-cols-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = reveal && idx === question.correctIndex
          const isWrong = reveal && isSelected && selected !== question.correctIndex

          let base = 'w-full rounded-xl border-1 px-2 py-2 text-center text-lg font-medium transition-colors duration-150'
          
          let color = 'bg-[#dcdedc] border-gray-800 text-gray-900 hover:bg-[#9f9f9f] cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed'
          if (isSelected) color = 'bg-gray-900 text-white border-gray-900 cursor-default'
          if (isCorrect) color = 'bg-gray-900 text-white border-gray-600 cursor-default'
          if (isWrong) color = 'bg-red-500 text-white border-red-600 cursor-default'

          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`${base} ${color} focus:outline-none`}
              aria-pressed={isSelected}
              disabled={reveal}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
