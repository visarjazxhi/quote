"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { questions, type Option, type Question } from "@/data/decision/questions"

type AnswersRecord = Record<number, string>

export default function BusinessStructureForm() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [history, setHistory] = useState<number[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [answers, setAnswers] = useState<AnswersRecord>({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleAnswer = (option: Option) => {
    setAnswers({ ...answers, [currentQuestion]: option.text })
    setIsTransitioning(true)

    setTimeout(() => {
      if (option.result) {
        setResult(option.result)
      } else if (option.nextQuestion) {
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
      setIsTransitioning(false)
    }, 400)
  }

  const currentQuestionData = questions[currentQuestion]
  const progress = (currentQuestion / 20) * 100

  return (
    <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Australian Business Structure Decision Tree
        </CardTitle>
        <CardDescription>
          Answer these questions to find the most suitable business structure for your needs
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {result ? (
            <ResultView result={result} answers={answers} />
          ) : (
            <QuestionView
              currentQuestion={currentQuestion}
              currentQuestionData={currentQuestionData}
              progress={progress}
              isTransitioning={isTransitioning}
              onAnswer={handleAnswer}
            />
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 mt-2">
        {history.length > 0 || result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Button variant="outline" onClick={handleBack} disabled={history.length === 0 && !result} className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
          </motion.div>
        ) : (
          <div />
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
            >
              Start Over
            </Button>
          </motion.div>
        )}
      </CardFooter>
    </Card>
  )
}

type QuestionViewProps = {
  currentQuestion: number
  currentQuestionData: Question
  progress: number
  isTransitioning: boolean
  onAnswer: (option: Option) => void
}

function QuestionView({
  currentQuestion,
  currentQuestionData,
  progress,
  isTransitioning,
  onAnswer,
}: QuestionViewProps) {
  return (
    <motion.div
      key={`question-${currentQuestion}`}
      initial={{ opacity: 0, x: isTransitioning ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isTransitioning ? 20 : -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Question {currentQuestion} of 20</span>
          <span className="text-sm font-medium">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-primary h-2.5"
            initial={{ width: `${((currentQuestion - 1) / 20) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-xl font-medium mt-4"
      >
        {currentQuestionData.text}
      </motion.h3>

      <div className="space-y-3 mt-6">
        {currentQuestionData.options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
          >
            <Button
              variant="outline"
              className="w-full justify-between text-left h-auto py-4 px-5 group hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300"
              onClick={() => onAnswer(option)}
            >
              <span>{option.text}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

type ResultViewProps = {
  result: string
  answers: AnswersRecord
}

function ResultView({ result, answers }: ResultViewProps) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-medium">Recommended Structure</h3>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-900 shadow-sm"
      >
        <p className="text-2xl font-bold text-green-800 dark:text-green-400">{result}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-8"
      >
        <h4 className="font-medium mb-3 text-lg">Your answers:</h4>
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 rounded-md">
          {Object.entries(answers).map(([questionNum, answer], index) => (
            <motion.div
              key={questionNum}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
              className="flex gap-2 text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md transition-colors"
            >
              <span className="font-medium text-primary">Q{questionNum}:</span>
              <span className="flex-1">{questions[Number.parseInt(questionNum)].text}</span>
              <span className="font-medium ml-auto">{answer}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

