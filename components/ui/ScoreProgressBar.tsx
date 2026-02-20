"use client"
import React from 'react'

type Props = {
  scorePercent: number
  wrongPercent: number
  maxPossiblePercent: number
  remainingFromMaxPercent: number
}

export default function ScoreProgressBar({ 
  scorePercent, 
  wrongPercent, 
  maxPossiblePercent,
  remainingFromMaxPercent 
}: Props) {
  return (
    <div className="h-8 mt-4 w-full rounded-md bg-gray-200 overflow-hidden border border-gray-800">
      <div className="flex h-full w-full">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${scorePercent}%`,
            backgroundColor: '#1e293b'
          }}
        />
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${wrongPercent}%`,
            backgroundColor: '#94a3b8'
          }}
        />
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${remainingFromMaxPercent}%`,
            backgroundColor: '#e5e7eb'
          }}
        />
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${Math.max(0, 100 - maxPossiblePercent)}%`,
            backgroundColor: '#ffff'
          }}
        />
      </div>
    </div>
  )
}