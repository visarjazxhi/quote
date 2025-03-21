"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, ArrowRight, CornerDownRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { questions, type Option } from "@/data/decision/questions"
import StructureExplanationDialog from "./structure-explanation-dialog"

type AnswersRecord = Record<number, string>

export default function BusinessStructureDiagram() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [history, setHistory] = useState<number[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnswersRecord>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [path, setPath] = useState<{ from: number; to: number; option: string }[]>([])

  const handleAnswer = (option: Option) => {
    setAnswers({ ...answers, [currentQuestion]: option.text })
    setIsTransitioning(true)

    setTimeout(() => {
      if (option.result) {
        setResult(option.result)
        setPath([...path, { from: currentQuestion, to: -1, option: option.text }])
      } else if (option.nextQuestion) {
        setPath([...path, { from: currentQuestion, to: option.nextQuestion, option: option.text }])
        setHistory([...history, currentQuestion])
        setCurrentQuestion(option.nextQuestion)
      }
      setIsTransitioning(false)
    }, 400)
  }

  const handleBack = () => {
    if (history.length > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        const prevQuestion = history[history.length - 1]
        setHistory(history.slice(0, -1))
        setPath(path.slice(0, -1))
        setCurrentQuestion(prevQuestion)
        setResult(null)
        setIsTransitioning(false)
      }, 400)
    }
  }

  const handleReset = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentQuestion(1)
      setHistory([])
      setResult(null)
      setAnswers({})
      setPath([])
      setIsTransitioning(false)
    }, 400)
  }


  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Business Structure Decision Tool
        </h1>
        {(history.length > 0 || result) && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={history.length === 0 && !result}
              className="group"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
            <Button variant="outline" onClick={handleReset} size="sm">
              Start Over
            </Button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Path Lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          {path.map((p, i) => {
            // Calculate positions based on question numbers
            const fromY = (p.from - 1) * 120 + 60
            const toY = p.to === -1 ? fromY + 120 : (p.to - 1) * 120 + 60

            return (
              <motion.path
                key={i}
                d={`M 20 ${fromY} C 20 ${(fromY + toY) / 2}, 20 ${(fromY + toY) / 2}, 20 ${toY}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="transparent"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )
          })}
        </svg>

        {/* Questions and Results */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {result ? (
              <ResultNode result={result} answers={answers} path={path} />
            ) : (
              <div className="space-y-4">
                {/* Current Question */}
                {Array.from({ length: Math.max(currentQuestion, 1) }).map((_, index) => {
                  const questionNumber = index + 1
                  const questionData = questions[questionNumber]
                  const isCurrentQuestion = questionNumber === currentQuestion
                  const isAnswered = answers[questionNumber]
                  const shouldShow = isCurrentQuestion || isAnswered

                  if (!shouldShow) return null

                  return (
                    <QuestionNode
                      key={questionNumber}
                      questionNumber={questionNumber}
                      questionData={questionData}
                      isCurrentQuestion={isCurrentQuestion}
                      isAnswered={Boolean(isAnswered)}
                      answer={answers[questionNumber]}
                      onAnswer={isCurrentQuestion ? handleAnswer : undefined}
                      isTransitioning={isTransitioning}
                    />
                  )
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

type QuestionNodeProps = {
  questionNumber: number
  questionData: (typeof questions)[number]
  isCurrentQuestion: boolean
  isAnswered: boolean
  answer?: string
  onAnswer?: (option: Option) => void
  isTransitioning: boolean
}

function QuestionNode({
  questionNumber,
  questionData,
  isCurrentQuestion,
  isAnswered,
  answer,
  onAnswer,
}: QuestionNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="ml-10 relative"
    >
      {/* Node connector */}
      <div className="absolute left-0 top-1/2 transform -translate-x-[30px] -translate-y-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
        {questionNumber}
      </div>

      <Card
        className={`
        border-2 transition-all duration-300
        ${isCurrentQuestion ? "border-primary shadow-lg" : "border-gray-200 dark:border-gray-800"}
        ${isAnswered && !isCurrentQuestion ? "bg-gray-50 dark:bg-gray-900/50" : ""}
      `}
      >
        <CardContent className="p-5 sm:p-6 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-3 py-1">
              <h3 className="text-lg sm:text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {questionData.text}
              </h3>
            </div>

            {isCurrentQuestion ? (
              <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2">
                {questionData.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                    className="relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-md"></div>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left h-auto py-3 px-4 group-hover:border-primary/50 transition-all duration-300 z-10 relative"
                      onClick={() => onAnswer?.(option)}
                    >
                      <span className="font-medium">{option.text}</span>
                      {option.result ? (
                        <CheckCircle2 className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-green-500" />
                      ) : (
                        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center mt-2 p-2 bg-primary/5 dark:bg-primary/10 rounded-md border-l-4 border-primary">
                <CornerDownRight className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">
                  Selected: <span className="text-primary">{answer}</span>
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

type ResultNodeProps = {
  result: string
  answers: AnswersRecord
  path: { from: number; to: number; option: string }[]
}

function ResultNode({ result, path }: ResultNodeProps) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 ml-10 relative"
    >
      {/* Node connector */}
      <div className="absolute left-0 top-10 transform -translate-x-[30px] w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
        <CheckCircle2 className="h-4 w-4" />
      </div>

      <Card className="border-2 border-green-500 shadow-lg">
        <CardContent className="p-5 sm:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500 dark:from-green-400 dark:to-emerald-300">
              Recommended Structure
            </h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-900 shadow-sm"
          >
            <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-400">{result}</p>
          </motion.div>

          {/* Why this structure button */}
          <div className="flex justify-center">
            <StructureExplanationDialog structureName={result} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-6"
          >
            <h4 className="font-medium mb-3 text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Decision Path:
            </h4>
            <div className="space-y-1 border-l-2 border-dashed border-gray-300 dark:border-gray-700 pl-4 py-2">
              {path.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                  className="relative"
                >
                  <div className="absolute left-0 top-1/2 transform -translate-x-[22px] -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-primary/80 to-primary/50 dark:from-primary/70 dark:to-primary/40 border-2 border-white dark:border-gray-900"></div>
                  <div className="flex gap-2 text-sm py-2 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md px-2 transition-colors">
                    <span className="font-medium text-primary">Q{step.from}:</span>
                    <span className="flex-1">{questions[step.from].text}</span>
                    <span className="font-medium ml-auto text-primary/80">{step.option}</span>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + path.length * 0.05, duration: 0.3 }}
                className="relative"
              >
                <div className="absolute left-0 top-1/2 transform -translate-x-[22px] -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 border-2 border-white dark:border-gray-900"></div>
                <div className="flex gap-2 text-sm py-2 bg-green-50 dark:bg-green-900/20 rounded-md px-2">
                  <span className="font-medium text-green-600">Result:</span>
                  <span className="flex-1 font-medium text-green-600">{result}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

