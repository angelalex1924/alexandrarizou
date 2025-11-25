"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Palette, Save, Eye, RotateCcw, Download, Upload } from 'lucide-react'

interface TemplateCustomization {
  id: string
  name: string
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
}

export default function TemplateEditor({ 
  templateId, 
  templateName, 
  onSave, 
  onPreview, 
  onClose 
}: TemplateEditorProps) {
  const [customization, setCustomization] = useState<TemplateCustomization>({
    id: templateId,
    name: templateName,
    colors: {
      primary: '#81a1d4',
      secondary: '#5b7db8',
      accent: '#4a6fa5',
      background: '#f0f9ff',
      text: '#1e293b'
    },
    fonts: {
      heading: 'Outfit',
      body: 'Inter'
    },
    layout: {
      borderRadius: '20px',
      padding: '40px',
      spacing: '25px'
    },
    logo: {
      size: '100px',
      position: 'center'
    }
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  const colorPresets = [
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
        ...prev.colors,
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
          customization,
          preview: true
        })
      })

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        alert(`Σφάλμα: Ο server επέστρεψε μη-JSON response. Status: ${response.status}`);
        return;
      }

      const result = await response.json()
      if (response.ok) {
        setPreviewHtml(result.html)
        setIsPreviewMode(true)
      } else {
        console.error('Error response:', result);
        alert(`Σφάλμα: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error generating preview:', error)
      alert('Σφάλμα κατά τη δημιουργία preview. Παρακαλώ δοκιμάστε ξανά.')
    }
  }

  const saveTemplate = () => {
    onSave(customization)
  }

  const resetToDefault = () => {
    setCustomization({
      id: templateId,
      name: templateName,
      colors: {
        primary: '#81a1d4',
        secondary: '#5b7db8',
        accent: '#4a6fa5',
        background: '#f0f9ff',
        text: '#1e293b'
      },
      fonts: {
        heading: 'Outfit',
        body: 'Inter'
      },
      layout: {
        borderRadius: '20px',
        padding: '40px',
        spacing: '25px'
      },
      logo: {
        size: '100px',
        position: 'center'
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex h-full">
          {/* Editor Panel */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white" style={{ fontFamily: 'StampatelloFaceto, cursive' }}>
                Template Editor
              </h3>
              <Button
                variant="outline"
                onClick={onClose}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Template Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Template Name
                </label>
                <Input
                  value={customization.name}
                  onChange={(e) => updateCustomization('name', e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {colorPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      onClick={() => applyColorPreset(preset)}
                      className="justify-start text-left h-auto p-3"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: preset.colors.primary }}
                        />
                        <span className="text-sm">{preset.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Custom Colors
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-20">Primary:</label>
                    <input
                      type="color"
                      value={customization.colors.primary}
                      onChange={(e) => updateNestedCustomization('colors', 'primary', e.target.value)}
                      className="w-12 h-8 rounded border border-slate-300"
                    />
                    <Input
                      value={customization.colors.primary}
                      onChange={(e) => updateNestedCustomization('colors', 'primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-20">Secondary:</label>
                    <input
                      type="color"
                      value={customization.colors.secondary}
                      onChange={(e) => updateNestedCustomization('colors', 'secondary', e.target.value)}
                      className="w-12 h-8 rounded border border-slate-300"
                    />
                    <Input
                      value={customization.colors.secondary}
                      onChange={(e) => updateNestedCustomization('colors', 'secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-20">Accent:</label>
                    <input
                      type="color"
                      value={customization.colors.accent}
                      onChange={(e) => updateNestedCustomization('colors', 'accent', e.target.value)}
                      className="w-12 h-8 rounded border border-slate-300"
                    />
                    <Input
                      value={customization.colors.accent}
                      onChange={(e) => updateNestedCustomization('colors', 'accent', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-20">Background:</label>
                    <input
                      type="color"
                      value={customization.colors.background}
                      onChange={(e) => updateNestedCustomization('colors', 'background', e.target.value)}
                      className="w-12 h-8 rounded border border-slate-300"
                    />
                    <Input
                      value={customization.colors.background}
                      onChange={(e) => updateNestedCustomization('colors', 'background', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Fonts */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Fonts
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400">Heading Font:</label>
                    <select
                      value={customization.fonts.heading}
                      onChange={(e) => updateNestedCustomization('fonts', 'heading', e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400">Body Font:</label>
                    <select
                      value={customization.fonts.body}
                      onChange={(e) => updateNestedCustomization('fonts', 'body', e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      {fontOptions.map((font) => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Layout
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-24">Border Radius:</label>
                    <Input
                      value={customization.layout.borderRadius}
                      onChange={(e) => updateNestedCustomization('layout', 'borderRadius', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-24">Padding:</label>
                    <Input
                      value={customization.layout.padding}
                      onChange={(e) => updateNestedCustomization('layout', 'padding', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-24">Spacing:</label>
                    <Input
                      value={customization.layout.spacing}
                      onChange={(e) => updateNestedCustomization('layout', 'spacing', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Logo Settings
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-16">Size:</label>
                    <Input
                      value={customization.logo.size}
                      onChange={(e) => updateNestedCustomization('logo', 'size', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-slate-600 dark:text-slate-400 w-16">Position:</label>
                    <select
                      value={customization.logo.position}
                      onChange={(e) => updateNestedCustomization('logo', 'position', e.target.value)}
                      className="flex-1 p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="center">Center</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  onClick={generatePreview}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={saveTemplate}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
                <Button
                  onClick={resetToDefault}
                  variant="outline"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 p-6 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Live Preview</h4>
              <Badge variant="secondary">Real-time</Badge>
            </div>
            
            {isPreviewMode ? (
              <div 
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                <div className="text-center">
                  <Palette className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Click "Preview" to see your template</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
