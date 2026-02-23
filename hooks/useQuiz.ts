import { useEffect, useReducer, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { quizReducer, initialQuizState } from '@/reducers/quizReducer'
import { decode, shuffle, formatCategory } from '@/utils/quiz'
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove, safeJsonParse } from '@/utils/storage'
import type { RawQuestion, Question, DifficultyLevel } from '@/types'

const STORAGE_KEYS = {
  QUESTIONS: 'quiz_questions',
  STATE: 'quiz_state',
  RESULTS: 'quiz_results',
  RESET_FLAG: 'quiz_should_reset'
} as const

const QUESTIONS_LIMIT = 20

export function useQuiz() {
  const router = useRouter()
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)

  const clearStorage = useCallback((options?: { keepQuestions?: boolean }) => {
    safeLocalStorageRemove(STORAGE_KEYS.STATE)
    safeLocalStorageRemove(STORAGE_KEYS.RESULTS)
    
    if (!options?.keepQuestions) {
      safeLocalStorageRemove(STORAGE_KEYS.QUESTIONS)
    }
  }, [])

  const setResetFlag = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEYS.RESET_FLAG, 'true')
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadQuestions = async () => {
      const shouldReset = sessionStorage.getItem(STORAGE_KEYS.RESET_FLAG)
      
      if (shouldReset === 'true') {
        sessionStorage.removeItem(STORAGE_KEYS.RESET_FLAG)
        clearStorage()
      }
      
      const savedQuestions = safeLocalStorageGet(STORAGE_KEYS.QUESTIONS)
      
      if (savedQuestions && shouldReset !== 'true') {
        const parsed = safeJsonParse<Question[]>(savedQuestions, [])
        if (mounted && parsed.length > 0) {
          dispatch({ type: 'SET_QUESTIONS', payload: parsed })
          return
        }
      }

      try {
        const response = await fetch('/api/questions')
        const rawQuestions: RawQuestion[] = await response.json()
        
        if (!mounted) return
        
        const mappedQuestions: Question[] = rawQuestions.map((rawQuestion, questionIndex) => {
          const correctAnswer = decode(rawQuestion.correct_answer || '')
          const incorrectAnswers = (rawQuestion.incorrect_answers || []).map((incorrectAnswer: string) => decode(incorrectAnswer))
          const shuffledOptions = shuffle([...incorrectAnswers, correctAnswer])
          const correctOptionIndex = shuffledOptions.findIndex((option) => option === correctAnswer)
          
          return {
            id: questionIndex + 1,
            question: decode(rawQuestion.question || ''),
            options: shuffledOptions,
            correctIndex: correctOptionIndex,
            category: formatCategory(rawQuestion.category),
            difficulty: (rawQuestion.difficulty || 'easy') as DifficultyLevel,
          }
        })
        
        const shuffledQuestions = shuffle(mappedQuestions)
        const finalQuestions = shuffledQuestions.slice(0, QUESTIONS_LIMIT)
        
        dispatch({ type: 'SET_QUESTIONS', payload: finalQuestions })
        safeLocalStorageSet(STORAGE_KEYS.QUESTIONS, finalQuestions)
        
      } catch (error) {
        console.error('Failed to fetch questions:', error)
      }
    }
    
    loadQuestions()
    
    return () => {
      mounted = false
    }
  }, [clearStorage])

  useEffect(() => {
    const shouldReset = sessionStorage.getItem(STORAGE_KEYS.RESET_FLAG)
    if (shouldReset === 'true') return
    
    const savedState = safeLocalStorageGet(STORAGE_KEYS.STATE)
    if (savedState) {
      const parsedState = safeJsonParse(savedState, {})
      if (Object.keys(parsedState).length > 0) {
        dispatch({ type: 'LOAD_SAVED_STATE', payload: parsedState })
      }
    }
  }, [])

  useEffect(() => {
    if (state.questions.length === 0) return
    if (state.isQuizComplete) return 
    
    const stateToSave = {
      currentQuestionIndex: state.currentQuestionIndex,
      correctAnswersCount: state.correctAnswersCount,
      selectedOptionIndex: state.selectedOptionIndex,
      isAnswerRevealed: state.isAnswerRevealed,
    }
    safeLocalStorageSet(STORAGE_KEYS.STATE, stateToSave)
  }, [
    state.currentQuestionIndex, 
    state.correctAnswersCount, 
    state.selectedOptionIndex, 
    state.isAnswerRevealed,
    state.isQuizComplete,
    state.questions.length
  ])

  const handleOptionSelect = useCallback((optionIndex: number) => {
    if (state.isAnswerRevealed) return
    
    dispatch({ type: 'SET_SELECTED_OPTION', payload: optionIndex })
    
    if (optionIndex === state.questions[state.currentQuestionIndex]?.correctIndex) {
      dispatch({ type: 'INCREMENT_CORRECT_COUNT' })
    }
    
    dispatch({ type: 'SET_ANSWER_REVEALED', payload: true })
  }, [state.isAnswerRevealed, state.questions, state.currentQuestionIndex])

  const handleNextQuestion = useCallback(() => {
    const nextQuestionIndex = state.currentQuestionIndex + 1
    
    if (nextQuestionIndex >= state.questions.length) {
      dispatch({ type: 'SET_QUIZ_COMPLETE', payload: true })
      safeLocalStorageSet(STORAGE_KEYS.RESULTS, { 
        score: state.correctAnswersCount, 
        total: state.questions.length 
      })
    } else {
      dispatch({ type: 'SET_QUESTION_INDEX', payload: nextQuestionIndex })
    }
  }, [state.currentQuestionIndex, state.questions.length, state.correctAnswersCount])

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' })
    clearStorage({ keepQuestions: true })
    setResetFlag()
  }, [clearStorage, setResetFlag])

  const goToHome = useCallback(() => {
    setResetFlag()
    dispatch({ type: 'RESET_QUIZ' })
    clearStorage()
    router.push('/')
  }, [router, clearStorage, setResetFlag])

  const currentQuestion = useMemo(() => 
    state.questions[state.currentQuestionIndex] || { 
      id: 0,
      question: '', 
      options: [], 
      correctIndex: 0, 
      category: '', 
      difficulty: 'easy' as DifficultyLevel
    }, 
    [state.questions, state.currentQuestionIndex]
  )

  const totalQuestions = state.questions.length

  const stats = useMemo(() => {
    const calculatePercentage = (value: number, total: number) => 
      total ? Math.min(100, Math.max(0, Math.round((value / total) * 100))) : 0

    const answeredCount = state.isAnswerRevealed ? state.currentQuestionIndex + 1 : state.currentQuestionIndex
    const wrongCount = Math.max(0, answeredCount - state.correctAnswersCount)
    
    const scorePercent = calculatePercentage(state.correctAnswersCount, totalQuestions)
    const wrongPercent = calculatePercentage(wrongCount, totalQuestions)
    
    const remainingQuestions = totalQuestions - state.currentQuestionIndex
    const maxPossibleScore = state.correctAnswersCount + remainingQuestions
    const safeMaxPossibleScore = Math.min(totalQuestions, Math.max(0, maxPossibleScore))
    const maxPossiblePercent = calculatePercentage(safeMaxPossibleScore, totalQuestions)
    
    const remainingPotentialPercent = Math.max(0, maxPossiblePercent - scorePercent)
    const topProgressPercent = calculatePercentage(state.currentQuestionIndex + 1, totalQuestions)

    return {
      scorePercent,
      wrongPercent,
      maxPossiblePercent,
      remainingFromMaxPercent: remainingPotentialPercent,
      topProgressPercent,
      wrongCount
    }
  }, [
    state.correctAnswersCount, 
    state.currentQuestionIndex, 
    state.isAnswerRevealed, 
    totalQuestions
  ])

  const getFeedbackTitle = useCallback(() => 
    state.selectedOptionIndex === currentQuestion.correctIndex ? 'Correct!' : 'Sorry!',
    [state.selectedOptionIndex, currentQuestion.correctIndex]
  )

  const getNextButtonLabel = useCallback(() => 
    state.currentQuestionIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question',
    [state.currentQuestionIndex, totalQuestions]
  )

  return {
    state,
    currentQuestion,
    totalQuestions,
    stats,
    getFeedbackTitle,
    getNextButtonLabel,
    handleOptionSelect,
    handleNextQuestion,
    resetQuiz,
    goToHome,
    dispatch
  }
}