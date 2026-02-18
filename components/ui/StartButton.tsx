"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Button from './Button'

export default function StartButton({ children, ...rest }: React.ComponentProps<typeof Button>) {
  const router = useRouter()

  const handle = () => {
    router.push('/quiz')
  }

  return (
    <Button {...(rest as any)} onClick={handle}>
      {children}
    </Button>
  )
}
