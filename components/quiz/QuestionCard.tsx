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
    <div className="w-full rounded-2xl bg-white pt-4">
      <h2 className="mb-6 text-2xl text-gray-800">{question.question}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = reveal && idx === question.correctIndex
          const isWrong = reveal && isSelected && selected !== question.correctIndex

          let base = 'w-full rounded-lg border px-6 py-4 text-left text-lg font-medium transition-colors duration-150'
          // default option appearance: light gray background, darker border
          let color = 'bg-[#e6e6e6] border-gray-400 text-gray-900 hover:bg-[#bdbdbd] cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed'
          if (isSelected) color = 'bg-gray-900 text-white border-gray-900 cursor-default'
          if (isCorrect) color = 'bg-green-500 text-white border-green-600 cursor-default'
          if (isWrong) color = 'bg-red-500 text-white border-red-600 cursor-default'

          return (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`${base} ${color} focus:outline-none`}
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
