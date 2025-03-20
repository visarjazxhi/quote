"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LucideBookOpen, LucideCheckCircle, LucideChevronRight, LucideGraduationCap } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { moduleData } from "@/lib/course_data"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function Home() {
  const [progress, setProgress] = useState(0)
  const [animateProgress, setAnimateProgress] = useState(false)

  useEffect(() => {
    // Simulate loading progress data
    setTimeout(() => {
      setAnimateProgress(true)
      setProgress(15) // Example progress value
    }, 500)
  }, [])

  // Calculate the number of completed modules
  const completedModules = moduleData.filter((m) => m.completed).length
  const totalModules = moduleData.length

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Taxtalk</h2>
              <p className="text-gray-600 dark:text-gray-300">The income tax return course</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href={`course/modules/${moduleData.find((m) => !m.completed)?.id || "01"}`}>
                <Button className="group">
                  Continue Learning
                  <LucideChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          <Card className="overflow-hidden border-none shadow-soft">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold mb-1">Course Completion</h3>
                  <p className="text-sm text-muted-foreground">
                    {completedModules} of {totalModules} modules completed
                  </p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm">
                  <LucideGraduationCap className="mr-1 h-4 w-4" />
                  Tax Specialist Course
                </Badge>
              </div>

              <div className="relative">
                <Progress
                  value={animateProgress ? progress : 0}
                  className="h-3 rounded-full transition-all duration-1000 ease-in-out"
                />
                <span className="absolute right-0 top-0 -translate-y-6 text-sm font-medium">{progress}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Course Modules</h2>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {moduleData.map((module) => (
              <motion.div key={module.id} variants={item}>
                <Card
                  className={`overflow-hidden h-full module-card ${module.id === "13" ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{module.title.split(":")[0]}</CardTitle>
                        <CardDescription className="mt-1">
                          {module.title.includes(":") ? module.title.split(":")[1].trim() : module.description}
                        </CardDescription>
                      </div>
                      {module.id === "13" && <Badge className="bg-primary text-white">Final Test</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <LucideBookOpen className="mr-1 h-4 w-4" />
                      <span>{module.type}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 pt-3">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center text-sm">
                        <span className={`flex items-center ${module.completed ? "text-green-500" : "text-gray-400"}`}>
                          {module.completed ? <LucideCheckCircle className="h-4 w-4 mr-1" /> : null}
                          {module.completed ? "Completed" : "Not started"}
                        </span>
                      </div>
                      <Link href={`course/modules/${module.id}`}>
                        <Button
                          variant={module.id === "13" ? "default" : "outline"}
                          size="sm"
                          className={module.id === "13" ? "shadow-sm hover:shadow-md transition-shadow" : ""}
                        >
                          {module.completed ? "Review" : "Start"}
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

