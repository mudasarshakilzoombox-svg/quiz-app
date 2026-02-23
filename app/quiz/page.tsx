"use client"

import React from "react"
import Button from "@/components/ui/Button"
import QuestionCard from "@/components/quiz/QuestionCard"
import ResultsCard from "@/components/quiz/ResultsCard"
import TopProgressBar from "@/components/ui/TopProgressBar"
import ScoreProgressBar from "@/components/ui/ScoreProgressBar"
import DifficultyStars from "@/components/quiz/DifficultyStars"
import { useQuiz } from "@/hooks/useQuiz"

export default function QuizPage() {
  const {
    currentQuestion,
    totalQuestions,
    stats,
    getFeedbackTitle,
    getNextButtonLabel,
    handleOptionSelect,
    handleNextQuestion,
    resetQuiz,
    goToHome,

    selectedOptionIndex,
    isAnswerRevealed,
    correctAnswersCount,
    currentQuestionIndex,
    isQuizComplete,
  } = useQuiz()

  const {
    scorePercent,
    wrongPercent,
    maxPossiblePercent,
    remainingFromMaxPercent,
    topProgressPercent,
  } = stats

  return (
    <>
      {!isQuizComplete && (
        <TopProgressBar percent={topProgressPercent} />
      )}

      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-2xl">

          {isQuizComplete ? (
            <ResultsCard
              score={correctAnswersCount}
              total={totalQuestions}
              onRetake={resetQuiz}
              onHome={goToHome}
            />
          ) : !currentQuestion ? (
            <div className="rounded-xl mt-5 bg-white p-8 shadow-xl text-center">
              <h2 className="text-2xl font-bold text-gray-700">
                Loading questions...
              </h2>
            </div>
          ) : (
            <div className="rounded-xl mt-5 bg-white p-8 shadow-xl">

              <header className="mb-4">
                <h2 className="text-3xl font-bold text-gray-700">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </h2>

                <div className="text-lg text-gray-600 mt-2">
                  {currentQuestion.category}
                </div>

                <DifficultyStars
                  difficulty={currentQuestion.difficulty}
                />
              </header>

              <QuestionCard
                question={currentQuestion}
                selectedOptionIndex={selectedOptionIndex}
                onOptionSelect={handleOptionSelect}
                isAnswerRevealed={isAnswerRevealed}
              />

              {isAnswerRevealed && (
                <div className="mt-6 text-center">
                  <h3 className="mb-6 text-2xl font-bold text-gray-800">
                    {getFeedbackTitle()}
                  </h3>

                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="px-4 py-2 bg-[#dcdedc] border border-black rounded-md hover:bg-[#9f9f9f] transition-colors cursor-pointer w-[200px]"
                  >
                    {getNextButtonLabel()}
                  </Button>
                </div>
              )}

              <footer className="mt-16">
                <div className="flex items-center justify-between text-md font-bold text-gray-900 mb-2">
                  <div>Score: {scorePercent}%</div>
                  <div>Max Score: {maxPossiblePercent}%</div>
                </div>

                <ScoreProgressBar
                  scorePercent={scorePercent}
                  wrongPercent={wrongPercent}
                  maxPossiblePercent={maxPossiblePercent}
                  remainingFromMaxPercent={remainingFromMaxPercent}
                />
              </footer>
            </div>
          )}
        </div>
      </main>
    </>
  )
}