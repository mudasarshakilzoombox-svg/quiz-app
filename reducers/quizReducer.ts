import type { Question, QuizState } from '@/types'

// Define action types as enum
export enum QuizActionType {
  SET_QUESTIONS = 'SET_QUESTIONS',
  SET_QUESTION_INDEX = 'SET_QUESTION_INDEX',
  SET_SELECTED_OPTION = 'SET_SELECTED_OPTION',
  INCREMENT_CORRECT_COUNT = 'INCREMENT_CORRECT_COUNT',
  SET_ANSWER_REVEALED = 'SET_ANSWER_REVEALED',
  SET_QUIZ_COMPLETE = 'SET_QUIZ_COMPLETE',
  RESET_QUIZ = 'RESET_QUIZ',
  LOAD_SAVED_STATE = 'LOAD_SAVED_STATE'
}

// Define action interfaces
export interface SetQuestionsAction {
  type: QuizActionType.SET_QUESTIONS
  payload: Question[]
}

export interface SetQuestionIndexAction {
  type: QuizActionType.SET_QUESTION_INDEX
  payload: number
}

export interface SetSelectedOptionAction {
  type: QuizActionType.SET_SELECTED_OPTION
  payload: number | null
}

export interface IncrementCorrectCountAction {
  type: QuizActionType.INCREMENT_CORRECT_COUNT
}

export interface SetAnswerRevealedAction {
  type: QuizActionType.SET_ANSWER_REVEALED
  payload: boolean
}

export interface SetQuizCompleteAction {
  type: QuizActionType.SET_QUIZ_COMPLETE
  payload: boolean
}

export interface ResetQuizAction {
  type: QuizActionType.RESET_QUIZ
}

export interface LoadSavedStateAction {
  type: QuizActionType.LOAD_SAVED_STATE
  payload: Partial<QuizState>
}

// Union type for all actions
export type QuizAction =
  | SetQuestionsAction
  | SetQuestionIndexAction
  | SetSelectedOptionAction
  | IncrementCorrectCountAction
  | SetAnswerRevealedAction
  | SetQuizCompleteAction
  | ResetQuizAction
  | LoadSavedStateAction

// Initial state
export const initialQuizState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  correctAnswersCount: 0,
  isAnswerRevealed: false,
  isQuizComplete: false,
}

// Reducer function
export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case QuizActionType.SET_QUESTIONS:
      return { ...state, questions: action.payload }
      
    case QuizActionType.SET_QUESTION_INDEX:
      return { 
        ...state, 
        currentQuestionIndex: action.payload, 
        selectedOptionIndex: null, 
        isAnswerRevealed: false 
      }
      
    case QuizActionType.SET_SELECTED_OPTION:
      return { ...state, selectedOptionIndex: action.payload }
      
    case QuizActionType.INCREMENT_CORRECT_COUNT:
      return { ...state, correctAnswersCount: state.correctAnswersCount + 1 }
      
    case QuizActionType.SET_ANSWER_REVEALED:
      return { ...state, isAnswerRevealed: action.payload }
      
    case QuizActionType.SET_QUIZ_COMPLETE:
      return { ...state, isQuizComplete: action.payload }
      
    case QuizActionType.RESET_QUIZ:
      return initialQuizState
      
    case QuizActionType.LOAD_SAVED_STATE:
      return {
        ...state,
        currentQuestionIndex: action.payload.currentQuestionIndex ?? state.currentQuestionIndex,
        correctAnswersCount: action.payload.correctAnswersCount ?? state.correctAnswersCount,
        selectedOptionIndex: action.payload.selectedOptionIndex ?? state.selectedOptionIndex,
        isAnswerRevealed: action.payload.isAnswerRevealed ?? state.isAnswerRevealed,
      }
      
    default:
      return state
  }
}