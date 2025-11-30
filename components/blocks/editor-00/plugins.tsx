import { useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { Toolbar } from "./toolbar"
import { HtmlExportPlugin } from "./HtmlExportPlugin"

interface PluginsProps {
  onHtmlChange?: (html: string) => void
}

export function Plugins({ onHtmlChange }: PluginsProps) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <Toolbar />
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Start typing ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        {onHtmlChange && <HtmlExportPlugin onHtmlChange={onHtmlChange} />}
        {/* editor plugins */}
      </div>
      {/* actions plugins */}
    </div>
  )
}
