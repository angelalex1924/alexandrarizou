"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Palette, Save, Eye, RotateCcw, Download, Upload, FileText } from 'lucide-react'
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { emailTemplates } from '@/lib/email-templates'
import { Editor } from '@/components/blocks/editor-00/editor'
import { SerializedEditorState } from 'lexical'
import { editorStateToHtml } from '@/lib/lexical-utils'

interface TemplateCustomization {
  id: string
  name: string
  customMessage?: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: {
    borderRadius: string
    padding: string
    spacing: string
  }
  logo: {
    size: string
    position: string
  }
}

interface TemplateEditorProps {
  templateId: string
  templateName: string
  onSave: (customization: TemplateCustomization) => void
  onPreview: (customization: TemplateCustomization) => void
  onClose: () => void
  savedTemplate?: TemplateCustomization & { id: string }
}

export default function TemplateEditor({ 
  templateId, 
  templateName, 
  onSave, 
  onPreview, 
  onClose,
  savedTemplate
}: TemplateEditorProps) {
  // Get initial template content
  const getInitialContent = () => {
    if (savedTemplate?.customMessage) {
      return savedTemplate.customMessage
    }
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      if (typeof template.content === 'string') {
        return template.content
      } else if (typeof template.content === 'object' && template.content.el) {
        return template.content.el
      } else if (typeof template.content === 'object' && template.content.en) {
        return template.content.en
      }
    }
    return ''
  }

  // Default customization values
  const defaultCustomization: TemplateCustomization = {
    id: templateId,
    name: templateName,
    customMessage: getInitialContent(),
    colors: {
      primary: '#6B9A7A',
      secondary: '#5a8a6a',
      accent: '#4a7c59',
      background: '#f5f7fa',
      text: '#1a202c'
    },
    fonts: {
      heading: 'Outfit',
      body: 'Inter'
    },
    layout: {
      borderRadius: '16px',
      padding: '40px',
      spacing: '28px'
    },
    logo: {
      size: '90px',
      position: 'center'
    }
  }

  // Merge savedTemplate with defaults to ensure all properties exist
  const getInitialCustomization = (): TemplateCustomization => {
    if (!savedTemplate) {
      return defaultCustomization
    }
    
    // Merge savedTemplate with defaults, ensuring nested objects are properly merged
    return {
      ...defaultCustomization,
      ...savedTemplate,
      colors: {
        ...defaultCustomization.colors,
        ...(savedTemplate.colors || {})
      },
      fonts: {
        ...defaultCustomization.fonts,
        ...(savedTemplate.fonts || {})
      },
      layout: {
        ...defaultCustomization.layout,
        ...(savedTemplate.layout || {})
      },
      logo: {
        ...defaultCustomization.logo,
        ...(savedTemplate.logo || {})
      }
    }
  }

  const [customization, setCustomization] = useState<TemplateCustomization>(getInitialCustomization())

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')
  const [latestHtmlFromEditor, setLatestHtmlFromEditor] = useState<string>('')
  
  // Initialize editor state from HTML
  const getInitialEditorState = (): SerializedEditorState => {
    const htmlContent = getInitialContent()
    if (!htmlContent) {
      return {
        root: {
          children: [
            {
              children: [],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      } as unknown as SerializedEditorState
    }
    
    // Create a simple editor state from HTML
    // Strip HTML tags for initial text
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim()
    return {
      root: {
        children: [
          {
            children: textContent ? [
              {
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: textContent,
                type: 'text',
                version: 1,
              },
            ] : [],
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'paragraph',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
      },
    } as unknown as SerializedEditorState
  }

  const [editorState, setEditorState] = useState<SerializedEditorState>(getInitialEditorState())

  const colorPresets = [
    { name: 'Alexandra Rizou Green', colors: { primary: '#6B9A7A', secondary: '#5a8a6a', accent: '#4a7c59' } },
    { name: 'Classic Blue', colors: { primary: '#81a1d4', secondary: '#5b7db8', accent: '#4a6fa5' } },
    { name: 'Warm Orange', colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#b45309' } },
    { name: 'Success Green', colors: { primary: '#10b981', secondary: '#059669', accent: '#047857' } },
    { name: 'Elegant Purple', colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#6d28d9' } },
    { name: 'Vibrant Red', colors: { primary: '#dc2626', secondary: '#b91c1c', accent: '#991b1b' } },
    { name: 'Professional Gray', colors: { primary: '#6b7280', secondary: '#4b5563', accent: '#374151' } }
  ]

  const fontOptions = [
    { name: 'Outfit', value: 'Outfit' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Roboto', value: 'Roboto' },
    { name: 'Open Sans', value: 'Open Sans' },
    { name: 'Lato', value: 'Lato' },
    { name: 'Montserrat', value: 'Montserrat' }
  ]

  const updateCustomization = (field: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedCustomization = (parent: string, field: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof TemplateCustomization] as any || {}),
        [field]: value
      }
    }))
  }

  const applyColorPreset = (preset: any) => {
    setCustomization(prev => ({
      ...prev,
      colors: {
        ...(prev.colors || defaultCustomization.colors),
        ...preset.colors
      }
    }))
  }

  const generatePreview = async () => {
    try {
      const response = await fetch('/api/generate-template-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId,
          customization: {
            ...customization,
            colors: customization?.colors || defaultCustomization.colors,
            customMessage: customization?.customMessage || ''
          },
          preview: true
        })
      })

      const result = await response.json()
      if (response.ok) {
        setPreviewHtml(result.html)
        setIsPreviewMode(true)
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  // Auto-update preview when colors or message change (if preview is already open)
  useEffect(() => {
    if (isPreviewMode) {
      const updatePreview = async () => {
        try {
          const response = await fetch('/api/generate-template-preview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              templateId,
              customization: {
                ...customization,
                colors: customization.colors,
                customMessage: customization.customMessage
              },
              preview: true
            })
          })

          const result = await response.json()
          if (response.ok) {
            setPreviewHtml(result.html)
          }
        } catch (error) {
          console.error('Error updating preview:', error)
        }
      }
      updatePreview()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization?.colors?.primary, customization?.colors?.secondary, customization?.colors?.accent, customization?.colors?.background, customization?.colors?.text, customization?.customMessage, isPreviewMode])

  const saveTemplate = async () => {
    try {
      // Before saving, ensure we have the latest HTML from the editor
      // Use the HTML from HtmlExportPlugin (which properly handles schedules) if available
      // Otherwise fall back to converting editorState to HTML
      const latestHtml = latestHtmlFromEditor || editorStateToHtml(editorState) || customization?.customMessage || ''
      
      // Update customization with the latest HTML before saving
      const updatedCustomization = {
        ...customization,
        customMessage: latestHtml
      }
      
      console.log('Saving template with HTML length:', latestHtml.length)
      console.log('HTML contains schedule:', latestHtml.includes('<div style=') && latestHtml.includes('border: 2px solid'))
      console.log('HTML preview (first 200 chars):', latestHtml.substring(0, 200))
      
      // Save to Firestore
      const templateData = {
        ...updatedCustomization,
        updatedAt: serverTimestamp(),
        baseTemplateId: templateId,
        baseTemplateName: templateName
      }

      // Check if we're editing an existing saved template
      // savedTemplate.id should be a Firestore document ID (not a base template ID like 'welcome')
      // Base template IDs are: 'welcome', 'promotion', 'event', 'review', 'christmas', 'newyear', 'easter', 'summer', 'autumn'
      // Firestore document IDs are auto-generated and look like: 'abc123xyz...'
      const baseTemplateIds = ['welcome', 'promotion', 'event', 'review', 'christmas', 'newyear', 'easter', 'summer', 'autumn']
      const isBaseTemplateId = baseTemplateIds.includes(templateId)
      const isFirestoreDocumentId = savedTemplate?.id && !baseTemplateIds.includes(savedTemplate.id) && savedTemplate.id.length > 20

      if (savedTemplate?.id && isFirestoreDocumentId) {
        // This is an existing saved template with a Firestore document ID - update it
        console.log('Updating existing template with Firestore ID:', savedTemplate.id)
        const templateRef = doc(db, 'emailTemplates', savedTemplate.id)
        await updateDoc(templateRef, {
          ...templateData,
          // Don't overwrite createdAt when updating
          createdAt: (savedTemplate as any).createdAt || serverTimestamp()
        })
        
        console.log('Template updated in Firestore with ID:', savedTemplate.id)
        console.log('Updated customMessage length:', templateData.customMessage?.length || 0)
        alert('Template ενημερώθηκε επιτυχώς!')
      } else {
        // This is a new template - create it
        // Remove the 'id' field from templateData if it's a base template ID
        const { id, ...dataToSave } = templateData
        const templateDataWithTimestamp = {
          ...dataToSave,
          createdAt: serverTimestamp()
        }
        
        console.log('Creating new template from base template:', templateId)
        console.log('CustomMessage length:', templateDataWithTimestamp.customMessage?.length || 0)
        const docRef = await addDoc(collection(db, 'emailTemplates'), templateDataWithTimestamp)
        
        console.log('Template saved to Firestore with ID:', docRef.id)
        alert('Template αποθηκεύτηκε επιτυχώς!')
      }
      
      onSave(updatedCustomization)
    } catch (error: any) {
      console.error('Error saving template:', error)
      console.error('Error code:', error?.code)
      console.error('Error message:', error?.message)
      const errorMessage = error?.message || 'Άγνωστο σφάλμα'
      alert(`Σφάλμα κατά την αποθήκευση του template: ${errorMessage}`)
    }
  }

  const resetToDefault = () => {
    setCustomization({
      id: templateId,
      name: templateName,
      colors: {
        primary: '#6B9A7A',
        secondary: '#5a8a6a',
        accent: '#4a7c59',
        background: '#f5f7fa',
        text: '#1a202c'
      },
      fonts: {
        heading: 'Outfit',
        body: 'Inter'
      },
      layout: {
        borderRadius: '16px',
        padding: '40px',
        spacing: '28px'
      },
      logo: {
        size: '90px',
        position: 'center'
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl w-full overflow-hidden border-2 border-slate-200/60 dark:border-slate-700/60 shadow-xl mt-6"
    >
      <div className="flex flex-col lg:flex-row h-auto min-h-[600px]">
        {/* Editor Panel */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  Template Editor
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Customize your email template</p>
              </div>
              <Button
                variant="outline"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Template Name */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Template Name
                </label>
                <Input
                  value={customization.name}
                  onChange={(e) => updateCustomization('name', e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#6B9A7A] focus:ring-[#6B9A7A]"
                />
              </div>

              {/* Template Message/Content */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Template Content
                  </label>
                </div>
                <div className="min-h-[300px]">
                  <Editor
                    editorSerializedState={editorState}
                    onSerializedChange={(value) => {
                      setEditorState(value)
                    }}
                    onHtmlChange={(html) => {
                      // Update customization with HTML from editor
                      updateCustomization('customMessage', html)
                      // Also store the latest HTML for saving
                      setLatestHtmlFromEditor(html)
                    }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Use the rich text editor to format your email content. No HTML knowledge required!
                </p>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Color Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset) => (
                    <motion.button
                      key={preset.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyColorPreset(preset)}
                      className={`justify-start text-left h-auto p-3 rounded-lg border-2 transition-all ${
                        preset.name === 'Alexandra Rizou Green'
                          ? 'border-[#6B9A7A] bg-gradient-to-br from-[#f0f7f4] to-[#e8f0ec] dark:from-[#4a7c59]/20 dark:to-[#5a8a6a]/20'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full ring-2 ring-offset-1 ring-slate-200 dark:ring-slate-700"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <span className={`text-sm font-medium ${
                          preset.name === 'Alexandra Rizou Green'
                            ? 'text-[#4a7c59] dark:text-[#6B9A7A]'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {preset.name}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Custom Colors
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-20">Primary:</label>
                    <input
                      type="color"
                      value={customization?.colors?.primary || defaultCustomization.colors.primary}
                      onChange={(e) => updateNestedCustomization('colors', 'primary', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer"
                    />
                    <Input
                      value={customization?.colors?.primary || defaultCustomization.colors.primary}
                      onChange={(e) => updateNestedCustomization('colors', 'primary', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-20">Secondary:</label>
                    <input
                      type="color"
                      value={customization?.colors?.secondary || defaultCustomization.colors.secondary}
                      onChange={(e) => updateNestedCustomization('colors', 'secondary', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer"
                    />
                    <Input
                      value={customization?.colors?.secondary || defaultCustomization.colors.secondary}
                      onChange={(e) => updateNestedCustomization('colors', 'secondary', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-20">Accent:</label>
                    <input
                      type="color"
                      value={customization?.colors?.accent || defaultCustomization.colors.accent}
                      onChange={(e) => updateNestedCustomization('colors', 'accent', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer"
                    />
                    <Input
                      value={customization?.colors?.accent || defaultCustomization.colors.accent}
                      onChange={(e) => updateNestedCustomization('colors', 'accent', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-20">Background:</label>
                    <input
                      type="color"
                      value={customization?.colors?.background || defaultCustomization.colors.background}
                      onChange={(e) => updateNestedCustomization('colors', 'background', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-slate-300 dark:border-slate-600 cursor-pointer"
                    />
                    <Input
                      value={customization?.colors?.background || defaultCustomization.colors.background}
                      onChange={(e) => updateNestedCustomization('colors', 'background', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                </div>
              </div>

              {/* Fonts */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Fonts
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Heading Font:</label>
                    <select
                      value={customization?.fonts?.heading || defaultCustomization.fonts.heading}
                      onChange={(e) => updateNestedCustomization('fonts', 'heading', e.target.value)}
                      className="w-full p-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-[#d4af37] transition-colors"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">Body Font:</label>
                    <select
                      value={customization?.fonts?.body || defaultCustomization.fonts.body}
                      onChange={(e) => updateNestedCustomization('fonts', 'body', e.target.value)}
                      className="w-full p-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-[#d4af37] transition-colors"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Layout
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-24">Border Radius:</label>
                    <Input
                      value={customization?.layout?.borderRadius || defaultCustomization.layout.borderRadius}
                      onChange={(e) => updateNestedCustomization('layout', 'borderRadius', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-24">Padding:</label>
                    <Input
                      value={customization?.layout?.padding || defaultCustomization.layout.padding}
                      onChange={(e) => updateNestedCustomization('layout', 'padding', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-24">Spacing:</label>
                    <Input
                      value={customization?.layout?.spacing || defaultCustomization.layout.spacing}
                      onChange={(e) => updateNestedCustomization('layout', 'spacing', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Logo Settings
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-16">Size:</label>
                    <Input
                      value={customization?.logo?.size || defaultCustomization.logo.size}
                      onChange={(e) => updateNestedCustomization('logo', 'size', e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-[#d4af37] focus:ring-[#d4af37]"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-700/30">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400 w-16">Position:</label>
                    <select
                      value={customization?.logo?.position || defaultCustomization.logo.position}
                      onChange={(e) => updateNestedCustomization('logo', 'position', e.target.value)}
                      className="flex-1 p-2.5 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-[#d4af37] focus:ring-[#d4af37] transition-colors"
                    >
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={generatePreview}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/30"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={saveTemplate}
                    className="bg-gradient-to-r from-[#6B9A7A] to-[#5a8a6a] hover:from-[#5a8a6a] hover:to-[#4a7c59] text-white shadow-lg shadow-[#6B9A7A]/30"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={resetToDefault}
                    variant="outline"
                    className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-full lg:w-1/2 p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-800/50 overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-700/60">
              <div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Live Preview</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">See your changes in real-time</p>
              </div>
              <Badge className="bg-gradient-to-r from-[#6B9A7A] to-[#5a8a6a] text-white border-0">Real-time</Badge>
            </div>
            
            {isPreviewMode ? (
              <div className="w-full overflow-auto flex justify-center">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full border-2 border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-xl bg-white"
                  style={{ 
                    maxWidth: '580px', 
                    minHeight: '600px',
                    height: 'auto',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  sandbox="allow-same-origin"
                  title="Email Preview"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                <div className="text-center">
                  <div className="p-4 bg-gradient-to-br from-[#f0f7f4] to-[#e8f0ec] dark:from-[#4a7c59]/20 dark:to-[#5a8a6a]/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Palette className="h-8 w-8 text-[#6B9A7A] dark:text-[#5a8a6a]" />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Click "Preview" to see your template</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Your changes will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
  )
}
