"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function ResultsPage() {
  const router = useRouter()
  const [score, setScore] = useState<number | null>(null)
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quiz_results')
      if (raw) {
        const obj = JSON.parse(raw)
        setScore(Number(obj.score))
        setTotal(Number(obj.total))
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const handleRetake = () => {
    try {
      localStorage.removeItem('quiz_results')
    } catch (e) {}
    router.push('/quiz')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow">
        <h1 className="mb-4 text-3xl font-bold">Results</h1>
        {score === null || total === null ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          <>
            <p className="mb-4 text-lg text-gray-700">You scored</p>
            <div className="mb-6 text-5xl font-extrabold text-blue-600">{score}/{total}</div>
            <p className="mb-6 text-sm text-gray-500">Well done — try again to improve your score.</p>
          </>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={handleRetake}>Retake</Button>
          <Button onClick={() => router.push('/')} className="bg-gray-600 hover:bg-gray-700">
            Home
          </Button>
        </div>
      </div>
    </main>
  )
}
