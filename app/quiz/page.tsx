"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import QuestionCard from '@/components/quiz/QuestionCard'
import ResultsCard from '@/components/quiz/ResultsCard'
import TopProgressBar from '@/components/ui/TopProgressBar'
import ScoreProgressBar from '@/components/ui/ScoreProgressBar'
import DifficultyStars from '@/components/quiz/DifficultyStars'
import { useQuiz } from '@/hooks'

export default function QuizPage() {
  const router = useRouter()
  const {
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
    resetQuiz
  } = useQuiz()

  const { isQuizComplete, selectedOptionIndex, isAnswerRevealed } = state

  return (
    <>
      {!isQuizComplete && <TopProgressBar percent={topProgressPercentage} />}

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-2xl">
          {isQuizComplete ? (
            <ResultsCard 
              score={state.correctAnswersCount}
              total={totalQuestions}
              onRetake={() => {
                resetQuiz()
                router.push('/quiz')
              }}
              onHome={() => router.push('/')}
            />
          ) : (
            <div className="rounded-xl bg-white p-8 shadow-xl mt-5">
              <header className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-700">
                      Question {state.currentQuestionIndex + 1} of {totalQuestions}
                    </h2>
                    <div className="text-lg text-gray-600">Entertainment: {currentQuestion.category}</div>
                    <DifficultyStars difficulty={currentQuestion.difficulty} />
                  </div>
                </div>
              </header>

              <QuestionCard 
                question={currentQuestion} 
                selectedOptionIndex={selectedOptionIndex} 
                onOptionSelect={handleOptionSelect} 
                isAnswerRevealed={isAnswerRevealed} 
              />

              <div className="mt-4 text-center">
                {isAnswerRevealed && (
                  <div>
                    <h3 className="mb-8 mt-12 text-2xl font-bold text-gray-800">{getFeedbackTitle()}</h3>
                    <Button 
                      onClick={handleNextQuestion} 
                      size="lg"
                      className="text-base md:text-lg lg:text-xl font-[400]  px-4 py-2 bg-[#dcdedc] border border-black rounded-md  hover:bg-[#9f9f9f] transition-colors cursor-pointer w-[200px]"
                    >
                      {getNextButtonLabel()}
                    </Button>
                  </div>
                )}
              </div>

              <footer className="mt-16">
                <div className="flex items-center justify-between text-md font-bold text-gray-900 mb-2">
                  <div>Score: {scorePercentage}%</div>
                  <div>Max Score: {maxPossibleScorePercentage}%</div>
                </div>
                <ScoreProgressBar
                  scorePercent={scorePercentage}
                  wrongPercent={wrongAnswersPercentage}
                  maxPossiblePercent={maxPossibleScorePercentage}
                  remainingFromMaxPercent={remainingFromMaxPercentage}
                />
              </footer>
            </div>
          )}
        </div>
      </main>
    </>
  )
}