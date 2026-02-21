"use client"
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

export default function Button({ 
  size = 'md', 
  variant = 'primary',
  className = '', 
  children, 
  disabled = false,
  type = 'button',
  ...rest 
}: ButtonProps) {
  
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-[#dcdedc] text-black hover:bg-[#9f9f9f]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'bg-transparent text-gray-700 border border-gray-400 hover:bg-gray-100'
  }

  const baseClasses = 'inline-flex items-center justify-center rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 transition-colors duration-200'

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}