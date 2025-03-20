"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LucidePlay, LucidePause, LucideVolume2, LucideVolumeX, LucideMaximize, LucideMinimize } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string; // Add this prop
}

export function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = Number.parseInt(e.target.value)
    setProgress(newProgress)
    setCurrentTime((newProgress / 100) * duration)
  }

  // Simulate video progress
  useEffect(() => {
    if (isPlaying && !isLoading && duration > 0) {
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1
          if (newTime >= duration) {
            setIsPlaying(false)
            return duration
          }
          return newTime
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isPlaying, isLoading, duration])

  // Separate effect to update progress based on currentTime
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100)
    }
  }, [currentTime, duration])

  // Set a dummy duration for the demo
  useEffect(() => {
    if (!isLoading) {
      setDuration(320) // 5:20 in seconds
    }
  }, [isLoading])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative"
    >
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Replace the placeholder image with the actual video */}
          <video
            src={videoUrl} // Use the videoUrl prop here
            controls={false} // Disable default controls
            className="w-full h-full object-cover"
            muted={isMuted}
            autoPlay={isPlaying}
            loop
          />

          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white"
              >
                <LucidePlay className="h-8 w-8" />
              </motion.button>
            </motion.div>
          )}

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
          >
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-white">
                <button onClick={handlePlayPause} className="hover:text-primary transition-colors">
                  {isPlaying ? <LucidePause className="h-5 w-5" /> : <LucidePlay className="h-5 w-5" />}
                </button>

                <span className="text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="flex-1 mx-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                </div>

                <button onClick={handleMute} className="hover:text-primary transition-colors">
                  {isMuted ? <LucideVolumeX className="h-5 w-5" /> : <LucideVolume2 className="h-5 w-5" />}
                </button>

                <button onClick={handleFullscreen} className="hover:text-primary transition-colors">
                  {isFullscreen ? <LucideMinimize className="h-5 w-5" /> : <LucideMaximize className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}