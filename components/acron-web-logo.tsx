"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Import Geogola font
import "@/app/globals.css"

// Professional Website Development Icon - simple triangle with rounded corners
const WebsiteIcon = ({ className, ...props }: { className?: string; [key: string]: any }) => (
  <svg data-logo="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" className={className} {...props}>
    <defs>
      <linearGradient id="blueGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
      <linearGradient id="blueGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <g id="logogram" transform="translate(0, 0) rotate(0)">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20.9053 40.0799C31.951 40.0799 40.9053 31.1256 40.9053 20.0799C40.9053 9.03427 31.951 0.0799561 20.9053 0.0799561C9.85956 0.0799561 0.905273 9.03427 0.905273 20.0799C0.905273 31.1256 9.85956 40.0799 20.9053 40.0799ZM27.1446 9.3968C27.4483 8.31801 26.4014 7.68008 25.4453 8.36125L12.0984 17.8695C11.0615 18.6082 11.2246 20.0799 12.3434 20.0799H15.858V20.0527H22.7078L17.1265 22.022L14.666 30.7631C14.3623 31.8419 15.4091 32.4798 16.3653 31.7986L29.7122 22.2904C30.7491 21.5517 30.5859 20.0799 29.4672 20.0799H24.1374L27.1446 9.3968Z" 
        className="fill-[url(#blueGradientLight)] dark:fill-[url(#blueGradientDark)]"
      />
    </g>
    <g id="logotype" transform="translate(41, 20.5)"></g>
  </svg>
)

