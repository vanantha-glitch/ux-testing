"use client"

import { ReactNode, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, X } from "lucide-react"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContextOverlayProps {
  children: ReactNode
  enabled: boolean
  onToggle: (enabled: boolean) => void
  contextImagePath?: string
}

export function ContextOverlay({
  children,
  enabled,
  onToggle,
  contextImagePath = "/context/RightPanelBackground.png",
}: ContextOverlayProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!enabled) {
    return <>{children}</>
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      {/* Inline context view */}
      <div className="relative w-full h-full min-h-[992px] overflow-hidden bg-muted">
        {/* Background image - sized to 1440x1024 */}
        {!imageError ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center">
            <div 
              className="relative context-image-container"
              style={{ 
                width: '1440px', 
                height: '1024px',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              <Image
                src={contextImagePath}
                alt="Context view"
                fill
                className="object-contain"
                style={{ objectFit: "contain" }}
                priority
                unoptimized
                onError={handleImageError}
                sizes="1440px"
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/50">
            <Alert className="max-w-md">
              <AlertDescription>
                Context image not found. Please ensure the image is located at <code className="text-xs bg-muted px-1 py-0.5 rounded">public/context/RightPanelBackground.png</code>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Overlay component - positioned to match image container */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
          <div className="relative context-overlay-wrapper" style={{ width: '1440px', height: '1024px', maxWidth: '100%', maxHeight: '100%' }}>
            <div className="relative w-full h-full pointer-events-auto">
              {children}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggle(false)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Exit Context
          </Button>
        </div>
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent 
          className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 m-0 rounded-none border-0"
          style={{ 
            width: '100vw', 
            height: '100vh', 
            maxWidth: '100vw', 
            maxHeight: '100vh',
            resize: 'none'
          }}
        >
          <div className="relative w-full h-full overflow-hidden bg-muted" style={{ width: '100vw', height: '100vh' }}>
            {/* Background image - sized to 1440x1024 */}
            {!imageError ? (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                <div 
                  className="relative context-image-container"
                  style={{ 
                    width: '1440px', 
                    height: '1024px',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                >
                  <Image
                    src={contextImagePath}
                    alt="Context view - Fullscreen"
                    fill
                    className="object-contain"
                    style={{ objectFit: "contain" }}
                    priority
                    unoptimized
                    onError={handleImageError}
                    sizes="1440px"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-muted/50">
                <Alert className="max-w-md">
                  <AlertDescription>
                    Context image not found. Please ensure the image is located at <code className="text-xs bg-muted px-1 py-0.5 rounded">public/context/RightPanelBackground.png</code>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            
            {/* Overlay component - positioned to match image container */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
              <div className="relative context-overlay-wrapper" style={{ width: '1440px', height: '1024px', maxWidth: '100%', maxHeight: '100%' }}>
                <div className="relative w-full h-full pointer-events-auto">
                  {children}
                </div>
              </div>
            </div>

            {/* Fullscreen controls */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFullscreen(false)}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Minimize2 className="h-4 w-4 mr-2" />
                Exit Fullscreen
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsFullscreen(false)
                  onToggle(false)
                }}
                className="bg-background/80 backdrop-blur-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Exit Context
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

