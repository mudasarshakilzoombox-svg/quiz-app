export type Question = {
  id: number
  question: string
  options: string[]
  correctIndex: number
  category?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export const questions: Question[] = [
  {
    id: 1,
    question: 'Which language runs in a web browser?',
    options: ['Java', 'C', 'Python', 'JavaScript'],
    correctIndex: 3,
    category: 'Computer Science',
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'What does CSS stand for?',
    options: [
      'Central Style Sheets',
      'Cascading Style Sheets',
      'Cascading Simple Sheets',
      'Cars SUVs Sailboats',
    ],
    correctIndex: 1,
    category: 'Web',
    difficulty: 'easy',
  },
  {
    id: 3,
    question: "What is Ron Weasley's middle name?",
    options: ['Dominic', 'Bilius', 'Arthur', 'John'],
    correctIndex: 1,
    category: 'Entertainment: Books',
    difficulty: 'hard',
  },
  {
    id: 4,
    question: 'Which company developed the React library?',
    options: ['Google', 'Meta (Facebook)', 'Microsoft', 'Twitter'],
    correctIndex: 1,
    category: 'Technology',
    difficulty: 'medium',
  },
  {
    id: 5,
    question: 'Which tag is used to include JavaScript in HTML?',
    options: ['<js>', '<script>', '<code>', '<javascript>'],
    correctIndex: 1,
    category: 'Web',
    difficulty: 'easy',
  },
]
