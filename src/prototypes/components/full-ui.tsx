"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ViewportProvider } from "./viewport/viewport-context"

// Dynamically import the production components
const TopBarProduction = dynamic(() => import("./top-bar/production").then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <Skeleton className="h-16 w-full" />
})

const RightPanelBehaviorV2 = dynamic(() => import("./right-panel/production").then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <Skeleton className="h-[896px] w-[240px]" />
})

const AdjustmentTools = dynamic(() => import("./adjustment-tools").then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-[300px]" />
})

const Viewport = dynamic(() => import("./viewport").then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />
})

export default function FullUI() {
  return (
    <ViewportProvider initialPrinterId="ultimaker-method-x">
    <div 
      className="relative flex flex-col bg-[#FAF8F6]"
      style={{
        width: '1440px',
        height: '1024px',
        maxWidth: '1440px',
        maxHeight: '1024px',
        minWidth: '1440px',
        minHeight: '1024px',
      }}
    >
      {/* Top Bar */}
      <div className="flex-shrink-0 relative z-10">
        <Suspense fallback={<Skeleton className="h-16 w-full" />}>
          <TopBarProduction />
        </Suspense>
      </div>

      {/* Viewport - Background Layer covering entire area */}
      <div 
        className="absolute"
        style={{
          top: '64px', // Below top bar
          left: 0,
          right: 0,
          bottom: 0,
          width: '1440px',
          height: '960px',
          zIndex: 1, // Background layer
          pointerEvents: 'auto', // Ensure viewport can receive pointer events
        }}
      >
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <Viewport showDropdowns={false} />
        </Suspense>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex overflow-hidden relative"
        style={{
          height: '960px', // 1024 - 64 (top bar height)
          zIndex: 10, // Above viewport
          pointerEvents: 'none', // Pass through by default, panels will override
        }}
      >
        {/* Left Side - Adjustment Tools */}
        <div 
          className="flex-shrink-0 flex flex-col p-4 relative"
          style={{
            width: '300px',
            minWidth: '300px',
            maxWidth: '300px',
            zIndex: 20,
            pointerEvents: 'auto', // Ensure this panel is clickable
          }}
        >
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <div className="flex-1 overflow-hidden" style={{ height: '100%' }}>
              <AdjustmentTools />
            </div>
          </Suspense>
        </div>

        {/* Center - Viewport visible here (transparent background) */}
        <div 
          className="flex-1 relative"
          style={{
            minWidth: 0,
            flexGrow: 1,
            padding: '0',
            zIndex: 0, // Below side panels
            pointerEvents: 'none', // Allow pointer events to pass through to viewport
          }}
        >
          {/* Viewport shows through this transparent area - pointer events pass through */}
        </div>

        {/* Right Side - Right Panel */}
        <div 
          className="flex-shrink-0 relative"
          style={{
            width: '240px',
            minWidth: '240px',
            maxWidth: '240px',
            paddingTop: '16px',
            zIndex: 20,
            pointerEvents: 'auto', // Ensure this panel is clickable
          }}
        >
          <Suspense fallback={<Skeleton className="h-full w-[240px]" />}>
            <RightPanelBehaviorV2 />
          </Suspense>
        </div>
      </div>
    </div>
    </ViewportProvider>
  )
}

