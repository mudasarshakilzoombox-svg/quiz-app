"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'
import Spinner from './Spinner'

export default function StartButton({ children, ...rest }: React.ComponentProps<typeof Button>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handle = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    if (loading) return
    setLoading(true)
    // show spinner briefly, then navigate to quiz
    setTimeout(() => {
      router.push('/quiz')
    }, 600)
  }

  return (
    <>
      <Button {...(rest as any)} onClick={handle} disabled={loading}>
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        )}
        {children}
      </Button>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white cursor-wait" role="status" aria-live="polite" aria-busy="true">
          <div className="flex flex-col items-center">
            <Spinner />
          </div>
        </div>
      )}
    </>
  )
}
