"use client";

import ClientInfoForm from "./ClientInfoForm";
import ClientWrapper from "./ClientWrapper";
import { ServiceCard } from "./ServiceCard";
import SummaryCard from "./SummaryCard";
import { motion } from "framer-motion";
import { useEstimationStore } from "@/lib/store";

export default function EstimationForm() {
  const { sections } = useEstimationStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <ClientWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-6"
        suppressHydrationWarning
      >
        <div className="space-y-6" suppressHydrationWarning>
          <ClientInfoForm />

          <div
            className="grid grid-cols-1 xl:grid-cols-4 gap-4"
            suppressHydrationWarning
          >
            <div
              className="col-span-1 xl:col-span-3 space-y-8"
              suppressHydrationWarning
            >
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  variants={sectionVariants}
                  className="mb-8"
                  suppressHydrationWarning
                >
                  <h2
                    className="text-2xl font-bold mb-6 text-primary"
                    suppressHydrationWarning
                  >
                    {section.name}
                  </h2>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    suppressHydrationWarning
                  >
                    {section.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        sectionId={section.id}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="col-span-1" suppressHydrationWarning>
              <SummaryCard />
            </div>
          </div>
        </div>
      </motion.div>
    </ClientWrapper>
  );
}
