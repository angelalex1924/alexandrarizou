"use client"

import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, deleteDoc, doc, where, getDoc } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Mail, Send, Edit, Trash2, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SavedTemplate {
  id: string
  name: string
  baseTemplateId: string
  baseTemplateName: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  createdAt: any
  updatedAt: any
}

interface SavedTemplatesListProps {
  onSelectTemplate: (template: SavedTemplate) => void
  onSendTemplate: (template: SavedTemplate) => void
}

export default function SavedTemplatesList({ onSelectTemplate, onSendTemplate }: SavedTemplatesListProps) {
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadSavedTemplates()
    } else {
      setSavedTemplates([])
      setLoading(false)
    }
  }, [user])

  const loadSavedTemplates = async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated
      if (!user) {
        console.error('User is not authenticated')
        setSavedTemplates([])
        return
      }
      
      const templatesRef = collection(db, 'emailTemplates')
      const q = query(templatesRef, orderBy('updatedAt', 'desc'))
      const snapshot = await getDocs(q)
      
      console.log('Loaded templates from Firestore:', snapshot.docs.length)
      
      const templates = snapshot.docs.map(doc => ({
        id: doc.id, // Firestore document ID (unique)
        ...doc.data()
      })) as SavedTemplate[]
      
      // Filter out any duplicates (shouldn't happen, but just in case)
      const uniqueTemplates = templates.filter((template, index, self) => 
        index === self.findIndex(t => t.id === template.id)
      )
      
      console.log('Unique templates after filtering:', uniqueTemplates.length)
      setSavedTemplates(uniqueTemplates)
    } catch (error) {
      console.error('Error loading saved templates:', error)
      setSavedTemplates([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (templateId: string, e?: React.MouseEvent) => {
    e?.stopPropagation() // Prevent event bubbling
    e?.preventDefault() // Prevent default behavior
    
    if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το template;')) {
      return
    }

    // Check if user is authenticated
    if (!user) {
      alert('Δεν είστε συνδεδεμένος! Παρακαλώ συνδεθείτε για να διαγράψετε templates.')
      return
    }

    try {
      console.log('=== DELETE TEMPLATE START ===')
      console.log('Template ID to delete:', templateId)
      console.log('Current user:', user?.email)
      console.log('Current templates count:', savedTemplates.length)
      
      // Verify the document exists before attempting to delete
      const templateRef = doc(db, 'emailTemplates', templateId)
      const templateDoc = await getDoc(templateRef)
      
      if (!templateDoc.exists()) {
        console.warn('Template document does not exist:', templateId)
        alert('Το template δεν βρέθηκε. Μπορεί να έχει ήδη διαγραφεί.')
        await loadSavedTemplates() // Reload to refresh the list
        return
      }
      
      console.log('Template exists, proceeding with deletion...')
      
      // First, update local state immediately for better UX
      setSavedTemplates(prev => {
        const filtered = prev.filter(t => t.id !== templateId)
        console.log('Local state updated. Remaining templates:', filtered.length)
        return filtered
      })
      
      // Delete from Firestore
      await deleteDoc(templateRef)
      console.log('Template deleted successfully from Firestore')
      
      // Wait a bit to ensure Firestore has processed the deletion
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Force reload from Firestore to ensure consistency (no cache)
      await loadSavedTemplates()
      
      // Double-check: verify the template is actually gone
      const verifyDoc = await getDoc(templateRef)
      if (verifyDoc.exists()) {
        console.error('WARNING: Template still exists after deletion!')
        alert('Προειδοποίηση: Το template μπορεί να μην έχει διαγραφεί πλήρως. Παρακαλώ ανανεώστε τη σελίδα.')
      } else {
        console.log('Verified: Template successfully deleted from Firestore')
      }
      
      console.log('=== DELETE TEMPLATE SUCCESS ===')
      alert('Template διαγράφηκε επιτυχώς!')
    } catch (error: any) {
      console.error('=== DELETE TEMPLATE ERROR ===')
      console.error('Error deleting template:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      console.error('Error name:', error?.name)
      console.error('Full error object:', error)
      
      // Reload to restore the template in the list if deletion failed
      await loadSavedTemplates()
      
      let errorMessage = 'Άγνωστο σφάλμα'
      if (error?.code === 'permission-denied') {
        errorMessage = 'Δεν έχετε δικαίωμα να διαγράψετε αυτό το template. Βεβαιωθείτε ότι είστε συνδεδεμένος.'
      } else if (error?.code === 'not-found') {
        errorMessage = 'Το template δεν βρέθηκε. Μπορεί να έχει ήδη διαγραφεί.'
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Το Firestore δεν είναι διαθέσιμο αυτή τη στιγμή. Παρακαλώ δοκιμάστε ξανά.'
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      alert(`Σφάλμα κατά τη διαγραφή του template!\n\n${errorMessage}\n\nError code: ${error?.code || 'N/A'}\n\nΠαρακαλώ ελέγξτε το Console (F12) για περισσότερες λεπτομέρειες.`)
    }
  }

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 border-2 border-slate-200/60 shadow-xl">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-slate-600">Φόρτωση templates...</span>
        </div>
      </div>
    )
  }

  if (savedTemplates.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-7 border-2 border-slate-200/60 shadow-xl">
        <div className="flex items-center gap-3 mb-5 sm:mb-6 md:mb-8">
          <div className="h-0.5 w-8 bg-gradient-to-r from-amber-600 to-transparent rounded-full"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Αποθηκευμένα Templates</h2>
        </div>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Δεν υπάρχουν αποθηκευμένα templates</p>
          <p className="text-slate-500 text-sm mt-2">Δημιουργήστε και αποθηκεύστε templates για να τα βλέπετε εδώ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 md:p-7 border-2 border-slate-200/60 shadow-xl">
      <div className="flex items-center gap-3 mb-5 sm:mb-6 md:mb-8">
        <div className="h-0.5 w-8 bg-gradient-to-r from-amber-600 to-transparent rounded-full"></div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800">Αποθηκευμένα Templates</h2>
        <Badge className="ml-auto bg-amber-100 text-amber-700 border-amber-200">
          {savedTemplates.length} {savedTemplates.length === 1 ? 'template' : 'templates'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {savedTemplates.map((template, index) => (
          <motion.div
            key={`template-${template.id}-${index}`}
            whileHover={{ scale: 1.02, y: -2 }}
            className="group bg-gradient-to-br from-slate-50 to-white rounded-xl p-4 sm:p-5 md:p-6 border-2 border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${template.colors.primary}20` }}>
                <Mail className="w-5 h-5" style={{ color: template.colors.primary }} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleDelete(template.id, e)}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Διαγραφή"
                  type="button"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{template.name}</h3>
            <p className="text-xs text-slate-500 mb-3">
              Βασικό: {template.baseTemplateName}
            </p>
            
            {template.updatedAt && (
              <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                <Calendar className="w-3 h-3" />
                <span>
                  {template.updatedAt.toDate ? 
                    new Date(template.updatedAt.toDate()).toLocaleDateString('el-GR') : 
                    'Πρόσφατα'
                  }
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onSelectTemplate(template)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Επεξεργασία
              </button>
              <button
                onClick={() => onSendTemplate(template)}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Αποστολή
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