// Main AcronWeb Logo Component
export const AcronWebLogo = ({ 
  size = "default", 
  textSize = null,
  className = "", 
  showTagline = false,
  animated = true,
  variant = "horizontal",
  ...props 
}) => {
  const sizeClasses = {
    xxxxs: {
      icon: "h-3 w-3",
      text: "text-[8px]",
      container: "gap-0.5",
      separator: "w-0.5 h-3"
    },
    xs: {
      icon: "h-4 w-4",
      text: "text-xs",
      container: "gap-0.5",
      separator: "w-0.5 h-4"
    },
    small: {
      icon: "h-5 w-5",
      text: "text-sm",
      container: "gap-1",
      separator: "w-0.5 h-6"
    },
    default: {
      icon: "h-6 w-6",
      text: "text-base",
      container: "gap-1",
      separator: "w-0.5 h-7"
    },
    large: {
      icon: "h-8 w-8",
      text: "text-lg",
      container: "gap-1",
      separator: "w-0.5 h-8"
    },
    xl: {
      icon: "h-10 w-10",
      text: "text-xl",
      container: "gap-1.5",
      separator: "w-0.5 h-10"
    }
  }

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm", 
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  }

  const currentSize = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default
  const currentTextSize = textSize ? textSizes[textSize as keyof typeof textSizes] : currentSize.text

  const logoVariants = {
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  }

  const iconVariants = {
    hover: {
      scale: 1.15,
      rotate: 3,
      transition: {
        duration: 0.4,
        type: "spring" as const,
        stiffness: 300,
        damping: 15
      }
    }
  }

  const textVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  }

  const LogoContent = () => (
    <motion.a
      href="https://www.acronweb.gr"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center group cursor-pointer transition-all duration-300",
        currentSize.container,
        variant === "vertical" ? "flex-col" : "flex-row",
        className
      )}
      variants={animated ? logoVariants : {}}
      initial="visible"
      animate="visible"
      whileHover="hover"
      style={{
        alignItems: 'center',
        display: 'flex',
        textDecoration: 'none'
      }}
      {...props}
    >
      {/* Website Icon - without container */}
      {variant !== "text-only" && (
        <motion.div
          className="relative flex items-center justify-center"
          variants={animated ? iconVariants : {}}
        >
          <WebsiteIcon 
            className={cn(
              currentSize.icon,
              "relative z-10",
              "transition-all duration-400",
              "drop-shadow-lg group-hover:drop-shadow-2xl",
              "filter group-hover:brightness-110"
            )}
          />
          
          {/* Simple glow effect behind icon */}
          {animated && (
            <motion.div 
              className="absolute inset-0 bg-blue-400/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"
              whileHover={{
                scale: 1.6,
                opacity: 0.7,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
            />
          )}
        </motion.div>
      )}

      {/* Text Container */}
      <motion.div
        className={cn(
          "flex items-center justify-center",
          variant === "vertical" ? "flex-col text-center mt-1" : "flex-row ml-1"
        )}
        variants={animated ? textVariants : {}}
        style={{ 
          alignItems: 'center',
          display: 'flex'
        }}
      >
        {/* Brand Name */}
        <motion.h1
          className={cn(
            "font-bold tracking-tight leading-none relative inline-flex items-center",
            "transition-all duration-500 ease-out",
            currentTextSize,
            // Enhanced font styling
            "antialiased subpixel-antialiased",
            "filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_3px_8px_rgba(59,130,246,0.3)]"
          )}
          style={{
            fontFamily: "'Inter', 'SF Pro Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            lineHeight: '1',
            height: 'auto'
          }}
        >
          <div className="relative inline-flex items-center" style={{ lineHeight: '1', height: 'auto' }}>
            {/* ACRON - Blue Color */}
            <span 
              className="group-hover:opacity-80 transition-all duration-500"
              style={{
                fontFamily: "'Quizlo', 'Paytone One', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: size === "xxxxs" ? "1" : "1",
                display: "inline-block",
                verticalAlign: size === "xxxxs" ? "baseline" : "baseline",
                transform: size === "xxxxs" ? "translateY(0.5px)" : "none",
                color: "#60a5fa"
              }}
            >
              ACRON
            </span>
                         {/* WEB - Black/White Color */}
             <span 
               className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-50 dark:via-white dark:to-slate-100 bg-clip-text text-transparent group-hover:from-slate-950 group-hover:via-slate-800 group-hover:to-slate-900 dark:group-hover:from-white dark:group-hover:via-slate-50 dark:group-hover:to-slate-100 transition-all duration-500 desktop-web-align"
               style={{
                 fontFamily: "'Geogola', 'Gegola DEMO', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                 fontWeight: 800,
                 letterSpacing: "-0.02em",
                 backgroundSize: "200% 200%",
                 backgroundPosition: "0% 50%",
                 textShadow: "0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)",
                 filter: "contrast(1.1) brightness(1.02)",
                 lineHeight: size === "xxxxs" ? "1" : "1",
                 display: "inline-block",
                 verticalAlign: size === "xxxxs" ? "baseline" : "baseline",
                 transform: "translateY(0px)"
               }}
             >
               WEB
             </span>
          </div>
        </motion.h1>

        {/* Professional Tagline */}
        {showTagline && (
          <motion.p
            className={cn(
              "text-xs font-bold tracking-widest uppercase",
              "text-slate-600/90 dark:text-slate-400/90",
              "group-hover:text-blue-700 dark:group-hover:text-blue-300",
              "transition-all duration-500",
              variant === "vertical" ? "mt-1.5" : "mt-0.5",
              size === "small" ? "text-[9px]" : "text-xs",
              "filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_2px_4px_rgba(59,130,246,0.2)] relative"
            )}
            style={{
              fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textShadow: "0 1px 2px rgba(0,0,0,0.08), 0 0.5px 1px rgba(0,0,0,0.04)"
            }}
          >
            <span className="relative">
              <span className="text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                Digital Solutions
              </span>
              
              {/* Simple animated underline */}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-500 group-hover:w-full transition-all duration-500 ease-out"></span>
            </span>
          </motion.p>
        )}
      </motion.div>

      {/* Simple glow effect for the entire logo */}
      {animated && (
        <motion.div
          className="absolute -inset-2 rounded-xl bg-blue-100/30 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 blur-lg -z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          whileHover={{
            scale: 1.05,
            opacity: 1
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        />
      )}
    </motion.a>
  )

  return (
    <>
      <style jsx>{`
        @font-face {
          font-family: 'Geogola';
          src: url('/fonts/Gegola DEMO.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Quizlo';
          src: url('/fonts/quizlo-demo.regular.otf') format('opentype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        /* Fix WEB text alignment on desktop only */
        @media (min-width: 768px) {
          .desktop-web-align {
            transform: translateY(0px) !important;
            vertical-align: baseline !important;
          }
        }
      `}</style>
      <LogoContent />
    </>
  )
}

// Compact version for mobile/small spaces
export const AcronWebLogoCompact = ({ className = "", ...props }) => (
  <AcronWebLogo 
    size="xs"
    className={className}
    variant="horizontal"
    {...props}
  />
)

// Navbar version with smaller text but same icon size
export const AcronWebLogoNavbar = ({ className = "", ...props }) => (
  <AcronWebLogo 
    size="xs"
    textSize={null}
    className={cn("scale-90", className)}
    variant="horizontal"
    {...props}
  />
)

// Large version for hero sections
export const AcronWebLogoLarge = ({ className = "", showTagline = true, ...props }) => (
  <AcronWebLogo 
    size="xl"
    showTagline={showTagline}
    className={className}
    variant="vertical"
    {...props}
  />
)

// AcronWeb Text Component (without SVG icon) - Now clickable!
const sizeClasses = {
  xs: {
    text: "text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs",
    container: "gap-0.5",
  },
  small: {
    text: "text-[7px] sm:text-[9px] md:text-xs lg:text-sm",
    container: "gap-0.5 sm:gap-1",
  },
  default: {
    text: "text-[8px] sm:text-xs md:text-sm lg:text-base",
    container: "gap-1",
  },
  large: {
    text: "text-[9px] sm:text-sm md:text-base lg:text-lg",
    container: "gap-1",
  },
  xl: {
    text: "text-xs sm:text-base md:text-lg lg:text-xl",
    container: "gap-1 sm:gap-1.5",
  }
}

