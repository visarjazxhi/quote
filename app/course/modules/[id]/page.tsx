"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LucideArrowLeft, LucideVideo, LucideFileText, LucideClipboardList, LucideChevronRight } from "lucide-react"
import Link from "next/link"
import { moduleData } from "@/lib/course_data"
import { VideoPlayer } from "@/components/course/video-player"
import { PdfViewer } from "@/components/course/pdf-viewer"
import { Quiz } from "@/components/course/quiz"
import { QuizResult } from "@/components/course/quiz-result"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { FinalTest } from "@/components/course/final-test"
import { TestRules } from "@/components/course/test-rules"

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string
  const [activeTab, setActiveTab] = useState("video")
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizPassed, setQuizPassed] = useState(false)
  const [sectionProgress, setSectionProgress] = useState(0)
  const [testSection, setTestSection] = useState<"rules" | "test">("rules")

  const mymodule = moduleData.find((m) => m.id === moduleId)

  useEffect(() => {
    // Update section progress based on active tab
    if (moduleId === "13") {
      setSectionProgress(testSection === "rules" ? 50 : 100)
      return
    }

    switch (activeTab) {
      case "video":
        setSectionProgress(33)
        break
      case "reading":
        setSectionProgress(66)
        break
      case "quiz":
        setSectionProgress(quizCompleted ? 100 : 90)
        break
      default:
        setSectionProgress(0)
    }
  }, [activeTab, quizCompleted, moduleId, testSection])

  if (!mymodule) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <Link href="/">
          <Button className="mt-4">Return to Dashboard</Button>
        </Link>
      </div>
    )
  }

  const handleQuizComplete = (score: number) => {
    const percentage = (score / mymodule.quiz.questions.length) * 100
    setQuizScore(percentage)
    setQuizPassed(percentage >= 75)
    setQuizCompleted(true)
  }

  const handleNextModule = () => {
    const currentIndex = moduleData.findIndex((m) => m.id === moduleId)
    if (currentIndex < moduleData.length - 1) {
      router.push(`/modules/${moduleData[currentIndex + 1].id}`)
    } else {
      router.push("/")
    }
  }

  const handleNextSection = () => {
    if (moduleId === "13") {
      if (testSection === "rules") {
        setTestSection("test")
      }
      return
    }

    switch (activeTab) {
      case "video":
        setActiveTab("reading")
        break
      case "reading":
        setActiveTab("quiz")
        break
      default:
        break
    }
  }

  const renderContent = () => {
    if (moduleId === "13") {
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={testSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {testSection === "rules" ? (
              <TestRules onContinue={() => setTestSection("test")} />
            ) : (
              <FinalTest onComplete={handleQuizComplete} />
            )}
          </motion.div>
        </AnimatePresence>
      )
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="video"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LucideVideo className="mr-2 h-4 w-4" />
            Video Training
          </TabsTrigger>
          <TabsTrigger
            value="reading"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LucideFileText className="mr-2 h-4 w-4" />
            Reading Material
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <LucideClipboardList className="mr-2 h-4 w-4" />
            Quiz
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="video" className="mt-0">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Video Training</CardTitle>
                  <CardDescription>Watch the training video for this module</CardDescription>
                </CardHeader>
                <CardContent>
                  <VideoPlayer videoUrl={mymodule.videoUrl} />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleNextSection} className="group">
                    Continue to Reading Material
                    <LucideChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="reading" className="mt-0">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Reading Material</CardTitle>
                  <CardDescription>Review the module content</CardDescription>
                </CardHeader>
                <CardContent>
                  <PdfViewer pdfUrl={mymodule.pdfUrl} />
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleNextSection} className="group">
                    Continue to Quiz
                    <LucideChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="quiz" className="mt-0">
              <Card className="border-none shadow-soft">
                <CardHeader>
                  <CardTitle>Module Quiz</CardTitle>
                  <CardDescription>Test your knowledge with {mymodule.quiz.questions.length} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  {!quizCompleted ? (
                    <Quiz questions={mymodule.quiz.questions} onComplete={handleQuizComplete} />
                  ) : (
                    <QuizResult score={quizScore} passed={quizPassed} />
                  )}
                </CardContent>
                {quizCompleted && (
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleNextModule} className="group">
                      {moduleId === "13" ? "Complete Course" : "Next Module"}
                      <LucideChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">


      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/course" className="mr-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                <LucideArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{mymodule.title}</h1>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-soft mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Section Progress</span>
              <span className="text-sm font-medium">{sectionProgress}%</span>
            </div>
            <Progress value={sectionProgress} className="h-2 progress-bar-animate" />
          </div>

          {renderContent()}
        </div>
      </main>
    </div>
  )
}

