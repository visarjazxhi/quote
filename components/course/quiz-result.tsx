"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LucideCheckCircle, LucideXCircle, LucideDownload, LucideRefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { jsPDF } from "jspdf"

interface QuizResultProps {
  score: number
  passed: boolean
}

export function QuizResult({ score, passed }: QuizResultProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  const generatePDF = () => {
    setIsGeneratingPdf(true)

    setTimeout(() => {
      try {
        const doc = new jsPDF()

        // Add title
        doc.setFontSize(20)
        doc.text("Quiz Results", 105, 20, { align: "center" })

        // Add date
        doc.setFontSize(12)
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30)

        // Add score information
        doc.setFontSize(16)
        doc.text(`Score: ${Math.round(score)}%`, 20, 50)
        doc.text(`Status: ${passed ? "PASSED" : "FAILED"}`, 20, 60)

        // Add pass/fail message
        doc.setFontSize(14)
        if (passed) {
          doc.text("Congratulations! You've successfully passed this module's quiz.", 20, 80)
        } else {
          doc.text("You need to score at least 75% to pass this module.", 20, 80)
        }

        // Add footer
        doc.setFontSize(10)
        doc.text("Tax Course LMS - Quiz Result Certificate", 105, 280, { align: "center" })

        // Save the PDF
        doc.save("quiz-results.pdf")
      } catch (error) {
        console.error("Error generating PDF:", error)
      } finally {
        setIsGeneratingPdf(false)
      }
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="space-y-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4"
        >
          {passed ? (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
              <LucideCheckCircle className="h-12 w-12 text-green-500" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100">
              <LucideXCircle className="h-12 w-12 text-red-500" />
            </div>
          )}
        </motion.div>
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2"
        >
          {passed ? "Congratulations!" : "Not Quite There Yet"}
        </motion.h3>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground mb-6"
        >
          {passed
            ? "You've successfully passed this module's quiz."
            : "You need to score at least 75% to pass this module."}
        </motion.p>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card className="border-none shadow-soft overflow-hidden">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Your Score</span>
                  <span className="text-sm font-medium">{Math.round(score)}%</span>
                </div>
                <Progress value={score} className="h-3 rounded-full progress-bar-animate" />
              </div>

              <div className="flex justify-between text-sm">
                <span>Passing Score: 75%</span>
                <span className={passed ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                  {passed ? "Passed" : "Failed"}
                </span>
              </div>

              <div className="pt-4 flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generatePDF}
                  disabled={isGeneratingPdf}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  {isGeneratingPdf ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <LucideDownload className="mr-2 h-4 w-4" />
                      Download Results
                    </>
                  )}
                </Button>

                {!passed && (
                  <Button variant="secondary" size="sm">
                    <LucideRefreshCw className="mr-2 h-4 w-4" />
                    Retry Quiz
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {!passed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <p className="mb-4 text-muted-foreground">Don&apos;t worry! You can review the material and try again.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

