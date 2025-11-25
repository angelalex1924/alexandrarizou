"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Star, Send, X, Users } from 'lucide-react'

interface ReviewEmailFormProps {
  onClose: () => void
}

export default function ReviewEmailForm({ onClose }: ReviewEmailFormProps) {
  const [formData, setFormData] = useState({
    emails: '',
    subject: '⭐ Αξιολογήστε την εμπειρία σας στο Alexandra Rizou hair-beauty & health services!',
    message: `Αγαπητέ/ή πελάτη,

Ευχαριστούμε που επιλέξατε το Alexandra Rizou hair-beauty & health services για την περιποίηση σας! ✂️

Η εμπειρία σας είναι πολύ σημαντική για εμάς και η γνώμη σας μας βοηθά να προσφέρουμε ακόμα καλύτερες υπηρεσίες! ⭐

Θα θέλατε να αφήσετε μια κριτική στο Google; Θα χρειαστεί μόνο 2 λεπτά και θα μας βοηθήσει πολύ! 🎯

Κάντε κλικ στον παρακάτω σύνδεσμο για να αφήσετε την κριτική σας:
https://share.google/NTHvLOlobEIU7Ajm4

Ευχαριστούμε για την εμπιστοσύνη σας! 🙏

Με εκτίμηση,
Η ομάδα του Alexandra Rizou hair-beauty & health services 💇‍♂️`
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Sending review request with data:', {
        emails: formData.emails.split(',').map(email => email.trim()).filter(email => email),
        subject: formData.subject,
        message: formData.message
      })

      const response = await fetch('/api/send-review-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: formData.emails.split(',').map(email => email.trim()).filter(email => email),
          subject: formData.subject,
          message: formData.message
        })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert(`Σφάλμα: Ο server επέστρεψε μη-JSON response. Status: ${response.status}`);
        return;
      }

      if (response.ok) {
        const result = await response.json()
        console.log('Success result:', result)
        setSuccess(true)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert(`Σφάλμα στην αποστολή του email: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Σφάλμα δικτύου. Παρακαλώ ελέγξτε τη σύνδεσή σας και δοκιμάστε ξανά.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Review Requests Sent!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Τα review request emails στάλθηκαν επιτυχώς!
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Send Review Request
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Στείλτε review requests σε πελάτες
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Recipients */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Email Recipients
              </label>
              <Textarea
                value={formData.emails}
                onChange={(e) => handleInputChange('emails', e.target.value)}
                placeholder="Enter email addresses separated by commas (e.g., customer1@email.com, customer2@email.com)"
                className="w-full min-h-[100px]"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Χωρίστε πολλαπλές διευθύνσεις email με κόμμα
              </p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Subject
              </label>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full min-h-[200px]"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                Το review link περιλαμβάνεται αυτόματα στο μήνυμα
              </p>
            </div>

            {/* Preview */}
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">Preview:</h4>
              <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                {formData.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Review Requests</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}