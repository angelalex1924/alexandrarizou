"use client"

import React from 'react'

interface AcronMetricsIconProps {
  size?: number
  className?: string
}

export const AcronMetricsIcon: React.FC<AcronMetricsIconProps> = ({ 
  size = 24, 
  className = "" 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="metricsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="metricsGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      
      {/* Base triangle (AcronWeb style) */}
      <path 
        d="M20 2L36 34H4L20 2Z" 
        fill="url(#metricsGradient)"
        className="dark:fill-[url(#metricsGradientDark)]"
      />
      
      {/* Chart bars overlay (metrics theme) */}
      <g transform="translate(8, 18)">
        {/* Bar 1 */}
        <rect x="0" y="8" width="3" height="6" fill="white" opacity="0.9" rx="1" />
        {/* Bar 2 */}
        <rect x="5" y="4" width="3" height="10" fill="white" opacity="0.9" rx="1" />
        {/* Bar 3 */}
        <rect x="10" y="6" width="3" height="8" fill="white" opacity="0.9" rx="1" />
        {/* Bar 4 */}
        <rect x="15" y="2" width="3" height="12" fill="white" opacity="0.9" rx="1" />
      </g>
      
      {/* Small accent dots (data points) */}
      <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.8" />
      <circle cx="28" cy="12" r="1.5" fill="white" opacity="0.8" />
    </svg>
  )
}

export function AcronMetricsLogo({ 
  iconSize = 24, 
  textSize = "text-sm",
  className = "",
  horizontal = true
}: {
  iconSize?: number
  textSize?: string
  className?: string
  horizontal?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* SVG Icon */}
      <div className="relative">
        <AcronMetricsIcon size={iconSize} />
      </div>
      
      {/* Text Logo */}
      {horizontal && (
        <div className="flex flex-col items-start gap-0">
          <span 
            className={`font-semibold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${textSize}`}
            style={{
              letterSpacing: "0.02em",
              textRendering: "optimizeLegibility",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale"
            }}
          >
            AcronMetrics
          </span>
        </div>
      )}
    </div>
  )
}

