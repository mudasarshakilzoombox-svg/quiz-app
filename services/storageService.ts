export interface StorableQuizState {
  currentQuestionIndex: number
  correctAnswersCount: number
  selectedOptionIndex: number | null
  isAnswerRevealed: boolean
}

export interface QuizResults {
  score: number
  total: number
  timestamp?: number 
}

export class StorageService {
  private static instance: StorageService
  private storage = typeof window !== 'undefined' ? localStorage : null
  private session = typeof window !== 'undefined' ? sessionStorage : null

  static readonly KEYS = {
    QUESTIONS: 'quiz_questions',
    STATE: 'quiz_state',
    RESULTS: 'quiz_results',
    RESET_FLAG: 'quiz_should_reset',
    LAST_ACTIVE: 'quiz_last_active'
  } as const

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService()
    }
    return StorageService.instance
  }

  private getItem<T>(storage: Storage, key: string, fallback: T | null = null): T | null {
    try {
      const item = storage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch (error) {
      console.error(`Failed to get ${key} from storage:`, error)
      return fallback
    }
  }

  private setItem<T>(storage: Storage, key: string, value: T): boolean {
    try {
      storage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Failed to set ${key} in storage:`, error)
      return false
    }
  }

  private removeItem(storage: Storage, key: string): boolean {
    try {
      storage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove ${key} from storage:`, error)
      return false
    }
  }

  getQuestions<T>(): T | null {
    return this.getItem(this.storage!, StorageService.KEYS.QUESTIONS, null)
  }

  setQuestions<T>(questions: T): boolean {
    return this.setItem(this.storage!, StorageService.KEYS.QUESTIONS, questions)
  }

  getState(): StorableQuizState | null {
    return this.getItem<StorableQuizState>(this.storage!, StorageService.KEYS.STATE, null)
  }

  setState(state: StorableQuizState): boolean {
    return this.setItem(this.storage!, StorageService.KEYS.STATE, state)
  }

  getResults(): QuizResults | null {
    return this.getItem<QuizResults>(this.storage!, StorageService.KEYS.RESULTS, null)
  }

  setResults(results: QuizResults): boolean {
    return this.setItem(this.storage!, StorageService.KEYS.RESULTS, {
      ...results,
      timestamp: Date.now()
    })
  }

  shouldReset(): boolean {
    return this.session?.getItem(StorageService.KEYS.RESET_FLAG) === 'true'
  }

  setResetFlag(shouldReset: boolean): void {
    if (shouldReset) {
      this.session?.setItem(StorageService.KEYS.RESET_FLAG, 'true')
    } else {
      this.session?.removeItem(StorageService.KEYS.RESET_FLAG)
    }
  }

  clearAllQuizData(keepQuestions = false): void {
    if (this.storage) {
      this.removeItem(this.storage, StorageService.KEYS.STATE)
      this.removeItem(this.storage, StorageService.KEYS.RESULTS)
      
      if (!keepQuestions) {
        this.removeItem(this.storage, StorageService.KEYS.QUESTIONS)
      }
    }
    
    if (this.session) {
      this.removeItem(this.session, StorageService.KEYS.RESET_FLAG)
    }
  }

  updateLastActive(): void {
    if (this.storage) {
      this.setItem(this.storage, StorageService.KEYS.LAST_ACTIVE, Date.now())
    }
  }
}