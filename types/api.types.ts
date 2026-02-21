import type { DifficultyLevel } from './quiz.types'

export interface RawQuestion {
  category: string
  type: string
  difficulty: DifficultyLevel
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface ApiResponse<T> {
  response_code: number
  results: T[]
}

export interface ApiError {
  message: string
  status: number
}