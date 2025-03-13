"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Check, Clock, Users, Trash2 } from "lucide-react"

type MatrixQuadrant = {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  textColor: string
  category: string
  explanation: string
}

export default function EisenhowerMatrix() {
  const [selectedQuadrant, setSelectedQuadrant] = useState<MatrixQuadrant | null>(null)

  const quadrants: MatrixQuadrant[] = [
    {
      id: 1,
      title: "Do Now",
      description: "Important & Urgent",
      icon: <Check className="h-8 w-8" />,
      color: "bg-red-500",
      textColor: "text-white",
      category: "First Quadrant",
      explanation:
        "Tasks that are both important and urgent require immediate attention. These are critical tasks that should be done right away. Examples include crisis situations, pressing deadlines, and important meetings.",
    },
    {
      id: 2,
      title: "Schedule",
      description: "Important & Less Urgent",
      icon: <Clock className="h-8 w-8" />,
      color: "bg-blue-400",
      textColor: "text-white",
      category: "Second Quadrant",
      explanation:
        "Tasks that are important but not urgent should be scheduled. These activities contribute to your long-term goals and mission. Examples include planning, preparation, relationship building, and personal development.",
    },
    {
      id: 3,
      title: "Delegate",
      description: "Less Important & Urgent",
      icon: <Users className="h-8 w-8" />,
      color: "bg-green-500",
      textColor: "text-white",
      category: "Third Quadrant",
      explanation:
        "Tasks that are urgent but less important can be delegated to others. These activities don't contribute significantly to your goals but require attention. Examples include certain meetings, some emails, and interruptions.",
    },
    {
      id: 4,
      title: "Delete",
      description: "Less Important & Less Urgent",
      icon: <Trash2 className="h-8 w-8" />,
      color: "bg-amber-500",
      textColor: "text-white",
      category: "Fourth Quadrant",
      explanation:
        "Tasks that are neither important nor urgent should be eliminated. These activities are distractions that don't contribute to your goals. Examples include excessive social media, time-wasting activities, and trivial tasks.",
    },
  ]

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Eisenhower Prioritization Matrix</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
        {/* Header Row */}
        <div className="hidden md:flex justify-center items-center h-12 font-bold text-lg">Urgent</div>
        <div className="hidden md:flex justify-center items-center h-12 font-bold text-lg">Less Urgent</div>

        {/* Left Column Header */}
        <div className="md:hidden flex justify-center items-center h-12 font-bold text-lg col-span-2">Important</div>

        {/* First Row - Important */}
        <div className="relative">
          <div className="hidden md:block absolute -left-48 top-1/2 transform -translate-y-1/2 -rotate-90 font-bold text-lg w-72 text-center">
            Important
          </div>
          <Card
            className={`${quadrants[0].color} cursor-pointer transition-transform hover:scale-105 h-48 md:h-64 flex flex-col items-center justify-center p-4`}
            onClick={() => setSelectedQuadrant(quadrants[0])}
          >
            <div className="text-center">
              <div className="rounded-full bg-white/20 p-3 inline-flex mb-3">
                <div className="rounded-full bg-white/30 p-2 inline-flex">{quadrants[0].icon}</div>
              </div>
              <h3 className={`text-xl font-bold ${quadrants[0].textColor}`}>{quadrants[0].title}</h3>
              <p className={`${quadrants[0].textColor} opacity-90`}>{quadrants[0].description}</p>
            </div>
          </Card>
        </div>

        <Card
          className={`${quadrants[1].color} cursor-pointer transition-transform hover:scale-105 h-48 md:h-64 flex flex-col items-center justify-center p-4`}
          onClick={() => setSelectedQuadrant(quadrants[1])}
        >
          <div className="text-center">
            <div className="rounded-full bg-white/20 p-3 inline-flex mb-3">
              <div className="rounded-full bg-white/30 p-2 inline-flex">{quadrants[1].icon}</div>
            </div>
            <h3 className={`text-xl font-bold ${quadrants[1].textColor}`}>{quadrants[1].title}</h3>
            <p className={`${quadrants[1].textColor} opacity-90`}>{quadrants[1].description}</p>
          </div>
        </Card>

        {/* Left Column Header */}
        <div className="md:hidden flex justify-center items-center h-12 font-bold text-lg col-span-2">
          Less Important
        </div>

        {/* Second Row - Less Important */}
        <div className="relative">
          <div className="hidden md:block absolute -left-48 top-1/2 transform -translate-y-1/2 -rotate-90 font-bold text-lg w-72 text-center">
            Less Important
          </div>
          <Card
            className={`${quadrants[2].color} cursor-pointer transition-transform hover:scale-105 h-48 md:h-64 flex flex-col items-center justify-center p-4`}
            onClick={() => setSelectedQuadrant(quadrants[2])}
          >
            <div className="text-center">
              <div className="rounded-full bg-white/20 p-3 inline-flex mb-3">
                <div className="rounded-full bg-white/30 p-2 inline-flex">{quadrants[2].icon}</div>
              </div>
              <h3 className={`text-xl font-bold ${quadrants[2].textColor}`}>{quadrants[2].title}</h3>
              <p className={`${quadrants[2].textColor} opacity-90`}>{quadrants[2].description}</p>
            </div>
          </Card>
        </div>

        <Card
          className={`${quadrants[3].color} cursor-pointer transition-transform hover:scale-105 h-48 md:h-64 flex flex-col items-center justify-center p-4`}
          onClick={() => setSelectedQuadrant(quadrants[3])}
        >
          <div className="text-center">
            <div className="rounded-full bg-white/20 p-3 inline-flex mb-3">
              <div className="rounded-full bg-white/30 p-2 inline-flex">{quadrants[3].icon}</div>
            </div>
            <h3 className={`text-xl font-bold ${quadrants[3].textColor}`}>{quadrants[3].title}</h3>
            <p className={`${quadrants[3].textColor} opacity-90`}>{quadrants[3].description}</p>
          </div>
        </Card>
      </div>

      <Dialog open={!!selectedQuadrant} onOpenChange={(open) => !open && setSelectedQuadrant(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedQuadrant && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${selectedQuadrant.color} ${selectedQuadrant.textColor}`}>
                    {selectedQuadrant.icon}
                  </div>
                  <span>
                    {selectedQuadrant.category}: {selectedQuadrant.title}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-lg pt-4">{selectedQuadrant.explanation}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <h3 className="font-medium">How to handle these tasks:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedQuadrant.id === 1 && (
                    <>
                      <li>Do these tasks immediately</li>
                      <li>Minimize time spent in this quadrant by planning ahead</li>
                      <li>Delegate if possible, but take responsibility</li>
                    </>
                  )}
                  {selectedQuadrant.id === 2 && (
                    <>
                      <li>Schedule specific time for these tasks</li>
                      <li>Focus on long-term goals and planning</li>
                      <li>Invest time here to reduce urgent matters</li>
                    </>
                  )}
                  {selectedQuadrant.id === 3 && (
                    <>
                      <li>Delegate these tasks when possible</li>
                      <li>Minimize time spent on these activities</li>
                      <li>Be cautious of tasks that seem urgent but aren&apos;t important</li>
                    </>
                  )}
                  {selectedQuadrant.id === 4 && (
                    <>
                      <li>Eliminate these tasks whenever possible</li>
                      <li>Recognize time-wasting activities</li>
                      <li>Say no to these tasks to focus on what matters</li>
                    </>
                  )}
                </ul>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

