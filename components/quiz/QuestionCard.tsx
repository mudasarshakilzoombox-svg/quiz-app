"use client"
import React from 'react'

type Question = {
  id: number
  question: string
  options: string[]
  correctIndex: number
}

type Props = {
  question: Question
  selected: number | null
  onSelect: (index: number) => void
  reveal?: boolean
}

export default function QuestionCard({ question, selected, onSelect, reveal = false }: Props) {
  return (
    <div className="w-full rounded-lg bg-white p-8 shadow-2xl">
      <h2 className="mb-6 text-xl font-medium text-gray-800">{question.question}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = reveal && idx === question.correctIndex
          const isWrong = reveal && isSelected && selected !== question.correctIndex

          let base = 'w-full rounded-lg border px-6 py-4 text-left text-lg font-medium transition'
          let color = 'bg-white border-gray-300 text-gray-800'
          if (isSelected) color = 'bg-gray-900 text-white border-gray-900'
          if (isCorrect) color = 'bg-green-500 text-white border-green-600'
          if (isWrong) color = 'bg-red-500 text-white border-red-600'

          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`${base} ${color}`}
              aria-pressed={isSelected}
              disabled={reveal}
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-center text-sm font-semibold">
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1">{opt}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
