"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle, CheckCircle, AlertTriangle, Calculator, Users, FileText } from "lucide-react"
import { structureExplanations } from "@/data/decision/structure-explanations"
import { motion } from "framer-motion"

type StructureExplanationDialogProps = {
  structureName: string
}

export default function StructureExplanationDialog({ structureName }: StructureExplanationDialogProps) {
  const explanation = structureExplanations[structureName] || {
    title: structureName,
    description: "No detailed explanation available for this structure.",
    keyFeatures: [],
    advantages: [],
    disadvantages: [],
    taxConsiderations: "",
    suitableFor: [],
    setupRequirements: [],
  }

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
    show: { opacity: 1, y: 0 },
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-4 bg-white dark:bg-gray-900 group hover:bg-primary/5 dark:hover:bg-primary/10"
        >
          <HelpCircle className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
          Why {structureName}?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-primary">
            <span>{explanation.title}</span>
          </DialogTitle>
          <DialogDescription className="text-base mt-2">{explanation.description}</DialogDescription>
        </DialogHeader>

        <motion.div className="mt-6 space-y-6" variants={container} initial="hidden" animate="show">
          {/* Key Features */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </span>
              Key Features
            </h3>
            <ul className="space-y-1 pl-6 list-disc text-muted-foreground">
              {explanation.keyFeatures.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </motion.div>

          {/* Advantages */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1 rounded-md bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              </span>
              Advantages
            </h3>
            <ul className="space-y-1 pl-6 list-disc text-muted-foreground">
              {explanation.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </motion.div>

          {/* Disadvantages */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-900/30">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </span>
              Disadvantages
            </h3>
            <ul className="space-y-1 pl-6 list-disc text-muted-foreground">
              {explanation.disadvantages.map((disadvantage, index) => (
                <li key={index}>{disadvantage}</li>
              ))}
            </ul>
          </motion.div>

          {/* Tax Considerations */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/30">
                <Calculator className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </span>
              Tax Considerations
            </h3>
            <p className="text-muted-foreground">{explanation.taxConsiderations}</p>
          </motion.div>

          {/* Suitable For */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30">
                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </span>
              Suitable For
            </h3>
            <ul className="space-y-1 pl-6 list-disc text-muted-foreground">
              {explanation.suitableFor.map((suitability, index) => (
                <li key={index}>{suitability}</li>
              ))}
            </ul>
          </motion.div>

          {/* Setup Requirements */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-100 dark:bg-rose-900/30">
                <FileText className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </span>
              Setup Requirements
            </h3>
            <ul className="space-y-1 pl-6 list-disc text-muted-foreground">
              {explanation.setupRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item} className="pt-4 text-center">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}

