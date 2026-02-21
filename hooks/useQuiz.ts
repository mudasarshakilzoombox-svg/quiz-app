import { useEffect, useReducer, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { quizReducer, initialQuizState } from '@/reducers/quizReducer'
import { decode, shuffle, formatCategory } from '@/utils/quiz'
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove, safeJsonParse } from '@/utils/storage'
import type { RawQuestion, Question, DifficultyLevel } from '@/types'

export function useQuiz() {
  const router = useRouter()
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)

  useEffect(() => {
    let mounted = true
    
    const loadQuestions = async () => {
      const shouldReset = sessionStorage.getItem('quiz_should_reset')
      if (shouldReset === 'true') {
        sessionStorage.removeItem('quiz_should_reset')
        safeLocalStorageRemove('quiz_state')
        safeLocalStorageRemove('quiz_questions')
        safeLocalStorageRemove('quiz_results')
      }
      
      const savedQuestions = safeLocalStorageGet('quiz_questions')
      
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
        const questionsLimit = Math.min(20, shuffledQuestions.length)
        const finalQuestions = shuffledQuestions.slice(0, questionsLimit)
        
        dispatch({ type: 'SET_QUESTIONS', payload: finalQuestions })
        safeLocalStorageSet('quiz_questions', finalQuestions)
        
      } catch (error) {
        console.error('Failed to fetch questions:', error)
      }
    }
    
    loadQuestions()
    
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const shouldReset = sessionStorage.getItem('quiz_should_reset')
    if (shouldReset === 'true') return
    
    const savedState = safeLocalStorageGet('quiz_state')
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
    safeLocalStorageSet('quiz_state', stateToSave)
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
      safeLocalStorageSet('quiz_results', { 
        score: state.correctAnswersCount, 
        total: state.questions.length 
      })
    } else {
      dispatch({ type: 'SET_QUESTION_INDEX', payload: nextQuestionIndex })
    }
  }, [state.currentQuestionIndex, state.questions.length, state.correctAnswersCount])

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET_QUIZ' })
    safeLocalStorageRemove('quiz_state')
    safeLocalStorageRemove('quiz_results')
    sessionStorage.setItem('quiz_should_reset', 'true')
    
  }, [])

  const goToHome = useCallback(() => {
    sessionStorage.setItem('quiz_should_reset', 'true')
    dispatch({ type: 'RESET_QUIZ' })
    safeLocalStorageRemove('quiz_state')
    safeLocalStorageRemove('quiz_questions')
    safeLocalStorageRemove('quiz_results')
    router.push('/')
  }, [router])

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
    const answeredCount = state.isAnswerRevealed ? state.currentQuestionIndex + 1 : state.currentQuestionIndex
    const wrongCount = Math.max(0, answeredCount - state.correctAnswersCount)
    
    const scorePercent = totalQuestions ? 
      Math.min(100, Math.max(0, Math.round((state.correctAnswersCount / totalQuestions) * 100))) : 0
    
    const wrongPercent = totalQuestions ? 
      Math.min(100, Math.max(0, Math.round((wrongCount / totalQuestions) * 100))) : 0
    
    const remainingQuestions = totalQuestions - state.currentQuestionIndex
    const maxPossibleScore = state.correctAnswersCount + remainingQuestions
    const safeMaxPossibleScore = Math.min(totalQuestions, Math.max(0, maxPossibleScore))
    const maxPossiblePercent = totalQuestions ? 
      Math.min(100, Math.max(0, Math.round((safeMaxPossibleScore / totalQuestions) * 100))) : 0
    
    const remainingPotentialPercent = Math.max(0, maxPossiblePercent - scorePercent)
    const topProgressPercent = totalQuestions ? 
      Math.min(100, Math.max(0, Math.round(((state.currentQuestionIndex + 1) / totalQuestions) * 100))) : 0

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

  const getFeedbackTitle = useCallback(() => {
    return state.selectedOptionIndex === currentQuestion.correctIndex ? 'Correct!' : 'Sorry!'
  }, [state.selectedOptionIndex, currentQuestion.correctIndex])

  const getNextButtonLabel = useCallback(() => {
    return state.currentQuestionIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'
  }, [state.currentQuestionIndex, totalQuestions])

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