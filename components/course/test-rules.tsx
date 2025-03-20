"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { LucideAlertCircle, LucideCheckCircle2, LucideClock, LucideFileText, LucideChevronRight } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface TestRulesProps {
  onContinue: () => void
}

export function TestRules({ onContinue }: TestRulesProps) {
  const [acceptedRules, setAcceptedRules] = useState(false)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-none shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl">Final Test Rules</CardTitle>
          <CardDescription>Please review the following rules before starting the final test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
            <div className="flex items-start">
              <LucideAlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                This final test will assess your understanding of all the topics covered in the previous 12 modules.
                Please ensure you have completed all modules before attempting this test.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
              <LucideFileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Test Format</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  The test consists of multiple question types including multiple-choice, text answers, and sorting
                  questions. There are 10 questions in total covering all previous modules.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
              <LucideClock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Time Limit</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You have 60 minutes to complete the test. The timer will start once you begin the test.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-md bg-gray-50">
              <LucideCheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Passing Criteria</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You must score at least 75% to pass the test. You can download your results as a PDF upon completion.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Additional Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You cannot pause the test once started. Ensure you have sufficient time before beginning.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You may review and change your answers before final submission.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>
                  For text answers, be concise and to the point. Spelling and grammar will not affect your score.
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>For sorting questions, drag and drop the items in the correct order.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="accept-rules"
              checked={acceptedRules}
              onCheckedChange={(checked) => setAcceptedRules(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="accept-rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and understood the test rules
              </Label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={onContinue} disabled={!acceptedRules} className="w-full md:w-auto group">
            Begin Test
            <LucideChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

