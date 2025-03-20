"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LucideChevronLeft, LucideChevronRight, LucideDownload, LucideZoomIn, LucideZoomOut } from "lucide-react"
import { motion } from "framer-motion"

interface PdfViewerProps {
  pdfUrl: string
}

export function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(10) // Placeholder
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and fetching PDF metadata
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Simulate setting total pages based on the PDF URL
      // In a real implementation, this would come from parsing the PDF
      setTotalPages(
        pdfUrl.includes("module01") ? 8 : pdfUrl.includes("module02") ? 12 : pdfUrl.includes("module03") ? 10 : 15,
      )
    }, 1000)

    return () => clearTimeout(timer)
  }, [pdfUrl])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25)
    }
  }

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="w-full bg-white rounded-lg shadow-soft border p-4 mb-4">
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <LucideChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <LucideChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <LucideZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <LucideZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" className="flex items-center hover:bg-primary/10 hover:text-primary">
            <LucideDownload className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {isLoading ? (
          <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-500">Loading document from {pdfUrl.split("/").pop()}...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            <div className="text-center p-8 bg-white shadow-sm mx-auto max-w-3xl h-full overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6">Module Content</h3>

              <div className="text-left space-y-4">
                <p className="mb-4">
                  This is a placeholder for the PDF content of this module. In a real implementation, this would display
                  the actual PDF document.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Section 1: Introduction</h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu
                  sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Section 2: Key Concepts</h4>
                <p>
                  Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Aenean ut gravida lorem.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>First important concept</li>
                  <li>Second important concept</li>
                  <li>Third important concept</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">Section 3: Application</h4>
                <p>
                  Ut aliquam purus sit amet luctus venenatis lectus magna fringilla urna. Porttitor rhoncus dolor purus
                  non enim praesent elementum facilisis.
                </p>

                <div className="bg-gray-100 p-4 rounded-md my-4">
                  <h5 className="font-medium mb-2">Example Case:</h5>
                  <p>
                    Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend
                    nibh porttitor.
                  </p>
                </div>

                <h4 className="text-xl font-semibold mt-6 mb-3">Summary</h4>
                <p>
                  In this module, we covered the essential concepts related to this topic. Remember the key points as
                  they will be important for the quiz and final assessment.
                </p>
              </div>

              <p className="mt-8 text-sm text-gray-500">Current page: {currentPage}</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

