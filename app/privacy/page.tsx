"use client"

import React, { useEffect, useRef, useState } from "react"
import { Shield, BookOpen, Database, Eye, Share2, UserCheck, Lock, Clock, Cookie, Baby, Mail, ChevronRight, ScrollText, Users, CheckCircle, MessageSquare, AlertCircle, Menu, X, Phone, MapPin, Scale, Gavel } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

// Helper function to safely get string from translation
const getString = (value: any): string => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(' ')
  if (typeof value === 'object' && value !== null) {
    return value.title || value.summary || 'Unknown'
  }
  return String(value)
}

// Helper function to get sections data based on language
const getSections = (t: (key: string) => string | string[]) => [
  {
    id: "introduction",
    icon: <Shield className="w-6 h-6" />,
    title: getString(t('privacy.introduction.title')),
    summary: getString(t('privacy.introduction.summary')),
    content: Array.isArray(t('privacy.introduction.content')) ? t('privacy.introduction.content') as string[] : [t('privacy.introduction.content') as string],
    legal: t('privacy.introduction.legal') as string
  },
  {
    id: "dataCollection",
    icon: <Database className="w-6 h-6" />,
    title: getString(t('privacy.dataCollection.title')),
    summary: getString(t('privacy.dataCollection.summary')),
    content: Array.isArray(t('privacy.dataCollection.content')) ? t('privacy.dataCollection.content') as string[] : [t('privacy.dataCollection.content') as string],
    legal: t('privacy.dataCollection.legal') as string
  },
  {
    id: "dataUsage",
    icon: <Eye className="w-6 h-6" />,
    title: getString(t('privacy.dataUsage.title')),
    summary: getString(t('privacy.dataUsage.summary')),
    content: Array.isArray(t('privacy.dataUsage.content')) ? t('privacy.dataUsage.content') as string[] : [t('privacy.dataUsage.content') as string],
    legal: t('privacy.dataUsage.legal') as string
  },
  {
    id: "dataSharing",
    icon: <Share2 className="w-6 h-6" />,
    title: getString(t('privacy.dataSharing.title')),
    summary: getString(t('privacy.dataSharing.summary')),
    content: Array.isArray(t('privacy.dataSharing.content')) ? t('privacy.dataSharing.content') as string[] : [t('privacy.dataSharing.content') as string],
    legal: t('privacy.dataSharing.legal') as string
  },
  {
    id: "dataRights",
    icon: <UserCheck className="w-6 h-6" />,
    title: getString(t('privacy.dataRights.title')),
    summary: getString(t('privacy.dataRights.summary')),
    content: Array.isArray(t('privacy.dataRights.content')) ? t('privacy.dataRights.content') as string[] : [t('privacy.dataRights.content') as string],
    legal: t('privacy.dataRights.legal') as string
  },
  {
    id: "dataSecurity",
    icon: <Lock className="w-6 h-6" />,
    title: getString(t('privacy.dataSecurity.title')),
    summary: getString(t('privacy.dataSecurity.summary')),
    content: Array.isArray(t('privacy.dataSecurity.content')) ? t('privacy.dataSecurity.content') as string[] : [t('privacy.dataSecurity.content') as string],
    legal: t('privacy.dataSecurity.legal') as string
  },
  {
    id: "dataRetention",
    icon: <Clock className="w-6 h-6" />,
    title: getString(t('privacy.dataRetention.title')),
    summary: getString(t('privacy.dataRetention.summary')),
    content: Array.isArray(t('privacy.dataRetention.content')) ? t('privacy.dataRetention.content') as string[] : [t('privacy.dataRetention.content') as string],
    legal: t('privacy.dataRetention.legal') as string
  },
  {
    id: "cookies",
    icon: <Cookie className="w-6 h-6" />,
    title: getString(t('privacy.cookies.title')),
    summary: getString(t('privacy.cookies.summary')),
    content: Array.isArray(t('privacy.cookies.content')) ? t('privacy.cookies.content') as string[] : [t('privacy.cookies.content') as string],
    legal: t('privacy.cookies.legal') as string
  },
  {
    id: "contact",
    icon: <Mail className="w-6 h-6" />,
    title: getString(t('privacy.contact.title')),
    summary: getString(t('privacy.contact.summary')),
    content: Array.isArray(t('privacy.contact.content')) ? t('privacy.contact.content') as string[] : [t('privacy.contact.content') as string],
    legal: t('privacy.contact.legal') as string
  },
  {
    id: "modifications",
    icon: <Scale className="w-6 h-6" />,
    title: getString(t('privacy.modifications.title')),
    summary: getString(t('privacy.modifications.summary')),
    content: Array.isArray(t('privacy.modifications.content')) ? t('privacy.modifications.content') as string[] : [t('privacy.modifications.content') as string],
    legal: t('privacy.modifications.legal') as string
  }
]

