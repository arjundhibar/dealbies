"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Smile,
  Send,
  SendHorizonal
} from 'lucide-react'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

interface TipTapEditorProps {
  placeholder?: string
  onSubmit: (content: string) => void
  disabled?: boolean
  className?: string
}

export function TipTapEditor({ 
  placeholder = "Write a comment...", 
  onSubmit, 
  disabled = false,
  className = ""
}: TipTapEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
      onFocus: () => setIsExpanded(true),
    immediatelyRender: false,
  })

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const addEmoji = (emoji: any) => {
    editor?.chain().focus().insertContent(emoji.native).run()
    setShowEmojiPicker(false)
  }

  const handleSubmit = () => {
    const content = editor?.getHTML() || ''
    if (content.trim() && !disabled) {
      onSubmit(content)
      editor?.commands.clearContent()
      setIsExpanded(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`
          border rounded-lg transition-all duration-200 ease-in-out dark:bg-[#1d1f20]
          ${isExpanded ? 'border-gray-300 dark:border-gray-500 shadow-sm' : 'border-gray-200'}
          ${disabled ? 'bg-gray-50' : 'bg-white'}
        `}
      >
        {/* Editor Content */}
        <div className="p-3">
          <EditorContent 
            editor={editor} 
            onKeyDown={handleKeyDown}
            className={`
              min-h-[40px] max-h-32 overflow-y-auto 
              ${isExpanded ? 'min-h-[80px]' : ''}
            `}
          />
        </div>

        {/* Toolbar and Submit Button Container - only show when expanded */}
        {isExpanded && (
          <div className="flex items-center justify-between p-2 bg-white dark:bg-[#1d1f20]">
            {/* Toolbar - positioned on the left */}
            <div className="flex items-center gap-1">
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Picker
                    data={data}
                    onEmojiSelect={addEmoji}
                    theme="light"
                    set="native"
                    previewPosition="none"
                    skinTonePosition="none"
                  />
                </PopoverContent>
              </Popover>

              <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={editor.isActive('link') ? 'bg-gray-200' : ''}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3">
                  <div className="flex gap-2">
                    <Input
                      ref={linkInputRef}
                      placeholder="Enter URL..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addLink()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addLink}>
                      Add
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={showImageInput} onOpenChange={setShowImageInput}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3">
                  <div className="flex gap-2">
                    <Input
                      ref={imageInputRef}
                      placeholder="Enter image URL..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addImage()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={addImage}>
                      Add
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Submit Button - positioned on the right */}
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={disabled || !editor.getText().trim()}
              className="flex items-center gap-2 rounded-full disabled:text-[#a7a9ac] disabled:bg-[#f3f5f7] dark:disabled:text-[#8b8d90] dark:disabled:bg-[#363739] bg-[#f7641b] hover:bg-[#eb611f]"
            >
              <SendHorizonal className="h-4 w-4" />
              Respond
            </Button>
          </div>
        )}


      </div>
    </div>
  )
}
