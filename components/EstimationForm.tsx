"use client";

import { useEstimationStore } from "@/lib/store";
import ServiceCard from "./ServiceCard";
import SummaryCard from "./SummaryCard";
import { motion } from "framer-motion";

export default function EstimationForm() {
  const { sections, totalCost,  } = useEstimationStore();


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6"> {/* Updated grid layout */}
      <motion.div className="col-span-1 lg:col-span-4" variants={containerVariants} initial="hidden" animate="visible">
        {sections.map((section) => (
          <motion.div key={section.id} variants={containerVariants} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{section.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"> {/* Updated grid layout */}
              {section.services.map((service) => (
                <ServiceCard key={service.id} sectionId={section.id} service={service} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <div className="col-span-1">
        <SummaryCard total={totalCost()} />
      </div>
    </div>
  );
}