// Table of Contents data
const getTableOfContents = (t: (key: string) => string | string[]) => [
  { id: "introduction", title: getString(t('privacy.introduction.title')), level: 1 },
  { id: "dataCollection", title: getString(t('privacy.dataCollection.title')), level: 1 },
  { id: "dataUsage", title: getString(t('privacy.dataUsage.title')), level: 1 },
  { id: "dataSharing", title: getString(t('privacy.dataSharing.title')), level: 1 },
  { id: "dataRights", title: getString(t('privacy.dataRights.title')), level: 1 },
  { id: "dataSecurity", title: getString(t('privacy.dataSecurity.title')), level: 1 },
  { id: "dataRetention", title: getString(t('privacy.dataRetention.title')), level: 1 },
  { id: "cookies", title: getString(t('privacy.cookies.title')), level: 1 },
  { id: "contact", title: getString(t('privacy.contact.title')), level: 1 },
  { id: "modifications", title: getString(t('privacy.modifications.title')), level: 1 },
]

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage()
  
  const heroTitleRef = useRef<HTMLHeadingElement | null>(null)
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeSection, setActiveSection] = useState("")
  const [isTocOpen, setIsTocOpen] = useState(false)
  const pathname = usePathname()
  
  const sections = getSections(t)
  const tableOfContents = getTableOfContents(t)

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sectionsRef.current.filter(Boolean)
      let currentSection = ""
      
      let maxVisibleHeight = 0
      
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          
          const visibleTop = Math.max(0, rect.top)
          const visibleBottom = Math.min(viewportHeight, rect.bottom)
          const visibleHeight = Math.max(0, visibleBottom - visibleTop)
          
          if (visibleHeight > maxVisibleHeight && rect.top <= viewportHeight * 0.3) {
            maxVisibleHeight = visibleHeight
            currentSection = sections[index].id
          }
        }
      })
      
      if (!currentSection && sectionElements.length > 0) {
        let closestDistance = Infinity
        let closestIndex = 0
        
        sectionElements.forEach((element, index) => {
          if (element) {
            const rect = element.getBoundingClientRect()
            const distance = Math.abs(rect.top - 100)
            if (distance < closestDistance) {
              closestDistance = distance
              closestIndex = index
            }
          }
        })
        
        currentSection = sections[closestIndex].id
      }
      
      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Handle mobile TOC visibility
  useEffect(() => {
    const handleMobileTocVisibility = () => {
      const tocButton = document.querySelector('.mobile-toc-button') as HTMLElement
      const footer = document.querySelector('footer') as HTMLElement
      
      if (tocButton && footer) {
        const footerRect = footer.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        
        if (footerRect.top < viewportHeight) {
          tocButton.style.opacity = '0'
          tocButton.style.pointerEvents = 'none'
        } else {
          tocButton.style.opacity = '1'
          tocButton.style.pointerEvents = 'auto'
        }
      }
    }

    window.addEventListener('scroll', handleMobileTocVisibility)
    window.addEventListener('resize', handleMobileTocVisibility)
    handleMobileTocVisibility()
    
    return () => {
      window.removeEventListener('scroll', handleMobileTocVisibility)
      window.removeEventListener('resize', handleMobileTocVisibility)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-white dark:from-slate-900 dark:via-blue-950/40 dark:to-indigo-950/30 min-h-screen flex flex-col relative overflow-hidden">
        
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-100 via-slate-100 to-white dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 overflow-hidden">
          <div className="relative w-full flex flex-col items-center justify-center max-w-5xl mx-auto px-6 z-10">
            <h1
              ref={heroTitleRef}
              className="text-center flex flex-row flex-wrap items-center justify-center gap-3 md:gap-4 mb-8"
            >
              <span className="hero-icon inline-block align-middle relative">
                <Shield className="w-12 h-12 md:w-16 md:h-16 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />
              </span>
              <span className="hero-word text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-800 dark:text-white drop-shadow-lg">
                {getString(t('privacy.title')).split(' ')[0]}
              </span>
              <span className="hero-word text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-800 dark:text-white drop-shadow-lg">
                {getString(t('privacy.title')).split(' ').slice(1).join(' ')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto text-center font-medium leading-relaxed mb-6">
              {getString(t('privacy.subtitle'))}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {getString(t('privacy.lastUpdated'))}
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {getString(t('privacy.compliance'))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Table of Contents - Desktop */}
        <div className="fixed top-1/2 left-6 transform -translate-y-1/2 z-50 hidden xl:block">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl overflow-hidden max-h-[70vh]">
            <div className="bg-slate-800 dark:bg-slate-700 p-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ScrollText className="w-4 h-4" />
                {getString(t('privacy.navigation.tableOfContents'))}
              </h3>
            </div>
            
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[55vh]">
              {tableOfContents.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all duration-300 flex items-center gap-3 relative group ${
                    activeSection === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 group-hover:bg-blue-500 group-hover:text-white'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <span className="flex-1 font-medium text-xs">{item.title}</span>
                  
                  {activeSection === item.id && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))}
            </nav>
            
            <div className="bg-slate-200 dark:bg-slate-600 h-1">
              <div 
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${((tableOfContents.findIndex(item => item.id === activeSection) + 1) / tableOfContents.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Mobile TOC Button */}
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="mobile-toc-button fixed bottom-6 left-6 z-50 xl:hidden bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-500 hover:scale-105 active:scale-95 border-2 border-white/20"
        >
          <div className="relative">
            {isTocOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </div>
        </button>

        {/* Enhanced Mobile TOC Overlay */}
        {isTocOpen && (
          <div className="fixed inset-0 z-40 xl:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTocOpen(false)} />
            <div className="absolute bottom-24 left-4 right-4 max-h-[70vh] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <ScrollText className="w-5 h-5" />
                    {getString(t('privacy.navigation.tableOfContents'))}
                  </h3>
                  <button
                    onClick={() => setIsTocOpen(false)}
                    className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="max-h-[calc(70vh-80px)] overflow-y-auto">
                <nav className="p-4 space-y-3">
                  {tableOfContents.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setIsTocOpen(false)
                        const element = document.getElementById(item.id)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 border ${
                        activeSection === item.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600 shadow-md'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 flex-shrink-0 ${
                        activeSection === item.id 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold block text-base leading-tight">{item.title}</span>
                        {activeSection === item.id && (
                          <span className="text-sm text-blue-600 dark:text-blue-400 block mt-1">{t('privacy.navigation.currentSection')}</span>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0">
                        {activeSection === item.id ? (
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
                
                <div className="p-4 border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <span>{t('privacy.navigation.progress')}</span>
                    <span>{Math.round(((tableOfContents.findIndex(item => item.id === activeSection) + 1) / tableOfContents.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((tableOfContents.findIndex(item => item.id === activeSection) + 1) / tableOfContents.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Sections */}
        <div className="flex-1 py-16 px-6 relative z-10">
          <div className="max-w-6xl mx-auto space-y-16">
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                ref={el => { sectionsRef.current[index] = el }}
                className="group"
              >
                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-slate-700/20 hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                      <div className="flex items-start gap-6">
                        <div className="section-icon p-4 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <span className="text-blue-700 dark:text-blue-300">
                            {section.icon}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-3 leading-tight">
                            {section.title}
                          </h2>
                          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
                            {section.summary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-700">
                          <div className="flex items-center gap-2">
                            <ScrollText className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                              {section.legal}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                      <div className="space-y-6">
                        {section.content.map((paragraph, pIndex) => (
                          <div key={pIndex} className="relative">
                            {paragraph.startsWith('•') ? (
                              <div className="flex items-start gap-3 pl-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                                  {paragraph.substring(2)}
                                </p>
                              </div>
                            ) : paragraph.includes('•') ? (
                              <div className="space-y-3">
                                {paragraph.split('\n').map((line, lineIndex) => (
                                  <div key={lineIndex}>
                                    {line.startsWith('•') ? (
                                      <div className="flex items-start gap-3 pl-4">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                                          {line.substring(2)}
                                        </p>
                                      </div>
                                    ) : line.startsWith('-') ? (
                                      <div className="flex items-start gap-3 pl-8">
                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-3.5 flex-shrink-0"></div>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                          {line.substring(2)}
                                        </p>
                                      </div>
                                    ) : line.trim() && (
                                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                                        {line}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg">
                                {paragraph}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom Notice */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-900 dark:to-blue-950 border-t border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-amber-700 dark:text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                      {getString(t('privacy.importantNotice'))}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {getString(t('privacy.importantText'))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 dark:border-slate-700/20">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-xl">
                    <Mail className="w-6 h-6 text-blue-700 dark:text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                      {getString(t('privacy.contact'))}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {getString(t('privacy.contactText'))}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Phone className="w-4 h-4" />
                        <Link href="tel:+302106818011" className="font-semibold transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300">
                          +3021 0681 8011
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Mail className="w-4 h-4" />
                        <Link href="mailto:ar.hairbeauty.healthservices@gmail.com" className="font-semibold transition-colors duration-200 hover:text-blue-700 dark:hover:text-blue-300">
                          ar.hairbeauty.healthservices@gmail.com
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">Ανδρέα Παπανδρέου 52, Χαλάνδρι, 152 32</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}

