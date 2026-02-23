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
  isLoading: boolean
  error: string | null
}

export type QuizActionType = 
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_QUESTION_INDEX'; payload: number }
  | { type: 'SET_SELECTED_OPTION'; payload: number | null }
  | { type: 'INCREMENT_CORRECT_COUNT' }
  | { type: 'SET_ANSWER_REVEALED'; payload: boolean }
  | { type: 'SET_QUIZ_COMPLETE'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_QUIZ' }
  | { type: 'LOAD_SAVED_STATE'; payload: Partial<QuizState> }

export interface QuizStats {
  scorePercent: number
  wrongPercent: number
  maxPossiblePercent: number
  remainingFromMaxPercent: number
  topProgressPercent: number
  wrongCount: number
  answeredCount: number
  remainingCount: number
}