export const AcronWebText = ({ 
  size = "default", 
  textSize = null,
  className = "", 
  animated = true,
  variant = "horizontal",
  clickable = true,
  ...props 
}: {
  size?: "xs" | "small" | "default" | "large" | "xl";
  textSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | null;
  className?: string;
  animated?: boolean;
  variant?: "horizontal" | "vertical";
  clickable?: boolean;
  [key: string]: any;
}) => {
  const openAcronweb = () => {
    if (typeof window !== 'undefined') {
      window.open('https://www.acronweb.gr', '_blank', 'noopener,noreferrer');
    }
  }

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm", 
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl"
  }

  const currentSize = sizeClasses[size] || sizeClasses.default
  const currentTextSize = textSize ? textSizes[textSize] : currentSize.text

  const handleClick = () => {
    if (clickable) {
      openAcronweb()
    }
  }

  const logoVariants = animated ? {
    visible: { 
      opacity: 1, 
      scale: 1
    }
  } : undefined

  const textVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <motion.div
      className={cn(
        "flex items-center group cursor-pointer transition-all duration-300",
        currentSize.container,
        variant === "vertical" ? "flex-col" : "flex-row",
        clickable && "hover:opacity-80",
        className
      )}
      variants={animated ? logoVariants : {}}
      initial="visible"
      animate="visible"
      whileHover="hover"
      onClick={handleClick}
      style={{
        alignItems: 'center',
        display: 'flex',
        position: 'relative'
      }}
      {...props}
    >
      {/* Text Container */}
      <motion.div
        className={cn(
          "flex items-center justify-center",
          variant === "vertical" ? "flex-col text-center" : "flex-row"
        )}
        variants={animated ? textVariants : {}}
        style={{ 
          alignItems: 'center',
          display: 'flex'
        }}
      >
        {/* Brand Name */}
        <motion.h1
          className={cn(
            "font-bold tracking-tight leading-none relative inline-flex items-center",
            "transition-all duration-500 ease-out",
            currentTextSize,
            "antialiased subpixel-antialiased",
            "filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.1)] group-hover:drop-shadow-[0_3px_8px_rgba(59,130,246,0.3)]"
          )}
          style={{
            fontFamily: "'Inter', 'SF Pro Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            textShadow: "0 1px 2px rgba(0,0,0,0.05)",
            lineHeight: '1',
            height: 'auto'
          }}
        >
          <div
            className="relative inline-flex items-baseline"
            style={{ lineHeight: '1', height: 'auto' }}
          >
            {/* ACRON part */}
            <span 
              className="group-hover:opacity-80 transition-all duration-500"
              style={{ 
                fontFamily: "'Quizlo', 'Paytone One', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif", 
                fontWeight: 400, 
                letterSpacing: "-0.02em", 
                lineHeight: "1",
                color: "#60a5fa"
              }}
            >
              ACRON
            </span>
            {/* WEB part */}
            <span 
              className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-slate-50 dark:via-white dark:to-slate-100 bg-clip-text text-transparent group-hover:from-slate-950 group-hover:via-slate-800 group-hover:to-slate-900 dark:group-hover:from-white dark:group-hover:via-slate-50 dark:group-hover:to-slate-100 transition-all duration-500"
              style={{ 
                fontFamily: "'Geogola', 'Gegola DEMO', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif", 
                fontWeight: 800, 
                letterSpacing: "-0.02em", 
                backgroundSize: "200% 200%", 
                backgroundPosition: "0% 50%", 
                textShadow: "0 2px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)", 
                filter: "contrast(1.1) brightness(1.02)", 
                lineHeight: "1" 
              }}
            >
              WEB
            </span>
          </div>
        </motion.h1>
      </motion.div>

      {/* Simple glow effect for the entire logo */}
      {animated && (
        <motion.div
          className="absolute -inset-2 rounded-xl bg-blue-100/30 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 blur-lg -z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          whileHover={{
            scale: 1.05,
            opacity: 1
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  )
}

// Compact version for mobile/small spaces
export const AcronWebTextCompact = ({ className = "", ...props }) => (
  <AcronWebText 
    size="xs"
    className={className}
    variant="horizontal"
    {...props}
  />
)

// Navbar version with smaller text
export const AcronWebTextNavbar = ({ className = "", ...props }) => (
  <AcronWebText 
    size="xs"
    textSize={null}
    className={cn("scale-90", className)}
    variant="horizontal"
    {...props}
  />
) 

export default AcronWebLogo 