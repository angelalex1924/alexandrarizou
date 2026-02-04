"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
// import { Calendar } from "@/components/ui/calendar" // Replaced with custom styled calendar
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { el } from "date-fns/locale"
import {
  Clock,
  CalendarIcon,
  User,
  Mail,
  Phone,
  Scissors,
  CheckCircle,
  AlertCircle,
  Lock,
  Sparkles,
  Star,
  Zap,
  Shield,
  Crown,
  Heart,
  Gem,
  ArrowRight,
  X,
  Gift,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  HaircutIcon,
  KidsHaircutIcon,
  HaircutBeardIcon,
  BeardIcon,
  EyebrowsIcon,
  BlackMaskIcon,
  WaxingIcon,
  LuteraIcon
} from "@/components/ui/service-icons"

const LOCAL_API_PATH = "/api/crm"

// Custom Image Icon component for services
const ServiceImageIcon = ({ src, alt, className = "h-8 w-8" }: { src: string; alt: string; className?: string }) => (
  <img src={src} alt={alt} className={className} style={{ objectFit: 'contain' }} />
)

// Services array - updated for Alexandra Rizou Salon with real images
const services = [
  // HAIR SERVICES
  {
    value: "hairstyling",
    label: "Χτένισμα",
    duration: 45,
    price: 30,
    description: "Επαγγελματικό styling και σχηματισμός μαλλιών",
    icon: () => <ServiceImageIcon src="/hair-styling_17828281.png" alt="Χτένισμα" />,
    gradient: "from-sage-green/20 via-sage-light/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "womenscut",
    label: "Κούρεμα Γυναικείο",
    duration: 60,
    price: 45,
    description: "Σύγχρονα γυναικεία κουρέματα",
    icon: () => <ServiceImageIcon src="/hair-cut_18074401.png" alt="Κούρεμα" />,
    gradient: "from-sage-green/20 via-sage-light/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "menscut",
    label: "Κούρεμα Ανδρικό",
    duration: 30,
    price: 25,
    description: "Ακριβή και προσεγμένα ανδρικά κουρέματα",
    icon: () => <ServiceImageIcon src="/wig_1053035.png" alt="Κούρεμα Ανδρικό" />,
    gradient: "from-sage-green/20 via-sage-light/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "treatment",
    label: "Θεραπεία",
    duration: 30,
    price: 35,
    description: "Εντατικές θεραπείες για υγιή, λάμπουσα τρίχα",
    icon: () => <ServiceImageIcon src="/hair-treatment.png" alt="Θεραπεία" />,
    gradient: "from-sage-green/20 via-sage-light/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "rootcolor",
    label: "Βαφή Ρίζα",
    duration: 90,
    price: 50,
    description: "Ακριβής βαφή στις ρίζες",
    icon: () => <ServiceImageIcon src="/hair-dye.png" alt="Βαφή Ρίζα" />,
    gradient: "from-copper/20 via-copper/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "fullcolor",
    label: "Βαφή Όλο",
    duration: 120,
    price: 80,
    description: "Πλήρης μεταμόρφωση με βαφή",
    icon: () => <ServiceImageIcon src="/hair-color_9054660.png" alt="Βαφή Όλο" />,
    gradient: "from-copper/20 via-copper/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "balayage",
    label: "Μπαλαγιάζ",
    duration: 180,
    price: 150,
    description: "Φυσικό, sun-kissed αποτέλεσμα",
    icon: () => <ServiceImageIcon src="/balayage.png" alt="Μπαλαγιάζ" />,
    gradient: "from-rose-gold/20 via-copper/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  {
    value: "highlights",
    label: "Ανταύγειες",
    duration: 120,
    price: 100,
    description: "Highlights για φυσική λάμψη",
    icon: () => <ServiceImageIcon src="/hair-highlights.png" alt="Ανταύγειες" />,
    gradient: "from-rose-gold/20 via-copper/10 to-transparent",
    category: "hair",
    role: "Hairdresser"
  },
  // NAIL SERVICES
  {
    value: "manicure",
    label: "Manicure",
    duration: 45,
    price: 25,
    description: "Περιποίηση χεριών και νυχιών",
    icon: () => <ServiceImageIcon src="/nail_452757.png" alt="Manicure" />,
    gradient: "from-copper/20 via-rose-gold/10 to-transparent",
    category: "nails",
    role: "Nail Artist"
  },
  {
    value: "pedicure",
    label: "Pedicure",
    duration: 60,
    price: 35,
    description: "Περιποίηση ποδιών και νυχιών",
    icon: () => <ServiceImageIcon src="/nail_452757.png" alt="Pedicure" />,
    gradient: "from-copper/20 via-rose-gold/10 to-transparent",
    category: "nails",
    role: "Nail Artist"
  },
  // WAXING
  {
    value: "waxing",
    label: "Αποτρίχωση",
    duration: 30,
    price: 15,
    description: "Επαγγελματική αποτρίχωση",
    icon: () => <ServiceImageIcon src="/waxing_17368167.png" alt="Αποτρίχωση" />,
    gradient: "from-copper/20 via-rose-gold/10 to-transparent",
    category: "waxing",
    role: "Nail Artist"
  },
  // EYELASHES
  {
    value: "eyelashes",
    label: "Βλεφαρίδες",
    duration: 90,
    price: 60,
    description: "Extensions βλεφαρίδων",
    icon: () => <ServiceImageIcon src="/eyelashes.png" alt="Βλεφαρίδες" />,
    gradient: "from-copper/20 via-rose-gold/10 to-transparent",
    category: "nails",
    role: "Nail Artist"
  },
]

interface AvailableSlotsResponse {
  success: boolean
  isBusinessOpen: boolean
  businessReason?: string
  customHours?: {
    openTime: string
    closeTime: string
  }
  availableSlots: Array<{
    time: string
    employeeNames?: string[]
    availableEmployees?: string[]
    bookedEmployees?: string[]
    status?: 'available' | 'partially_booked' | 'fully_booked' | 'past_time'
  }>
  bookedSlots: string[]
  error?: string
}

// Load Chillax font
const loadChillaxFont = () => {
  if (typeof window !== 'undefined') {
    // Also load Junicode for headers if needed, but Chillax is for UI
    const font = new FontFace('Chillax', 'url(/fonts/Chillax-Semibold.otf)')
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont)
    })
  }
}

