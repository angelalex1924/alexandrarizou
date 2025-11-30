import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, $insertNodes } from 'lexical'
import { SerializedEditorState } from 'lexical'

/**
 * Convert HTML string to Lexical editor state
 */
export function htmlToEditorState(html: string): SerializedEditorState {
  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser()
  const dom = parser.parseFromString(html, 'text/html')
  
  // Create a minimal editor state structure
  const editorState: SerializedEditorState = {
    root: {
      children: [],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  } as SerializedEditorState

  // Convert DOM nodes to Lexical nodes
  // This is a simplified version - in production you'd use $generateNodesFromDOM
  // For now, we'll create a simple paragraph with the HTML content
  if (dom.body && dom.body.innerHTML) {
    // Create a paragraph node with the HTML content
    const paragraphNode = {
      children: [
        {
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text: dom.body.textContent || '',
          type: 'text',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'paragraph',
      version: 1,
    }

    editorState.root.children = [paragraphNode]
  }

  return editorState
}

/**
 * Convert Lexical editor state to HTML string
 * Properly converts formatting (bold, italic, headings, lists, etc.)
 */
export function editorStateToHtml(editorState: SerializedEditorState): string {
  if (!editorState || !editorState.root || !editorState.root.children) {
    return ''
  }

  const convertNode = (node: any): string => {
    if (!node) return ''

    // Text node
    if (node.type === 'text') {
      let text = node.text || ''
      
      // Apply formatting (handle combined formats correctly)
      if (node.format) {
        const format = node.format
        const tags: string[] = []
        
        if (format & 1) tags.push('strong') // Bold
        if (format & 2) tags.push('em') // Italic
        if (format & 4) tags.push('u') // Underline
        if (format & 8) tags.push('s') // Strikethrough
        
        // Wrap text with all applicable tags
        tags.forEach(tag => {
          text = `<${tag}>${text}</${tag}>`
        })
      }
      
      return text
    }

    // Heading nodes
    if (node.type === 'heading') {
      const tag = node.tag || 'h1'
      const content = node.children ? node.children.map(convertNode).join('') : ''
      return `<${tag}>${content}</${tag}>`
    }

    // Paragraph node
    if (node.type === 'paragraph') {
      const content = node.children ? node.children.map(convertNode).join('') : ''
      // Check if content is HTML (starts with <div or contains style=)
      if (content.trim().startsWith('<div') || content.includes('style=')) {
        // Return HTML as-is (for schedule blocks)
        return content
      }
      return content ? `<p>${content}</p>` : '<p><br></p>'
    }

    // Quote node
    if (node.type === 'quote') {
      const content = node.children ? node.children.map(convertNode).join('') : ''
      return `<blockquote>${content}</blockquote>`
    }

    // List nodes
    if (node.type === 'list') {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const content = node.children ? node.children.map(convertNode).join('') : ''
      return `<${tag}>${content}</${tag}>`
    }

    if (node.type === 'listitem') {
      const content = node.children ? node.children.map(convertNode).join('') : ''
      return `<li>${content}</li>`
    }

    // Default: process children
    if (node.children && Array.isArray(node.children)) {
      return node.children.map(convertNode).join('')
    }

    return ''
  }

  const html = editorState.root.children.map(convertNode).join('')
  return html
}

