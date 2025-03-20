"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { LucideArrowRight, LucideArrowLeft, LucideClock } from "lucide-react"
import { QuizResult } from "@/components/course/quiz-result"

interface FinalTestProps {
  onComplete: (score: number) => void
}

// Different question types
type MultipleChoiceQuestion = {
  id: string
  type: "multiple-choice"
  text: string
  options: { id: string; text: string }[]
  correctOptionId: string
}

type TextQuestion = {
  id: string
  type: "text"
  text: string
  expectedKeywords: string[]
}

type SortingQuestion = {
  id: string
  type: "sorting"
  text: string
  items: { id: string; text: string }[]
  correctOrder: string[]
}

type Question = MultipleChoiceQuestion | TextQuestion | SortingQuestion

// Define a type for the answers
type AnswerValue = string | { id: string; text: string }[]
type Answers = Record<string, AnswerValue>

export function FinalTest({ onComplete }: FinalTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60 * 60) // 60 minutes in seconds
  const [sortItems, setSortItems] = useState<{ id: string; text: string }[]>([])

  const questions: Question[] = useMemo(() => [
    {
      id: "q1",
      type: "multiple-choice",
      text: "Which of the following is considered assessable income?",
      options: [
        { id: "q1a", text: "Gifts from family members" },
        { id: "q1b", text: "Inheritance" },
        { id: "q1c", text: "Salary and wages" },
        { id: "q1d", text: "Life insurance proceeds" },
      ],
      correctOptionId: "q1c",
    },
    {
      id: "q2",
      type: "multiple-choice",
      text: "What is the difference between a tax deduction and a tax offset?",
      options: [
        { id: "q2a", text: "There is no difference" },
        {
          id: "q2b",
          text: "A tax deduction reduces your assessable income, while a tax offset directly reduces your tax payable",
        },
        {
          id: "q2c",
          text: "A tax offset reduces your assessable income, while a tax deduction directly reduces your tax payable",
        },
        { id: "q2d", text: "Tax deductions are for individuals, while tax offsets are for businesses" },
      ],
      correctOptionId: "q2b",
    },
    {
      id: "q3",
      type: "text",
      text: "Explain the concept of negative gearing in relation to rental properties.",
      expectedKeywords: ["expenses exceed income", "tax deduction", "investment loss", "offset against other income"],
    },
    {
      id: "q4",
      type: "multiple-choice",
      text: "How is the decline in value (depreciation) of a rental property's building calculated?",
      options: [
        { id: "q4a", text: "At 2.5% per year for 40 years for residential rental properties" },
        { id: "q4b", text: "At 10% per year for 10 years" },
        { id: "q4c", text: "At 5% per year for 20 years" },
        { id: "q4d", text: "It varies based on the property's market value" },
      ],
      correctOptionId: "q4a",
    },
    {
      id: "q5",
      type: "sorting",
      text: "Sort the following steps in the correct order for determining tax residency status.",
      items: [
        { id: "s1", text: "Apply the 183-day test if necessary" },
        { id: "s2", text: "Determine if the person resides in Australia" },
        { id: "s3", text: "Apply the domicile test if necessary" },
        { id: "s4", text: "Apply the Commonwealth superannuation test if necessary" },
      ],
      correctOrder: ["s2", "s1", "s3", "s4"],
    },
    {
      id: "q6",
      type: "multiple-choice",
      text: "Which method can be used to claim motor vehicle expenses?",
      options: [
        { id: "q6a", text: "Only the logbook method" },
        { id: "q6b", text: "Only the cents per kilometer method" },
        { id: "q6c", text: "Either the logbook method or the cents per kilometer method" },
        { id: "q6d", text: "Neither, motor vehicle expenses are not deductible" },
      ],
      correctOptionId: "q6c",
    },
    {
      id: "q7",
      type: "text",
      text: "Describe the tax treatment of fully franked dividends for Australian residents.",
      expectedKeywords: ["assessable income", "franking credits", "tax offset", "imputation", "company tax"],
    },
    {
      id: "q8",
      type: "multiple-choice",
      text: "What discount is available for capital gains on assets held for more than 12 months by individuals?",
      options: [
        { id: "q8a", text: "No discount" },
        { id: "q8b", text: "25% discount" },
        { id: "q8c", text: "50% discount" },
        { id: "q8d", text: "100% discount (tax-free)" },
      ],
      correctOptionId: "q8c",
    },
    {
      id: "q9",
      type: "sorting",
      text: "Sort the following deductions in order of when they are applied in calculating taxable income.",
      items: [
        { id: "d1", text: "Tax offsets" },
        { id: "d2", text: "Work-related expenses" },
        { id: "d3", text: "Medicare levy" },
        { id: "d4", text: "Capital losses" },
      ],
      correctOrder: ["d2", "d4", "d3", "d1"],
    },
    {
      id: "q10",
      type: "multiple-choice",
      text: "When are self-education expenses deductible?",
      options: [
        { id: "q10a", text: "When the education is related to your current employment" },
        { id: "q10b", text: "When the education is for personal interest" },
        { id: "q10c", text: "When the education is to help you get a new job in a different field" },
        { id: "q10d", text: "Self-education expenses are never deductible" },
      ],
      correctOptionId: "q10a",
    },
  ], [])

  const currentQuestion = questions[currentQuestionIndex]

  // Memoize the submit handler to avoid dependency issues in useEffect
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true)

    // Calculate score
    let correctAnswers = 0

    questions.forEach((question) => {
      const userAnswer = answers[question.id]

      if (!userAnswer) return

      if (question.type === "multiple-choice") {
        if (userAnswer === question.correctOptionId) {
          correctAnswers++
        }
      } else if (question.type === "text") {
        // Check if the answer contains the expected keywords
        const answerText = userAnswer.toString().toLowerCase()
        let keywordsFound = 0

        question.expectedKeywords.forEach((keyword) => {
          if (answerText.includes(keyword.toLowerCase())) {
            keywordsFound++
          }
        })

        // If at least half of the keywords are found, consider it correct
        if (keywordsFound >= question.expectedKeywords.length / 2) {
          correctAnswers++
        }
      } else if (question.type === "sorting") {
        // Check if the order matches the correct order
        const sortingAnswer = userAnswer as { id: string; text: string }[]
        const userOrder = sortingAnswer.map((item) => item.id)
        let isCorrect = true

        for (let i = 0; i < question.correctOrder.length; i++) {
          if (userOrder[i] !== question.correctOrder[i]) {
            isCorrect = false
            break
          }
        }

        if (isCorrect) {
          correctAnswers++
        }
      }
    })

    const finalScore = (correctAnswers / questions.length) * 100
    setScore(finalScore)
    setTestCompleted(true)
    onComplete(finalScore)
  }, [questions, answers, onComplete])

  // Initialize sort items when a sorting question is shown
  useEffect(() => {
    const question = questions[currentQuestionIndex]
    if (question && question.type === "sorting") {
      const questionId = question.id
      // If we already have an answer, use that order
      if (answers[questionId]) {
        const sortingAnswer = answers[questionId] as { id: string; text: string }[]
        setSortItems([...sortingAnswer])
      } else {
        // Create a stable shuffled version to prevent re-renders
        const shuffled = [...question.items]
        // Use a simple shuffle that's stable for the same question
        shuffled.sort(() => 0.5 - Math.random())
        setSortItems(shuffled)
      }
    }
  }, [currentQuestionIndex, questions, answers])

  // Timer countdown
  useEffect(() => {
    if (testCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testCompleted, handleSubmit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleMultipleChoiceAnswer = (optionId: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionId,
    })
  }

  const handleTextAnswer = (text: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: text,
    })
  }

  const handleSortingAnswer = (items: { id: string; text: string }[]) => {
    // Create a new array to avoid reference issues
    const newItems = [...items]
    setSortItems(newItems)

    // Use a callback form to ensure we're using the latest state
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: newItems,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] !== undefined
  }

  const areAllQuestionsAnswered = questions.every((q) => isQuestionAnswered(q.id))

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6">{currentQuestion.text}</h3>

            <RadioGroup
              value={(answers[currentQuestion.id] as string) || ""}
              onValueChange={handleMultipleChoiceAnswer}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 p-3 rounded-md transition-all quiz-option hover:bg-gray-100 border border-transparent"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "text":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6">{currentQuestion.text}</h3>

            <Textarea
              placeholder="Type your answer here..."
              value={(answers[currentQuestion.id] as string) || ""}
              onChange={(e) => handleTextAnswer(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        )

      case "sorting":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium mb-6">{currentQuestion.text}</h3>

            <Reorder.Group axis="y" values={sortItems} onReorder={handleSortingAnswer} className="space-y-2">
              {sortItems.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="p-3 bg-white border rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="mr-3 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </div>
                    <span>{item.text}</span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        )

      default:
        return <div>Unknown question type</div>
    }
  }

  if (testCompleted) {
    return <QuizResult score={score} passed={score >= 75} />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="flex space-x-1 mt-2">
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

        <div className="flex items-center space-x-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full">
          <LucideClock className="h-4 w-4" />
          <span className="text-sm font-medium">{formatTime(timeLeft)} remaining</span>
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
            <CardContent className="pt-6">{renderQuestion()}</CardContent>
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

        {currentQuestionIndex < questions.length - 1 ? (
          <Button onClick={handleNext} className="group">
            Next
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
              "Submit Test"
            )}
          </Button>
        )}
      </div>
    </motion.div>
  )
}

