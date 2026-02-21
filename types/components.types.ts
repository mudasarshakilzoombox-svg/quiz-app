import type { Question } from './quiz.types'

export interface QuestionCardProps {
  question: Question
  selectedOptionIndex: number | null
  onOptionSelect: (index: number) => void
  isAnswerRevealed: boolean
}

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface ProgressBarProps {
  percent: number
  height?: 'sm' | 'md' | 'lg'
  color?: string
  backgroundColor?: string
}

export interface ScoreProgressBarProps {
  scorePercent: number
  wrongPercent: number
  maxPossiblePercent: number
  remainingFromMaxPercent: number
}

export interface DifficultyStarsProps {
  difficulty: 'easy' | 'medium' | 'hard'
  size?: 'sm' | 'md' | 'lg'
}

export interface ResultsCardProps {
  score: number
  total: number
  onRetake: () => void
  onHome: () => void
}