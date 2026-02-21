import type { QuizState, QuizAction } from '@/types/quiz.types'

export const initialQuizState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedOptionIndex: null,
  correctAnswersCount: 0,
  isAnswerRevealed: false,
  isQuizComplete: false,
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload }
      
    case 'SET_QUESTION_INDEX':
      return { 
        ...state, 
        currentQuestionIndex: action.payload, 
        selectedOptionIndex: null, 
        isAnswerRevealed: false 
      }
      
    case 'SET_SELECTED_OPTION':
      return { ...state, selectedOptionIndex: action.payload }
      
    case 'INCREMENT_CORRECT_COUNT':
      return { ...state, correctAnswersCount: state.correctAnswersCount + 1 }
      
    case 'SET_ANSWER_REVEALED':
      return { ...state, isAnswerRevealed: action.payload }
      
    case 'SET_QUIZ_COMPLETE':
      return { ...state, isQuizComplete: action.payload }
      
    case 'RESET_QUIZ':
      return initialQuizState
      
    case 'LOAD_SAVED_STATE':
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