import { decode, shuffle, formatCategory } from '@/utils/quiz'
import type { RawQuestion, Question, DifficultyLevel } from '@/types'

const QUESTIONS_LIMIT = 20
const API_URL = '/api/questions'
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

export class QuizService {
  private static instance: QuizService
  private questionCache: Question[] | null = null

  static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService()
    }
    return QuizService.instance
  }

  async fetchQuestions(retryCount = 0): Promise<Question[]> {
    if (this.questionCache) {
      return this.questionCache
    }

    try {
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const rawQuestions: RawQuestion[] = await response.json()
      const mappedQuestions = this.mapQuestions(rawQuestions)
      const shuffledQuestions = shuffle(mappedQuestions)
      const finalQuestions = shuffledQuestions.slice(0, QUESTIONS_LIMIT)
      
      this.questionCache = finalQuestions
      
      return finalQuestions
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, retryCount)))
        return this.fetchQuestions(retryCount + 1)
      }
      throw new Error('Failed to load questions after multiple attempts')
    }
  }

  private mapQuestions(rawQuestions: RawQuestion[]): Question[] {
    return rawQuestions.map((rawQuestion, index) => {
      const correctAnswer = decode(rawQuestion.correct_answer || '')
      const incorrectAnswers = (rawQuestion.incorrect_answers || []).map(decode)
      const shuffledOptions = shuffle([...incorrectAnswers, correctAnswer])
      const correctOptionIndex = shuffledOptions.findIndex(option => option === correctAnswer)

      return {
        id: index + 1,
        question: decode(rawQuestion.question || ''),
        options: shuffledOptions,
        correctIndex: correctOptionIndex,
        category: formatCategory(rawQuestion.category),
        difficulty: (rawQuestion.difficulty || 'easy') as DifficultyLevel,
      }
    })
  }

  clearCache(): void {
    this.questionCache = null
  }
}