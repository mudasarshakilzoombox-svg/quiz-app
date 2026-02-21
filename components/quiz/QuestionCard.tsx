"use client"
import React from 'react'
import type { Question } from '@/types/quiz.types'

interface QuestionCardProps {
  question: Question
  selectedOptionIndex: number | null
  onOptionSelect: (index: number) => void
  isAnswerRevealed?: boolean
}

export default function QuestionCard({ 
  question, 
  selectedOptionIndex, 
  onOptionSelect, 
  isAnswerRevealed = false 
}: QuestionCardProps) {
  return (
    <div className="w-full rounded-2xl bg-white pt-4">
      <h2 className="mb-6 text-2xl text-gray-800">{question.question}</h2>

      <div className="grid mt-8 grid-cols-1 gap-4 sm:grid-cols-2">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionIndex === index
          const isCorrect = isAnswerRevealed && index === question.correctIndex
          const isWrong = isAnswerRevealed && isSelected && selectedOptionIndex !== question.correctIndex

          const baseClasses = 'w-full rounded-xl border px-2 py-2 text-center text-lg font-medium transition-colors duration-150 focus:outline-none'
          
          let colorClasses = 'bg-[#dcdedc] border-gray-800 text-gray-900 hover:bg-[#9f9f9f] cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed'
          
          if (isAnswerRevealed) {
            if (isCorrect) {
              colorClasses = 'bg-gray-900 text-white border-gray-600 cursor-default'
            } else if (isWrong) {
              colorClasses = 'bg-red-500 text-white border-red-600 cursor-default'
            } else if (isSelected) {
              colorClasses = 'bg-gray-900 text-white border-gray-900 cursor-default'
            }
          } else {
            if (isSelected) {
              colorClasses = 'bg-gray-900 text-white border-gray-900 cursor-default'
            }
          }

          return (
            <button
              key={index}
              onClick={() => onOptionSelect(index)}
              className={`${baseClasses} ${colorClasses}`}
              aria-pressed={isSelected}
              disabled={isAnswerRevealed}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}