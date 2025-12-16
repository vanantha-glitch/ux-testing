"use client"

import React from "react"

/**
 * AxisTriad
 * Simple visual XYZ axis indicator, rendered as a transparent overlay.
 * Currently a static legend; only used in the Cura Cloud page prototype.
 */
export default function AxisTriad() {
  return (
    <div
      className="pointer-events-none"
      style={{
        width: 72,
        height: 72,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        opacity: 0.9,
      }}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 72 72"
        style={{
          overflow: "visible",
        }}
      >
        {/* Origin point */}
        <circle cx="16" cy="56" r="3" fill="#111827" />

        {/* X axis (red) */}
        <line x1="16" y1="56" x2="60" y2="56" stroke="#EF4444" strokeWidth="2" />
        <text x="62" y="60" fontSize="10" fill="#EF4444" fontFamily="system-ui, -apple-system, BlinkMacSystemFont">
          X
        </text>

        {/* Y axis (green, up) */}
        <line x1="16" y1="56" x2="16" y2="12" stroke="#10B981" strokeWidth="2" />
        <text x="12" y="10" fontSize="10" fill="#10B981" fontFamily="system-ui, -apple-system, BlinkMacSystemFont">
          Y
        </text>

        {/* Z axis (blue, into screen represented diagonally) */}
        <line x1="16" y1="56" x2="40" y2="32" stroke="#3B82F6" strokeWidth="2" />
        <text x="42" y="30" fontSize="10" fill="#3B82F6" fontFamily="system-ui, -apple-system, BlinkMacSystemFont">
          Z
        </text>
      </svg>
    </div>
  )
}




