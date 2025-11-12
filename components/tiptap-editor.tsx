"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableHeader } from "@tiptap/extension-table-header"
import { TableCell } from "@tiptap/extension-table-cell"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Underline } from "@tiptap/extension-underline"
import { TextAlign } from "@tiptap/extension-text-align"
import { Color } from "@tiptap/extension-color"
import { Highlight } from "@tiptap/extension-highlight"
import { TextStyle } from "@tiptap/extension-text-style"
import { useProposalStore } from "@/lib/store"
import { useEffect } from "react"
import { PageBreak } from "@/lib/page-break-extension"
// import { PlaceholderExtension } from "@/lib/placeholder-extension"

export function TiptapEditor({ onEditorReady }) {
  const { content, setContent } = useProposalStore()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: 'table-wrapper',
        },
      }),
      TableRow,
      TableHeader,
      TableCell.extend({
        addAttributes() {
          return {
            backgroundColor: {
              default: null,
              parseHTML: element => element.style.backgroundColor || null,
              renderHTML: attributes => {
                if (!attributes.backgroundColor) {
                  return {}
                }
                return {
                  style: `background-color: ${attributes.backgroundColor}`,
                }
              },
            },
            color: {
              default: null,
              parseHTML: element => element.style.color || null,
              renderHTML: attributes => {
                if (!attributes.color) {
                  return {}
                }
                return {
                  style: `color: ${attributes.color}`,
                }
              },
            },
          }
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Placeholder.configure({
        placeholder: "Start writing your professional proposal here...",
        emptyEditorClass: "is-editor-empty",
      }),
      PageBreak,
      // PlaceholderExtension,
    ],
    content:
      content ||
      `<h1 style="text-align: center; color: #2563eb;">Professional Business Proposal</h1>
      <h2>Executive Summary</h2>
      <p>This proposal outlines our comprehensive solution to meet your business objectives. Our team brings extensive experience and proven methodologies to deliver exceptional results.</p>
      <h2>Project Overview</h2>
      <p>Start customizing this template with your specific project details, timeline, and deliverables.</p>
      <h2>Investment & Timeline</h2>
      <p>Budget: <span data-placeholder-key="budget">{{budget}}</span></p>
      <p>Timeline: <span data-placeholder-key="timeline">{{timeline}}</span></p>`,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/10 p-8 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.03), transparent 50%)'
      }}></div>
      <div className="mx-auto max-w-4xl relative z-10">
        <div className="prose dark:prose-invert max-w-none prose-p:my-3 prose-h1:mt-8 prose-h1:mb-6 prose-h2:mt-6 prose-h2:mb-4 prose-h3:mt-5 prose-h3:mb-3">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-border/50 transition-all duration-300 hover:shadow-2xl">
            <EditorContent editor={editor} className="editor-content" />
          </div>
        </div>
      </div>
    </div>
  )
}