export default function AppointmentBooking() {
  const pathname = usePathname()
  const router = useRouter()
  const isEnglish = pathname.startsWith('/en')

  // Load Chillax font on component mount
  useEffect(() => {
    loadChillaxFont()
  }, [])

  // Translation object for English text
  const translations = {
    // Service labels (keep Greek for API, but show English in UI)
    services: {
      hairstyling: { label: "Hair Styling", description: "Professional styling and hair shaping" },
      womenscut: { label: "Women's Haircut", description: "Contemporary women's haircuts" },
      menscut: { label: "Men's Haircut", description: "Precise men's haircuts" },
      treatment: { label: "Treatment", description: "Intensive hair treatments" },
      rootcolor: { label: "Root Color", description: "Precise root coloring" },
      fullcolor: { label: "Full Color", description: "Complete hair coloring" },
      balayage: { label: "Balayage", description: "Natural, sun-kissed effect" },
      manicure: { label: "Manicure", description: "Hand and nail care" },
      pedicure: { label: "Pedicure", description: "Foot and nail care" },
      nail_art: { label: "Nail Art", description: "Decorative nail designs" },
      waxing: { label: "Waxing", description: "Professional waxing" }
    },
    // UI text
    ui: {
      steps: {
        dateEmployee: "Date & Specialist",
        time: "Time",
        services: "Services",
        details: "Details",
        confirmation: "Confirmation"
      },
      status: {
        current: "Current step",
        completed: "Completed",
        pending: "Pending"
      },
      buttons: {
        back: "Back",
        continue: "Continue",
        edit: "Edit",
        editAll: "Reset All",
        processing: "Processing...",
        completeVerification: "Complete Verification",
        bookAppointment: "Book Appointment"
      },
      labels: {
        selectDateEmployee: "Select Date & Specialist",
        selectTime: "Select Time",
        selectTimeFor: "Select time for",
        selected: "Selected:",
        selectService: "Select Service",
        selectedServices: "Selected Services",
        total: "Total",
        customerDetails: "Customer Details",
        requiredFields: "Required fields",
        fullName: "Full Name",
        phone: "Phone",
        email: "Email",
        notes: "Notes",
        confirmation: "Confirmation",
        confirmationTitle: "Booking Confirmation",
        confirmationSubtitle: "Check your booking details before completion",
        dateTime: "Date & Time",
        date: "Date",
        time: "Time",
        employee: "Specialist",
        services: "Services",
        customer: "Customer",
        securityVerification: "Security Verification",
        completeVerification: "Please complete verification to proceed",
        bookingSummary: "Booking Summary",
        bookingCompleted: "Your booking has been completed successfully! ✨",
        confirmationMessage: "We will notify you via email to confirm your booking.",
        thankYou: "Thank you for choosing Alexandra Rizou Salon! ✨"
      },
      placeholders: {
        fullName: "Enter your full name",
        phone: "Enter your phone number",
        email: "Enter your email address",
        notes: "Additional information or special requirements..."
      },
      messages: {
        closed: "Closed",
        loading: "Loading...",
        unavailable: "Unavailable",
        noEmployees: "No available specialists for this date",
        businessClosed: "The shop is closed today. Selected:",
        noAvailableDays: "No available days found in the next 14 days. Please contact the shop.",
        apiError: "API Error:",
        connectionError: "Connection Error:",
        unknownError: "Unknown error",
        corsError: "CORS Error: The API does not allow requests from this domain. CORS configuration needed on server.",
        connectionFailed: "Connection failed with API",
        pastDate: "Past date",
        fillRequired: "Please fill in all required fields",
        completeVerification: "Please complete security verification",
        verificationFailed: "Security verification failed. Please try again.",
        minutes: "minutes"
      }
    }
  }

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'hair' | 'nails' | null>(null)
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; employeeNames?: string[] }>>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isBusinessOpen, setIsBusinessOpen] = useState<boolean>(true)
  const [businessReason, setBusinessReason] = useState<string>("")
  const [customHours, setCustomHours] = useState<{ openTime: string; closeTime: string } | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [availableEmployees, setAvailableEmployees] = useState<string[]>([])
  const [allEmployees, setAllEmployees] = useState<string[]>([])
  const [employeeData, setEmployeeData] = useState<{ [key: string]: { rating?: number, specialty?: string, avatar?: string } }>({})
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  })

  // Employee specialty mapping for Alexandra Rizou Salon
  const EMPLOYEE_SPECIALTIES: { [key: string]: string } = {
    'Μαρία': 'Nail Artist',
    'Αλεξάνδρα': 'Hairdresser',
    // Add more employees here as needed
  }

  // Function to load employee data - uses explicit mapping
  const loadEmployeeData = (employeeNames: string[]) => {
    const employeeDataMap: { [key: string]: { rating?: number, specialty?: string, avatar?: string } } = {}

    employeeNames.forEach(name => {
      // Use explicit mapping, fallback to Hairdresser if not found
      const specialty = EMPLOYEE_SPECIALTIES[name] || 'Hairdresser'

      employeeDataMap[name] = {
        rating: 5.0,
        specialty: specialty,
        avatar: ''
      }
    })

    setEmployeeData(employeeDataMap)
  }
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [conflictMessage, setConflictMessage] = useState<string>("")
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null)
  const [closedDates, setClosedDates] = useState<Date[]>([])
  const [loadingClosedDates, setLoadingClosedDates] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string>("")
  const [isTurnstileVerified, setIsTurnstileVerified] = useState<boolean>(false)
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)

  // Load closed dates from localStorage on component mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('alexandra-rizou-closed-dates')
      const cacheTimestamp = localStorage.getItem('alexandra-rizou-closed-dates-timestamp')

      if (cached && cacheTimestamp) {
        const cacheAge = Date.now() - parseInt(cacheTimestamp)
        const maxCacheAge = 24 * 60 * 60 * 1000 // 24 hours

        if (cacheAge < maxCacheAge) {
          const parsedDates = JSON.parse(cached).map((dateStr: string) => new Date(dateStr))
          setClosedDates(parsedDates)
        } else {
          localStorage.removeItem('alexandra-rizou-closed-dates')
          localStorage.removeItem('alexandra-rizou-closed-dates-timestamp')
        }
      }
    } catch (error) {
    }
  }, [])

  // Save closed dates to localStorage when they change
  useEffect(() => {
    if (closedDates.length > 0) {
      try {
        const dateStrings = closedDates.map(date => date.toISOString())
        localStorage.setItem('alexandra-rizou-closed-dates', JSON.stringify(dateStrings))
        localStorage.setItem('alexandra-rizou-closed-dates-timestamp', Date.now().toString())
      } catch (error) {
      }
    }
  }, [closedDates])

  const loadClosedDatesForMonth = async (year: number, month: number) => {
    setLoadingClosedDates(true)
    try {
      // Get first and last day of the month
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)


      const closed: Date[] = []

      // Create all date strings for the month
      const dateStrings: string[] = []
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const checkDate = new Date(year, month, day)
        const yearStr = checkDate.getFullYear()
        const monthStr = String(checkDate.getMonth() + 1).padStart(2, "0")
        const dayStr = String(checkDate.getDate()).padStart(2, "0")
        const dateStr = `${yearStr}-${monthStr}-${dayStr}`
        dateStrings.push(dateStr)
      }

      // Make parallel API calls (batch of 5 at a time to avoid overwhelming the server)
      const batchSize = 5
      for (let i = 0; i < dateStrings.length; i += batchSize) {
        const batch = dateStrings.slice(i, i + batchSize)

        const promises = batch.map(async (dateStr) => {
          try {
            const apiUrl = `${LOCAL_API_PATH}/available-slots?date=${dateStr}`
            const response = await fetch(apiUrl, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              mode: "cors",
            })

            if (response.ok) {
              const data = await response.json()
              if (data.success && !data.isBusinessOpen) {
                const [yearStr, monthStr, dayStr] = dateStr.split('-')
                return new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr))
              }
            }
          } catch (error) {
          }
          return null
        })

        const results = await Promise.all(promises)
        const validClosedDates = results.filter(date => date !== null) as Date[]
        closed.push(...validClosedDates)

        // Small delay between batches to be nice to the server
        if (i + batchSize < dateStrings.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      // Update closed dates state
      setClosedDates(prev => {
        // Remove dates from other months and add new ones
        const filtered = prev.filter(date =>
          date.getFullYear() !== year || date.getMonth() !== month
        )
        return [...filtered, ...closed]
      })

    } catch (error) {
    } finally {
      setLoadingClosedDates(false)
    }
  }

  const loadClosedDatesForCurrentMonth = async () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    await loadClosedDatesForMonth(year, month)
  }

  const findNextAvailableDay = async (startDate: Date) => {

    // Check up to 14 days ahead (reduced from 30 for speed)
    const maxDays = 14

    // Create date strings for the next 14 days
    const dateStrings = []
    for (let i = 1; i <= maxDays; i++) {
      const checkDate = new Date(startDate)
      checkDate.setDate(startDate.getDate() + i)
      const year = checkDate.getFullYear()
      const month = String(checkDate.getMonth() + 1).padStart(2, "0")
      const day = String(checkDate.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`
      dateStrings.push({ dateStr, checkDate })
    }

    // Check days in batches of 3 for faster results
    const batchSize = 3
    for (let i = 0; i < dateStrings.length; i += batchSize) {
      const batch = dateStrings.slice(i, i + batchSize)

      const promises = batch.map(async ({ dateStr, checkDate }) => {
        try {
          const apiUrl = `${LOCAL_API_PATH}/available-slots?date=${dateStr}`
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.isBusinessOpen && data.availableSlots && data.availableSlots.length > 0) {
              return { checkDate, data }
            }
          }
        } catch (error) {
        }
        return null
      })

      const results = await Promise.all(promises)
      const availableDay = results.find(result => result !== null)

      if (availableDay) {
        setSelectedDate(availableDay.checkDate)
        setMessage({
          type: "success",
          text: isEnglish ?
            `The shop is closed today. Selected: ${availableDay.checkDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}.` :
            `Το μαγαζί είναι κλειστό σήμερα. Επιλέχθηκε η ${availableDay.checkDate.toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long' })}.`
        })
        // Load the available slots for the new date
        setTimeout(() => {
          loadAvailableSlots(availableDay.checkDate)
        }, 100)
        return
      }

      // Small delay between batches
      if (i + batchSize < dateStrings.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    // If no available day found
    setMessage({
      type: "error",
      text: isEnglish ? "No available days found in the next 14 days. Please contact the shop." : "Δεν βρέθηκε διαθέσιμη ημέρα στις επόμενες 14 μέρες. Παρακαλώ επικοινωνήστε με το μαγαζί."
    })
  }

  const loadAvailableSlots = async (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dateStr = `${year}-${month}-${day}`

    setIsLoadingSlots(true)
    setSelectedTime("")
    setSelectedEmployee("")
    setAvailableEmployees([])


    // Check if we have prefetched data for this date
    let prefetchedData: AvailableSlotsResponse | null = null
    try {
      const prefetched = sessionStorage.getItem('alexandra-rizou-prefetched-slots')
      if (prefetched) {
        const parsed = JSON.parse(prefetched)
        // Use prefetched data if it's for today and less than 5 minutes old
        const today = new Date()
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

        if (parsed.date === dateStr && parsed.date === todayStr) {
          const age = Date.now() - parsed.timestamp
          const maxAge = 5 * 60 * 1000 // 5 minutes

          if (age < maxAge) {
            prefetchedData = parsed.data
          } else {
            sessionStorage.removeItem('alexandra-rizou-prefetched-slots')
          }
        }
      }
    } catch (e) {
    }

    const apiUrl = `${LOCAL_API_PATH}/available-slots?date=${dateStr}`

    try {
      let data: AvailableSlotsResponse

      if (prefetchedData) {
        // Use prefetched data immediately, but also fetch in background for next time
        data = prefetchedData

        // Fetch fresh data in background (don't await)
        fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        }).then(async (response) => {
          if (response.ok) {
            const freshData = await response.json()
            // Update sessionStorage with fresh data
            try {
              sessionStorage.setItem('alexandra-rizou-prefetched-slots', JSON.stringify({
                date: dateStr,
                data: freshData,
                timestamp: Date.now()
              }))
            } catch (e) {
            }
          }
        }).catch(err => {
        })
      } else {
        // No prefetched data, fetch normally
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        data = await response.json()
      }


      if (data.success) {
        setIsBusinessOpen(data.isBusinessOpen)
        setBusinessReason(data.businessReason || "")
        setCustomHours(data.customHours || null)

        // Filter out past slots for today
        const today = new Date()
        const isToday = date.toDateString() === today.toDateString()


        const filteredSlots = (data.availableSlots || []).filter(slot => {
          if (isToday) {
            const isPast = isPastTime(slot.time, date)
            return !isPast
          }
          return true
        })

        setAvailableSlots(filteredSlots)
        setBookedSlots(data.bookedSlots || [])

        // Extract all unique employees from all slots, preserving order from first slot
        // Slots should already have employees in the correct order (from EmployeeManager)
        const orderedEmployeesFromSlots: string[] = []
        const seenEmployees = new Set<string>()

        // First, get the order from the first slot that has employees (this is the reference order)
        const firstSlotWithEmployees = filteredSlots.find(slot =>
          slot.employeeNames && slot.employeeNames.length > 0
        )

        if (firstSlotWithEmployees && firstSlotWithEmployees.employeeNames) {
          // Use the order from the first slot as the reference
          firstSlotWithEmployees.employeeNames.forEach(emp => {
            if (!seenEmployees.has(emp)) {
              orderedEmployeesFromSlots.push(emp)
              seenEmployees.add(emp)
            }
          })
        }

        // Then, add any employees from other slots that weren't in the first slot
        filteredSlots.forEach(slot => {
          if (slot.employeeNames && slot.employeeNames.length > 0) {
            slot.employeeNames.forEach(emp => {
              if (!seenEmployees.has(emp)) {
                orderedEmployeesFromSlots.push(emp)
                seenEmployees.add(emp)
              }
            })
          }
        })

        // Use employees directly from slots (already ordered by the CRM)
        setAllEmployees(orderedEmployeesFromSlots)

        // Load employee data (rating, specialty, avatar) - local defaults only
        if (orderedEmployeesFromSlots.length > 0) {
          loadEmployeeData(orderedEmployeesFromSlots)
        }


        // If business is closed and it's today, find next available day
        if (!data.isBusinessOpen && data.businessReason && date.getTime() === new Date().setHours(0, 0, 0, 0)) {
          findNextAvailableDay(date)
        }
      } else {
        setMessage({
          type: "error",
          text: isEnglish ? `API Error: ${data.error || "Unable to load available hours"}` : `Σφάλμα API: ${data.error || "Δεν ήταν δυνατή η φόρτωση των διαθέσιμων ωρών"}`,
        })
        setAvailableSlots([])
        setBookedSlots([])
        setIsBusinessOpen(false)
        setBusinessReason(data.error || (isEnglish ? "Loading error" : "Σφάλμα φόρτωσης"))
      }
    } catch (error) {

      let errorMessage = isEnglish ? "Unknown error" : "Άγνωστο σφάλμα"

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage = isEnglish ?
          "CORS Error: The API does not allow requests from this domain. CORS configuration needed on server." :
          "Σφάλμα CORS: Το API δεν επιτρέπει αιτήματα από αυτό το domain. Χρειάζεται διαμόρφωση CORS στον server."
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setMessage({
        type: "error",
        text: isEnglish ? `Connection Error: ${errorMessage}` : `Σφάλμα σύνδεσης: ${errorMessage}`,
      })
      setAvailableSlots([])
      setBookedSlots([])
      setIsBusinessOpen(false)
      setBusinessReason(isEnglish ? "Connection failed with API" : "Σφάλμα σύνδεσης με το API")
    } finally {
      setIsLoadingSlots(false)
    }
  }

  const handleEmployeeSelection = (employee: string) => {
    setSelectedEmployee(employee)
    setSelectedTime("") // Reset time selection
    // Auto advance to next step (time selection)
    setCurrentStep(2)
    // Scroll to steps indicator on mobile
    setTimeout(() => {
      const stepsElement = document.querySelector('.steps-indicator')
      if (stepsElement) {
        stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time)

    // Auto advance to service selection
    setCurrentStep(3)
    // Scroll to steps indicator on mobile
    setTimeout(() => {
      const stepsElement = document.querySelector('.steps-indicator')
      if (stepsElement) {
        stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  const handleServiceSelection = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        // Remove service if already selected
        return prev.filter(s => s !== service)
      } else {
        // Add service if not selected
        return [...prev, service]
      }
    })
  }

  const resetAllSelections = () => {
    setCurrentStep(1)
    setSelectedDate(new Date())
    setSelectedTime("")
    setSelectedService("")
    setSelectedServices([])
    setSelectedEmployee("")
    setAvailableEmployees([])
    setCustomerData({ name: "", email: "", phone: "", notes: "" })
    setAvailableSlots([])
    setBookedSlots([])
    setMessage(null)
    // Reload today's slots
    loadAvailableSlots(new Date())
  }

  const goToStep = (step: number) => {
    if (step === 1) {
      setCurrentStep(1)
      setTimeout(() => {
        const stepsElement = document.querySelector('.steps-indicator')
        if (stepsElement) {
          stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } else if (step === 2 && selectedEmployee) {
      setCurrentStep(2)
      setTimeout(() => {
        const stepsElement = document.querySelector('.steps-indicator')
        if (stepsElement) {
          stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } else if (step === 3 && selectedTime) {
      setCurrentStep(3)
      setTimeout(() => {
        const stepsElement = document.querySelector('.steps-indicator')
        if (stepsElement) {
          stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } else if (step === 4 && selectedTime && selectedServices.length > 0) {
      setCurrentStep(4)
      setTimeout(() => {
        const stepsElement = document.querySelector('.steps-indicator')
        if (stepsElement) {
          stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } else if (step === 5 && selectedTime && selectedServices.length > 0 && customerData.name) {
      setCurrentStep(5)
      setTimeout(() => {
        const stepsElement = document.querySelector('.steps-indicator')
        if (stepsElement) {
          stepsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    }
  }

  useEffect(() => {
    // Load today's available slots automatically when component mounts
    const today = new Date()
    setSelectedDate(today)

    // Check if today is closed and find next available day
    const checkTodayAndFindNext = async () => {
      try {
        const year = today.getFullYear()
        const month = String(today.getMonth() + 1).padStart(2, "0")
        const day = String(today.getDate()).padStart(2, "0")
        const dateStr = `${year}-${month}-${day}`

        const apiUrl = `${LOCAL_API_PATH}/available-slots?date=${dateStr}`
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        })

        if (response.ok) {
          const data = await response.json()

          if (data.success && !data.isBusinessOpen) {
            await findNextAvailableDay(today)
          } else {
            // Today is open, load today's slots
            loadAvailableSlots(today)
          }
        } else {
          // If API fails, just load today's slots
          loadAvailableSlots(today)
        }
      } catch (error) {
        // If error, just load today's slots
        loadAvailableSlots(today)
      }
    }

    checkTodayAndFindNext()

    // Load closed dates for current month immediately
    loadClosedDatesForCurrentMonth()
  }, [])

  // Dynamic real-time checking - check every 10 seconds for updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedDate) {
        const now = new Date()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Always reload if it's today to catch new bookings and time changes
        if (selectedDate.getTime() === today.getTime()) {
          loadAvailableSlots(selectedDate)
        }
      }
    }, 10000) // Check every 10 seconds for real-time updates

    return () => clearInterval(interval)
  }, [selectedDate])

  // Immediate check when component mounts
  useEffect(() => {
    if (selectedDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // If it's today, check immediately
      if (selectedDate.getTime() === today.getTime()) {
        loadAvailableSlots(selectedDate)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate >= today) {
        loadAvailableSlots(selectedDate)
      } else {
        setAvailableSlots([])
        setBookedSlots([])
        setIsBusinessOpen(false)
        setBusinessReason(isEnglish ? "Past date" : "Παρελθούσα ημερομηνία")
      }
    }
  }, [selectedDate])

  // Load closed dates when month changes
  useEffect(() => {
    if (selectedDate && !loadingClosedDates) {
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth()

      // Check if we already have closed dates for this month
      const hasClosedDatesForMonth = closedDates.some(date =>
        date.getFullYear() === year && date.getMonth() === month
      )

      if (!hasClosedDatesForMonth) {
        loadClosedDatesForMonth(year, month)
      }
    }
  }, [selectedDate])

  // Force reload when user manually selects today's date
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      // Force reload even if it's the same date to get updated status
      setTimeout(() => {
        loadAvailableSlots(date)
      }, 100)
    }
  }

  const isPastDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  // Calendar matcher function - disable past dates and closed dates
  const isDateDisabled = (date: Date): boolean => {
    // Disable past dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true

    // Check if date is in cached closed dates
    const dateStr = date.toISOString().split('T')[0]
    const isClosed = closedDates.some(closedDate => {
      const closedDateStr = closedDate.toISOString().split('T')[0]
      return dateStr === closedDateStr
    })

    if (isClosed) {
    }

    return isClosed
  }

  const isPastTime = (time: string, date: Date): boolean => {
    const now = new Date()

    // Απλή σύγκριση ημερομηνιών
    const isToday = date.toDateString() === now.toDateString()


    if (isToday) {
      const [hours, minutes] = time.split(':').map(Number)

      // Δημιουργούμε την ημερομηνία/ώρα του slot
      const slotDateTime = new Date(date)
      slotDateTime.setHours(hours, minutes, 0, 0)

      // Έλεγχος αν το slot είναι στο παρελθόν (χωρίς buffer)
      const isPast = slotDateTime < now


      return isPast
    }

    return false
  }

  // Test function για debugging
  const testTimeFiltering = () => {
    const testTimes = ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']
    const today = new Date()


    testTimes.forEach(time => {
      const isPast = isPastTime(time, today)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime || !customerData.name || !customerData.phone || !customerData.email || selectedServices.length === 0) {
      setMessage({ type: "error", text: isEnglish ? translations.ui.messages.fillRequired : "Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία" })
      return
    }

    if (!termsAccepted) {
      setMessage({ type: "error", text: isEnglish ? "Please accept the Terms of Service to continue" : "Παρακαλώ αποδεχτείτε τους Όρους Χρήσης για να συνεχίσετε" })
      return
    }

    // Check Turnstile verification only in production
    if (process.env.NODE_ENV === 'production' && !isTurnstileVerified) {
      setMessage({ type: "error", text: isEnglish ? translations.ui.messages.completeVerification : "Παρακαλώ ολοκληρώστε την επαλήθευση ασφαλείας" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const year = selectedDate.getFullYear()
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0")
      const day = String(selectedDate.getDate()).padStart(2, "0")
      const localDateStr = `${year}-${month}-${day}`

      // Convert selected services to Greek labels for API
      const selectedServicesLabels = selectedServices.map(serviceValue => {
        const service = services.find(s => s.value === serviceValue)
        return service ? service.label : serviceValue
      })

      // Check slot availability before submitting
      try {
        const availabilityCheckUrl = `${LOCAL_API_PATH}/available-slots?date=${localDateStr}`
        const availabilityResponse = await fetch(availabilityCheckUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
        })

        if (availabilityResponse.ok) {
          const availabilityData: AvailableSlotsResponse = await availabilityResponse.json()

          if (availabilityData.success) {
            // Find the slot for the selected time
            const slotForTime = availabilityData.availableSlots.find(slot => slot.time === selectedTime)

            if (!slotForTime) {
              const conflictMsg = isEnglish
                ? "This time slot is no longer available. Please select a different time."
                : "Η ώρα αυτή δεν είναι πλέον διαθέσιμη. Παρακαλώ επιλέξτε άλλη ώρα."
              setIsLoading(false)
              setConflictMessage(conflictMsg)
              setShowConflictModal(true)
              if (selectedDate) {
                loadAvailableSlots(selectedDate)
              }
              return
            }

            if (selectedEmployee) {
              if (slotForTime.employeeNames && slotForTime.employeeNames.length > 0) {
                if (!slotForTime.employeeNames.includes(selectedEmployee)) {
                  const conflictMsg = isEnglish
                    ? `${selectedEmployee} is no longer available for this time slot. Please select a different time or barber.`
                    : `Ο ${selectedEmployee} δεν είναι πλέον διαθέσιμος για αυτή την ώρα. Παρακαλώ επιλέξτε άλλη ώρα ή μπαρμπέρη.`
                  setIsLoading(false)
                  setConflictMessage(conflictMsg)
                  setShowConflictModal(true)
                  if (selectedDate) {
                    loadAvailableSlots(selectedDate)
                  }
                  return
                }

                if (slotForTime.bookedEmployees && slotForTime.bookedEmployees.includes(selectedEmployee)) {
                  const conflictMsg = isEnglish
                    ? `${selectedEmployee} is already booked for this time slot. Please select a different time.`
                    : `Ο ${selectedEmployee} έχει ήδη ραντεβού για αυτή την ώρα. Παρακαλώ επιλέξτε άλλη ώρα.`
                  setIsLoading(false)
                  setConflictMessage(conflictMsg)
                  setShowConflictModal(true)
                  if (selectedDate) {
                    loadAvailableSlots(selectedDate)
                  }
                  return
                }

                if (slotForTime.availableEmployees !== undefined) {
                  if (!slotForTime.availableEmployees.includes(selectedEmployee)) {
                    const conflictMsg = isEnglish
                      ? `${selectedEmployee} is no longer available for this time slot. Please select a different time.`
                      : `Ο ${selectedEmployee} δεν είναι πλέον διαθέσιμος για αυτή την ώρα. Παρακαλώ επιλέξτε άλλη ώρα.`
                    setIsLoading(false)
                    setConflictMessage(conflictMsg)
                    setShowConflictModal(true)
                    if (selectedDate) {
                      loadAvailableSlots(selectedDate)
                    }
                    return
                  }
                }
              }
            } else {
              if (slotForTime.employeeNames && slotForTime.employeeNames.length > 0) {
                const hasAvailableEmployees = slotForTime.availableEmployees && slotForTime.availableEmployees.length > 0
                if (!hasAvailableEmployees && slotForTime.status === 'fully_booked') {
                  const conflictMsg = isEnglish
                    ? "This time slot is fully booked. Please select a different time."
                    : "Η ώρα αυτή είναι πλήρως κλεισμένη. Παρακαλώ επιλέξτε άλλη ώρα."
                  setIsLoading(false)
                  setConflictMessage(conflictMsg)
                  setShowConflictModal(true)
                  if (selectedDate) {
                    loadAvailableSlots(selectedDate)
                  }
                  return
                }
              }
            }

            if (slotForTime.status === 'fully_booked' || slotForTime.status === 'past_time') {
              const conflictMsg = isEnglish
                ? "This time slot is no longer available. Please select a different time."
                : "Η ώρα αυτή δεν είναι πλέον διαθέσιμη. Παρακαλώ επιλέξτε άλλη ώρα."
              setIsLoading(false)
              setConflictMessage(conflictMsg)
              setShowConflictModal(true)
              if (selectedDate) {
                loadAvailableSlots(selectedDate)
              }
              return
            }
          } else {
            if (!availabilityData.isBusinessOpen) {
              const conflictMsg = availabilityData.businessReason || (isEnglish
                ? "The business is closed for this date. Please select a different date."
                : "Το μαγαζί είναι κλειστό για αυτή την ημερομηνία. Παρακαλώ επιλέξτε άλλη ημερομηνία.")
              setIsLoading(false)
              setConflictMessage(conflictMsg)
              setShowConflictModal(true)
              if (selectedDate) {
                loadAvailableSlots(selectedDate)
              }
              return
            }
          }
        }
      } catch (availabilityError) {
        // Silently handle availability check error
      }

      const appointmentData = {
        customerName: customerData.name,
        customerEmail: customerData.email || null,
        customerPhone: customerData.phone || null,
        appointmentDate: localDateStr + "T" + selectedTime + ":00.000+02:00",
        appointmentTime: selectedTime,
        service: selectedServicesLabels.join(", "),
        services: selectedServicesLabels,
        notes: customerData.notes || null,
        employeeNames: selectedEmployee ? [selectedEmployee] : null,
        source: "acronflow-now-website",
      }

      if (process.env.NODE_ENV === 'production' && turnstileToken) {
        const turnstileResponse = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: turnstileToken }),
        })

        const turnstileResult = await turnstileResponse.json()
        if (!turnstileResult.success) {
          setMessage({ type: "error", text: isEnglish ? translations.ui.messages.verificationFailed : "Η επαλήθευση ασφαλείας απέτυχε. Παρακαλώ δοκιμάστε ξανά." })
          setIsLoading(false)
          return
        }
      }

      const response = await fetch(`${LOCAL_API_PATH}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          appointmentData,
        }),
      })

      if (!response.ok) {
        if (response.status === 409) {
          const errorData = await response.json().catch(() => ({}))
          const conflictMsg = errorData.message || (isEnglish ? "This time slot was just booked by another customer. Please select a different time." : "Η ώρα αυτή μόλις κλείστηκε από άλλον πελάτη. Παρακαλώ επιλέξτε άλλη ώρα.")
          setIsLoading(false)
          setConflictMessage(conflictMsg)
          setShowConflictModal(true)
          if (selectedDate) {
            loadAvailableSlots(selectedDate)
          }
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setAppointmentDetails({
          date: selectedDate.toLocaleDateString("el-GR", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          time: selectedTime,
          services: selectedServicesLabels,
          name: customerData.name,
          employee: selectedEmployee || null,
        })

        setShowSuccessModal(true)

        try {
          const emailData = {
            ...appointmentData,
            appointmentId: result.appointmentId
          };

          await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ appointmentData: emailData }),
          });
        } catch (emailError) {
          // Silently handle email error
        }

        setCurrentStep(1)
        setSelectedDate(new Date())
        setSelectedTime("")
        setSelectedService("")
        setSelectedServices([])
        setSelectedEmployee("")
        setAvailableEmployees([])
        setCustomerData({ name: "", email: "", phone: "", notes: "" })
        setAvailableSlots([])
        setBookedSlots([])
        loadAvailableSlots(new Date())
      } else {
        throw new Error(result.message || result.error || (isEnglish ? "Unknown error" : "Άγνωστο σφάλμα"))
      }
    } catch (error) {
      let errorMessage = isEnglish ? "Unknown error" : "Άγνωστο σφάλμα"

      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage = isEnglish ? "CORS Error: The API does not allow requests from this domain." : "Σφάλμα CORS: Το API δεν επιτρέπει αιτήματα από αυτό το domain."
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setMessage({
        type: "error",
        text: isEnglish ? `❌ Error: ${errorMessage}` : `❌ Σφάλμα: ${errorMessage}`,
      })

      if (
        error instanceof Error &&
        (error.message.includes("already booked") || error.message.includes("not available"))
      ) {
        if (selectedDate) {
          setTimeout(() => loadAvailableSlots(selectedDate), 1500)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const selectedServiceData = services.find((s) => s.value === selectedService)

  // Helper function to get translated service data
  const getServiceData = (serviceValue: string) => {
    const service = services.find(s => s.value === serviceValue)
    if (!service) return null

    if (isEnglish && translations.services[serviceValue as keyof typeof translations.services]) {
      const translation = translations.services[serviceValue as keyof typeof translations.services]
      return {
        ...service,
        label: translation.label,
        description: translation.description || service.description
      }
    }
    return service
  }

  const steps = [
    { number: 1, title: isEnglish ? translations.ui.steps.dateEmployee : "Ημερομηνία & Ειδικός", icon: CalendarIcon, completed: selectedEmployee !== "" },
    { number: 2, title: isEnglish ? translations.ui.steps.time : "Ώρα", icon: Clock, completed: selectedTime !== "" },
    { number: 3, title: isEnglish ? translations.ui.steps.services : "Υπηρεσίες", icon: Scissors, completed: selectedServices.length > 0 },
    { number: 4, title: isEnglish ? translations.ui.steps.details : "Στοιχεία", icon: Mail, completed: customerData.name !== "" && customerData.phone !== "" && customerData.email !== "" },
    { number: 5, title: isEnglish ? translations.ui.steps.confirmation : "Επιβεβαίωση", icon: CheckCircle, completed: false }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 scroll-smooth">

        {/* Error Message */}
        {message && message.type === "error" && (
          <div className="relative backdrop-blur-xl bg-red-500/20 border border-red-400/30 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-2xl"></div>
            <div className="relative flex items-center gap-4">
              <div className="p-3 bg-sage-green rounded-full shadow-lg" style={{ backgroundColor: 'hsl(150 20% 45%)' }}>
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-medium text-lg">{message.text}</span>
            </div>
          </div>
        )}


        {/* Steps Indicator */}
        <div className="mb-6 flex justify-center px-2 sm:px-0">
          <div className="steps-indicator relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-2xl shadow-xl p-4 w-full max-w-4xl">
            {/* Mobile: Vertical Layout */}
            <ol className="relative text-gray-500 border-s border-gray-200 dark:border-gray-700 dark:text-gray-400 sm:hidden">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = step.completed
                const isDisabled = step.number > 1 && !steps[step.number - 2].completed

                return (
                  <li key={step.number} className="mb-10 ms-6 last:mb-0">
                    <button
                      onClick={() => !isDisabled && goToStep(step.number)}
                      disabled={isDisabled}
                      className="w-full text-left"
                    >
                      <span className={cn(
                        "absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-white dark:ring-gray-900 transition-all duration-300",
                        isActive ? "bg-sage-green/10 dark:bg-sage-green/20" :
                          isCompleted ? "bg-green-100 dark:bg-green-900/30" :
                            "bg-gray-100 dark:bg-gray-700"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        ) : (
                          <StepIcon className={cn(
                            "w-3.5 h-3.5",
                            isActive ? "text-sage-green dark:text-sage-green" :
                              "text-gray-500 dark:text-gray-400"
                          )} style={{ color: isActive ? 'hsl(150 20% 45%)' : undefined }} />
                        )}
                      </span>
                      <h3 className={cn(
                        "font-medium leading-tight transition-colors duration-300",
                        isActive ? "text-sage-green dark:text-sage-green" :
                          isCompleted ? "text-green-600 dark:text-green-400" :
                            "text-gray-500 dark:text-gray-400"
                      )} style={{ color: isActive ? 'hsl(150 20% 45%)' : undefined }}>
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        {isActive ? (isEnglish ? translations.ui.status.current : "Τρέχον βήμα") : isCompleted ? (isEnglish ? translations.ui.status.completed : "Ολοκληρώθηκε") : (isEnglish ? translations.ui.status.pending : "Σε αναμονή")}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ol>

            {/* Desktop: Horizontal Layout */}
            <ol className="hidden sm:flex items-center w-full space-x-4 text-base font-medium text-center text-gray-500 dark:text-gray-400">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = step.completed
                const isDisabled = step.number > 1 && !steps[step.number - 2].completed

                return (
                  <li key={step.number} className="flex items-center flex-1">
                    <button
                      onClick={() => !isDisabled && goToStep(step.number)}
                      disabled={isDisabled}
                      className={cn(
                        "flex items-center w-full transition-all duration-300",
                        isActive ? "text-amber-600 dark:text-amber-500" :
                          isCompleted ? "text-green-600 dark:text-green-500" :
                            "text-gray-500 dark:text-gray-400",
                        isDisabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center w-6 h-6 me-3 text-xs border rounded-full shrink-0 transition-all duration-300",
                        isActive ? "border-sage-green dark:border-sage-green bg-sage-green/10 dark:bg-sage-green/20" :
                          isCompleted ? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20" :
                            "border-gray-500 dark:border-gray-400"
                      )} style={{
                        borderColor: isActive ? 'hsl(150 20% 45%)' : undefined,
                        backgroundColor: isActive ? 'hsl(150 20% 45% / 0.1)' : undefined
                      }}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          step.number
                        )}
                      </span>
                      <span className="text-sm font-medium">
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <ArrowRight className="w-3 h-3 ml-4 rtl:rotate-180 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="flex gap-8 justify-center items-start w-full">
          {/* Main Content */}
          <div className="flex-1 max-w-6xl">
            <div className="space-y-8 scroll-smooth">

              {/* STEP 1: Category, Calendar & Employee Selection */}
              {currentStep === 1 && (
                <Card className="relative backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-sage-green/20 dark:border-sage-green/30 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-transparent to-copper/5"></div>

                  {/* Header */}
                  <CardHeader className="relative text-center pb-4 pt-8">
                    <CardTitle className="text-3xl font-bold text-slate-800 dark:text-white font-serif">
                      {isEnglish ? "Book Your Appointment" : "Κλείστε το Ραντεβού σας"}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-gray-400 mt-2 text-sm">
                      {isEnglish ? "Choose your preferred category and specialist" : "Επιλέξτε κατηγορία και ειδικό"}
                    </p>
                  </CardHeader>

                  <CardContent className="relative px-4 sm:px-8 pb-8">

                    {/* Category Selector - Hair vs Nails */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-slate-700 dark:text-gray-300 mb-4 text-center font-serif">
                        {isEnglish ? "What would you like?" : "Τι θα θέλατε;"}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                        {/* Hair Category */}
                        <button
                          onClick={() => {
                            setSelectedCategory('hair')
                            setSelectedEmployee('')
                            setSelectedServices([])
                          }}
                          className={cn(
                            "relative group p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                            selectedCategory === 'hair'
                              ? "border-sage-green bg-gradient-to-br from-sage-green/20 to-sage-light/20 shadow-lg shadow-sage-green/20"
                              : "border-sage-green/30 bg-white/50 dark:bg-gray-800/50 hover:border-sage-green/60 hover:shadow-md"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative flex flex-col items-center gap-3">
                            <div className={cn(
                              "p-4 rounded-2xl transition-all duration-300",
                              selectedCategory === 'hair'
                                ? "bg-sage-green text-white shadow-lg"
                                : "bg-sage-green/10 text-sage-green group-hover:bg-sage-green/20"
                            )}>
                              <Scissors className="h-8 w-8" />
                            </div>
                            <div>
                              <h4 className={cn(
                                "font-bold text-lg transition-colors",
                                selectedCategory === 'hair' ? "text-sage-green" : "text-slate-700 dark:text-white"
                              )}>
                                {isEnglish ? "Hair" : "Μαλλιά"}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                                {isEnglish ? "Styling, Coloring, Treatments" : "Κούρεμα, Βαφή, Θεραπείες"}
                              </p>
                            </div>
                            {selectedCategory === 'hair' && (
                              <div className="absolute top-2 right-2 p-1 bg-sage-green rounded-full">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Nails Category */}
                        <button
                          onClick={() => {
                            setSelectedCategory('nails')
                            setSelectedEmployee('')
                            setSelectedServices([])
                          }}
                          className={cn(
                            "relative group p-6 rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                            selectedCategory === 'nails'
                              ? "border-copper bg-gradient-to-br from-copper/20 to-rose-gold/20 shadow-lg shadow-copper/20"
                              : "border-copper/30 bg-white/50 dark:bg-gray-800/50 hover:border-copper/60 hover:shadow-md"
                          )}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-copper/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative flex flex-col items-center gap-3">
                            <div className={cn(
                              "p-4 rounded-2xl transition-all duration-300",
                              selectedCategory === 'nails'
                                ? "bg-copper text-white shadow-lg"
                                : "bg-copper/10 text-copper group-hover:bg-copper/20"
                            )}>
                              <Heart className="h-8 w-8" />
                            </div>
                            <div>
                              <h4 className={cn(
                                "font-bold text-lg transition-colors",
                                selectedCategory === 'nails' ? "text-copper" : "text-slate-700 dark:text-white"
                              )}>
                                {isEnglish ? "Nails & Waxing" : "Νύχια & Αποτρίχωση"}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                                {isEnglish ? "Manicure, Pedicure, Waxing" : "Μανικιούρ, Πεντικιούρ, Αποτρίχωση"}
                              </p>
                            </div>
                            {selectedCategory === 'nails' && (
                              <div className="absolute top-2 right-2 p-1 bg-copper rounded-full">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Calendar & Employee Selection - Show only after category selected */}
                    {selectedCategory && (
                      <div className="rounded-2xl border border-slate-200/50 dark:border-gray-700/50 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm overflow-hidden shadow-lg animate-fade-in">
                        <div className="flex max-sm:flex-col max-sm:space-y-4">
                          {/* Premium Calendar */}
                          <div className="p-4 sm:p-6 sm:pe-8 bg-transparent max-sm:w-full border-r border-slate-200/50 dark:border-gray-700/50">
                            <div className="calendar-modern">
                              {/* Month Navigation Header */}
                              <div className="calendar-modern__header">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newDate = new Date(selectedDate)
                                    newDate.setMonth(newDate.getMonth() - 1)
                                    const today = new Date()
                                    if (newDate.getFullYear() > today.getFullYear() ||
                                      (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() >= today.getMonth())) {
                                      handleDateChange(newDate)
                                    }
                                  }}
                                  className="calendar-modern__nav-btn"
                                  disabled={selectedDate.getMonth() === new Date().getMonth() && selectedDate.getFullYear() === new Date().getFullYear()}
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </button>

                                <div className="calendar-modern__title">
                                  <span className="calendar-modern__month">
                                    {format(selectedDate, "LLLL yyyy", { locale: isEnglish ? undefined : el })}
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const newDate = new Date(selectedDate)
                                    newDate.setMonth(newDate.getMonth() + 1)
                                    handleDateChange(newDate)
                                  }}
                                  className="calendar-modern__nav-btn"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                              </div>

                              <div className="calendar-modern__body">
                                <div className="calendar-modern__days">
                                  {isEnglish ? (
                                    <>
                                      <div>Sun</div>
                                      <div>Mon</div>
                                      <div>Tue</div>
                                      <div>Wed</div>
                                      <div>Thu</div>
                                      <div>Fri</div>
                                      <div>Sat</div>
                                    </>
                                  ) : (
                                    <>
                                      <div>Κυρ</div>
                                      <div>Δευ</div>
                                      <div>Τρι</div>
                                      <div>Τετ</div>
                                      <div>Πεμ</div>
                                      <div>Παρ</div>
                                      <div>Σαβ</div>
                                    </>
                                  )}
                                </div>

                                <div className="calendar-modern__dates">
                                  {(() => {
                                    const year = selectedDate.getFullYear()
                                    const month = selectedDate.getMonth()
                                    const firstDay = new Date(year, month, 1)
                                    const lastDay = new Date(year, month + 1, 0)
                                    const startDate = new Date(firstDay)
                                    const dayOfWeek = firstDay.getDay()
                                    startDate.setDate(startDate.getDate() - dayOfWeek)

                                    const dates = []
                                    for (let i = 0; i < 42; i++) {
                                      const date = new Date(startDate)
                                      date.setDate(startDate.getDate() + i)
                                      dates.push(date)
                                    }

                                    return dates.map((date, index) => {
                                      const isCurrentMonth = date.getMonth() === month
                                      const isToday = date.toDateString() === new Date().toDateString()
                                      const isSelected = selectedDate.toDateString() === date.toDateString()
                                      const isDisabled = isDateDisabled(date)
                                      const isClosed = closedDates.some(closedDate => {
                                        const dateStr = date.toISOString().split('T')[0]
                                        const closedDateStr = closedDate.toISOString().split('T')[0]
                                        return dateStr === closedDateStr
                                      })

                                      return (
                                        <div
                                          key={index}
                                          className={`calendar-modern__date ${!isCurrentMonth ? 'calendar-modern__date--other' : ''
                                            } ${isToday && !isSelected ? 'calendar-modern__date--today' : ''
                                            } ${isSelected ? 'calendar-modern__date--selected' : ''
                                            } ${isDisabled ? 'calendar-modern__date--disabled' : ''
                                            } ${isClosed ? 'calendar-modern__date--closed' : ''
                                            }`}
                                          onClick={() => !isDisabled && !isClosed && handleDateChange(date)}
                                          title={isClosed ? (isEnglish ? 'Closed' : 'Κλειστά') : isToday ? (isEnglish ? 'Today' : 'Σήμερα') : ''}
                                        >
                                          <span>{date.getDate()}</span>
                                          {isClosed && (
                                            <Lock className="calendar-modern__lock" />
                                          )}
                                        </div>
                                      )
                                    })
                                  })()}
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Employee Selection */}
                          <div className="flex-1 min-w-0 sm:min-w-[280px]">
                            <div className="py-4 px-4 h-full">
                              <div className="space-y-4">
                                {/* Selected Date Header */}
                                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sage-green/10 to-sage-light/5 rounded-xl border border-sage-green/20">
                                  <div className="p-2 bg-sage-green/20 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-sage-green" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-sage-green font-medium uppercase tracking-wide">
                                      {isEnglish ? "Selected Date" : "Επιλεγμένη Ημέρα"}
                                    </p>
                                    <p className="text-base font-bold text-slate-800 dark:text-white">
                                      {format(selectedDate, "EEEE, d MMMM", { locale: el })}
                                    </p>
                                  </div>
                                </div>

                                {/* Employee List Title */}
                                <div className="px-1">
                                  <h4 className="text-sm font-semibold text-slate-600 dark:text-gray-400 uppercase tracking-wide">
                                    {isEnglish ? "Choose Specialist" : "Επιλέξτε Ειδικό"}
                                  </h4>
                                </div>

                                {/* Business Closed Message */}
                                {!isBusinessOpen ? (
                                  <div className="px-5">
                                    <div className="backdrop-blur-lg bg-red-500/20 dark:bg-red-500/30 border border-red-400/30 dark:border-red-400/50 rounded-xl p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Lock className="h-5 w-5 text-red-600" />
                                        <p className="font-bold text-red-700 dark:text-red-400">{isEnglish ? translations.ui.messages.closed : "Κλειστά"}</p>
                                      </div>
                                      {businessReason && (
                                        <p className="text-xs text-red-600 dark:text-red-400">{businessReason}</p>
                                      )}
                                    </div>
                                  </div>
                                ) : isLoadingSlots ? (
                                  <div className="px-5 text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-sage-green/20 border-t-sage-green mx-auto mb-3"></div>
                                    <p className="text-xs text-slate-600 dark:text-gray-400">{isEnglish ? translations.ui.messages.loading : "Φόρτωση..."}</p>
                                  </div>
                                ) : allEmployees.length === 0 ? (
                                  <div className="px-5">
                                    <div className="backdrop-blur-lg bg-sage-green/10 dark:bg-sage-green/20 border border-sage-green/30 dark:border-sage-green/50 rounded-xl p-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="h-5 w-5 text-sage-green" />
                                        <p className="font-bold text-sage-green dark:text-sage-green/80">{isEnglish ? translations.ui.messages.unavailable : "Μη διαθέσιμο"}</p>
                                      </div>
                                      <p className="text-xs text-sage-green dark:text-sage-green/80">{isEnglish ? translations.ui.messages.noEmployees : "Δεν υπάρχουν διαθέσιμοι ειδικοί για αυτή την ημερομηνία"}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-3 px-4">
                                    {allEmployees
                                      .filter((employee) => {
                                        // Filter employees based on selected category
                                        const empData = employeeData[employee] || {}
                                        const specialty = (empData.specialty || '').toLowerCase()

                                        if (selectedCategory === 'hair') {
                                          return specialty.includes('hair') || specialty.includes('κομμ') || specialty === 'hairdresser'
                                        } else if (selectedCategory === 'nails') {
                                          return specialty.includes('nail') || specialty.includes('νύχι') || specialty === 'nail artist'
                                        }
                                        return true
                                      })
                                      .map((employee) => {
                                        const empData = employeeData[employee] || {}
                                        const rating = empData.rating || 5.0
                                        const specialty = empData.specialty || ''
                                        const avatar = empData.avatar || ''
                                        const isSelected = selectedEmployee === employee

                                        return (
                                          <div
                                            key={`employee-${employee}`}
                                            onClick={() => handleEmployeeSelection(employee)}
                                            className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                                          >
                                            <div className={cn(
                                              "relative rounded-2xl p-4 transition-all duration-300 border-2",
                                              isSelected
                                                ? "bg-gradient-to-r from-sage-green to-sage-light border-sage-green shadow-lg shadow-sage-green/20"
                                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-sage-lite dark:hover:border-sage-green/50 hover:shadow-md"
                                            )}>

                                              {/* Employee Info */}
                                              <div className="flex items-center gap-4">
                                                {/* Avatar */}
                                                <div className="relative flex-shrink-0">
                                                  <div className={cn(
                                                    "rounded-full p-[3px]",
                                                    isSelected
                                                      ? "bg-white/30"
                                                      : "bg-gradient-to-br from-sage-green to-sage-light"
                                                  )}>
                                                    {avatar ? (
                                                      <img
                                                        src={avatar}
                                                        alt={employee}
                                                        className="w-12 h-12 rounded-full object-cover bg-white"
                                                      />
                                                    ) : (
                                                      <div className={cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center",
                                                        isSelected
                                                          ? "bg-white/20"
                                                          : "bg-sage-green/10"
                                                      )}>
                                                        <User className={cn(
                                                          "h-6 w-6",
                                                          isSelected ? "text-white" : "text-sage-green"
                                                        )} />
                                                      </div>
                                                    )}
                                                  </div>

                                                  {/* Rating Badge */}
                                                  <div className={cn(
                                                    "absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-xs font-bold shadow-md",
                                                    isSelected
                                                      ? "bg-white text-sage-green"
                                                      : "bg-sage-green text-white"
                                                  )}>
                                                    <Star className="w-3 h-3 fill-current" />
                                                    <span>{rating.toFixed(1)}</span>
                                                  </div>
                                                </div>

                                                {/* Name & Specialty */}
                                                <div className="flex-1 min-w-0">
                                                  <h3 className={cn(
                                                    "font-bold text-base mb-0.5",
                                                    isSelected ? "text-white" : "text-gray-900 dark:text-white"
                                                  )}>
                                                    {employee}
                                                  </h3>

                                                  {specialty && (
                                                    <div className="flex items-center gap-1.5">
                                                      <Scissors className={cn(
                                                        "w-3.5 h-3.5",
                                                        isSelected ? "text-white/80" : "text-sage-green dark:text-sage-light"
                                                      )} />
                                                      <span className={cn(
                                                        "text-sm font-medium",
                                                        isSelected ? "text-white/90" : "text-gray-600 dark:text-gray-400"
                                                      )}>
                                                        {specialty}
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>

                                                {/* Checkmark */}
                                                <div className="flex-shrink-0">
                                                  <div className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all",
                                                    isSelected
                                                      ? "bg-white border-white"
                                                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                                  )}>
                                                    {isSelected && (
                                                      <CheckCircle className="w-5 h-5 text-amber-500" />
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* STEP 2: Time Selection */}
              {currentStep === 2 && selectedEmployee && (
                <div className="mb-8">
                  <Card className="relative backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-sage-green/20 dark:border-sage-green/30 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-transparent to-copper/5"></div>
                    <CardHeader className="relative pb-6 pt-8 text-center">
                      <CardTitle className="text-2xl font-bold flex items-center justify-center gap-4 text-slate-800 dark:text-white font-serif">
                        <div className="p-3 bg-gradient-to-r from-sage-green to-sage-light rounded-xl shadow-lg">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        {isEnglish ? translations.ui.labels.selectTime : "Επιλογή Ώρας"}
                      </CardTitle>
                      <p className="text-slate-600 dark:text-gray-300 font-medium mt-2">
                        {isEnglish ? `${translations.ui.labels.selectTimeFor} ${selectedEmployee}` : `Επιλέξτε ώρα για ${selectedEmployee}`}
                      </p>
                    </CardHeader>
                    <CardContent className="relative p-6">
                      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        {(() => {
                          // Get all available times first
                          const allAvailableTimes = availableSlots.map(slot => slot.time);
                          const uniqueTimes = [...new Set(allAvailableTimes)].sort();

                          return uniqueTimes.map((time) => {
                            const slot = availableSlots.find(s => s.time === time);
                            const isPastTimeSlot = isPastTime(time, selectedDate);

                            // Check if this specific employee is available for this time
                            let isEmployeeAvailable = true;

                            if (slot && slot.employeeNames && slot.employeeNames.length > 0) {
                              // If slot has specific employees, check if our selected employee is one of them
                              if (!slot.employeeNames.includes(selectedEmployee)) {
                                isEmployeeAvailable = false;
                              } else {
                                // Check if this specific employee is booked for this time
                                const isEmployeeBooked = (slot as any).bookedEmployees &&
                                  (slot as any).bookedEmployees.includes(selectedEmployee);
                                isEmployeeAvailable = !isEmployeeBooked;
                              }
                            }
                            // If no employee names specified, slot is available for all employees

                            const isAvailable = !isPastTimeSlot && isEmployeeAvailable;
                            const isSelected = selectedTime === time;

                            return (
                              <button
                                key={`time-${time}`}
                                type="button"
                                onClick={() => isAvailable && handleTimeSelection(time)}
                                disabled={!isAvailable}
                                className={cn(
                                  "group relative h-14 rounded-2xl font-bold text-base transition-all duration-300 overflow-hidden",
                                  isSelected
                                    ? "scale-105 z-10"
                                    : "hover:-translate-y-1 hover:scale-102",
                                  !isAvailable && "opacity-35 cursor-not-allowed hover:translate-y-0 hover:scale-100"
                                )}
                              >
                                {/* Background */}
                                <div className={cn(
                                  "absolute inset-0 rounded-2xl transition-all duration-300",
                                  isSelected
                                    ? "bg-gradient-to-br from-sage-green via-sage-green to-sage-light shadow-lg shadow-sage-green/40"
                                    : "bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border border-sage-green/20 dark:border-gray-600/60 group-hover:border-sage-green/50 dark:group-hover:border-sage-green/60 group-hover:shadow-lg group-hover:shadow-sage-green/10"
                                )} />

                                {/* Shine effect for selected */}
                                {isSelected && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                )}

                                {/* Content */}
                                <div className={cn(
                                  "relative flex items-center justify-center gap-2 h-full px-4",
                                  isSelected ? "text-white" : "text-gray-700 dark:text-gray-200"
                                )}>
                                  <Clock className={cn(
                                    "w-4 h-4 transition-colors duration-300",
                                    isSelected ? "text-white/90" : "text-sage-green dark:text-sage-light"
                                  )} />
                                  <span className={cn(
                                    "font-bold tracking-wide",
                                    isSelected && "drop-shadow-sm"
                                  )}>{time}</span>
                                </div>

                                {/* Bottom accent for selected */}
                                {isSelected && (
                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/50 rounded-full" />
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>

                      {selectedTime && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-sage-green/10 to-sage-light/10 border border-sage-green/30 rounded-xl">
                          <p className="text-sage-green dark:text-sage-light font-semibold flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            {isEnglish ? `Selected: ${selectedTime}` : `Επιλέχθηκε: ${selectedTime}`}
                          </p>
                        </div>
                      )}

                      {/* Navigation buttons */}
                      <div className="mt-6 flex gap-4">
                        <Button
                          onClick={() => goToStep(1)}
                          variant="outline"
                          className="flex-1 border-sage-green/30 text-sage-green hover:bg-sage-green/10 font-bold py-3 rounded-xl"
                        >
                          {isEnglish ? translations.ui.buttons.back : "Πίσω"}
                        </Button>
                        {selectedTime && (
                          <Button
                            onClick={() => goToStep(3)}
                            className="flex-1 bg-gradient-to-r from-sage-green to-sage-light hover:from-sage-green/90 hover:to-sage-light/90 text-white font-bold py-3 rounded-xl"
                          >
                            {isEnglish ? translations.ui.buttons.continue : "Συνέχεια"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* STEP 3: Services Selection */}
              {currentStep === 3 && (
                <Card className="relative backdrop-blur-xl bg-white/20 dark:bg-gray-800/20 border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden group hover:bg-white/25 dark:hover:bg-gray-800/25 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-sage-green/10 to-copper/5"></div>
                  <CardHeader className="relative pb-6 sm:pb-8">
                    <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3 sm:gap-4 text-slate-800 dark:text-white font-serif">
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-sage-green to-sage-light rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, hsl(150 20% 45%), hsl(150 15% 70%))' }}>
                        <Scissors className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                      </div>
                      {isEnglish ? translations.ui.labels.selectService : "Επιλέξτε υπηρεσία"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative p-4 sm:p-6 lg:p-8">
                    {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {services
                        .filter(service => {
                          if (!selectedEmployee) return true;
                          const empSpecialty = (employeeData[selectedEmployee]?.specialty || '').toLowerCase();

                          // If employee is Hairdresser, show only hair services
                          if (empSpecialty.includes('hair') || empSpecialty.includes('κομμ')) {
                            return service.category === 'hair';
                          }
                          // If employee is Nail Artist, show nails and waxing
                          if (empSpecialty.includes('nail') || empSpecialty.includes('νύχια')) {
                            return service.category === 'nails' || service.category === 'waxing';
                          }
                          return true;
                        })
                        .map((service) => {
                          const IconComponent = service.icon
                          const isSelected = selectedServices.includes(service.value)

                          return (
                            <div
                              key={service.value}
                              onClick={() => handleServiceSelection(service.value)}
                              className={cn(
                                "relative cursor-pointer group transition-all duration-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 backdrop-blur-xl overflow-hidden",
                                "hover:shadow-xl hover:scale-[1.02] transform",
                                isSelected
                                  ? "bg-gradient-to-br from-sage-green/10 to-sage-light/10 border-sage-green shadow-xl scale-[1.02] ring-2 ring-sage-green/40"
                                  : "bg-white/40 dark:bg-gray-800/40 border-white/50 dark:border-gray-600/50 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:border-sage-green/40 hover:shadow-lg"
                              )}
                            >
                              {/* Professional gradient background */}
                              <div className={cn(
                                "absolute inset-0 transition-all duration-300",
                                isSelected ? "opacity-15" : "opacity-5 group-hover:opacity-10"
                              )}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl sm:rounded-3xl`}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl sm:rounded-3xl"></div>
                              </div>

                              {/* Selection indicator - more subtle */}
                              {isSelected && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/90 z-30">
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                              )}

                              {/* Service category badge - more compact */}
                              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border",
                                  service.category === "hair" ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-300/30" :
                                    service.category === "beard" ? "bg-green-500/20 text-green-700 dark:text-green-300 border-green-300/30" :
                                      service.category === "grooming" ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-300/30" :
                                        "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-300/30"
                                )}>
                                  {service.category === "hair" ? "Μαλλιά" :
                                    service.category === "beard" ? "Μούσι" :
                                      service.category === "grooming" ? "Καθαρισμός" : "Θεραπεία"}
                                </span>
                              </div>

                              <div className="relative z-10">
                                {/* Icon with professional styling */}
                                <div className="flex items-center justify-center mb-3 sm:mb-4">
                                  <div
                                    className={cn(
                                      "p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg",
                                      isSelected
                                        ? `bg-gradient-to-r ${service.gradient} ring-2 ring-white/50 shadow-xl`
                                        : "bg-white/60 dark:bg-gray-700/60 group-hover:bg-white/80 dark:group-hover:bg-gray-600/80 group-hover:shadow-lg"
                                    )}
                                  >
                                    <div className={cn(
                                      "h-8 w-8 sm:h-10 sm:w-10 transition-all duration-300 flex items-center justify-center",
                                      isSelected ? "drop-shadow-md" : ""
                                    )}>
                                      <IconComponent />
                                    </div>
                                  </div>
                                </div>

                                {/* Service details - more compact */}
                                <div className="text-center space-y-2 sm:space-y-3">
                                  <h3 className={cn(
                                    "font-bold text-lg sm:text-xl transition-colors duration-300 leading-tight",
                                    isSelected ? "text-slate-800 dark:text-white" : "text-slate-700 dark:text-white/90"
                                  )}>
                                    {getServiceData(service.value)?.label || service.label}
                                  </h3>

                                  {(getServiceData(service.value)?.description || service.description) && (
                                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium leading-relaxed line-clamp-2">
                                      {getServiceData(service.value)?.description || service.description}
                                    </p>
                                  )}

                                  {/* Price and duration - more professional layout */}
                                  <div className="flex items-center justify-between pt-2 border-t border-white/30 dark:border-gray-600/30">
                                    <div className="text-left">
                                      <div className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">
                                        {isEnglish ? "Duration" : "Διάρκεια"}
                                      </div>
                                      <div className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                                        {service.duration} λεπτά
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-slate-500 dark:text-gray-400 font-medium mb-1">
                                        {isEnglish ? "Price" : "Τιμή"}
                                      </div>
                                      <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sage-green to-sage-light bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, hsl(150 20% 45%), hsl(150 15% 70%))' }}>
                                        {service.price} €
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Professional hover effect */}
                              <div className="absolute inset-0 bg-gradient-to-t from-sage-green/0 to-sage-green/0 group-hover:from-sage-green/5 group-hover:to-sage-green/10 rounded-2xl sm:rounded-3xl transition-all duration-300"></div>
                            </div>
                          )
                        })}
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-sage-green/10 via-sage-light/10 to-sage-green/5 dark:from-sage-green/20 dark:via-sage-light/20 dark:to-sage-green/10 rounded-2xl border border-sage-green/30 dark:border-sage-green/50 shadow-lg backdrop-blur-lg">
                        <div className="mb-4">
                          <p className="font-bold text-slate-800 dark:text-white text-base sm:text-lg mb-3 flex items-center gap-2 font-serif">
                            <CheckCircle className="h-5 w-5 text-sage-green" />
                            {isEnglish ? `${translations.ui.labels.selectedServices} (${selectedServices.length})` : `Επιλεγμένες υπηρεσίες (${selectedServices.length})`}
                          </p>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          {selectedServices.map((serviceValue) => {
                            const serviceData = getServiceData(serviceValue)
                            if (!serviceData) return null

                            return (
                              <div key={serviceValue} className="flex items-center justify-between p-3 sm:p-4 bg-white/40 dark:bg-gray-700/40 rounded-xl border border-white/20 dark:border-gray-600/20">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className={`p-2 rounded-lg bg-gradient-to-r ${serviceData.gradient} shadow-md flex-shrink-0`}>
                                    <div className="h-5 w-5">
                                      {typeof serviceData.icon === 'function' ? <serviceData.icon /> : null}
                                    </div>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm sm:text-base truncate">{serviceData.label}</p>
                                    {serviceData.description && (
                                      <p className="text-xs text-slate-600 dark:text-gray-300 truncate">{serviceData.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3">
                                  <div className="text-base sm:text-lg font-bold text-sage-green dark:text-sage-light">
                                    {serviceData.price} €
                                  </div>
                                  <div className="text-xs text-slate-600 dark:text-gray-300">
                                    {serviceData.duration} λεπτά
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-4 pt-4 border-t border-sage-green/20 dark:border-gray-600/30">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800 dark:text-white text-base sm:text-lg">{isEnglish ? translations.ui.labels.total : "Σύνολο"}:</span>
                            <span className="text-xl sm:text-2xl font-bold text-sage-green dark:text-sage-green">
                              {selectedServices.reduce((total, serviceValue) => {
                                const service = services.find(s => s.value === serviceValue)
                                return total + (service?.price || 0)
                              }, 0)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <Button
                        onClick={() => goToStep(1)}
                        className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isEnglish ? translations.ui.buttons.back : "Πίσω"}
                      </Button>
                      {selectedServices.length > 0 && (
                        <Button
                          onClick={() => goToStep(4)}
                          className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-sage-green to-sage-light hover:brightness-110 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isEnglish ? translations.ui.buttons.continue : "Συνέχεια"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* STEP 4: Customer Details */}
              {currentStep === 4 && (
                <Card className="relative backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-sage-green/20 dark:border-sage-green/30 rounded-3xl shadow-2xl overflow-hidden group hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-transparent to-copper/5"></div>
                  <CardHeader className="relative pb-8 pt-8">
                    <CardTitle className="text-3xl font-bold flex items-center gap-4 text-slate-800 dark:text-white font-serif">
                      <div className="p-4 bg-gradient-to-r from-sage-green to-sage-light rounded-2xl shadow-xl">
                        <User className="h-7 w-7 text-white" />
                      </div>
                      {isEnglish ? translations.ui.labels.customerDetails : "Στοιχεία Πελάτη"}
                    </CardTitle>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">{isEnglish ? translations.ui.labels.requiredFields : "Τα πεδία είναι υποχρεωτικά"}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="relative p-4 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                      <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                          <Label htmlFor="name" className="text-lg font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {isEnglish ? translations.ui.labels.fullName : "Πλήρες Όνομα"}
                            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                          </Label>
                          <Input
                            id="name"
                            type="text"
                            value={customerData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData((prev) => ({ ...prev, name: e.target.value }))}
                            className="h-12 sm:h-14 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-2 border-sage-green/10 dark:border-gray-600/40 rounded-2xl focus:ring-4 focus:ring-sage-green/30 focus:border-sage-green/50 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 text-base sm:text-lg font-medium shadow-lg"
                            placeholder={isEnglish ? translations.ui.placeholders.fullName : "Εισάγετε το πλήρες όνομά σας"}
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-lg font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            {isEnglish ? translations.ui.labels.phone : "Τηλέφωνο"}
                            <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={customerData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData((prev) => ({ ...prev, phone: e.target.value }))}
                            className="h-12 sm:h-14 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-2 border-sage-green/10 dark:border-gray-600/40 rounded-2xl focus:ring-4 focus:ring-sage-green/30 focus:border-sage-green/50 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 text-base sm:text-lg font-medium shadow-lg"
                            placeholder="6987654321"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-lg font-bold text-slate-700 dark:text-gray-300 flex items-center gap-2">
                          <Mail className="h-5 w-5" />
                          {isEnglish ? translations.ui.labels.email : "Email"}
                          <div className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerData((prev) => ({ ...prev, email: e.target.value }))}
                          className="h-12 sm:h-14 backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-2 border-sage-green/10 dark:border-gray-600/40 rounded-2xl focus:ring-4 focus:ring-sage-green/30 focus:border-sage-green/50 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 text-base sm:text-lg font-medium shadow-lg"
                          placeholder="example@email.com"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="notes" className="text-lg font-bold text-slate-700 dark:text-gray-300">
                          {isEnglish ? translations.ui.labels.notes : "Σημειώσεις"}
                        </Label>
                        <Textarea
                          id="notes"
                          value={customerData.notes}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomerData((prev) => ({ ...prev, notes: e.target.value }))}
                          className="min-h-[100px] sm:min-h-[120px] backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 border-2 border-sage-green/10 dark:border-gray-600/40 rounded-2xl focus:ring-4 focus:ring-sage-green/30 focus:border-sage-green/50 text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-gray-400 text-base sm:text-lg font-medium shadow-lg resize-none"
                          placeholder={isEnglish ? translations.ui.placeholders.notes : "Επιπλέον πληροφορίες ή ειδικές απαιτήσεις..."}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          type="button"
                          onClick={() => goToStep(3)}
                          className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-slate-400 to-gray-500 hover:brightness-110 text-white font-bold rounded-2xl text-base sm:text-lg transition-all"
                        >
                          {isEnglish ? translations.ui.buttons.back : "Πίσω"}
                        </Button>

                        <Button
                          type="button"
                          onClick={() => goToStep(5)}
                          disabled={!selectedDate || !selectedTime || !customerData.name || !customerData.phone || !customerData.email}
                          className="flex-1 sm:flex-[2] h-14 sm:h-16 bg-gradient-to-r from-sage-green to-sage-light hover:brightness-110 text-white text-lg sm:text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                          <div className="flex items-center gap-4 justify-center">
                            <CheckCircle className="h-6 w-6" />
                            {isEnglish ? translations.ui.labels.confirmation : "Επιβεβαίωση"}
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* STEP 5: Summary & Confirmation */}
              {currentStep === 5 && (
                <Card className="relative backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-sage-green/20 dark:border-sage-green/30 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-transparent to-copper/5"></div>
                  <CardHeader className="relative pb-8 pt-8 text-center">
                    <CardTitle className="text-3xl font-bold flex items-center justify-center gap-4 text-slate-800 dark:text-white font-serif">
                      <div className="p-4 bg-gradient-to-r from-sage-green to-sage-light rounded-2xl shadow-xl">
                        <CheckCircle className="h-7 w-7 text-white" />
                      </div>
                      {isEnglish ? translations.ui.labels.confirmationTitle : "Επιβεβαίωση Κράτησης"}
                    </CardTitle>
                    <p className="text-slate-600 dark:text-gray-300 font-medium">
                      {isEnglish ? translations.ui.labels.confirmationSubtitle : "Ελέγξτε τα στοιχεία της κράτησής σας πριν την ολοκλήρωση"}
                    </p>
                  </CardHeader>
                  <CardContent className="relative p-6 sm:p-8">
                    {/* Summary Section */}
                    <div className="space-y-4">

                      {/* Date & Time Card */}
                      <div className="relative overflow-hidden rounded-2xl border border-sage-green/30 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sage-green to-sage-light"></div>
                        <div className="p-5 pl-6">
                          <h3 className="text-sm font-bold text-sage-green uppercase tracking-wider mb-3 flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            {isEnglish ? translations.ui.labels.dateTime : "Ημερομηνία & Ώρα"}
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isEnglish ? translations.ui.labels.date : "Ημερομηνία"}</p>
                              <p className="font-bold text-gray-900 dark:text-white">
                                {selectedDate.toLocaleDateString(isEnglish ? 'en-US' : 'el-GR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isEnglish ? translations.ui.labels.time : "Ώρα"}</p>
                              <p className="font-bold text-gray-900 dark:text-white text-xl">{selectedTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Employee Card */}
                      {selectedEmployee && (
                        <div className="relative overflow-hidden rounded-2xl border border-sage-green/30 bg-white dark:bg-gray-800 shadow-sm">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sage-green to-sage-light"></div>
                          <div className="p-5 pl-6">
                            <h3 className="text-sm font-bold text-sage-green uppercase tracking-wider mb-3 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {isEnglish ? translations.ui.labels.employee : "Ειδικός"}
                            </h3>
                            <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedEmployee}</p>
                          </div>
                        </div>
                      )}

                      {/* Services Card */}
                      <div className="relative overflow-hidden rounded-2xl border border-sage-green/30 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sage-green to-sage-light"></div>
                        <div className="p-5 pl-6">
                          <h3 className="text-sm font-bold text-sage-green uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Scissors className="h-4 w-4" />
                            {isEnglish ? `${translations.ui.labels.services} (${selectedServices.length})` : `Υπηρεσίες (${selectedServices.length})`}
                          </h3>
                          <div className="space-y-3">
                            {selectedServices.map((serviceValue) => {
                              const serviceData = getServiceData(serviceValue)
                              if (!serviceData) return null

                              return (
                                <div key={serviceValue} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-r from-sage-green to-sage-light shadow-sm">
                                      <div className="h-4 w-4">
                                        {typeof serviceData.icon === 'function' ? <serviceData.icon /> : null}
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-bold text-gray-900 dark:text-white">{serviceData.label}</p>
                                      {serviceData.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{serviceData.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-sage-green">{serviceData.price} €</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{serviceData.duration} {isEnglish ? translations.ui.messages.minutes : "λεπτά"}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-700 dark:text-gray-300">{isEnglish ? translations.ui.labels.total : "Σύνολο"}:</span>
                              <span className="text-2xl font-black text-sage-green">
                                {selectedServices.reduce((total, serviceValue) => {
                                  const service = services.find(s => s.value === serviceValue)
                                  return total + (service?.price || 0)
                                }, 0)} €
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details Card */}
                      <div className="relative overflow-hidden rounded-2xl border border-sage-green/30 bg-white dark:bg-gray-800 shadow-sm">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sage-green to-sage-light"></div>
                        <div className="p-5 pl-6">
                          <h3 className="text-sm font-bold text-sage-green uppercase tracking-wider mb-3 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {isEnglish ? translations.ui.labels.customerDetails : "Στοιχεία Πελάτη"}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {isEnglish ? translations.ui.labels.fullName : "Ονοματεπώνυμο"}
                              </p>
                              <p className="font-bold text-gray-900 dark:text-white">{customerData.name}</p>
                            </div>
                            {customerData.phone && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {isEnglish ? translations.ui.labels.phone : "Τηλέφωνο"}
                                </p>
                                <p className="font-bold text-gray-900 dark:text-white">{customerData.phone}</p>
                              </div>
                            )}
                            {customerData.email && (
                              <div className="sm:col-span-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {isEnglish ? translations.ui.labels.email : "Email"}
                                </p>
                                <p className="font-bold text-gray-900 dark:text-white">{customerData.email}</p>
                              </div>
                            )}
                            {customerData.notes && (
                              <div className="sm:col-span-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{isEnglish ? translations.ui.labels.notes : "Σημειώσεις"}</p>
                                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">{customerData.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms of Service Checkbox */}
                    <div className="mt-6 relative overflow-hidden rounded-2xl border border-sage-green/30 bg-white dark:bg-gray-800 shadow-sm">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sage-green to-sage-light"></div>
                      <div className="p-5 pl-6">
                        <div className="flex items-start gap-4">
                          <div className="flex items-center pt-0.5">
                            <input
                              type="checkbox"
                              id="termsAccepted"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="w-5 h-5 text-sage-green bg-white dark:bg-gray-700 border-2 border-sage-green/50 rounded-md focus:ring-sage-green focus:ring-2 cursor-pointer accent-sage-green"
                            />
                          </div>
                          <div className="flex-1">
                            <label htmlFor="termsAccepted" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed">
                              {isEnglish ? (
                                <>
                                  I have read and accept the{" "}
                                  <a
                                    href="/en/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sage-green hover:text-sage-green/80 underline font-bold transition-colors"
                                  >
                                    Terms of Service
                                  </a>
                                  {" "}and{" "}
                                  <a
                                    href="/en/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sage-green hover:text-sage-green/80 underline font-bold transition-colors"
                                  >
                                    Privacy Policy
                                  </a>
                                </>
                              ) : (
                                <>
                                  Έχω διαβάσει και αποδέχομαι τους{" "}
                                  <a
                                    href="/terms"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sage-green hover:text-sage-green/80 underline font-bold transition-colors"
                                  >
                                    Όρους Χρήσης
                                  </a>
                                  {" "}και την{" "}
                                  <a
                                    href="/privacy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sage-green hover:text-sage-green/80 underline font-bold transition-colors"
                                  >
                                    Πολιτική Απορρήτου
                                  </a>
                                </>
                              )}
                            </label>
                            {!termsAccepted && (
                              <p className="text-red-500 dark:text-red-400 text-xs mt-2 font-semibold flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-red-500"></span>
                                {isEnglish ? "You must accept the terms to continue" : "Πρέπει να αποδεχτείτε τους όρους για να συνεχίσετε"}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cloudflare Turnstile - Only show in production */}
                    {process.env.NODE_ENV === 'production' && (
                      <div className="mt-6 flex justify-center">
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center gap-2">
                              <Shield className="h-5 w-5 text-blue-600" />
                              {isEnglish ? translations.ui.labels.securityVerification : "Επαλήθευση Ασφαλείας"}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-gray-400">
                              {isEnglish ? translations.ui.labels.completeVerification : "Παρακαλώ ολοκληρώστε την επαλήθευση για να προχωρήσετε"}
                            </p>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={resetAllSelections}
                        className="flex-1 h-14 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <X className="h-5 w-5 mr-2" />
                        {isEnglish ? translations.ui.buttons.editAll : "Επαναφορά Όλων"}
                      </Button>

                      <Button
                        onClick={() => goToStep(4)}
                        className="flex-1 h-14 bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white font-bold rounded-2xl"
                      >
                        {isEnglish ? translations.ui.buttons.edit : "Επεξεργασία"}
                      </Button>

                      <Button
                        onClick={handleSubmit}
                        disabled={isLoading || (process.env.NODE_ENV === 'production' && !isTurnstileVerified) || !termsAccepted}
                        className="flex-1 sm:flex-[2] h-16 bg-gradient-to-r from-sage-green to-sage-light hover:brightness-110 text-white text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        {isLoading ? (
                          <div className="flex items-center gap-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white"></div>
                            {isEnglish ? translations.ui.buttons.processing : "Επεξεργασία..."}
                          </div>
                        ) : process.env.NODE_ENV === 'production' && !isTurnstileVerified ? (
                          <div className="flex items-center gap-4">
                            <Shield className="h-6 w-6" />
                            {isEnglish ? translations.ui.buttons.completeVerification : "Ολοκληρώστε την Επαλήθευση"}
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <CheckCircle className="h-6 w-6" />
                            {isEnglish ? translations.ui.buttons.bookAppointment : "Κλείσιμο Ραντεβού"}
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>

          {/* Right Sidebar - Summary */}
          {selectedTime && (
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <Card className="relative backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-sage-green/20 dark:border-sage-green/30 rounded-3xl shadow-2xl overflow-hidden sticky top-8">
                <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-transparent to-copper/5"></div>
                <CardHeader className="relative pb-4 pt-6">
                  <CardTitle className="text-xl font-bold flex items-center justify-center gap-3 text-slate-800 dark:text-white font-serif">
                    <div className="p-2 bg-gradient-to-r from-sage-green to-sage-light rounded-xl shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    {isEnglish ? translations.ui.labels.bookingSummary : "Περίληψη Κράτησης"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 border border-sage-green/10 rounded-xl">
                      <CalendarIcon className="h-4 w-4 text-sage-green" />
                      <div>
                        <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">{isEnglish ? translations.ui.labels.date : "Ημερομηνία"}</p>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{selectedDate.toLocaleDateString(isEnglish ? 'en-US' : 'el-GR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 border border-sage-green/10 rounded-xl">
                      <Clock className="h-4 w-4 text-sage-green" />
                      <div>
                        <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">{isEnglish ? translations.ui.labels.time : "Ώρα"}</p>
                        <p className="font-bold text-slate-800 dark:text-white text-sm">{selectedTime || "-"}</p>
                      </div>
                    </div>
                    {selectedEmployee && (
                      <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 border border-sage-green/10 rounded-xl">
                        <User className="h-4 w-4 text-sage-green" />
                        <div>
                          <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">{isEnglish ? translations.ui.labels.employee : "Ειδικός"}</p>
                          <p className="font-bold text-slate-800 dark:text-white text-sm">{selectedEmployee}</p>
                        </div>
                      </div>
                    )}
                    {selectedServices.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">{isEnglish ? `${translations.ui.labels.services} (${selectedServices.length})` : `Υπηρεσίες (${selectedServices.length})`}</p>
                        {selectedServices.map((serviceValue) => {
                          const serviceData = getServiceData(serviceValue)
                          if (!serviceData) return null

                          return (
                            <div key={serviceValue} className="flex items-center gap-3 p-2 bg-white/60 dark:bg-gray-800/60 border border-sage-green/5 rounded-lg">
                              <div className="h-4 w-4 text-sage-green">
                                {typeof serviceData.icon === 'function' ? <serviceData.icon /> : null}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-slate-800 dark:text-white text-sm">{serviceData.label}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-sage-green">{serviceData.price} €</p>
                              </div>
                            </div>
                          )
                        })}
                        <div className="pt-2 border-t border-sage-green/20">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-800 dark:text-white">{isEnglish ? translations.ui.labels.total : "Σύνολο"}:</span>
                            <span className="text-lg font-bold text-sage-green">
                              {selectedServices.reduce((total, serviceValue) => {
                                const service = services.find(s => s.value === serviceValue)
                                return total + (service?.price || 0)
                              }, 0)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Conflict Modal */}
      {showConflictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-xs w-full mx-auto">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 rounded-xl blur-xl opacity-75 animate-pulse"></div>

            <div className="relative backdrop-blur-xl bg-white/95 rounded-xl p-4 shadow-2xl border border-white/20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-orange-50/50 to-amber-50/50"></div>

              <div className="relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowConflictModal(false)
                  }}
                  className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Error icon */}
                <div className="mb-3">
                  <div className="relative mx-auto w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-full w-12 h-12 flex items-center justify-center shadow-xl">
                      <AlertCircle className="h-6 w-6 text-white animate-bounce" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-black mb-2 text-black font-serif" style={{ letterSpacing: "0.15em" }}>
                  ALEXANDRA RIZOU
                </h2>

                <p className="text-gray-700 mb-3 text-sm font-bold">
                  {isEnglish ? "Time Slot Already Booked" : "Η Ώρα Είναι Κατειλημμένη"}
                </p>

                {/* Conflict message */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 mb-3 border border-red-200">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {conflictMessage}
                  </p>
                </div>

                <p className="text-gray-600 mb-3 text-xs">
                  {isEnglish ? "Please select a different time slot below." : "Παρακαλώ επιλέξτε άλλη ώρα παρακάτω."}
                </p>

                <Button
                  onClick={() => {
                    setShowConflictModal(false)
                    // Go back to time selection step
                    if (selectedDate) {
                      setCurrentStep(2)
                      setSelectedTime("")
                    }
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-1.5 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  {isEnglish ? "Select Different Time" : "Επιλογή Άλλης Ώρας"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && appointmentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-xs w-full mx-auto">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-sage-green via-sage-light to-copper rounded-xl blur-xl opacity-75 animate-pulse"></div>

            <div className="relative backdrop-blur-xl bg-white/95 rounded-xl p-4 shadow-2xl border border-white/20 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 via-sage-light/5 to-copper/5"></div>

              <div className="relative">
                {/* Close button */}
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    // Redirect to home with refresh to prevent spam
                    const homePath = isEnglish ? '/en' : '/'
                    router.push(homePath)
                    // Small delay before refresh to ensure navigation completes
                    setTimeout(() => {
                      window.location.reload()
                    }, 100)
                  }}
                  className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Success animation */}
                <div className="mb-3">
                  <div className="relative mx-auto w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-sage-green to-sage-light rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-gradient-to-r from-sage-green to-sage-light rounded-full w-12 h-12 flex items-center justify-center shadow-xl">
                      <CheckCircle className="h-6 w-6 text-white animate-bounce" />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold mb-2 text-black font-serif uppercase tracking-widest">
                  ALEXANDRA RIZOU
                </h2>

                <p className="text-gray-700 mb-3 text-sm font-bold">
                  {isEnglish ? translations.ui.labels.bookingCompleted : "Η κράτησή σας ολοκληρώθηκε επιτυχώς! ✨"}
                </p>

                {/* Appointment details */}
                <div className="bg-gradient-to-r from-sage-green/5 to-sage-light/5 rounded-lg p-3 mb-3 border border-sage-green/20">
                  <div className="space-y-2 text-left">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-sage-green" />
                        <div>
                          <span className="text-[10px] text-gray-600 uppercase tracking-tight font-bold">{isEnglish ? translations.ui.labels.date : "Ημερομηνία"}</span>
                          <div className="font-bold text-gray-800 text-[11px] leading-tight">{appointmentDetails.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sage-green" />
                        <div>
                          <span className="text-[10px] text-gray-600 uppercase tracking-tight font-bold">{isEnglish ? translations.ui.labels.time : "Ώρα"}</span>
                          <div className="font-bold text-gray-800 text-[11px] leading-tight">{appointmentDetails.time}</div>
                        </div>
                      </div>
                      {appointmentDetails.employee && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-sage-green" />
                          <div>
                            <span className="text-[10px] text-gray-600 uppercase tracking-tight font-bold">{isEnglish ? translations.ui.labels.employee : "Ειδικός"}</span>
                            <div className="font-bold text-gray-800 text-[11px] leading-tight">{appointmentDetails.employee}</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-sage-green" />
                        <div>
                          <span className="text-[10px] text-gray-600 uppercase tracking-tight font-bold">{isEnglish ? translations.ui.labels.customer : "Πελάτης"}</span>
                          <div className="font-bold text-gray-800 text-[11px] leading-tight">{appointmentDetails.name}</div>
                        </div>
                      </div>
                    </div>

                    {appointmentDetails.services && appointmentDetails.services.length > 0 && (
                      <div className="pt-2 border-t border-sage-green/20">
                        <div className="flex items-center gap-1 mb-1">
                          <Scissors className="h-3 w-3 text-sage-green" />
                          <span className="font-bold text-gray-800 text-[10px] uppercase tracking-tight">{isEnglish ? translations.ui.labels.services : "Υπηρεσίες"}</span>
                        </div>
                        <div className="space-y-1">
                          {appointmentDetails.services.map((service: string, index: number) => {
                            const serviceData = services.find(s => s.label === service)
                            return (
                              <div key={index} className="flex items-center justify-between p-1 bg-white/50 rounded">
                                <div className="flex items-center gap-1">
                                  <div className={`p-1 rounded bg-gradient-to-r ${serviceData?.gradient || 'from-sage-green/20 to-sage-light/20'} shadow-sm`}>
                                    <Scissors className="h-2 w-2 text-sage-green" />
                                  </div>
                                  <span className="font-medium text-gray-800 text-[11px]">{service}</span>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-sage-green text-[11px]">{serviceData?.price || 0} €</div>
                                  <div className="text-[10px] text-gray-500">{serviceData?.duration || 0} {isEnglish ? translations.ui.messages.minutes : "λεπτά"}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <div className="mt-2 pt-1 border-t border-sage-green/20">
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-bold text-gray-800">{isEnglish ? translations.ui.labels.total : "Σύνολο"}:</span>
                            <span className="text-xs font-bold text-sage-green">
                              {appointmentDetails.services.reduce((total: number, service: string) => {
                                const serviceData = services.find(s => s.label === service)
                                return total + (serviceData?.price || 0)
                              }, 0)} €
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-3 text-[10px]">
                  {isEnglish ? translations.ui.labels.confirmationMessage : "Θα σας ενημερώσουμε με email για την επιβεβαίωση της κράτησής σας."}
                  <br />
                  <span className="text-copper font-bold">{isEnglish ? translations.ui.labels.thankYou : "Ευχαριστούμε που επιλέξατε το Alexandra Rizou Salon! ✨"}</span>
                </p>

                <Button
                  onClick={() => {
                    setShowSuccessModal(false)
                    // Redirect to home with refresh to prevent spam
                    const homePath = isEnglish ? '/en' : '/'
                    router.push(homePath)
                    // Small delay before refresh to ensure navigation completes
                    setTimeout(() => {
                      window.location.reload()
                    }, 100)
                  }}
                  className="w-full bg-gradient-to-r from-sage-green to-sage-light hover:brightness-110 text-white font-bold py-1.5 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Εντάξει
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AcronFlow Now */}
      <div className="mt-8 sm:mt-12 flex justify-center">
        <div className="relative backdrop-blur-xl bg-white/30 dark:bg-gray-800/10 border border-slate-200/50 dark:border-gray-700/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-sage-green/5 via-sage-light/5 to-copper/5 dark:from-sage-green/5 dark:via-sage-light/5 dark:to-copper/5 rounded-2xl"></div>
          <div className="relative px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className="text-xs sm:text-sm font-medium text-slate-700 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-gray-300 transition-colors duration-300"
                style={{
                  fontFamily: "'Chillax', 'Arial', sans-serif",
                  fontWeight: 600
                }}
              >
                Powered by
              </span>
              <a
                href={isEnglish ? "https://WWW.ACRONFLOW.COM" : "https://WWW.ACRONFLOW.COM"}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <div className="relative h-5 w-[100px] group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/acronflow-logo.svg"
                    alt="AcronFlow"
                    fill
                    className="dark:hidden object-contain"
                  />
                  <Image
                    src="/acronflow-logo-dark.svg"
                    alt="AcronFlow"
                    fill
                    className="hidden dark:block object-contain"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}                                                                   