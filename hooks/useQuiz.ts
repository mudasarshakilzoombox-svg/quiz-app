import { useEffect, useReducer, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { quizReducer, initialQuizState } from '@/reducers/quizReducer'
import { QuizService } from '@/services/quizService'
import { StorageService } from '@/services/storageService'
import type { Question, QuizStats } from '@/types'

function useQuizStats(
  questions: Question[],
  currentIndex: number,
  correctCount: number,
  isRevealed: boolean
): QuizStats {
  return useMemo(() => {
    const total = questions.length
    
    const calculatePercent = (value: number) => 
      total ? Math.min(100, Math.max(0, Math.round((value / total) * 100))) : 0

    const answeredCount = isRevealed ? currentIndex + 1 : currentIndex
    const wrongCount = Math.max(0, answeredCount - correctCount)
    const remainingCount = total - currentIndex
    
    const scorePercent = calculatePercent(correctCount)
    const wrongPercent = calculatePercent(wrongCount)
    
    const maxPossibleScore = correctCount + remainingCount
    const maxPossiblePercent = calculatePercent(maxPossibleScore)
    
    return {
      scorePercent,
      wrongPercent,
      maxPossiblePercent,
      remainingFromMaxPercent: Math.max(0, maxPossiblePercent - scorePercent),
      topProgressPercent: calculatePercent(currentIndex + 1),
      wrongCount,
      answeredCount,
      remainingCount,
    }
  }, [
    questions, 
    currentIndex, 
    correctCount, 
    isRevealed, 
    questions.length 
  ])
}

export function useQuiz() {
  const router = useRouter()
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)
  
  const quizService = QuizService.getInstance()
  const storageService = StorageService.getInstance()

  useEffect(() => {
    let mounted = true
    
    const loadQuestions = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        if (storageService.shouldReset()) {
          storageService.setResetFlag(false)
          storageService.clearAllQuizData()
        }
        
        const savedQuestions = storageService.getQuestions<Question[]>()
        
        if (savedQuestions && !storageService.shouldReset()) {
          dispatch({ type: 'SET_QUESTIONS', payload: savedQuestions })
          return
        }
        
        const freshQuestions = await quizService.fetchQuestions()
        
        if (mounted) {
          dispatch({ type: 'SET_QUESTIONS', payload: freshQuestions })
          storageService.setQuestions(freshQuestions)
        }
        
      } catch (error) {
        if (mounted) {
          dispatch({ 
            type: 'SET_ERROR', 
            payload: error instanceof Error ? error.message : 'Failed to load questions' 
          })
        }
      }
    }
    
    loadQuestions()
    
    return () => {
      mounted = false
    }
  }, [storageService, quizService])

  useEffect(() => {
    if (storageService.shouldReset()) return
    
    const savedState = storageService.getState()
    if (savedState) {
      dispatch({ type: 'LOAD_SAVED_STATE', payload: savedState })
    }
  }, [storageService])

  useEffect(() => {
    if (state.questions.length === 0) return
    if (state.isQuizComplete) return
    
    storageService.setState({
      currentQuestionIndex: state.currentQuestionIndex,
      correctAnswersCount: state.correctAnswersCount,
      selectedOptionIndex: state.selectedOptionIndex,
      isAnswerRevealed: state.isAnswerRevealed,
    })
    
    storageService.updateLastActive()
  }, [
    state.currentQuestionIndex,
    state.correctAnswersCount,
    state.selectedOptionIndex,
    state.isAnswerRevealed,
    state.isQuizComplete,
    state.questions.length,
    storageService
  ])

  const handleOptionSelect = useCallback((optionIndex: number) => {
    if (state.isAnswerRevealed || state.isQuizComplete) return
    
    dispatch({ type: 'SET_SELECTED_OPTION', payload: optionIndex })
    
    if (optionIndex === state.questions[state.currentQuestionIndex]?.correctIndex) {
      dispatch({ type: 'INCREMENT_CORRECT_COUNT' })
    }
    
    dispatch({ type: 'SET_ANSWER_REVEALED', payload: true })
  }, [state])

  const handleNextQuestion = useCallback(() => {
    const nextIndex = state.currentQuestionIndex + 1
    
    if (nextIndex >= state.questions.length) {
      dispatch({ type: 'SET_QUIZ_COMPLETE', payload: true })
      storageService.setResults({
        score: state.correctAnswersCount,
        total: state.questions.length,
        timestamp: 0
      })
    } else {
      dispatch({ type: 'SET_QUESTION_INDEX', payload: nextIndex })
    }
  }, [state, storageService])

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' })
    storageService.clearAllQuizData(true) 
    storageService.setResetFlag(true)
  }, [storageService])

  const goToHome = useCallback(() => {
    storageService.clearAllQuizData(false) 
    storageService.setResetFlag(true)
    quizService.clearCache()
    router.push('/')
  }, [router, storageService, quizService])

  const currentQuestion = useMemo(
    () => state.questions[state.currentQuestionIndex] ?? null,
    [state.questions, state.currentQuestionIndex]
  )

  const totalQuestions = state.questions.length
  
  const stats = useQuizStats(
    state.questions,
    state.currentQuestionIndex,
    state.correctAnswersCount,
    state.isAnswerRevealed
  )

  const getFeedbackTitle = useCallback(
    () => state.selectedOptionIndex === currentQuestion?.correctIndex ? 'Correct!' : 'Sorry!',
    [state.selectedOptionIndex, currentQuestion?.correctIndex]
  )

  const getNextButtonLabel = useCallback(
    () => state.currentQuestionIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question',
    [state.currentQuestionIndex, totalQuestions]
  )

  return {
    ...state,
    currentQuestion,
    totalQuestions,
    stats,
    getFeedbackTitle,
    getNextButtonLabel,
    handleOptionSelect,
    handleNextQuestion,
    resetQuiz,
    goToHome,
    isLoading: state.isLoading,
    error: state.error,
    hasQuestions: state.questions.length > 0,
  }
}