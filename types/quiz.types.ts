export type DifficultyLevel = 'easy' | 'medium' | 'hard'

export interface Question {
  id: number
  question: string
  options: string[]
  correctIndex: number
  category: string
  difficulty: DifficultyLevel
}

export interface QuizState {
  questions: Question[]
  currentQuestionIndex: number
  selectedOptionIndex: number | null
  correctAnswersCount: number
  isAnswerRevealed: boolean
  isQuizComplete: boolean
}

export interface QuizResults {
  score: number
  total: number
  percentage: number
}