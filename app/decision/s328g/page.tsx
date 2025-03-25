"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import CriterionDetailsDialog from "@/components/s328g/criterion-details-dialog"
import { criteriaData } from "@/data/s328g"
import LegalDisclaimerDialog from "@/components/s328g/criterion-details-dialog"
import WelcomeScreen from "@/components/s328g/welcome-screen"

export default function SmallBusinessRestructureChecklist() {
  const [answers, setAnswers] = useState<Record<number, boolean | undefined>>({})
  const [currentCriterion, setCurrentCriterion] = useState(1)
  const [showSummary, setShowSummary] = useState(false)
  const [showDisqualification, setShowDisqualification] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const handleAnswer = (criterionId: number, value: boolean) => {
    setAnswers({ ...answers, [criterionId]: value })
  }

  const handleNext = () => {
    if (answers[currentCriterion] === false) {
      setShowSummary(false)
      setShowDisqualification(true)
    } else if (currentCriterion < criteriaData.length) {
      setCurrentCriterion(currentCriterion + 1)
    } else {
      setShowSummary(true)
    }
  }

  const handlePrevious = () => {
    if (currentCriterion > 1) {
      setCurrentCriterion(currentCriterion - 1)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setCurrentCriterion(1)
    setShowSummary(false)
    setShowDisqualification(false)
    setShowWelcome(true)
  }

  const startChecklist = () => {
    setShowWelcome(false)
  }

  const isEligible = Object.values(answers).every((answer) => answer === true)
  const progress = (Object.keys(answers).length / criteriaData.length) * 100

  if (showWelcome) {
    return <WelcomeScreen onContinue={startChecklist} />
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Small Business Restructure Relief Checklist
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Assess your eligibility for tax rollover relief under Subdivision 328-G of the Income Tax Assessment Act 1997
          for transfers of active assets as part of a genuine restructure of an ongoing business.
        </p>
        <div className="flex justify-center mt-4">
          <LegalDisclaimerDialog criterion={criteriaData[currentCriterion - 1]} />
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${isEligible ? "bg-green-500" : "bg-primary"}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <AnimatePresence mode="wait">
        {showDisqualification ? (
          <motion.div
            key="disqualification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DisqualificationCard criterion={criteriaData[currentCriterion - 1]} onReset={handleReset} />
          </motion.div>
        ) : !showSummary ? (
          <motion.div
            key={`criterion-${currentCriterion}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CriterionCard
              criterion={criteriaData[currentCriterion - 1]}
              answer={answers[currentCriterion]}
              onAnswer={(value) => handleAnswer(currentCriterion, value)}
              currentStep={currentCriterion}
              totalSteps={criteriaData.length}
            />

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentCriterion === 1} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Previous
              </Button>

              <Button onClick={handleNext} disabled={answers[currentCriterion] === undefined} className="gap-2">
                {currentCriterion === criteriaData.length ? "View Summary" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SummaryCard answers={answers} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type CriterionCardProps = {
  criterion: (typeof criteriaData)[number]
  answer?: boolean
  onAnswer: (value: boolean) => void
  currentStep: number
  totalSteps: number
}

function CriterionCard({ criterion, answer, onAnswer, currentStep, totalSteps }: CriterionCardProps) {
  return (
    <Card className="border-2 shadow-md">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
              {criterion.id}
            </div>
            <h2 className="text-xl font-semibold">{criterion.title}</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <div className="flex items-start gap-2 mb-6 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-100 dark:border-blue-900">
          <FileText className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Legislative Reference</p>
            <p className="text-sm text-blue-600 dark:text-blue-400">{criterion.legislativeReference}</p>
          </div>
        </div>

        <p className="text-muted-foreground mb-6">{criterion.description}</p>

        <div className="flex justify-end mb-4">
          <CriterionDetailsDialog criterion={criterion} />
        </div>

        <p className="text-sm text-muted-foreground mb-2">Please select one option:</p>

        <RadioGroup
          value={answer === undefined ? "" : answer ? "yes" : "no"}
          onValueChange={(value) => {
            if (value === "yes" || value === "no") {
              onAnswer(value === "yes")
            }
          }}
          className="space-y-3"
        >
          <div
            className={`flex items-center space-x-2 border rounded-md p-4 transition-colors ${
              answer === true
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <RadioGroupItem value="yes" id={`${criterion.id}-yes`} />
            <Label htmlFor={`${criterion.id}-yes`} className="flex-1 cursor-pointer">
              Yes, this criteria is satisfied
            </Label>
            {answer === true && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>

          <div
            className={`flex items-center space-x-2 border rounded-md p-4 transition-colors ${
              answer === false
                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                : "hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <RadioGroupItem value="no" id={`${criterion.id}-no`} />
            <Label htmlFor={`${criterion.id}-no`} className="flex-1 cursor-pointer">
              No, this criteria is not satisfied
            </Label>
            {answer === false && <AlertCircle className="h-5 w-5 text-red-500" />}
          </div>
        </RadioGroup>

        {answer === false && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Disqualification Warning</AlertTitle>
            <AlertDescription>
              A &quot;No&quot; response to this criterion means you do not qualify for the Small Business Restructure Relief under
              Subdivision 328-G of the Income Tax Assessment Act 1997. All criteria must be satisfied to be eligible for
              the rollover relief.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

type SummaryCardProps = {
  answers: Record<number, boolean | undefined>
  onReset: () => void
}

function SummaryCard({ answers, onReset }: SummaryCardProps) {
  const isEligible = Object.values(answers).every((answer) => answer === true)

  return (
    <Card className={`border-2 ${isEligible ? "border-green-500" : "border-red-500"} shadow-md`}>
      <CardContent className="pt-6 pb-6">
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isEligible ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {isEligible ? <CheckCircle className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
          </div>
          <h2 className="text-2xl font-bold mt-4">
            {isEligible ? "You Appear to Qualify" : "You Do Not Appear to Qualify"}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            {isEligible
              ? "Based on your responses, you appear to satisfy all criteria for the Small Business Restructure Relief under Subdivision 328-G of the Income Tax Assessment Act 1997."
              : "Based on your responses, you do not satisfy all criteria for the Small Business Restructure Relief under Subdivision 328-G of the Income Tax Assessment Act 1997."}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-lg">Your Responses:</h3>
          {criteriaData.map((criterion) => (
            <div
              key={criterion.id}
              className={`p-4 rounded-md border ${
                answers[criterion.id] === true
                  ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900"
                  : answers[criterion.id] === false
                    ? "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900"
                    : "border-gray-200 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      answers[criterion.id] === true
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : answers[criterion.id] === false
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {criterion.id}
                  </div>
                  <span className="font-medium">{criterion.title}</span>
                </div>
                <div
                  className={`flex items-center ${
                    answers[criterion.id] === true
                      ? "text-green-600"
                      : answers[criterion.id] === false
                        ? "text-red-600"
                        : "text-gray-400"
                  }`}
                >
                  {answers[criterion.id] === true ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" /> Yes
                    </>
                  ) : answers[criterion.id] === false ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-1" /> No
                    </>
                  ) : (
                    "Not answered"
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium">Legislative Reference:</span> {criterion.legislativeReference}
              </div>
            </div>
          ))}
        </div>

        {!isEligible && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Disqualification Notice</AlertTitle>
            <AlertDescription>
              You do not appear to qualify for the Small Business Restructure Relief under Subdivision 328-G of the
              Income Tax Assessment Act 1997 based on your responses. Please review the criteria where you answered
              &quot;No&quot;.
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Important Legal Disclaimer</h4>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                This assessment is based solely on the information you provided and is not a definitive determination of
                your eligibility. The application of tax law depends on your specific circumstances. We strongly
                recommend seeking professional advice from a qualified tax professional before proceeding with any
                business restructure.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onReset} className="gap-2">
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

type DisqualificationCardProps = {
  criterion: (typeof criteriaData)[number]
  onReset: () => void
}

function DisqualificationCard({ criterion, onReset }: DisqualificationCardProps) {
  return (
    <Card className="border-2 border-red-500 shadow-md">
      <CardContent className="pt-6 pb-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center bg-red-100 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold mt-4">You Do Not Qualify</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Based on your response to the criterion below, you do not qualify for the Small Business Restructure Relief
            under Subdivision 328-G of the Income Tax Assessment Act 1997.
          </p>
        </div>

        <div className="p-4 rounded-md border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {criterion.id}
              </div>
              <span className="font-medium">{criterion.title}</span>
            </div>
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" /> No
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <span className="font-medium">Legislative Reference:</span> {criterion.legislativeReference}
          </div>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Disqualification Notice</AlertTitle>
          <AlertDescription>
            All criteria must be satisfied to qualify for the Small Business Restructure Relief. Since you answered &quot;No&quot;
            to the criterion above, you are not eligible for the rollover relief.
          </AlertDescription>
        </Alert>

        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-400">What Next?</h4>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                You may want to consult with a qualified tax professional to explore alternative restructuring options
                or to determine if your situation might qualify under different circumstances. Remember that this
                assessment is based solely on the information you provided.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={onReset} className="gap-2">
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

