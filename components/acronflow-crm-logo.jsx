"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Load Milker font
const loadMilkerFont = () => {
  if (typeof window !== 'undefined') {
    const font = new FontFace('Milker', 'url(/fonts/Milker.otf)')
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont)
    }).catch((error) => {
      console.warn('Failed to load Milker font:', error)
    })
  }
}

// AcronFlow CRM Icon - Professional CRM system icon
const AcronFlowIcon = ({ className, isHovered, size = "default" }) => {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    default: "w-6 h-6",
    lg: "w-8 h-8"
  }
  
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
    >
      <motion.path 
        d="M33.724 36.5809C37.7426 32.5622 40.0003 27.1118 40.0003 21.4286C40.0003 15.7454 37.7426 10.2949 33.724 6.27629C29.7054 2.25765 24.2549 1.02188e-06 18.5717 0C12.8885 -1.02188e-06 7.43807 2.25764 3.41943 6.27628L10.4905 13.3473C11.6063 14.4631 13.4081 14.4074 14.8276 13.7181C15.9836 13.1568 17.2622 12.8571 18.5717 12.8571C20.845 12.8571 23.0252 13.7602 24.6326 15.3677C26.2401 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8435 24.0167 26.2822 25.1727C25.5929 26.5922 25.5372 28.394 26.6529 29.5098L33.724 36.5809Z" 
        fill="#14B8A6"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: isHovered ? [0, 1] : 1,
          fill: isHovered ? ["#14B8A6", "#059669", "#14B8A6"] : "#14B8A6"
        }}
        transition={{ 
          duration: isHovered ? 2 : 0.5,
          ease: "easeInOut",
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: isHovered ? 1 : 0
        }}
      />
      <motion.path 
        d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" 
        fill="#0ea5e9"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: isHovered ? [0, 1] : 1,
          fill: isHovered ? ["#0ea5e9", "#10B981", "#0ea5e9"] : "#0ea5e9"
        }}
        transition={{ 
          duration: isHovered ? 2 : 0.5,
          ease: "easeInOut",
          delay: isHovered ? 0.3 : 0.1,
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: isHovered ? 1 : 0
        }}
      />
      <motion.path 
        d="M10.7143 39.9999H4.28571C1.91878 39.9999 0 38.0812 0 35.7142V29.2856L10.7143 39.9999Z" 
        fill="#0ea5e9"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: isHovered ? [0, 1] : 1,
          fill: isHovered ? ["#0ea5e9", "#10B981", "#0ea5e9"] : "#0ea5e9"
        }}
        transition={{ 
          duration: isHovered ? 2 : 0.5,
          ease: "easeInOut",
          delay: isHovered ? 0.5 : 0.2,
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: isHovered ? 1 : 0
        }}
      />
    </svg>
  )
}

// Coming Soon Badge Component
const ComingSoonBadge = ({ className, size = "default" }) => {
  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    default: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1"
  }
  
  return (
    <motion.span
      className={cn(
        "inline-flex items-center rounded-full bg-amber-100 border border-amber-300 text-amber-700 font-medium",
        sizeClasses[size],
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      whileHover={{ 
        scale: 1.05
      }}
    >
      Coming Soon
    </motion.span>
  )
}

// Main AcronFlow CRM Logo Component
export const AcronFlowLogo = ({ 
  size = "default", 
  className = "", 
  showBadge = false,
  animated = true,
  variant = "horizontal",
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Load Milker font on component mount
  useEffect(() => {
    loadMilkerFont()
  }, [])

  const sizeClasses = {
    navbar: {
      icon: "xs",
      text: "text-xs",
      container: "gap-1",
      badge: "sm"
    },
    mobile: {
      icon: "sm",
      text: "text-sm",
      container: "gap-1.5",
      badge: "sm"
    },
    sm: {
      icon: "sm",
      text: "text-sm",
      container: "gap-2",
      badge: "sm"
    },
    default: {
      icon: "default",
      text: "text-base",
      container: "gap-2",
      badge: "default"
    },
    lg: {
      icon: "lg", 
      text: "text-lg",
      container: "gap-3",
      badge: "lg"
    },
    "2xl": {
      icon: "lg", 
      text: "text-2xl",
      container: "gap-4",
      badge: "lg"
    }
  }

  const currentSize = sizeClasses[size] || sizeClasses.default

  const logoVariants = {
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  }

  const LogoContent = () => (
    <motion.div
      className={cn(
        "flex items-center cursor-pointer transition-all duration-300",
        currentSize.container,
        variant === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      variants={animated ? logoVariants : {}}
      initial="visible"
      animate="visible"
      whileHover="hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Icon with glow effect */}
      <div className="relative">
        <AcronFlowIcon 
          className="text-indigo-600 dark:text-indigo-400" 
          isHovered={isHovered}
          size={currentSize.icon}
        />
        {isHovered && (
          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-indigo-400/20 blur-md"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Text and Badge Container */}
      <div className={cn(
        "flex items-center",
        variant === "vertical" ? "flex-col gap-1" : "gap-2"
      )}>
        {/* Logo Text */}
        <div className="relative">
          <motion.span
            className={cn(
              "font-medium tracking-wide font-milker text-gray-800 dark:text-white",
              currentSize.text
            )}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
            style={{
              fontFamily: "'Milker', 'Arial', sans-serif",
              fontWeight: 'normal',
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              textRendering: "optimizeLegibility",
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale"
            }}
          >
            AcronFlow
          </motion.span>
          
          {/* Beautiful accent dots with enhanced styling */}
          <motion.div
            className="absolute -bottom-2 left-0 flex items-center gap-0.5"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <motion.div 
              className="w-1 h-1 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 shadow-lg shadow-teal-500/30"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.3, shadow: "0 0 12px rgba(20, 184, 166, 0.6)" }}
              style={{ backgroundColor: '#40e0d0' }}
            />
            <motion.div 
              className="w-1 h-1 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ scale: 1.3, shadow: "0 0 12px rgba(59, 130, 246, 0.6)" }}
              style={{ backgroundColor: '#3b82f6' }}
            />
            <motion.div 
              className="w-1 h-1 rounded-full bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 shadow-lg shadow-fuchsia-500/30"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              whileHover={{ scale: 1.3, shadow: "0 0 12px rgba(217, 70, 239, 0.6)" }}
              style={{ backgroundColor: '#d946ef' }}
            />
            <motion.span
              className="ml-1 text-[8px] sm:text-[9px] font-milker font-medium uppercase tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              style={{
                fontFamily: "'Milker', 'Arial', sans-serif",
                color: '#0d9488',
                WebkitTextFillColor: '#0d9488'
              }}
            >
              CRM
            </motion.span>
          </motion.div>
        </div>
        
        {/* Coming Soon Badge */}
        {showBadge && (
          <ComingSoonBadge 
            size={currentSize.badge}
            className={variant === "vertical" ? "mt-1" : ""}
          />
        )}
      </div>
    </motion.div>
  )

  return <LogoContent />
}

export default AcronFlowLogo