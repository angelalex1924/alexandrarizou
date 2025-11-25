"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const pathname = usePathname()
  
  // Check if we're on English pages
  const isEnglish = pathname.startsWith('/en')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/subscribe-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          language: isEnglish ? 'en' : 'el'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus('error')
        if (data.error?.includes('already subscribed')) {
        setMessage(isEnglish ? 'This email is already subscribed to our newsletter!' : 'Αυτό το email είναι ήδη εγγεγραμμένο στο newsletter μας!')
        } else {
          setMessage(isEnglish ? 'Error during subscription. Please try again.' : 'Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά.')
        }
        return
      }

      setStatus('success')
      setMessage(isEnglish ? 'Successfully subscribed to newsletter!' : 'Εγγραφήκατε επιτυχώς στο newsletter!')
      setEmail('')
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setStatus('error')
      setMessage(isEnglish ? 'Error during subscription. Please try again.' : 'Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="newsletter-section-standalone"
      >
        <div className="newsletter-content">
          <h4 className="newsletter-title">
            {isEnglish ? "Stay Updated" : "Μείνετε Ενημερωμένοι"}
          </h4>
          <p className="newsletter-description">
            {isEnglish 
              ? "Get exclusive offers and updates" 
              : "Αποκλειστικές προσφορές και ενημερώσεις"
            }
          </p>
          
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="newsletter-input-group">
              <input 
                type="email" 
                placeholder={isEnglish ? "Your email" : "Το email σας"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="newsletter-button"
              >
                <span className="newsletter-button-text">
                  {isLoading 
                    ? (isEnglish ? "Subscribing..." : "Εγγραφή...") 
                    : (isEnglish ? "Subscribe" : "Εγγραφή")
                  }
                </span>
                <svg className="newsletter-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-green-400 text-sm mt-3"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{message}</span>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-red-400 text-sm mt-3"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{message}</span>
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>

      <style jsx>{`
        /* Newsletter Section - Clean & Compact */
        .newsletter-section-standalone {
          margin: 0;
          padding: 0;
          width: 100%;
        }

        .newsletter-content {
          max-width: 100%;
          margin: 0;
          text-align: left;
        }

        .newsletter-title {
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: hsl(var(--primary));
          text-transform: uppercase;
          letter-spacing: 0.45em;
        }

        .newsletter-description {
          font-size: 0.875rem;
          line-height: 1.5;
          opacity: 0.8;
          margin-bottom: 1rem;
          color: hsl(var(--muted-foreground));
        }

        .newsletter-form {
          width: 100%;
        }

        .newsletter-input-group {
          display: flex;
          gap: 0;
          align-items: stretch;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          padding: 0;
          transition: all 0.3s ease;
          max-width: 100%;
          margin: 0;
          backdrop-blur-sm;
        }

        .newsletter-input-group:focus-within {
          border-color: hsl(var(--primary) / 0.5);
          box-shadow: 0 0 0 2px hsl(var(--primary) / 0.1);
        }

        .newsletter-input {
          flex: 1;
          border: none;
          background: transparent;
          color: inherit;
          font-size: 0.9rem;
          padding: 0.75rem 1rem;
          outline: none;
          border-radius: 10px 0 0 10px;
          transition: all 0.3s ease;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .light-mode .newsletter-input::placeholder {
          color: rgba(0, 0, 0, 0.5);
        }

        .newsletter-button {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: hsl(var(--primary) / 0.9);
          color: #ffffff;
          border: none;
          border-radius: 0 10px 10px 0;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .newsletter-button:hover {
          background: hsl(var(--primary));
          transform: translateY(-1px);
        }

        .newsletter-button:active {
          transform: translateY(0);
        }

        .newsletter-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .newsletter-button-text {
          font-weight: 600;
        }

        .newsletter-icon {
          transition: transform 0.3s ease;
        }

        .newsletter-button:hover .newsletter-icon {
          transform: translateX(2px);
        }

        /* Dark mode newsletter styles */
        .dark .newsletter-input-group {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .dark .newsletter-input {
          color: hsl(var(--foreground));
        }

        .dark .newsletter-input::placeholder {
          color: hsl(var(--muted-foreground) / 0.6);
        }

        /* Light mode newsletter styles */
        :not(.dark) .newsletter-input-group {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(0, 0, 0, 0.1);
        }

        :not(.dark) .newsletter-input {
          color: hsl(var(--foreground));
        }

        :not(.dark) .newsletter-input::placeholder {
          color: hsl(var(--muted-foreground) / 0.6);
        }

        /* Mobile Responsive Newsletter */
        @media (max-width: 640px) {
          .newsletter-section-standalone {
            margin: 1.5rem 0;
            padding: 1rem 0;
          }

          .newsletter-title {
            font-size: 0.9rem;
            margin-bottom: 0.4rem;
          }

          .newsletter-description {
            font-size: 0.8rem;
            margin-bottom: 0.8rem;
          }

          .newsletter-input-group {
            flex-direction: column;
            border-radius: 8px;
            gap: 0;
          }

          .newsletter-input {
            border-radius: 10px 10px 0 0;
            padding: 0.8rem;
            font-size: 0.85rem;
          }

          .newsletter-button {
            border-radius: 0 0 10px 10px;
            padding: 0.8rem;
            font-size: 0.8rem;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}
