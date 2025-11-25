"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import { Send, X, Users, FileText, Edit3, Mail, Check, User } from 'lucide-react'
import { emailTemplates } from '@/lib/emailTemplates'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface TemplateEmailSenderProps {
  onClose: () => void
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string;
  language: string;
  subscribedAt: string | null;
  isActive: boolean;
}

export default function TemplateEmailSender({ onClose }: TemplateEmailSenderProps) {
  const [formData, setFormData] = useState({
    emails: '',
    templateId: '',
    customSubject: '',
    customMessage: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  const [recipientMode, setRecipientMode] = useState<'manual' | 'subscribers'>('manual')

  // Fetch newsletter subscribers directly from Firebase (like NewsletterDashboard)
  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoadingSubscribers(true)
      try {
        console.log('Fetching subscribers directly from Firebase...')
        const subscribersRef = collection(db, 'newsletter_subscribers')
        const q = query(subscribersRef, orderBy('subscribedAt', 'desc'))
        const snapshot = await getDocs(q)
        
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name || '',
          language: doc.data().language || 'el',
          subscribedAt: doc.data().subscribedAt ? doc.data().subscribedAt.toDate().toISOString() : null,
          isActive: doc.data().isActive !== false
        })).filter(subscriber => subscriber.isActive) // Only active subscribers
        
        setSubscribers(data)
        console.log(`Loaded ${data.length} active newsletter subscribers`)
      } catch (error) {
        console.error('Error fetching subscribers:', error)
      } finally {
        setLoadingSubscribers(false)
      }
    }

    fetchSubscribers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Determine recipient emails based on mode
      let recipientEmails: string[] = []
      
      if (recipientMode === 'manual') {
        recipientEmails = formData.emails.split(',').map(email => email.trim()).filter(email => email)
      } else {
        // Get emails from selected subscribers
        recipientEmails = subscribers
          .filter(sub => selectedSubscribers.includes(sub.id))
          .map(sub => sub.email)
      }

      console.log('Sending template email with data:', {
        emails: recipientEmails,
        templateId: formData.templateId,
        customSubject: formData.customSubject || undefined,
        customMessage: formData.customMessage || undefined,
        recipientMode
      })

      const response = await fetch('/api/send-template-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: recipientEmails,
          templateId: formData.templateId,
          customSubject: formData.customSubject || undefined,
          customMessage: formData.customMessage || undefined
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

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      templateId,
      customSubject: template?.subject || '',
      customMessage: template?.content || ''
    }))
  }

  const handleSubscriberToggle = (subscriberId: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(subscriberId) 
        ? prev.filter(id => id !== subscriberId)
        : [...prev, subscriberId]
    )
  }

  const handleSelectAllSubscribers = () => {
    if (selectedSubscribers.length === subscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(subscribers.map(sub => sub.id))
    }
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
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            Template Emails Sent!
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            Τα template emails στάλθηκαν επιτυχώς σε {recipientMode === 'manual' ? formData.emails.split(',').length : selectedSubscribers.length} recipients!
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
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                Send Template Email
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Στείλτε έτοιμα email templates
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
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Select Template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {emailTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.templateId === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 dark:border-slate-600 hover:border-blue-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 dark:text-white">
                        {template.name}
                      </h4>
                      <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipient Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Select Recipients
              </label>
              
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setRecipientMode('manual')}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    recipientMode === 'manual'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-300 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-2" />
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientMode('subscribers')}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    recipientMode === 'subscribers'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-300 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Newsletter Subscribers ({subscribers.length})
                </button>
              </div>

              {/* Manual Email Entry */}
              {recipientMode === 'manual' && (
                <div>
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
              )}

              {/* Newsletter Subscribers Selection */}
              {recipientMode === 'subscribers' && (
                <div>
                  {loadingSubscribers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-slate-600">Loading subscribers...</span>
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-lg max-h-[300px] overflow-y-auto">
                      {/* Select All Button */}
                      <div className="p-3 border-b border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={handleSelectAllSubscribers}
                          className="flex items-center space-x-2 text-sm font-medium text-slate-700 hover:text-blue-600"
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {selectedSubscribers.length === subscribers.length 
                              ? 'Deselect All' 
                              : 'Select All'
                            } ({selectedSubscribers.length}/{subscribers.length})
                          </span>
                        </button>
                      </div>

                      {/* Subscribers List */}
                      {subscribers.length === 0 ? (
                        <div className="p-4 text-center text-slate-500">
                          No newsletter subscribers found
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200">
                          {subscribers.map((subscriber) => (
                            <label
                              key={subscriber.id}
                              className="flex items-center p-3 hover:bg-slate-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSubscribers.includes(subscriber.id)}
                                onChange={() => handleSubscriberToggle(subscriber.id)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <div className="ml-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-slate-900">
                                    {subscriber.name || 'No name'}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      {subscriber.language.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {subscriber.subscribedAt ? 
                                        new Date(subscriber.subscribedAt).toLocaleDateString() : 
                                        'Recently'
                                      }
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm text-slate-600">
                                  {subscriber.email}
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {recipientMode === 'subscribers' && selectedSubscribers.length === 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Please select at least one subscriber
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Custom Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Edit3 className="w-4 h-4 inline mr-2" />
                Custom Subject (Optional)
              </label>
              <Input
                value={formData.customSubject}
                onChange={(e) => handleInputChange('customSubject', e.target.value)}
                placeholder="Leave empty to use template default"
                className="w-full"
              />
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <Edit3 className="w-4 h-4 inline mr-2" />
                Custom Message (Optional)
              </label>
              <Textarea
                value={formData.customMessage}
                onChange={(e) => handleInputChange('customMessage', e.target.value)}
                placeholder="Leave empty to use template default"
                className="w-full min-h-[200px]"
              />
              <p className="text-xs text-slate-500 mt-1">
                Αφήστε κενό για να χρησιμοποιήσετε το default template
              </p>
            </div>

            {/* Preview */}
            {selectedTemplate && (
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <h4 className="font-medium text-slate-800 dark:text-white mb-2">Preview:</h4>
                <div className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                  {formData.customMessage || selectedTemplate.content}
                </div>
              </div>
            )}

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
                disabled={
                  isLoading || 
                  !formData.templateId || 
                  (recipientMode === 'manual' && !formData.emails.trim()) ||
                  (recipientMode === 'subscribers' && selectedSubscribers.length === 0)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Template Emails</span>
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
