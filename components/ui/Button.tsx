"use client"
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ size = 'md', className = '', children, ...rest }: Props) {
  const sizeCls =
    size === 'sm' ? 'px-3 py-1 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'

  return (
    <button
      {...rest}
      className={
        'inline-flex items-center justify-center rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 ' +
        sizeCls +
        ' ' +
        className
      }
    >
      {children}
    </button>
  )
}
