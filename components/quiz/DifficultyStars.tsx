"use client"
import React from 'react'

type Props = {
  difficulty?: string
}

export default function DifficultyStars({ difficulty = 'easy' }: Props) {
  const starCount = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1
  
  return (
    <div className="text-xl">
      {Array.from({ length: starCount }).map((_, i) => (
        <span key={i} className="inline-block text-black mr-1">★</span>
      ))}
    </div>
  )
}