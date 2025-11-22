"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Settings, Shield, TrendingUp, Palette, Target, Check, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
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
export const isCookieEnabled = (category: string, language = 'el') => {
  const consent = getCookieConsent(language)
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
  const { language: currentLanguage } = useLanguage()
  
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
  const savePreferences = (prefs: any) => {
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

  const togglePreference = (key: string) => {
    if (key === 'essential') return // Cannot disable essential cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const content = {
    el: {
      title: 'Συγκατάθεση Cookies',
      description: 'Αυτός ο ιστότοπος χρησιμοποιεί cookies για να εξασφαλίσει την καλύτερη εμπειρία στον ιστότοπό μας.',
      acceptAll: 'Αποδοχή όλων',
      declineAll: 'Απόρριψη όλων',
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
      declineAll: 'Decline All',
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
    },
    fr: {
      title: 'Consentement aux Cookies',
      description: 'Ce site web utilise des cookies pour vous assurer la meilleure expérience sur notre site web.',
      acceptAll: 'Accepter Tout',
      declineAll: 'Refuser Tout',
      customizeSettings: 'Personnaliser',
      learnMore: 'En savoir plus',
      settings: {
        title: 'Paramètres des Cookies',
        description: 'Gérez vos préférences de cookies. Vous pouvez activer ou désactiver différentes catégories de cookies ci-dessous.',
        essential: {
          title: 'Cookies Essentiels',
          description: 'Ces cookies sont nécessaires au fonctionnement du site web et ne peuvent pas être désactivés.',
          always: 'Toujours Actifs'
        },
        performance: {
          title: 'Cookies de Performance',
          description: 'Ces cookies nous aident à comprendre comment les visiteurs utilisent notre site web pour améliorer les performances.'
        },
        preferences: {
          title: 'Cookies de Préférences',
          description: 'Ces cookies se souviennent de vos préférences et fournissent des expériences personnalisées.'
        },
        marketing: {
          title: 'Cookies Marketing',
          description: 'Ces cookies sont utilisés pour vous montrer des publicités pertinentes basées sur vos intérêts.'
        },
        saveSettings: 'Sauvegarder les Paramètres',
        backToMain: 'Retour'
      }
    }
  }

  const currentContent = content[currentLanguage as keyof typeof content] || content.en

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
        <motion.div
          key={currentLanguage}
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-[9999] pointer-events-auto"
          style={{
            position: 'fixed',
            zIndex: 9999,
            ...(isMobile
              ? {
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  margin: 0,
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.30)',
                  padding: '1rem',
                  overflow: 'hidden'
                }
              : {
                  bottom: isMobile ? '80px' : '24px',
                  left: '24px',
                  maxWidth: '420px',
                  width: '100%'
                }
            )
          }}
        >
          <div 
            className={`relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-xl ${isMobile ? 'p-5' : 'p-8'}`}
            style={
              isMobile 
                ? { 
                    width: '100%',
                    maxWidth: '380px',
                    maxHeight: '95vh', 
                    overflowY: 'auto',
                    margin: '0 auto'
                  } 
                : { 
                    maxWidth: showSettings ? 550 : 400, 
                    width: '100%'
                  }
            }
          >
            {!showSettings ? (
              // Main Cookie Consent View
              <>
                {/* Cookie icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-full flex items-center justify-center shadow-lg">
                    <svg 
                      viewBox="0 0 64 64" 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-16 h-16"
                      aria-hidden="true" 
                      role="img" 
                      preserveAspectRatio="xMidYMid meet" 
                      fill="#000000"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier"> 
                        <path d="M36.9 22.7l2.5-18.6C37 3.5 34.6 2 32 2c-2.6 0-5 1.5-7.5 2.2c-2.5.6-5.3.5-7.5 1.8s-3.6 3.8-5.4 5.6C9.8 13.4 7.3 14.8 6 17c-1.3 2.2-1.2 5-1.9 7.5C3.5 27 2 29.4 2 32c0 2.6 1.5 5 2.2 7.5c.6 2.5.5 5.3 1.8 7.5s3.8 3.6 5.6 5.4c1.8 1.8 3.1 4.3 5.4 5.6c2.2 1.3 5 1.2 7.5 1.9c2.5.6 4.9 2.1 7.5 2.1c2.6 0 5-1.5 7.5-2.2c2.5-.7 5.3-.6 7.5-1.9c2.2-1.3 3.6-3.8 5.4-5.6c1.8-1.8 4.3-3.1 5.6-5.4c1.3-2.2 1.2-5 1.9-7.5c.6-2.4 2.1-4.8 2.1-7.4c0-2.6-2.1-8.1-2.1-8.1l-23-1.2" fill="#dda85f"> </path> 
                        <path d="M59.4 22.4c-1 .3-2.4.2-3.9-.4c-2.1-.8-3.4-2.5-3.8-4.5c-1 .3-3.4 0-5-1c-2.4-1.5-2.9-5.7-2.9-5.7c-2.7-.8-4.7-4-4.4-6.7c-2.2-.6-5-.5-7.4-.5c-2.4 0-4.6 1.4-6.8 2c-2.3.6-4.9.5-6.9 1.7s-3.3 3.5-4.9 5.1c-1.7 1.7-4 2.9-5.1 4.9c-1.2 2-1.1 4.6-1.7 6.9c-.6 2.2-2 4.4-2 6.8c0 2.4 1.4 4.6 2 6.8c.6 2.3.5 4.9 1.7 6.9s3.5 3.3 5.1 4.9c1.7 1.7 2.9 4 4.9 5.1c2 1.2 4.6 1.1 6.9 1.7c2.2.6 4.4 2 6.8 2c2.4 0 4.6-1.4 6.8-2c2.3-.6 4.9-.5 6.9-1.7s3.3-3.5 4.9-5.1c1.7-1.7 4-2.9 5.1-4.9c1.2-2 1.1-4.6 1.7-6.9c.6-2.2 3-4 3.3-6.4c.8-3.9-1.2-8.3-1.3-9" fill="#f2cb7d"> </path> 
                        <g fill="#dda85f"> 
                          <path d="M50.1 10.8l-1.4 1.4l-1.3-1.4l1.3-1.3z"> </path> 
                          <path d="M55.8 17.8l-.6.7l-.7-.7l.7-.7z"> </path> 
                          <path d="M50.8 13.2l-.7.7l-.7-.7l.7-.7z"> </path> 
                          <path d="M44.6 7.1l-.7.7l-.7-.7l.7-.7z"> </path> 
                          <path d="M57.2 20.3l-.7.7l-.7-.7l.7-.7z"> </path> 
                          <path d="M57.8 17.8l-.7.7l-.7-.7l.7-.7z"> </path> 
                        </g> 
                        <path d="M11.8 20.6c-1 1.7.5 4.8 2.5 5.7c2.9 1.2 4.6 1.4 6.4-1.7c.6-1.1 1.4-4 1.1-4.7c-.4-1-2.1-3-3.2-3c-3.1.1-6.1 2.5-6.8 3.7" fill="#6d4934"> </path> 
                        <path d="M12.3 20.6c-.7 1.2 1.1 4.8 3.5 4.5c3.3-.4 3-7.2 1.6-7.2c-2.4 0-4.6 1.8-5.1 2.7" fill="#a37f6a"> </path> 
                        <path d="M45.2 39.1c1.4-.4 2.4-2.9 1.8-4.4c-.9-2.3-1.8-3.3-4.4-2.6c-.9.3-3 1.4-3.2 1.9c-.3.8-.5 2.8.1 3.4c1.7 1.7 4.7 2 5.7 1.7" fill="#6d4934"> </path> 
                        <path d="M43.8 36.7c1.1-.3 2.8-3.7 1-3.9c-3.1-.5-5.5 1-5.2 2.7c.3 1.7 3.4 1.4 4.2 1.2" fill="#a37f6a"> </path> 
                        <path d="M24.9 44.5c-.3-1.2-2.5-2.1-3.9-1.5c-2 .8-2.9 1.5-2.2 3.8c.2.8 1.2 2.6 1.7 2.7c.7.3 2.4.4 2.9-.1c1.5-1.4 1.7-4 1.5-4.9" fill="#6d4934"> </path> 
                        <path d="M23.2 43.6c-.2-.9-4.4.4-4 2c.8 2.7.8 3.1 1.6 3c1.5-.4 2.5-4.3 2.4-5" fill="#a37f6a"> </path> 
                        <path d="M51.1 25.5c-1.2.3-2.1 2.5-1.5 3.9c.8 2 2.7 2.3 4.8 1.2c1.8-.9 1.9-4.1 1.4-4.7c-1.5-1.5-3.8-.6-4.7-.4" fill="#6d4934"> </path> 
                        <path d="M50.6 26.6c-.6.7-1.1 3.5.4 3.1c2.7-.8 4.6-3.5 3.4-3.9c-1.5-.5-3.1 0-3.8.8" fill="#a37f6a"> </path> 
                        <path fill="#6d4934" d="M22.74 16.112l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                        <g fill="#dda85f"> 
                          <path d="M14.706 33.483l1.979-1.98l1.98 1.979l-1.979 1.98z"> </path> 
                          <path d="M34.698 44.811l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                          <path d="M32.038 39.289l2.687-2.687l2.687 2.687l-2.687 2.687z"> </path> 
                          <path d="M24.696 9.827l2.687-2.687l2.687 2.687l-2.687 2.687z"> </path> 
                        </g> 
                        <g fill="#6d4934"> 
                          <path d="M41.122 46.347l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                          <path d="M49.076 35.215l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                          <path d="M41.812 24.637l.99-.99l.99.99l-.99.99z"> </path> 
                          <path d="M13.726 38.266l.99-.99l.99.99l-.99.99z"> </path> 
                        </g> 
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                    {currentContent.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-8">
                    {currentContent.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3 mb-6">
                    <button
                      onClick={handleAcceptAll}
                      className="w-full px-6 py-3 text-white font-bold rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-lime-400 dark:focus:ring-lime-700"
                      style={{
                        background: 'linear-gradient(90deg, rgba(177,255,8,1) 43%, rgba(87,199,133,1) 100%)',
                        boxShadow: '0 10px 15px -3px rgba(177,255,8,0.15), 0 4px 6px -2px rgba(87,199,133,0.05)'
                      }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-4 h-4 flex-shrink-0" />
                        {currentContent.acceptAll}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => setShowSettings(true)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 hover:from-blue-400 hover:via-blue-500 hover:to-blue-600 text-white font-semibold rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Settings className="w-4 h-4 flex-shrink-0" />
                        {currentContent.customizeSettings}
                      </span>
                    </button>
                    
                    <button
                      onClick={handleDeclineAll}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-semibold rounded-2xl transition-colors duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <X className="w-4 h-4 flex-shrink-0" />
                        {currentContent.declineAll}
                      </span>
                    </button>
                  </div>

                  {/* Learn more link */}
                  <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                    <a
                      href="/legal/privacy-policy"
                      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {currentContent.learnMore}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </>
            ) : (
              // Settings Modal View
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 dark:text-slate-100 ${isMobile ? 'mb-2' : 'mb-4'}`}>
                    {currentContent.settings.title}
                  </h3>
                  <p className={`text-gray-600 dark:text-slate-300 ${isMobile ? 'text-xs' : 'text-sm'} leading-relaxed ${isMobile ? 'hidden' : ''}`}>
                    {currentContent.settings.description}
                  </p>
                </div>

                {/* Cookie Categories */}
                <div className={`space-y-3 mb-6 ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
                  {cookieCategories.map((category) => {
                    const IconComponent = category.icon
                    const isEnabled = category.enabled
                    const isRequired = category.required
                    const categoryContent = currentContent.settings[category.key as keyof typeof currentContent.settings]
                    
                    const colorClasses = {
                      blue: {
                        enabled: 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30',
                        disabled: 'border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-800/50',
                        icon: 'bg-blue-500 text-white',
                        iconDisabled: 'bg-gray-400 text-white dark:bg-slate-600 dark:text-slate-300',
                        toggle: 'bg-blue-500',
                        toggleDisabled: 'bg-gray-300 dark:bg-slate-500'
                      },
                      green: {
                        enabled: 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/30',
                        disabled: 'border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-800/50',
                        icon: 'text-white',
                        iconDisabled: 'bg-gray-400 text-white dark:bg-slate-600 dark:text-slate-300',
                        toggle: '',
                        toggleDisabled: 'bg-gray-300 dark:bg-slate-500'
                      },
                      purple: {
                        enabled: 'border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/30',
                        disabled: 'border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-800/50',
                        icon: 'bg-purple-500 text-white',
                        iconDisabled: 'bg-gray-400 text-white dark:bg-slate-600 dark:text-slate-300',
                        toggle: 'bg-purple-500',
                        toggleDisabled: 'bg-gray-300 dark:bg-slate-500'
                      },
                      orange: {
                        enabled: 'border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-900/30',
                        disabled: 'border-gray-200 bg-gray-50 dark:border-slate-600 dark:bg-slate-800/50',
                        icon: 'bg-orange-500 text-white',
                        iconDisabled: 'bg-gray-400 text-white dark:bg-slate-600 dark:text-slate-300',
                        toggle: 'bg-orange-500',
                        toggleDisabled: 'bg-gray-300 dark:bg-slate-500'
                      }
                    }
                    
                    const colors = colorClasses[category.color as keyof typeof colorClasses]
                    
                    return (
                      <div
                        key={category.key}
                        className={`${isMobile ? 'p-3' : 'p-4'} rounded-2xl border-2 transition-all duration-300 ${
                          isEnabled ? colors.enabled : colors.disabled
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div 
                              className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                isEnabled ? colors.icon : colors.iconDisabled
                              }`}
                              style={category.color === 'green' && isEnabled ? { backgroundColor: '#9ACD32' } : {}}
                            >
                              <IconComponent className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className={`font-semibold text-gray-900 dark:text-slate-100 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                                {typeof categoryContent === 'object' && 'title' in categoryContent ? categoryContent.title : ''}
                              </h4>
                              <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-slate-400 leading-tight ${isMobile ? 'hidden' : ''}`}>
                                {typeof categoryContent === 'object' && 'description' in categoryContent ? categoryContent.description : ''}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center ml-4 flex-shrink-0">
                            {isRequired ? (
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: '#9ACD32' }}
                                ></div>
                                <span 
                                  className="text-xs font-medium"
                                  style={{ color: '#9ACD32' }}
                                >
                                  {category.key === 'essential' ? currentContent.settings.essential.always : 'Always'}
                                </span>
                              </div>
                            ) : (
                              <button
                                onClick={() => togglePreference(category.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                  isEnabled ? colors.toggle : colors.toggleDisabled
                                }`}
                                style={category.color === 'green' && isEnabled ? { backgroundColor: '#9ACD32' } : {}}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Settings Footer */}
                <div className={`flex gap-3 ${isMobile ? 'mt-4' : 'mt-6'}`}>
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`flex-1 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 font-semibold rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-slate-600`}
                  >
                    {currentContent.settings.backToMain}
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className={`flex-1 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'} text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4`}
                    style={{
                      background: 'linear-gradient(to right, #9ACD32, #8FBC2B)',
                      boxShadow: '0 10px 15px -3px rgba(154, 205, 50, 0.3), 0 4px 6px -2px rgba(154, 205, 50, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #8FBC2B, #7A9C24)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, #9ACD32, #8FBC2B)'
                    }}
                  >
                    {currentContent.settings.saveSettings}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Powered by AcronWeb Cookies Logo */}
            <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-center gap-1 group cursor-pointer transition-all duration-300">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Powered by
                </span>

                <svg 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-4 h-4 inline-block align-middle flex-shrink-0"
                  aria-hidden="true" 
                  role="img" 
                  preserveAspectRatio="xMidYMid meet" 
                  fill="currentColor"
                >
                  <g id="SVGRepo_iconCarrier"> 
                    <path d="M36.9 22.7l2.5-18.6C37 3.5 34.6 2 32 2c-2.6 0-5 1.5-7.5 2.2c-2.5.6-5.3.5-7.5 1.8s-3.6 3.8-5.4 5.6C9.8 13.4 7.3 14.8 6 17c-1.3 2.2-1.2 5-1.9 7.5C3.5 27 2 29.4 2 32c0 2.6 1.5 5 2.2 7.5c.6 2.5.5 5.3 1.8 7.5s3.8 3.6 5.6 5.4c1.8 1.8 3.1 4.3 5.4 5.6c2.2 1.3 5 1.2 7.5 1.9c2.5.6 4.9 2.1 7.5 2.1c2.6 0 5-1.5 7.5-2.2c2.5-.7 5.3-.6 7.5-1.9c2.2-1.3 3.6-3.8 5.4-5.6c1.8-1.8 4.3-3.1 5.6-5.4c1.3-2.2 1.2-5 1.9-7.5c.6-2.4 2.1-4.8 2.1-7.4c0-2.6-2.1-8.1-2.1-8.1l-23-1.2" fill="#dda85f"> </path> 
                    <path d="M59.4 22.4c-1 .3-2.4.2-3.9-.4c-2.1-.8-3.4-2.5-3.8-4.5c-1 .3-3.4 0-5-1c-2.4-1.5-2.9-5.7-2.9-5.7c-2.7-.8-4.7-4-4.4-6.7c-2.2-.6-5-.5-7.4-.5c-2.4 0-4.6 1.4-6.8 2c-2.3.6-4.9.5-6.9 1.7s-3.3 3.5-4.9 5.1c-1.7 1.7-4 2.9-5.1 4.9c-1.2 2-1.1 4.6-1.7 6.9c-.6 2.2-2 4.4-2 6.8c0 2.4 1.4 4.6 2 6.8c.6 2.3.5 4.9 1.7 6.9s3.5 3.3 5.1 4.9c1.7 1.7 2.9 4 4.9 5.1c2 1.2 4.6 1.1 6.9 1.7c2.2.6 4.4 2 6.8 2c2.4 0 4.6-1.4 6.8-2c2.3-.6 4.9-.5 6.9-1.7s3.3-3.5 4.9-5.1c1.7-1.7 4-2.9 5.1-4.9c1.2-2 1.1-4.6 1.7-6.9c.6-2.2 3-4 3.3-6.4c.8-3.9-1.2-8.3-1.3-9" fill="#f2cb7d"> </path> 
                    <g fill="#dda85f"> 
                      <path d="M50.1 10.8l-1.4 1.4l-1.3-1.4l1.3-1.3z"> </path> 
                      <path d="M55.8 17.8l-.6.7l-.7-.7l.7-.7z"> </path> 
                      <path d="M50.8 13.2l-.7.7l-.7-.7l.7-.7z"> </path> 
                      <path d="M44.6 7.1l-.7.7l-.7-.7l.7-.7z"> </path> 
                      <path d="M57.2 20.3l-.7.7l-.7-.7l.7-.7z"> </path> 
                      <path d="M57.8 17.8l-.7.7l-.7-.7l.7-.7z"> </path> 
                    </g> 
                    <path d="M11.8 20.6c-1 1.7.5 4.8 2.5 5.7c2.9 1.2 4.6 1.4 6.4-1.7c.6-1.1 1.4-4 1.1-4.7c-.4-1-2.1-3-3.2-3c-3.1.1-6.1 2.5-6.8 3.7" fill="#6d4934"> </path> 
                    <path d="M12.3 20.6c-.7 1.2 1.1 4.8 3.5 4.5c3.3-.4 3-7.2 1.6-7.2c-2.4 0-4.6 1.8-5.1 2.7" fill="#a37f6a"> </path> 
                    <path d="M45.2 39.1c1.4-.4 2.4-2.9 1.8-4.4c-.9-2.3-1.8-3.3-4.4-2.6c-.9.3-3 1.4-3.2 1.9c-.3.8-.5 2.8.1 3.4c1.7 1.7 4.7 2 5.7 1.7" fill="#6d4934"> </path> 
                    <path d="M43.8 36.7c1.1-.3 2.8-3.7 1-3.9c-3.1-.5-5.5 1-5.2 2.7c.3 1.7 3.4 1.4 4.2 1.2" fill="#a37f6a"> </path> 
                    <path d="M24.9 44.5c-.3-1.2-2.5-2.1-3.9-1.5c-2 .8-2.9 1.5-2.2 3.8c.2.8 1.2 2.6 1.7 2.7c.7.3 2.4.4 2.9-.1c1.5-1.4 1.7-4 1.5-4.9" fill="#6d4934"> </path> 
                    <path d="M23.2 43.6c-.2-.9-4.4.4-4 2c.8 2.7.8 3.1 1.6 3c1.5-.4 2.5-4.3 2.4-5" fill="#a37f6a"> </path> 
                    <path d="M51.1 25.5c-1.2.3-2.1 2.5-1.5 3.9c.8 2 2.7 2.3 4.8 1.2c1.8-.9 1.9-4.1 1.4-4.7c-1.5-1.5-3.8-.6-4.7-.4" fill="#6d4934"> </path> 
                    <path d="M50.6 26.6c-.6.7-1.1 3.5.4 3.1c2.7-.8 4.6-3.5 3.4-3.9c-1.5-.5-3.1 0-3.8.8" fill="#a37f6a"> </path> 
                    <path fill="#6d4934" d="M22.74 16.112l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                    <g fill="#dda85f"> 
                      <path d="M14.706 33.483l1.979-1.98l1.98 1.979l-1.979 1.98z"> </path> 
                      <path d="M34.698 44.811l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                      <path d="M32.038 39.289l2.687-2.687l2.687 2.687l-2.687 2.687z"> </path> 
                      <path d="M24.696 9.827l2.687-2.687l2.687 2.687l-2.687 2.687z"> </path> 
                    </g> 
                    <g fill="#6d4934"> 
                      <path d="M41.122 46.347l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                      <path d="M49.076 35.215l1.98-1.98l1.98 1.98l-1.98 1.98z"> </path> 
                      <path d="M41.812 24.637l.99-.99l.99.99l-.99.99z"> </path> 
                      <path d="M13.726 38.266l.99-.99l.99.99l-.99.99z"> </path> 
                    </g> 
                  </g>
                </svg>

                <span 
                  className="text-xs font-bold bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 dark:from-amber-300 dark:via-amber-200 dark:to-amber-400 bg-clip-text text-transparent group-hover:from-amber-900 group-hover:via-amber-800 group-hover:to-amber-950 dark:group-hover:from-amber-200 dark:group-hover:via-amber-100 dark:group-hover:to-amber-300 transition-all duration-300"
                  style={{
                    fontFamily: "'Inter', 'SF Pro Display', 'Segoe UI', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    verticalAlign: 'baseline'
                  }}
                >
                  ACRON
                </span>
                <span 
                  className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 -ml-0.5 md:-ml-1"
                  style={{
                    fontFamily: "'Geogola', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    verticalAlign: 'baseline'
                  }}
                >
                  WEB
                </span>
                <span 
                  className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300"
                  style={{
                    fontFamily: "'Geogola', 'Outfit', 'Space Grotesk', 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    verticalAlign: 'baseline'
                  }}
                >
                  Cookies
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 