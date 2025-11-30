"use client"

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Mail, Users, Globe, Calendar, Search, Send, Download, Trash2, AlertTriangle, FileText, Send as SendIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { emailTemplates } from '@/lib/email-templates'

interface NewsletterSubscriber {
  id: string
  email: string
  language: string
  subscribedAt: any
  isActive: boolean
}

export default function NewsletterDashboard() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    languages: {} as Record<string, number>
  })
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailContent, setEmailContent] = useState({
    subject: '',
    content: '',
    language: 'all'
  })
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  useEffect(() => {
    filterSubscribers()
  }, [subscribers, searchTerm])

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true)
      const subscribersRef = collection(db, 'newsletter_subscribers')
      const q = query(subscribersRef, orderBy('subscribedAt', 'desc'))
      const snapshot = await getDocs(q)
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsletterSubscriber[]

      setSubscribers(data)
      
      // Calculate stats
      const total = data.length
      const active = data.filter(sub => sub.isActive).length
      const languages = data.reduce((acc, sub) => {
        acc[sub.language] = (acc[sub.language] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      setStats({ total, active, languages })
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSubscribers = () => {
    if (!searchTerm) {
      setFilteredSubscribers(subscribers)
      return
    }

    const filtered = subscribers.filter(sub =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.language.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredSubscribers(filtered)
  }

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Language', 'Subscribed At', 'Active'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.language,
        sub.subscribedAt?.toDate?.()?.toLocaleDateString() || 'N/A',
        sub.isActive ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const sendNewsletter = async () => {
    if (!emailContent.subject || !emailContent.content) {
      alert('Please fill in all required fields!')
      return
    }

    try {
      setIsSendingEmail(true)
      
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: emailContent.subject,
          content: emailContent.content,
          language: emailContent.language
        })
      })

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert(`Error: Server returned non-JSON response. Status: ${response.status}`);
        return;
      }

      const result = await response.json()

      if (response.ok) {
        alert(`Newsletter sent successfully to ${result.recipients} subscribers!`)
        setShowEmailModal(false)
        setEmailContent({
          subject: '',
          content: '',
          language: 'all'
        })
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      alert('Error sending newsletter. Please try again.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  const openEmailModal = () => {
    setShowEmailModal(true)
    setEmailContent({
      subject: '',
      content: '',
      language: 'all'
    })
  }

  const deleteSubscriber = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteDoc(doc(db, 'newsletter_subscribers', id))
      
      // Update local state
      setSubscribers(prev => prev.filter(sub => sub.id !== id))
      setFilteredSubscribers(prev => prev.filter(sub => sub.id !== id))
      
      // Recalculate stats
      const updatedSubscribers = subscribers.filter(sub => sub.id !== id)
      const total = updatedSubscribers.length
      const active = updatedSubscribers.filter(sub => sub.isActive).length
      const languages = updatedSubscribers.reduce((acc, sub) => {
        acc[sub.language] = (acc[sub.language] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      setStats({ total, active, languages })
      
      alert('Subscriber deleted successfully!')
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      alert('Error deleting subscriber. Please try again.')
    } finally {
      setDeletingId(null)
      setShowDeleteConfirm(null)
    }
  }

  const toggleSubscriberSelection = (id: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(id) 
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    )
  }

  const selectAllSubscribers = () => {
    setSelectedSubscribers(filteredSubscribers.map(sub => sub.id))
  }

  const clearSelection = () => {
    setSelectedSubscribers([])
  }

  const bulkDeleteSubscribers = async () => {
    try {
      setDeletingId('bulk')
      
      // Delete all selected subscribers
      await Promise.all(
        selectedSubscribers.map(id => deleteDoc(doc(db, 'newsletter_subscribers', id)))
      )
      
      // Update local state
      setSubscribers(prev => prev.filter(sub => !selectedSubscribers.includes(sub.id)))
      setFilteredSubscribers(prev => prev.filter(sub => !selectedSubscribers.includes(sub.id)))
      
      // Recalculate stats
      const updatedSubscribers = subscribers.filter(sub => !selectedSubscribers.includes(sub.id))
      const total = updatedSubscribers.length
      const active = updatedSubscribers.filter(sub => sub.isActive).length
      const languages = updatedSubscribers.reduce((acc, sub) => {
        acc[sub.language] = (acc[sub.language] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      setStats({ total, active, languages })
      
      alert(`${selectedSubscribers.length} subscribers deleted successfully!`)
      setSelectedSubscribers([])
    } catch (error) {
      console.error('Error deleting subscribers:', error)
      alert('Error deleting subscribers. Please try again.')
    } finally {
      setDeletingId(null)
      setShowBulkDeleteConfirm(false)
    }
  }

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'el': '🇬🇷',
      'en': '🇬🇧',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'es': '🇪🇸',
      'it': '🇮🇹'
    }
    return flags[language] || '🌍'
  }

  const getLanguageName = (language: string) => {
    const names: Record<string, string> = {
      'el': 'Greek',
      'en': 'English',
      'fr': 'French',
      'de': 'German',
      'es': 'Spanish',
      'it': 'Italian'
    }
    return names[language] || language
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
          </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-slate-700 font-medium text-lg"
            >
              Φόρτωση subscribers...
            </motion.p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
            Newsletter Dashboard
          </h1>
          </div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Διαχειριστείτε τους subscribers σας και στείλτε ενημερώσεις
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
              </div>
            </div>
                <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Σύνολο Subscribers</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">{stats.total}</p>
                </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-gradient-to-br from-white to-green-50/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
              </div>
            </div>
                <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Ενεργοί Subscribers</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-green-600">{stats.active}</p>
                </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
              </div>
            </div>
                <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Γλώσσες</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">{Object.keys(stats.languages).length}</p>
                </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            className="bg-gradient-to-br from-white to-orange-50/50 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border-2 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-orange-600" />
              </div>
            </div>
                <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-1">Engagement</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-orange-600">
                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                  </p>
                </div>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Αναζήτηση subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/95 backdrop-blur-xl border-2 border-slate-200/60 shadow-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openEmailModal}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Send className="h-5 w-5" />
            <span>Send Newsletter</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportSubscribers}
            className="flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white/95 backdrop-blur-xl border-2 border-slate-200/60 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-slate-700 hover:text-slate-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </motion.button>
        </motion.div>

        {/* Bulk Actions */}
        {selectedSubscribers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  {selectedSubscribers.length} subscriber(s) selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearSelection}
                  className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {showBulkDeleteConfirm ? (
                  <>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={bulkDeleteSubscribers}
                      disabled={deletingId === 'bulk'}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deletingId === 'bulk' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Confirm Delete All
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowBulkDeleteConfirm(false)}
                      disabled={deletingId === 'bulk'}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-slate-800 dark:text-white" style={{ fontFamily: 'StampatelloFaceto, cursive' }}>
                Language Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(stats.languages).map(([language, count]) => (
                  <Badge
                    key={language}
                    variant="secondary"
                    className="px-4 py-2 text-sm font-medium"
                  >
                    {getLanguageFlag(language)} {getLanguageName(language)}: {count}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscribers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-800 dark:text-white" style={{ fontFamily: 'StampatelloFaceto, cursive' }}>
                  Subscribers ({filteredSubscribers.length})
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={selectAllSubscribers}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Select All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearSelection}
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubscribers.map((subscriber, index) => (
                  <motion.div
                    key={subscriber.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onChange={() => toggleSubscriberSelection(subscriber.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {subscriber.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">{subscriber.email}</p>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <span>{getLanguageFlag(subscriber.language)} {getLanguageName(subscriber.language)}</span>
                          <span>•</span>
                          <span>
                            {subscriber.subscribedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={subscriber.isActive ? "default" : "secondary"}
                        className={subscriber.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {subscriber.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      
                      {showDeleteConfirm === subscriber.id ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSubscriber(subscriber.id)}
                            disabled={deletingId === subscriber.id}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deletingId === subscriber.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-1" />
                                Confirm Delete
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={deletingId === subscriber.id}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(subscriber.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Modal */}
        {showEmailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white" style={{ fontFamily: 'StampatelloFaceto, cursive' }}>
                  Send Newsletter
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Target Language
                  </label>
                  <select
                    value={emailContent.language}
                    onChange={(e) => setEmailContent(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="all">All Languages</option>
                    <option value="el">Greek</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Subject *
                  </label>
                  <Input
                    value={emailContent.subject}
                    onChange={(e) => setEmailContent(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Enter email subject..."
                    className="w-full"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={emailContent.content}
                    onChange={(e) => setEmailContent(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter email content (HTML supported)..."
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white h-32 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={sendNewsletter}
                    disabled={isSendingEmail || !emailContent.subject || !emailContent.content}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <SendIcon className="h-4 w-4 mr-2" />
                    {isSendingEmail ? 'Sending...' : 'Send Newsletter'}
                  </Button>
                  <Button
                    onClick={() => setShowEmailModal(false)}
                    variant="outline"
                    disabled={isSendingEmail}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
