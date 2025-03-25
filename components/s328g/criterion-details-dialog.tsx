"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Info, CheckCircle2, XCircle, AlertTriangle, FileText, BookOpen } from "lucide-react"
import type { criteriaData } from "@/data/s328g"

type CriterionDetailsDialogProps = {
  criterion: (typeof criteriaData)[number]
}

export default function CriterionDetailsDialog({ criterion }: CriterionDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="h-4 w-4" /> Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="bg-primary/10 text-primary font-medium rounded-full w-7 h-7 flex items-center justify-center text-sm">
              {criterion.id}
            </span>
            {criterion.title}
          </DialogTitle>
          <DialogDescription className="text-base">{criterion.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100 dark:border-blue-900">
            <FileText className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-700 dark:text-blue-300">Legislative Reference</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">{criterion.legislativeReference}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Detailed Explanation
            </h3>
            <div className="text-muted-foreground space-y-3">
              {criterion.detailedExplanation.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {criterion.examples && criterion.examples.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Examples from Law Companion Ruling 2016/3</h3>
              <div className="space-y-4">
                {criterion.examples.map((example, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-md border ${
                      example.satisfies
                        ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900"
                        : "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 ${
                          example.satisfies ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {example.satisfies ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{example.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
                        {example.keyFacts && (
                          <div className="mt-2">
                            <h5 className="text-sm font-medium">Key Facts:</h5>
                            <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5 space-y-1">
                              {example.keyFacts.map((fact, factIndex) => (
                                <li key={factIndex}>{fact}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {criterion.keyConsiderations && criterion.keyConsiderations.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Key Considerations</h3>
              <ul className="space-y-2">
                {criterion.keyConsiderations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {criterion.additionalNotes && criterion.additionalNotes.length > 0 && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-lg">Additional Notes</h3>
              <ul className="space-y-2">
                {criterion.additionalNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t">
            <DialogClose asChild>
              <Button className="w-full">Close</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

