"use client"
import React from 'react'

type Props = {
  scorePercent: number
  wrongPercent: number
  remainingPercent: number
}

export default function ScoreProgressBar({ scorePercent, wrongPercent, remainingPercent }: Props) {
  return (
    <div className="h-8 mt-4 w-full rounded-md bg-gray-200 overflow-hidden border border-gray-800">
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
  )
}
