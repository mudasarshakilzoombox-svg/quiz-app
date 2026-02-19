export type QuizQuestion = {
  id: number
  question: string
  options: string[]
  correctIndex: number
  category?: string
  difficulty?: string
}

export type RawQuestion = {
  category?: string
  type?: string
  difficulty?: string
  question?: string
  correct_answer?: string
  incorrect_answers?: string[]
}
