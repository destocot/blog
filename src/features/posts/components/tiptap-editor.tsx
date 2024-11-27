'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  SquareCodeIcon,
  Quote,
  Undo,
  Redo,
} from 'lucide-react'

type TiptapEditorProps = {
  content: string
  onChange: (value: string) => void
}

export const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class:
          'w-full max-w-none focus:outline-none [&>p]:my-0.5 text-sm text-foreground [&_*]:text-foreground prose dark:prose-invert [&_.has-focus]:ring-0 [&_pre]:!bg-muted [&_code]:!bg-muted dark:[&_pre]:!bg-muted/50 dark:[&_code]:!bg-muted/50 [&_blockquote]:!border-l-muted-foreground [&_blockquote]:!border-l-2',
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Tab') {
          const { state, dispatch } = view
          event.preventDefault()
          dispatch(state.tr.insertText('    '))
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor)
    return (
      <div className='min-h-[205px] animate-pulse rounded-md bg-muted/80' />
    )

  return (
    <div className='flex flex-col gap-y-2 bg-background'>
      <TiptapEditorToolbar editor={editor} />
      <div
        className='custom-scrollbar h-64 flex-grow rounded-md border border-input ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent
          editor={editor}
          className='h-full w-full cursor-text overflow-y-auto px-3 py-2'
        />
      </div>
    </div>
  )
}

const ToolbarButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type='button'
    className={`rounded p-1.5 ${
      isActive
        ? 'bg-muted text-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
)

const TiptapEditorToolbar = ({ editor }: { editor: Editor }) => {
  return (
    <div className='flex flex-wrap gap-1 border-b border-input bg-muted/50 px-2 py-1'>
      <ToolbarButton
        isActive={false}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={false}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <SquareCodeIcon className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        isActive={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className='h-4 w-4' />
      </ToolbarButton>
    </div>
  )
}
