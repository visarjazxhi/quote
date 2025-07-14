"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, ExternalLink, Eye, File, FileArchive, FileText, Play } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import type { Integration } from "@/data/knowledge"
import { useState } from "react"

type IntegrationCardProps = {
  integration: Integration
}

export default function IntegrationCard({ integration }: IntegrationCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const IconComponent = integration.icon as React.ComponentType<{ className?: string; style?: React.CSSProperties }>

  // Function to get appropriate icon based on file type
  const getFileIcon = (fileType?: string) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 mr-2" />
      case "zip":
        return <FileArchive className="h-4 w-4 mr-2" />
      default:
        return <File className="h-4 w-4 mr-2" />
    }
  }

  // Check if integration has files or links
  const hasFiles = integration.files && integration.files.length > 0
  const hasLinks = integration.links && integration.links.length > 0

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/[?&]v=([^&]+)/)
    return match ? match[1] : null
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 group h-full">
        <CardContent className="p-4 flex flex-col h-full min-h-[320px]">
          <div className="flex flex-col items-center text-center space-y-2 mb-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
              style={{ backgroundColor: `${integration.color}20` }}
            >
              <IconComponent
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                style={{ color: integration.color }}
              />
            </div>
            <h3 className="font-semibold text-sm">{integration.name}</h3>
          </div>

          {/* Video placeholder or embedded video */}
          {integration.hasVideo && (
            <div
              className="w-full aspect-video mb-3 rounded-md overflow-hidden flex items-center justify-center relative group cursor-pointer"
              style={{ backgroundColor: `${integration.color}10` }}
              onClick={() => setDialogOpen(true)}
            >
              {integration.videoUrl ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(integration.videoUrl)}`}
                  title={integration.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white bg-opacity-90 shadow-md transition-transform group-hover:scale-110"
                    style={{ color: integration.color }}
                  >
                    <Play className="w-6 h-6 ml-1" fill={integration.color} />
                  </div>
                </div>
              )}
            </div>
          )}
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

            {hasFiles && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="Download files">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {integration.files?.map((file, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => window.open(file.url, "_blank")}
                      className="flex items-center"
                    >
                      {getFileIcon(file.type)}
                      {file.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {hasLinks && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8" title="Visit websites">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {integration.links?.map((link, index) => (
                    <DropdownMenuItem key={index} onClick={() => window.open(link.url, "_blank")}>
                      {link.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                <IconComponent className="w-4 h-4" style={{ color: integration.color }} />
              </div>
              {integration.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Category: {integration.category}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Video placeholder or embedded video in dialog */}
            {integration.hasVideo && (
              <div
                className="w-full aspect-video rounded-md overflow-hidden flex items-center justify-center relative"
                style={{ backgroundColor: `${integration.color}10` }}
              >
                {integration.videoUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(integration.videoUrl)}`}
                    title={integration.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-white bg-opacity-90 shadow-md"
                      style={{ color: integration.color }}
                    >
                      <Play className="w-8 h-8 ml-1" fill={integration.color} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <p className="text-sm">{integration.description}</p>

            {/* Files section */}
            {hasFiles && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Files</h4>
                <div className="grid grid-cols-1 gap-2">
                  {integration.files?.map((file, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start gap-2 w-full"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      {getFileIcon(file.type)}
                      <span className="truncate">{file.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Links section */}
            {hasLinks && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Links</h4>
                <div className="grid grid-cols-1 gap-2">
                  {integration.links?.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start gap-2 w-full"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{link.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
