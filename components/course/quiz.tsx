"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { LucideArrowRight, LucideArrowLeft, LucideCheck } from "lucide-react"

interface Question {
  id: string
  text: string
  options: {
    id: string
    text: string
  }[]
  correctOptionId: string
}

interface QuizProps {
  questions: Question[]
  onComplete: (score: number) => void
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion.id]: optionId,
    })
  }

  const handleNext = () => {
    if (showFeedback) {
      setShowFeedback(false)
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    } else {
      // Show feedback before moving to next question
      const isAnswerCorrect = selectedOptions[currentQuestion.id] === currentQuestion.correctOptionId
      setIsCorrect(isAnswerCorrect)
      setShowFeedback(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setShowFeedback(false)
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Calculate score
    let correctAnswers = 0
    questions.forEach((question) => {
      if (selectedOptions[question.id] === question.correctOptionId) {
        correctAnswers++
      }
    })

    // Call the onComplete callback with the score
    onComplete(correctAnswers)
  }

  const isQuestionAnswered = (questionId: string) => {
    return selectedOptions[questionId] !== undefined
  }

  const areAllQuestionsAnswered = questions.every((q) => isQuestionAnswered(q.id))

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex space-x-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                index === currentQuestionIndex
                  ? "bg-primary"
                  : isQuestionAnswered(questions[index].id)
                    ? "bg-green-500"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-none shadow-soft">
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-6">{currentQuestion.text}</h3>

              <RadioGroup
                value={selectedOptions[currentQuestion.id]}
                onValueChange={handleOptionSelect}
                className="space-y-4"
              >
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-2 p-3 rounded-md transition-all quiz-option ${
                      showFeedback && option.id === currentQuestion.correctOptionId
                        ? "bg-green-100 border border-green-300"
                        : showFeedback &&
                            selectedOptions[currentQuestion.id] === option.id &&
                            option.id !== currentQuestion.correctOptionId
                          ? "bg-red-100 border border-red-300"
                          : "hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      disabled={showFeedback}
                      className={showFeedback && option.id === currentQuestion.correctOptionId ? "text-green-500" : ""}
                    />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                    {showFeedback && option.id === currentQuestion.correctOptionId && (
                      <LucideCheck className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>

              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-md ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {isCorrect
                    ? "Correct! Well done."
                    : `Incorrect. The correct answer is: ${currentQuestion.options.find((o) => o.id === currentQuestion.correctOptionId)?.text}`}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <LucideArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentQuestionIndex < questions.length - 1 || showFeedback ? (
          <Button onClick={handleNext} disabled={!isQuestionAnswered(currentQuestion.id)} className="group">
            {showFeedback ? "Next Question" : "Check Answer"}
            <LucideArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!areAllQuestionsAnswered || isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

