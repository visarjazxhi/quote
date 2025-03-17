"use client"

import type React from "react"

import { useState } from "react"
import type { Integration } from "@/data/knowledge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye, Download, ExternalLink } from "lucide-react"

type IntegrationCardProps = {
  integration: Integration
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> = integration.icon

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    // In a real app, you would implement actual file download logic here
    window.open(integration.fileUrl, "_blank")
  }

  const handleExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(integration.websiteUrl, "_blank")
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 group h-full">
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex flex-col items-center text-center space-y-2 mb-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: `${integration.color}20` }}
            >
              <Icon
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                style={{ color: integration.color }}
              />
            </div>
            <h3 className="font-semibold text-sm">{integration.name}</h3>
          </div>
          <p className="text-xs text-gray-500 flex-grow overflow-hidden">
            {integration.description.length > 150
              ? `${integration.description.substring(0, 150)}...`
              : integration.description}
          </p>

          {/* Action buttons */}
          <div className="flex justify-center mt-3 space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => setDialogOpen(true)}
              title="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {integration.fileUrl && (
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={handleDownload} title="Download file">
                <Download className="h-4 w-4" />
              </Button>
            )}

            {integration.websiteUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8"
                onClick={handleExternalLink}
                title="Visit website"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog for showing full content */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${integration.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: integration.color }} />
              </div>
              {integration.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Category: {integration.category}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">{integration.description}</p>

            <div className="flex space-x-2">
              {integration.fileUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(integration.fileUrl, "_blank")}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}

              {integration.websiteUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(integration.websiteUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  Visit Website
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

