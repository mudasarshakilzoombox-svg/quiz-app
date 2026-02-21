import { useEffect, useReducer } from 'react'
import { useRouter } from 'next/navigation'
import { quizReducer, initialQuizState, QuizActionType } from '@/reducers/quizReducer'
import { decode, shuffle } from '@/utils/quiz'
import type { RawQuestion, Question, DifficultyLevel } from '@/types'

export function useQuiz() {
  const router = useRouter()
  const [state, dispatch] = useReducer(quizReducer, initialQuizState)

  useEffect(() => {
    let mounted = true
    const savedQuestions = localStorage.getItem('quiz_questions')
    
    if (savedQuestions) {
      const parsed = JSON.parse(savedQuestions)
      if (mounted) dispatch({ type: QuizActionType.SET_QUESTIONS, payload: parsed })
      return
    }

    fetch('/api/questions')
      .then((response) => response.json())
      .then((rawQuestions: RawQuestion[]) => {
        if (!mounted) return
        
        const mappedQuestions: Question[] = rawQuestions.map((rawQuestion, index) => {
          const correctAnswer = decode(rawQuestion.correct_answer || '')
          const incorrectAnswers = (rawQuestion.incorrect_answers || []).map((answer: string) => decode(answer))
          const shuffledOptions = shuffle([...incorrectAnswers, correctAnswer])
          const correctOptionIndex = shuffledOptions.findIndex((option) => option === correctAnswer)
          
          return {
            id: index + 1,
            question: decode(rawQuestion.question || ''),
            options: shuffledOptions,
            correctIndex: correctOptionIndex,
            category: rawQuestion.category ? decode(rawQuestion.category) : 'General',
            difficulty: (rawQuestion.difficulty || 'easy') as DifficultyLevel,
          }
        })
        
        const shuffledQuestions = shuffle(mappedQuestions)
        const questionsLimit = Math.min(20, shuffledQuestions.length)
        const finalQuestions = shuffledQuestions.slice(0, questionsLimit)
        
        dispatch({ type: QuizActionType.SET_QUESTIONS, payload: finalQuestions })
        
        try {
          localStorage.setItem('quiz_questions', JSON.stringify(finalQuestions))
        } catch (error) {
          console.error('Failed to save questions:', error)
        }
      })
      .catch((error) => {
        console.error('Failed to fetch questions:', error)
      })
      
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const savedState = localStorage.getItem('quiz_state')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        dispatch({ type: QuizActionType.LOAD_SAVED_STATE, payload: parsedState })
      } catch (error) {
        console.error('Failed to load saved state:', error)
      }
    }
  }, [])

  useEffect(() => {
    const stateToSave = {
      currentQuestionIndex: state.currentQuestionIndex,
      correctAnswersCount: state.correctAnswersCount,
      selectedOptionIndex: state.selectedOptionIndex,
      isAnswerRevealed: state.isAnswerRevealed,
    }
    try {
      localStorage.setItem('quiz_state', JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Failed to save state:', error)
    }
  }, [state.currentQuestionIndex, state.correctAnswersCount, state.selectedOptionIndex, state.isAnswerRevealed])

  const handleOptionSelect = (optionIndex: number) => {
    if (state.isAnswerRevealed) return
    dispatch({ type: QuizActionType.SET_SELECTED_OPTION, payload: optionIndex })
    if (optionIndex === state.questions[state.currentQuestionIndex]?.correctIndex) {
      dispatch({ type: QuizActionType.INCREMENT_CORRECT_COUNT })
    }
    dispatch({ type: QuizActionType.SET_ANSWER_REVEALED, payload: true })
  }

  const handleNextQuestion = () => {
    if (!state.isAnswerRevealed) {
      if (state.selectedOptionIndex === null) return
      if (state.selectedOptionIndex === state.questions[state.currentQuestionIndex]?.correctIndex) {
        dispatch({ type: QuizActionType.INCREMENT_CORRECT_COUNT })
      }
      dispatch({ type: QuizActionType.SET_ANSWER_REVEALED, payload: true })
      return
    }

    const nextQuestionIndex = state.currentQuestionIndex + 1
    if (nextQuestionIndex >= state.questions.length) {
      dispatch({ type: QuizActionType.SET_QUIZ_COMPLETE, payload: true })
      try {
        localStorage.setItem('quiz_results', JSON.stringify({ 
          score: state.correctAnswersCount, 
          total: state.questions.length 
        }))
      } catch (error) {
        console.error('Failed to save results:', error)
      }
    } else {
      dispatch({ type: QuizActionType.SET_QUESTION_INDEX, payload: nextQuestionIndex })
    }
  }

  const resetQuiz = () => {
    dispatch({ type: QuizActionType.RESET_QUIZ })
    localStorage.removeItem('quiz_state')
    localStorage.removeItem('quiz_questions')
    localStorage.removeItem('quiz_results')
  }

  const currentQuestion = state.questions[state.currentQuestionIndex] || { 
    id: 0,
    question: '', 
    options: [], 
    correctIndex: 0, 
    category: '', 
    difficulty: 'easy' as DifficultyLevel
  }

  const totalQuestions = state.questions.length
  const answeredQuestionsCount = state.isAnswerRevealed ? state.currentQuestionIndex + 1 : state.currentQuestionIndex
  const wrongAnswersCount = Math.max(0, answeredQuestionsCount - state.correctAnswersCount)

  const scorePercentage = totalQuestions ? Math.round((state.correctAnswersCount / totalQuestions) * 100) : 0
  const wrongAnswersPercentage = totalQuestions ? Math.round((wrongAnswersCount / totalQuestions) * 100) : 0
  const maxPossibleScorePercentage = totalQuestions ? 
    Math.round(((state.correctAnswersCount + (totalQuestions - (state.currentQuestionIndex + 1))) / totalQuestions) * 100) : 0
  const remainingFromMaxPercentage = Math.max(0, maxPossibleScorePercentage - scorePercentage)
  const topProgressPercentage = totalQuestions ? 
    Math.round(((state.currentQuestionIndex + 1) / totalQuestions) * 100) : 0

  const getFeedbackTitle = () => {
    return state.selectedOptionIndex === currentQuestion.correctIndex ? 'Correct!' : 'Sorry!'
  }

  const getNextButtonLabel = () => {
    return state.currentQuestionIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'
  }

  return {
    state,
    currentQuestion,
    totalQuestions,
    scorePercentage,
    wrongAnswersPercentage,
    maxPossibleScorePercentage,
    remainingFromMaxPercentage,
    topProgressPercentage,
    getFeedbackTitle,
    getNextButtonLabel,
    handleOptionSelect,
    handleNextQuestion,
    resetQuiz,
    dispatch
  }
}