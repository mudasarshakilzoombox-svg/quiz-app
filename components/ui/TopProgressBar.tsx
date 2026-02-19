"use client"
import React from 'react'

type Props = {
  percent: number
}

export default function TopProgressBar({ percent }: Props) {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-4 w-full bg-gray-50">
        <div
          className="h-full bg-[#6a7282] transition-all"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
