"use client"

import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $generateHtmlFromNodes } from "@lexical/html"
import { $getRoot, $isTextNode } from "lexical"

interface HtmlExportPluginProps {
  onHtmlChange?: (html: string) => void
}

export function HtmlExportPlugin({ onHtmlChange }: HtmlExportPluginProps) {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!onHtmlChange) return

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot()
        
        // First, check if there's any raw HTML to preserve (schedule blocks)
        let rawHtmlContent = ''
        
        root.getChildren().forEach((node) => {
          if (node.getType() === 'paragraph') {
            const children = (node as any).getChildren()
            children.forEach((child: any) => {
              if ($isTextNode(child)) {
                const text = child.getTextContent()
                // Check if text is raw HTML (starts with <div style=)
                if (text.trim().startsWith('<div style=') && text.includes('border: 2px solid')) {
                  rawHtmlContent = text.trim()
                }
              }
            })
          }
        })
        
        // Get HTML from Lexical
        let htmlString = $generateHtmlFromNodes(editor, null)
        
        // If we found raw HTML, replace the escaped version with the raw HTML
        if (rawHtmlContent) {
          // Decode function
          const decodeHtml = (str: string) => {
            return str
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&nbsp;/g, ' ')
          }
          
          // Strategy 1: Replace escaped HTML in paragraphs - preserve other content
          htmlString = htmlString.replace(/<p[^>]*>([\s\S]*?)<\/p>/g, (match, content) => {
            const decoded = decodeHtml(content)
            
            // Check if this paragraph contains the schedule HTML
            if (decoded.includes('border: 2px solid') && 
                (decoded.includes('Χριστουγεννιάτικο') || 
                 decoded.includes('Πρωτοχρονιάτικο') ||
                 decoded.includes('Πασχαλινό') ||
                 decoded.includes('Θερινό') ||
                 decoded.includes('Ειδικό'))) {
              // If the paragraph contains ONLY the schedule HTML, replace the whole paragraph
              if (decoded.trim() === rawHtmlContent) {
                return rawHtmlContent
              }
              // If the paragraph contains schedule HTML + other text, replace only the schedule part
              // Find the escaped schedule HTML within the content
              const escapedPattern = /&lt;div[^&]*style[^&]*border[^&]*2px[^&]*solid[^&]*&gt;[\s\S]*?&lt;\/div&gt;/g
              let result = content
              let scheduleMatch
              while ((scheduleMatch = escapedPattern.exec(content)) !== null) {
                const decodedSchedule = decodeHtml(scheduleMatch[0])
                if (decodedSchedule.includes('border: 2px solid')) {
                  // Replace only the escaped schedule HTML with raw HTML
                  result = result.substring(0, scheduleMatch.index) + rawHtmlContent + result.substring(scheduleMatch.index + scheduleMatch[0].length)
                  // Reset regex lastIndex since we modified the string
                  escapedPattern.lastIndex = 0
                  break
                }
              }
              // Return the paragraph with replaced schedule HTML
              return `<p>${result}</p>`
            }
            return match
          })
          
          // Strategy 2: Replace escaped HTML anywhere in the string (not in <p> tags)
          // Find escaped div blocks that match our schedule pattern
          if (htmlString.includes('&lt;div') && htmlString.includes('border: 2px solid')) {
            // Find escaped div blocks that match our schedule pattern
            const escapedPattern = /&lt;div[^&]*style[^&]*border[^&]*2px[^&]*solid[^&]*&gt;[\s\S]*?&lt;\/div&gt;/g
            htmlString = htmlString.replace(escapedPattern, (match) => {
              const decoded = decodeHtml(match)
              if (decoded.includes('border: 2px solid') && 
                  (decoded.includes('Χριστουγεννιάτικο') || 
                   decoded.includes('Πρωτοχρονιάτικο') ||
                   decoded.includes('Πασχαλινό') ||
                   decoded.includes('Θερινό') ||
                   decoded.includes('Ειδικό'))) {
                return rawHtmlContent
              }
              return match
            })
          }
        }
        
        onHtmlChange(htmlString)
      })
    })
  }, [editor, onHtmlChange])

  return null
}

