"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, AlertTriangle, Scale } from "lucide-react"

type WelcomeScreenProps = {
  onContinue: () => void
}

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-2 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 border-b">
            <div className="flex flex-col items-center text-center">
              <Scale className="h-10 w-10 text-primary mb-3" />
              <h1 className="text-2xl font-bold text-primary mb-1">Small Business Restructure Relief</h1>
              <p className="text-muted-foreground">Subdivision 328-G Eligibility Assessment</p>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                This tool helps you determine if your business qualifies for tax rollover relief when transferring
                assets as part of a genuine restructure.
              </p>

              <div>
                <h3 className="text-lg font-medium mb-2">How It Works</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Answer questions about the 6 key criteria from Subdivision 328-G
                    </p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">Get immediate feedback on your eligibility status</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      Review detailed explanations for each criterion if needed
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-500">
                    For informational purposes only. Consult with a qualified tax professional before making decisions.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center pt-2">
                <Button onClick={onContinue} className="gap-2">
                  Begin Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

