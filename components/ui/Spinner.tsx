"use client"
import React from 'react'

type Props = {
  sizeClass?: string
  className?: string
}

export default function Spinner({ sizeClass = 'w-12 h-12', className = '' }: Props) {
  return (
    <div
      className={`${sizeClass} mb-4 border-4 border-gray-200 border-t-black rounded-full animate-spin ${className}`}
      aria-hidden="true"
    />
  )
}
