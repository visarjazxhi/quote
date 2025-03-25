"use client"

import { motion } from "framer-motion"
import BusinessStructureDiagram from "@/components/decision/business-structure-diagram"

export default function BusinessStructureDecisionTree() {
  return (
    <div className="container mx-auto py-10 px-4 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <BusinessStructureDiagram />
      </motion.div>
    </div>
  )
}

