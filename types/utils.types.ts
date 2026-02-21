export type DecodeFunction = (text: string) => string

export type ShuffleFunction = <T>(array: T[]) => T[]

export enum StorageKeys {
  QUESTIONS = 'quiz_questions',
  STATE = 'quiz_state',
  RESULTS = 'quiz_results'
}