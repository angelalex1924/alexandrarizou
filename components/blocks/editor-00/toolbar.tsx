"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, $insertNodes, $getRoot, $createParagraphNode, $createTextNode } from "lexical"
import { $setBlocksType } from "@lexical/selection"
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text"
import { $createQuoteNode } from "@lexical/rich-text"
import { $generateNodesFromDOM } from "@lexical/html"
import { Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from "@lexical/list"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { HOLIDAY_THEMES, type HolidayType } from "@/lib/holidayThemes"

export function Toolbar() {
  const [editor] = useLexicalComposerContext()
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize))
      }
    })
  }

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode())
      }
    })
  }

  const insertSchedule = (holidayType: HolidayType = 'christmas') => {
    editor.update(() => {
      const selection = $getSelection()
      const theme = HOLIDAY_THEMES[holidayType]
      
      // Create schedule HTML with holiday-specific styling
      const scheduleHtml = `<div style="background: linear-gradient(135deg, ${theme.colors.itemBg}, rgba(255,255,255,0.5)); border: 2px solid ${theme.colors.border}; border-radius: 12px; padding: 20px; margin: 20px 0;"><h2 style="color: ${theme.colors.accent}; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">${theme.title.el}</h2><ul style="list-style: none; padding: 0; margin: 0;"><li style="padding: 8px 0; border-bottom: 1px solid ${theme.colors.itemBorder};"><strong style="color: ${theme.colors.accent};">Δευτέρα:</strong> 10:00-18:00</li><li style="padding: 8px 0; border-bottom: 1px solid ${theme.colors.itemBorder};"><strong style="color: ${theme.colors.accent};">Τρίτη:</strong> 10:00-18:00</li><li style="padding: 8px 0; border-bottom: 1px solid ${theme.colors.itemBorder};"><strong style="color: ${theme.colors.accent};">Τετάρτη:</strong> 10:00-18:00</li><li style="padding: 8px 0; border-bottom: 1px solid ${theme.colors.itemBorder};"><strong style="color: ${theme.colors.accent};">Πέμπτη:</strong> 10:00-18:00</li><li style="padding: 8px 0; border-bottom: 1px solid ${theme.colors.itemBorder};"><strong style="color: ${theme.colors.accent};">Παρασκευή:</strong> 10:00-18:00</li><li style="padding: 8px 0; border-bottom: 1px solid ${theme.colors.itemBorder};"><strong style="color: ${theme.colors.accent};">Σάββατο:</strong> 10:00-16:00</li><li style="padding: 8px 0;"><strong style="color: ${theme.colors.accent};">Κυριακή:</strong> Κλειστά</li></ul><p style="margin-top: 12px; font-size: 13px; color: ${theme.colors.text}; opacity: 0.8;"></p></div>`
      
      // Insert as raw HTML text - we'll detect and convert it back during export
      const paragraph = $createParagraphNode()
      const htmlText = $createTextNode(scheduleHtml)
      paragraph.append(htmlText)
      
      if (selection && $isRangeSelection(selection)) {
        selection.insertNodes([paragraph])
      } else {
        $insertNodes([paragraph])
      }
      
      setShowScheduleDialog(false)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-slate-50 dark:bg-slate-800">
      {/* Text Formatting */}
      <div className="flex items-center gap-1 pr-2 border-r border-slate-300 dark:border-slate-600">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("bold")}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("italic")}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("underline")}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatText("strikethrough")}
          className="h-8 w-8 p-0"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 pr-2 border-r border-slate-300 dark:border-slate-600">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatHeading("h1")}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatHeading("h2")}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => formatHeading("h3")}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatParagraph}
          className="h-8 px-2 text-xs"
          title="Paragraph"
        >
          P
        </Button>
      </div>

      {/* Lists & Quote */}
      <div className="flex items-center gap-1 pr-2 border-r border-slate-300 dark:border-slate-600">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatQuote}
          className="h-8 w-8 p-0"
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      {/* Schedule */}
      <div className="flex items-center gap-1">
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              title="Insert Schedule"
            >
              <Calendar className="h-4 w-4 mr-1" />
              Ωράριο
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Επιλέξτε Τύπο Ωραρίου</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {Object.values(HOLIDAY_THEMES).map((theme) => (
                <Button
                  key={theme.type}
                  type="button"
                  variant="outline"
                  onClick={() => insertSchedule(theme.type)}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                  style={{
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.itemBg,
                  }}
                >
                  <span className="text-2xl">{theme.icon.startsWith('/') ? '🎄' : theme.icon}</span>
                  <span className="text-sm font-semibold" style={{ color: theme.colors.accent }}>
                    {theme.title.el}
                  </span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

