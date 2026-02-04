"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Settings, Shield, TrendingUp, Palette, Target, Check, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'

// Αφαιρώ το interface CookiePreferences και χρησιμοποιώ JSDoc για documentation
/**
 * @typedef {Object} CookiePreferences
 * @property {boolean} essential
 * @property {boolean} performance
 * @property {boolean} preferences
 * @property {boolean} marketing
 */
// Function to get current cookie consent status
export const getCookieConsent = (language = 'el') => {
  try {
    const preferencesKey = `cookiePreferences_${language}`

    const savedPreferences = getCookie(preferencesKey)
    if (savedPreferences && typeof savedPreferences === 'string') {
      return JSON.parse(savedPreferences)
    }
    return null
  } catch {
    return null
  }
}

// Function to check if a specific cookie category is enabled
export const isCookieEnabled = (category) => {
  const consent = getCookieConsent()
  return consent ? consent[category] : false
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  // Αφαιρώ το type annotation εδώ
  const [preferences, setPreferences] = useState({
    essential: true, // Always true - cannot be disabled
    performance: true,
    preferences: true,
    marketing: false
  })
  const pathname = usePathname()

  // Επιλογή γλώσσας από το pathname
  const currentLanguage = pathname?.startsWith('/en') ? 'en' : 'el';
  const consentKey = `cookieConsent_${currentLanguage}`;
  const preferencesKey = `cookiePreferences_${currentLanguage}`;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load saved preferences
  useEffect(() => {
    try {
      const savedPreferences = getCookie(preferencesKey)
      if (savedPreferences && typeof savedPreferences === 'string') {
        const parsed = JSON.parse(savedPreferences)
        setPreferences({ ...parsed, essential: true }) // Essential is always true
      }
    } catch {
      // Use default preferences
    }
  }, [preferencesKey])

  // Also create a function to get current cookie values
  const getCookieValues = () => {
    return {
      essential: getCookie('acronweb_essential') === 'true',
      performance: getCookie('acronweb_performance') === 'true',
      preferences: getCookie('acronweb_preferences') === 'true',
      marketing: getCookie('acronweb_marketing') === 'true'
    }
  }

  // Check HTTP cookies on mount and when language changes
  useEffect(() => {
    setIsLoaded(false);
    setIsVisible(false);
    setTimeout(() => {
      setIsLoaded(true);
      // Εμφανίζεται μόνο αν ΔΕΝ υπάρχει αποθηκευμένη επιλογή
      try {
        const consent = getCookie(consentKey)
        if (consent === null || consent === undefined) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      } catch {
        setIsVisible(true)
      }
    }, 0);
  }, [consentKey]);

  // Show consent when language changes if user hasn't made a choice yet
  useEffect(() => {
    if (isLoaded) {
      // Δεν χρειάζεται να ξαναελέγξω εδώ, το ελέγχω στο παραπάνω useEffect
    }
    // Listener for manual open
    const openHandler = () => {
      setIsVisible(true)
      setShowSettings(false) // Reset to main view
    }
    window.addEventListener('openCookieConsent', openHandler)
    return () => window.removeEventListener('openCookieConsent', openHandler)
  }, [currentLanguage, isLoaded])

  // Save cookie preferences and actual cookies
  const savePreferences = (prefs) => {
    try {
      // Save consent status
      setCookie(consentKey, 'custom', {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        httpOnly: false,
      })

      // Save preferences
      setCookie(preferencesKey, JSON.stringify(prefs), {
        maxAge: 365 * 24 * 60 * 60, // 1 year
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        httpOnly: false,
      })

      // Set actual functional cookies based on preferences
      if (prefs.essential) {
        setCookie('acronweb_essential', 'true', {
          maxAge: 365 * 24 * 60 * 60,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        })
      }

      if (prefs.performance) {
        setCookie('acronweb_performance', 'true', {
          maxAge: 365 * 24 * 60 * 60,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        })
      } else {
        deleteCookie('acronweb_performance')
      }

      if (prefs.preferences) {
        setCookie('acronweb_preferences', 'true', {
          maxAge: 365 * 24 * 60 * 60,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        })
      } else {
        deleteCookie('acronweb_preferences')
      }

      if (prefs.marketing) {
        setCookie('acronweb_marketing', 'true', {
          maxAge: 365 * 24 * 60 * 60,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        })
      } else {
        deleteCookie('acronweb_marketing')
      }

    } catch {
      console.log('Cookie not available')
    }
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      performance: true,
      preferences: true,
      marketing: true
    }
    setPreferences(allAccepted)
    savePreferences(allAccepted)
    setIsVisible(false)
  }

  const handleDeclineAll = () => {
    const onlyEssential = {
      essential: true,
      performance: false,
      preferences: false,
      marketing: false
    }
    setPreferences(onlyEssential)
    savePreferences(onlyEssential)
    setIsVisible(false)
  }

  const handleSaveSettings = () => {
    savePreferences(preferences)
    setIsVisible(false)
  }

  const togglePreference = (key) => {
    if (key === 'essential') return // Cannot disable essential cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const content = {
    el: {
      title: 'Συγκατάθεση Cookies',
      description: 'Αυτός ο ιστότοπος χρησιμοποιεί cookies για να εξασφαλίσει την καλύτερη εμπειρία στον ιστότοπό μας.',
      acceptAll: 'Αποδοχή όλων',
      declineAll: 'Αποδοχή αναγκαίων',
      customizeSettings: 'Προσαρμογή',
      learnMore: 'Μάθε περισσότερα',
      settings: {
        title: 'Ρυθμίσεις Cookies',
        description: 'Διαχειριστείτε τις προτιμήσεις σας για cookies. Μπορείτε να ενεργοποιήσετε ή να απενεργοποιήσετε διαφορετικές κατηγορίες cookies παρακάτω.',
        essential: {
          title: 'Αναγκαία Cookies',
          description: 'Αυτά τα cookies είναι απαραίτητα για τη λειτουργία του ιστότοπου και δεν μπορούν να απενεργοποιηθούν.',
          always: 'Πάντα ενεργά'
        },
        performance: {
          title: 'Cookies Απόδοσης',
          description: 'Αυτά τα cookies μας βοηθούν να κατανοήσουμε πώς οι επισκέπτες χρησιμοποιούν τον ιστότοπό μας για να βελτιώσουμε την απόδοση.'
        },
        preferences: {
          title: 'Cookies Προτιμήσεων',
          description: 'Αυτά τα cookies θυμούνται τις προτιμήσεις σας και παρέχουν εξατομικευμένες εμπειρίες.'
        },
        marketing: {
          title: 'Cookies Marketing',
          description: 'Αυτά τα cookies χρησιμοποιούνται για να σας δείξουν σχετικές διαφημίσεις βασισμένες στα ενδιαφέροντά σας.'
        },
        saveSettings: 'Αποθήκευση Ρυθμίσεων',
        backToMain: 'Πίσω'
      }
    },
    en: {
      title: 'Cookie Consent',
      description: 'This website uses cookies to ensure you get the best experience on our website.',
      acceptAll: 'Accept All',
      declineAll: 'Accept Essential',
      customizeSettings: 'Customize',
      learnMore: 'Learn more',
      settings: {
        title: 'Cookie Settings',
        description: 'Manage your cookie preferences. You can enable or disable different categories of cookies below.',
        essential: {
          title: 'Essential Cookies',
          description: 'These cookies are necessary for the website to function and cannot be disabled.',
          always: 'Always Active'
        },
        performance: {
          title: 'Performance Cookies',
          description: 'These cookies help us understand how visitors use our website to improve performance.'
        },
        preferences: {
          title: 'Preference Cookies',
          description: 'These cookies remember your preferences and provide personalized experiences.'
        },
        marketing: {
          title: 'Marketing Cookies',
          description: 'These cookies are used to show you relevant advertisements based on your interests.'
        },
        saveSettings: 'Save Settings',
        backToMain: 'Back'
      }
    }
  }

  const currentContent = content[currentLanguage]

  // Cookie categories with icons
  const cookieCategories = [
    {
      key: 'essential',
      icon: Shield,
      color: 'blue',
      enabled: preferences.essential,
      required: true
    },
    {
      key: 'performance',
      icon: TrendingUp,
      color: 'green',
      enabled: preferences.performance,
      required: false
    },
    {
      key: 'preferences',
      icon: Palette,
      color: 'purple',
      enabled: preferences.preferences,
      required: false
    },
    {
      key: 'marketing',
      icon: Target,
      color: 'orange',
      enabled: preferences.marketing,
      required: false
    }
  ]

  // Don't render anything until we've checked cookies
  if (!isLoaded) {
    return null
  }

  return (
    <AnimatePresence key={currentLanguage}>
      {isVisible && (
        <>
          {/* Backdrop overlay - Full coverage on mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9997] pointer-events-auto"
              style={{
                background: 'rgba(0, 0, 0, 0.92)',
                zIndex: 9997
              }}
            />
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] pointer-events-auto"
            style={{
              background: isMobile
                ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(15, 23, 42, 0.9) 50%, rgba(0, 0, 0, 0.88) 100%)'
                : 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(30, 41, 59, 0.5) 100%)',
              backdropFilter: isMobile ? 'blur(12px)' : 'blur(8px)',
              WebkitBackdropFilter: isMobile ? 'blur(12px)' : 'blur(8px)',
              zIndex: 9998
            }}
            onClick={() => !isMobile && setIsVisible(false)}
          />

          <motion.div
            key={currentLanguage}
            initial={{ opacity: 0, y: isMobile ? 100 : 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? 100 : 50, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className="fixed z-[9999] pointer-events-auto"
            style={{
              position: 'fixed',
              zIndex: 9999,
              ...(isMobile
                ? {
                  bottom: '20px',
                  left: '16px',
                  right: '16px',
                  width: 'auto',
                  maxWidth: 'none',
                  maxHeight: '85vh',
                }
                : {
                  bottom: '32px',
                  right: '32px',
                  maxWidth: showSettings ? '580px' : '480px',
                  width: '100%'
                }
              )
            }}
          >
            <div
              className="relative overflow-hidden dark:bg-slate-900/95"
              style={{
                background: isMobile
                  ? 'linear-gradient(145deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 255, 255, 0.98) 100%)'
                  : 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                borderRadius: isMobile ? '24px' : '28px',
                boxShadow: isMobile
                  ? '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.6) inset, 0 -4px 20px -5px rgba(0, 0, 0, 0.1)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Beautiful decorative gradient overlays */}
              <div
                className="absolute top-0 left-0 right-0 h-40 opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(175, 254, 18, 0.12) 0%, rgba(159, 224, 17, 0.1) 30%, rgba(56, 189, 248, 0.08) 60%, rgba(139, 92, 246, 0.06) 100%)',
                  borderRadius: '28px 28px 0 0'
                }}
              />
              <div
                className="absolute top-0 left-0 w-1/2 h-full opacity-20"
                style={{
                  background: 'radial-gradient(ellipse at top left, rgba(175, 254, 18, 0.15) 0%, transparent 70%)',
                  borderRadius: '28px 0 0 0'
                }}
              />
              <div
                className="absolute top-0 right-0 w-1/2 h-full opacity-20"
                style={{
                  background: 'radial-gradient(ellipse at top right, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
                  borderRadius: '0 28px 0 0'
                }}
              />
              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.15) 1px, transparent 0)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Content container */}
              <div className={`relative ${isMobile ? (showSettings ? 'p-4' : 'p-6') : 'p-8'}`}>
                {!showSettings ? (
                  // Main Cookie Consent View - Premium Design
                  <div className="flex flex-col">
                    {/* Header with Cookie Image */}
                    <div className={`relative flex items-start gap-5 ${isMobile ? 'mb-5' : 'mb-6'}`}>
                      {/* Cookie Image - Artistic Placement */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{
                          scale: 1,
                          rotate: 0,
                          opacity: 1
                        }}
                        transition={{
                          scale: {
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                          },
                          rotate: {
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: 0.2
                          },
                          opacity: {
                            delay: 0.2,
                            duration: 0.5
                          }
                        }}
                        className="flex-shrink-0 relative"
                        style={{
                          zIndex: 1
                        }}
                      >
                        {/* Decorative glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full blur-xl"
                          style={{
                            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(217, 119, 6, 0.2) 50%, transparent 70%)',
                            transform: 'scale(1.3)'
                          }}
                          animate={{
                            opacity: [0.4, 0.6, 0.4],
                            scale: [1.3, 1.4, 1.3]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />

                        {/* Main container with enhanced styling */}
                        <div
                          className="relative"
                          style={{
                            width: isMobile ? '75px' : '110px',
                            height: isMobile ? '75px' : '110px',
                            background: 'linear-gradient(145deg, rgba(255, 247, 237, 0.95) 0%, rgba(254, 243, 199, 0.9) 50%, rgba(251, 191, 36, 0.15) 100%)',
                            borderRadius: isMobile ? '22px' : '28px',
                            padding: isMobile ? '12px' : '16px',
                            boxShadow: `
                              0 0 0 1px rgba(251, 191, 36, 0.2) inset,
                              0 8px 32px -8px rgba(217, 119, 6, 0.3),
                              0 4px 16px -4px rgba(251, 191, 36, 0.2),
                              0 0 40px -10px rgba(251, 191, 36, 0.15)
                            `,
                            transform: 'perspective(1000px) rotateY(-5deg) rotateX(2deg)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.05)'
                            e.currentTarget.style.boxShadow = `
                              0 0 0 1px rgba(251, 191, 36, 0.3) inset,
                              0 12px 40px -8px rgba(217, 119, 6, 0.4),
                              0 6px 20px -4px rgba(251, 191, 36, 0.3),
                              0 0 50px -10px rgba(251, 191, 36, 0.2)
                            `
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(2deg) scale(1)'
                            e.currentTarget.style.boxShadow = `
                              0 0 0 1px rgba(251, 191, 36, 0.2) inset,
                              0 8px 32px -8px rgba(217, 119, 6, 0.3),
                              0 4px 16px -4px rgba(251, 191, 36, 0.2),
                              0 0 40px -10px rgba(251, 191, 36, 0.15)
                            `
                          }}
                        >
                          {/* Inner glow ring */}
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 60%)',
                              borderRadius: isMobile ? '22px' : '28px',
                              pointerEvents: 'none'
                            }}
                          />

                          {/* Cookie Image */}
                          <img
                            src="/cookie.png"
                            alt="Cookie"
                            className="w-full h-full object-contain relative z-10"
                            style={{
                              filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15)) drop-shadow(0 2px 4px rgba(217, 119, 6, 0.2))',
                              transform: 'scale(1.05)'
                            }}
                          />

                          {/* Decorative sparkle effect */}
                          <motion.div
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                            style={{
                              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(251, 191, 36, 0.6) 100%)',
                              boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)'
                            }}
                            animate={{
                              opacity: [0.6, 1, 0.6],
                              scale: [1, 1.2, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                      </motion.div>

                      {/* Title and Description */}
                      <div className="flex-1 pt-1 relative z-10">
                        <motion.h3
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2 dark:text-slate-100`}
                          style={{
                            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            lineHeight: '1.2'
                          }}
                        >
                          {currentContent.title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className={`${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed dark:text-slate-300`}
                          style={{
                            color: '#64748b',
                            lineHeight: '1.6'
                          }}
                        >
                          {currentContent.description}
                        </motion.p>
                      </div>
                    </div>

                    {/* Premium Buttons */}
                    <div className={`flex flex-col ${isMobile ? 'gap-2.5 mb-5' : 'gap-3 mb-6'}`}>
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAcceptAll}
                        className={`w-full ${isMobile ? 'px-5 py-3.5 text-sm' : 'px-6 py-4 text-base'} text-white font-bold rounded-2xl transition-all duration-300 relative overflow-hidden group`}
                        style={{
                          background: 'linear-gradient(135deg, #AFFE12 0%, #9FE011 50%, #8FC010 100%)',
                          boxShadow: '0 10px 25px -5px rgba(175, 254, 18, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2 text-base">
                          <svg height="20px" width="20px" version="1.1" viewBox="0 0 370.643 370.643" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                            <g>
                              <path d="M370.587,100.397c-0.252-2.146-1.349-4.097-3.048-5.43l-68.142-53.632 c-3.52-2.788-8.641-2.162-11.413,1.357L171.339,190.835c-2.772,3.528-2.17,8.633,1.366,11.413c3.528,2.78,8.633,2.162,11.413-1.357 L295.731,59.136l55.364,43.569l-131.09,166.051L185.8,310.342c-2.853,3.471-2.349,8.592,1.122,11.445 c1.512,1.244,3.333,1.853,5.154,1.853c2.349,0,4.674-1.016,6.283-2.967l34.311-41.716l136.235-172.562 C370.229,104.697,370.839,102.543,370.587,100.397z"></path>
                              <path d="M150.457,208.401c3.463,2.845,8.584,2.349,11.437-1.114c2.853-3.471,2.349-8.592-1.122-11.445 l-92.414-76.01c-1.666-1.366-3.829-2.065-5.942-1.813c-2.154,0.203-4.121,1.26-5.495,2.926L1.85,187.909 c-2.853,3.471-2.349,8.592,1.114,11.445L160.805,329.2c1.52,1.244,3.341,1.853,5.162,1.853c2.349,0,4.674-1.016,6.283-2.967 c2.853-3.463,2.349-8.592-1.114-11.445L19.563,191.957l44.748-54.405L150.457,208.401z"></path>
                            </g>
                          </svg>
                          {currentContent.acceptAll}
                        </span>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #9FE011 0%, #8FC010 50%, #7FB00F 100%)'
                          }}
                        />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowSettings(true)}
                        className={`w-full ${isMobile ? 'px-5 py-3 text-sm' : 'px-6 py-3.5'} text-white font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden group`}
                        style={{
                          background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
                          boxShadow: '0 8px 20px -5px rgba(56, 189, 248, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z" fill="#ffffff"></path>
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z" fill="#ffffff"></path>
                          </svg>
                          {currentContent.customizeSettings}
                        </span>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)'
                          }}
                        />
                      </motion.button>

                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDeclineAll}
                        className={`w-full ${isMobile ? 'px-5 py-3 text-sm' : 'px-6 py-3.5'} text-white font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden group`}
                        style={{
                          background: 'linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
                          boxShadow: '0 8px 20px -5px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <svg height="20px" width="20px" version="1.1" viewBox="0 0 401.374 401.374" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
                            <g>
                              <path d="M216.548,78.922l48.463-59.347l100.282,81.895l-67.906,83.155c-2.845,3.479-2.325,8.6,1.154,11.437 c1.512,1.236,3.333,1.837,5.137,1.837c2.357,0,4.698-1.016,6.3-2.991l73.043-89.455c2.845-3.479,2.325-8.6-1.154-11.437 L269.001,1.838c-1.674-1.366-3.837-2.016-5.958-1.796c-2.146,0.228-4.113,1.284-5.479,2.951l-53.608,65.646 c-2.845,3.479-2.325,8.6,1.154,11.437C208.582,82.921,213.711,82.392,216.548,78.922z"></path>
                              <path d="M219.425,325.981c-2.829-3.479-7.958-4.007-11.437-1.154c-3.479,2.837-3.991,7.958-1.154,11.437 l50.722,62.119c1.366,1.666,3.333,2.731,5.479,2.951c0.268,0.024,0.545,0.041,0.821,0.041c1.861,0,3.682-0.642,5.145-1.837 l112.873-92.178c3.479-2.837,3.991-7.958,1.154-11.437l-73.425-89.918c-2.837-3.479-7.958-4.016-11.437-1.154 c-3.479,2.837-3.991,7.958-1.154,11.437l68.272,83.627L265.01,381.8L219.425,325.981z"></path>
                              <path d="M132.376,399.529c1.512,1.236,3.333,1.837,5.137,1.837c2.357,0,4.698-1.016,6.3-2.991l52.129-63.834 c2.845-3.479,2.325-8.6-1.154-11.437c-3.487-2.853-8.616-2.325-11.437,1.154l-46.983,57.534L36.085,299.905l66.898-81.92 c2.845-3.479,2.325-8.6-1.154-11.437c-3.495-2.853-8.616-2.325-11.437,1.154l-72.044,88.219c-1.366,1.666-2.008,3.812-1.796,5.958 s1.276,4.113,2.943,5.479L132.376,399.529z"></path>
                              <path d="M92.79,196.607c1.601,1.967,3.942,2.991,6.3,2.991c1.805,0,3.625-0.602,5.137-1.837 c3.479-2.837,3.991-7.958,1.154-11.437l-69.296-84.862l100.29-81.887l46.983,57.534c2.829,3.463,7.95,3.999,11.437,1.154 c3.479-2.845,3.991-7.958,1.154-11.437L143.821,3.001c-2.837-3.471-7.958-4.007-11.437-1.154L19.503,94.016 c-1.666,1.366-2.731,3.333-2.943,5.479c-0.211,2.146,0.431,4.292,1.796,5.958L92.79,196.607z"></path>
                            </g>
                          </svg>
                          {currentContent.declineAll}
                        </span>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)'
                          }}
                        />
                      </motion.button>
                    </div>

                    {/* Learn more link - Beautiful button style */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="pt-4"
                      style={{
                        borderTop: '1px solid rgba(226, 232, 240, 0.6)'
                      }}
                    >
                      <a
                        href="/privacy"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.08) 100%)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          color: '#3b82f6',
                          fontWeight: 600,
                          fontSize: '14px',
                          letterSpacing: '-0.01em',
                          boxShadow: '0 2px 8px -2px rgba(59, 130, 246, 0.15)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.12) 100%)'
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                          e.currentTarget.style.color = '#2563eb'
                          e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(59, 130, 246, 0.25)'
                          e.currentTarget.style.transform = 'translateY(-1px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.08) 100%)'
                          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'
                          e.currentTarget.style.color = '#3b82f6'
                          e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(59, 130, 246, 0.15)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <span>{currentContent.learnMore}</span>
                        <ExternalLink className="w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" />
                      </a>
                    </motion.div>
                  </div>
                ) : (
                  // Settings Modal View - Premium Design
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header with back button */}
                    <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'mb-6'}`}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowSettings(false)}
                        className={`flex-shrink-0 ${isMobile ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl flex items-center justify-center transition-all duration-200`}
                        style={{
                          background: 'rgba(241, 245, 249, 0.8)',
                          border: '1px solid rgba(226, 232, 240, 0.8)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(226, 232, 240, 0.9)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(241, 245, 249, 0.8)'
                        }}
                      >
                        <svg className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#475569' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <div className="flex-1 min-w-0">
                        <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold ${isMobile ? 'mb-1' : 'mb-2'} dark:text-slate-100`} style={{
                          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}>
                          {currentContent.settings.title}
                        </h3>
                        {!isMobile && (
                          <p className="text-sm leading-relaxed dark:text-slate-300" style={{ color: '#64748b' }}>
                            {currentContent.settings.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Cookie Categories - Premium Cards */}
                    <div className={`${isMobile ? 'space-y-2 mb-4' : 'space-y-3 mb-6'}`}>
                      {cookieCategories.map((category, index) => {
                        const IconComponent = category.icon
                        const isEnabled = category.enabled
                        const isRequired = category.required
                        const categoryContent = currentContent.settings[category.key]

                        // Premium color configurations
                        const colorStyles = {
                          blue: {
                            enabledBorder: 'rgba(59, 130, 246, 0.3)',
                            enabledBg: 'linear-gradient(135deg, rgba(239, 246, 255, 0.8) 0%, rgba(219, 234, 254, 0.6) 100%)',
                            iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            toggleBg: '#3b82f6',
                            glow: 'rgba(59, 130, 246, 0.2)'
                          },
                          green: {
                            enabledBorder: 'rgba(154, 205, 50, 0.3)',
                            enabledBg: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8) 0%, rgba(220, 252, 231, 0.6) 100%)',
                            iconBg: 'linear-gradient(135deg, #9ACD32 0%, #7cb518 100%)',
                            toggleBg: '#9ACD32',
                            glow: 'rgba(154, 205, 50, 0.2)'
                          },
                          purple: {
                            enabledBorder: 'rgba(168, 85, 247, 0.3)',
                            enabledBg: 'linear-gradient(135deg, rgba(250, 245, 255, 0.8) 0%, rgba(243, 232, 255, 0.6) 100%)',
                            iconBg: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                            toggleBg: '#a855f7',
                            glow: 'rgba(168, 85, 247, 0.2)'
                          },
                          orange: {
                            enabledBorder: 'rgba(249, 115, 22, 0.3)',
                            enabledBg: 'linear-gradient(135deg, rgba(255, 247, 237, 0.8) 0%, rgba(255, 237, 213, 0.6) 100%)',
                            iconBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            toggleBg: '#f97316',
                            glow: 'rgba(249, 115, 22, 0.2)'
                          }
                        }

                        const colorStyle = colorStyles[category.color]

                        return (
                          <motion.div
                            key={category.key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${isMobile ? 'p-3' : 'p-4'} rounded-2xl transition-all duration-300 relative overflow-hidden`}
                            style={{
                              border: `2px solid ${isEnabled ? colorStyle.enabledBorder : 'rgba(226, 232, 240, 0.6)'}`,
                              background: isEnabled ? colorStyle.enabledBg : 'rgba(249, 250, 251, 0.8)',
                              boxShadow: isEnabled
                                ? `0 4px 12px -2px ${colorStyle.glow}, 0 0 0 1px rgba(255, 255, 255, 0.5) inset`
                                : '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-4'} min-w-0 flex-1`}>
                                <div
                                  className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-lg`}
                                  style={{
                                    background: isEnabled ? colorStyle.iconBg : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                                    color: 'white',
                                    boxShadow: isEnabled
                                      ? `0 4px 12px -2px ${colorStyle.glow}`
                                      : '0 2px 8px -2px rgba(0, 0, 0, 0.1)'
                                  }}
                                >
                                  <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className={`font-bold ${isMobile ? 'text-xs mb-0.5' : 'text-sm mb-1.5'} dark:text-slate-100`} style={{ color: '#1e293b' }}>
                                    {categoryContent.title}
                                  </h4>
                                  {!isMobile && (
                                    <p className="text-xs leading-relaxed dark:text-slate-300" style={{ color: '#64748b' }}>
                                      {categoryContent.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className={`flex items-center ${isMobile ? 'ml-2' : 'ml-4'} flex-shrink-0`}>
                                {isRequired ? (
                                  <div className={`flex items-center gap-1.5 ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} rounded-lg`} style={{
                                    background: 'rgba(154, 205, 50, 0.1)',
                                    border: '1px solid rgba(154, 205, 50, 0.2)'
                                  }}>
                                    <div
                                      className={`${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'} rounded-full animate-pulse`}
                                      style={{ backgroundColor: '#9ACD32' }}
                                    />
                                    <span
                                      className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold`}
                                      style={{ color: '#7cb518' }}
                                    >
                                      {category.key === 'essential' ? currentContent.settings.essential.always : 'Always'}
                                    </span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => togglePreference(category.key)}
                                    className={`relative inline-flex ${isMobile ? 'h-6 w-11' : 'h-7 w-12'} items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                    style={{
                                      backgroundColor: isEnabled ? colorStyle.toggleBg : '#d1d5db',
                                      boxShadow: isEnabled
                                        ? `0 2px 8px -2px ${colorStyle.glow}`
                                        : '0 2px 4px -2px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (isEnabled) {
                                        e.currentTarget.style.transform = 'scale(1.05)'
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = 'scale(1)'
                                    }}
                                  >
                                    <span
                                      className={`inline-block ${isMobile ? 'h-4 w-4' : 'h-5 w-5'} transform rounded-full bg-white shadow-lg transition-all duration-300 ${isEnabled ? (isMobile ? 'translate-x-[22px]' : 'translate-x-6') : 'translate-x-1'
                                        }`}
                                      style={{
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                      }}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Settings Footer - Premium Buttons */}
                    <div className={`flex ${isMobile ? 'gap-2 mt-4' : 'gap-3 mt-6'}`}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowSettings(false)}
                        className={`flex-1 ${isMobile ? 'px-4 py-2.5 text-sm' : 'px-6 py-3.5'} font-semibold rounded-2xl transition-all duration-300 relative overflow-hidden`}
                        style={{
                          background: 'rgba(241, 245, 249, 0.9)',
                          color: '#475569',
                          border: '1px solid rgba(226, 232, 240, 0.8)',
                          boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(226, 232, 240, 0.95)'
                          e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(241, 245, 249, 0.9)'
                          e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        {currentContent.settings.backToMain}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveSettings}
                        className={`flex-1 ${isMobile ? 'px-4 py-2.5 text-sm' : 'px-6 py-3.5'} text-white font-bold rounded-2xl transition-all duration-300 relative overflow-hidden group`}
                        style={{
                          background: 'linear-gradient(135deg, #9ACD32 0%, #7cb518 50%, #6b9a0f 100%)',
                          boxShadow: '0 10px 25px -5px rgba(154, 205, 50, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Check className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                          {currentContent.settings.saveSettings}
                        </span>
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: 'linear-gradient(135deg, #7cb518 0%, #6b9a0f 50%, #5a7f0d 100%)'
                          }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Powered by AcronWeb Cookies Logo - Premium Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 pt-5"
                  style={{
                    borderTop: '1px solid rgba(226, 232, 240, 0.6)'
                  }}
                >
                  <div className="flex items-center justify-center gap-2 group">
                    <span className="text-xs font-medium" style={{ color: '#94a3b8' }}>
                      Powered by
                    </span>
                    <img
                      src="/cookie.png"
                      alt="Cookie"
                      className="w-4 h-4 object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="flex items-baseline">
                      <span
                        className="text-xs transition-all duration-300"
                        style={{
                          fontFamily: "'Quizlo', 'Inter', 'SF Pro Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.1,
                          color: '#92400e'
                        }}
                      >
                        ACRON
                      </span>
                      <span
                        className="text-xs font-bold transition-colors duration-300"
                        style={{
                          fontFamily: "'Gegola', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                          fontWeight: 800,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.1,
                          color: '#374151',
                          transform: 'translateY(0px)'
                        }}
                      >
                        WEB
                      </span>
                    </span>
                    <span
                      className="text-xs font-bold transition-colors duration-300"
                      style={{
                        fontFamily: "'Gegola', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                        color: '#d97706'
                      }}
                    >
                      Cookies
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 