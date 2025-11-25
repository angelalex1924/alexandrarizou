import React from 'react'
import { motion } from 'framer-motion'

// AcronWeb ID SVG Icon - Clean and professional
const AcronWebIDIcon = ({ className = "h-6 w-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none"
    className={className}
  >
    <g clipPath="url(#clip0_4418_3412)">
      <path 
        d="M12.0001 9.11914C12.9101 9.11914 13.6501 9.85917 13.6501 10.7692V13.2391C13.6501 14.1491 12.9101 14.8892 12.0001 14.8892C11.0901 14.8892 10.3501 14.1491 10.3501 13.2391" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M16.98 13.4697C16.78 16.0497 14.62 18.0697 12 18.0697C9.24 18.0697 7 15.8297 7 13.0697V10.9297C7 8.16969 9.24 5.92969 12 5.92969C14.59 5.92969 16.72 7.89968 16.97 10.4197" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M15 2H17C20 2 22 4 22 7V9" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeMiterlimit="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M2 9V7C2 4 4 2 7 2H9" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeMiterlimit="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M15 22H17C20 22 22 20 22 17V15" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeMiterlimit="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M2 15V17C2 20 4 22 7 22H9" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeMiterlimit="10" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </g>
    <defs>
      <clipPath id="clip0_4418_3412">
        <rect width="24" height="24" fill="white"/>
      </clipPath>
    </defs>
  </svg>
)

// Main AcronWeb ID Logo Component
export const AcronWebIDLogo = ({ 
  size = "md", 
  showText = true, 
  showDescription = false,
  isGreek = false,
  animated = true,
  className = "",
  iconClassName = "",
  textClassName = ""
}) => {
  const sizeMap = {
    sm: {
      icon: "h-6 w-6",
      text: "text-sm",
      container: "gap-2"
    },
    md: {
      icon: "h-8 w-8",
      text: "text-base",
      container: "gap-2.5"
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-lg",
      container: "gap-3"
    }
  }

  const currentSize = sizeMap[size] || sizeMap.md

  // Description text based on language
  const getDescription = () => {
    return isGreek ? "Ενιαία πρόσβαση παντού" : "Your all-in-one SSO"
  }

  const LogoContent = () => (
    <motion.div
      className={`${showDescription ? 'flex flex-col items-center' : `flex items-center ${currentSize.container}`} ${className}`}
      whileHover={animated ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Main logo container */}
      <div className={`flex items-center ${showDescription ? currentSize.container : ''}`}>
        {/* Icon */}
        <div className={`flex-shrink-0 relative ${iconClassName}`}>
          <AcronWebIDIcon 
            className={`${currentSize.icon} text-teal-600 dark:text-teal-400`}
          />
        </div>

        {/* Text - All in one line with proper alignment */}
        {showText && (
          <div className={`flex items-baseline ${textClassName}`}>
            {/* ACRON - Blue gradient like main logo */}
            <span 
              className={`bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 dark:from-blue-400 dark:via-blue-300 dark:to-blue-500 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-blue-600 group-hover:to-blue-800 dark:group-hover:from-blue-300 dark:group-hover:via-blue-200 dark:group-hover:to-blue-400 transition-all duration-500 ${currentSize.text}`}
              style={{
                fontFamily: "'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 50%",
                textShadow: "0 2px 4px rgba(59, 130, 246, 0.15), 0 1px 2px rgba(59, 130, 246, 0.08)",
                filter: "contrast(1.1) brightness(1.02)",
                lineHeight: "1"
              }}
            >
              ACRON
            </span>
            
            {/* WEB - Slate gradient like main logo */}
            <span 
              className={`gegola-font bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-50 dark:via-white dark:to-slate-100 bg-clip-text text-transparent group-hover:from-slate-950 group-hover:via-slate-800 group-hover:to-slate-900 dark:group-hover:from-white dark:group-hover:via-slate-50 dark:group-hover:to-slate-100 transition-all duration-500 ${currentSize.text}`}
              style={{
                fontFamily: "'Geogola', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 50%",
                textShadow: "0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
                filter: "contrast(1.1) brightness(1.02)",
                lineHeight: "1",
                marginLeft: "-1px"
              }}
            >
              WEB
            </span>
            
            {/* ID - Teal gradient with Gegola font like WEB */}
            <span 
              className={`gegola-font bg-gradient-to-br from-teal-600 via-teal-500 to-teal-700 dark:from-teal-400 dark:via-teal-300 dark:to-teal-500 bg-clip-text text-transparent group-hover:from-teal-700 group-hover:via-teal-600 group-hover:to-teal-800 dark:group-hover:from-teal-300 dark:group-hover:via-teal-200 dark:group-hover:to-teal-400 transition-all duration-500 ${currentSize.text}`}
              style={{
                fontFamily: "'Geogola', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                backgroundSize: "200% 200%",
                backgroundPosition: "0% 50%",
                textShadow: "0 2px 4px rgba(20, 184, 166, 0.15), 0 1px 2px rgba(20, 184, 166, 0.08)",
                filter: "contrast(1.1) brightness(1.02)",
                lineHeight: "1",
                marginLeft: "2px"
              }}
            >
              ID
            </span>
          </div>
        )}
      </div>

      {/* Description text */}
      {showDescription && (
        <motion.p
          className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium"
          style={{
            fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            letterSpacing: "0.025em",
            textShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {getDescription()}
        </motion.p>
      )}
    </motion.div>
  )

  return (
    <div className="group">
      <LogoContent />
    </div>
  )
}

export default AcronWebIDLogo 