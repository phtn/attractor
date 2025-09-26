'use client'

import { EncryptedChat } from '@/components/encrypted-chat'
import { ResizeControls } from '@/components/resize-controls'
import { ReviewerHeader } from '@/components/reviewer-header'
import { ReviewerStats } from '@/components/reviewer/main'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { EventsCtxProvider } from '@/ctx/events-ctx'
import { useResizeCtx } from '@/ctx/resize-ctx'
import { useChat } from '@ai-sdk/react'
import {
  ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { ChatPanel } from './chat-panel'
import { ReviewContent } from './review-content'
// import { HighlightItem } from "./types";
import { exampleMarkdown } from './static-md'
import { DefaultChatTransport } from 'ai'

export const Content = () => {
  const { leftExpanded, rightExpanded, centerExpanded } = useResizeCtx()
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const centerPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)

  // Handle panel size changes based on toggle states
  useEffect(() => {
    if (leftPanelRef.current) {
      if (!leftExpanded) {
        leftPanelRef.current.collapse()
      } else {
        leftPanelRef.current.expand()
      }
    }
  }, [leftExpanded])

  useEffect(() => {
    if (rightPanelRef.current) {
      if (rightExpanded) {
        rightPanelRef.current.collapse() // Expand to 25%
      } else {
        rightPanelRef.current.expand() // Default size
      }
    }
  }, [rightExpanded])

  useEffect(() => {
    if (centerExpanded && centerPanelRef.current) {
      // Get current panel sizes to determine action
      const leftSize = leftPanelRef.current?.getSize() || 0
      rightPanelRef.current?.getSize()

      // If left panel is not collapsed (> 0), collapse it
      if (leftSize > 0) {
        leftPanelRef.current?.collapse()
      } else if (rightPanelRef.current && rightPanelRef.current.getSize() > 20) {
        // If right panel is not at min size (> 20), collapse it to min
        rightPanelRef.current?.resize(0)
      } else {
        // If both are already at minimum, return to default
        leftPanelRef.current?.resize(25)
        rightPanelRef.current?.resize(20)
        centerPanelRef.current.resize(50)
      }
    }
  }, [centerExpanded])

  const [selectedModel, setSelectedModel] = useState('gemini-1.5-pro')
  const [loading] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  // const [highlights] = useState<HighlightItem[]>([]);
  // const [externalLinks] = useState<string[]>([]);
  const [input, setInput] = useState('')

  // == useChat == // AI-SDK v5
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/reviewer/chat',
      headers: {},
    }),
  })

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setInput(e.currentTarget.value)
  }, [])

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      sendMessage({ text: input })
    },
    [sendMessage, input]
  )

  const onKeyPress = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  // Removed unused variables and functions

  return (
    <EventsCtxProvider>
      <div className='reviewer bg-radial-[at_60%_30%] from-background to-muted/20 dark:from-foreground/80 dark:to-card-origin/80'>
        <ReviewerHeader />
        <main className=' flex flex-col w-screen overflow-hidden scrollbar-none'>
          <div className='z-40'>
            {/* Fixed Resize Controls - Always Centered */}
            <ResizeControls />

            <ResizablePanelGroup
              direction='horizontal'
              className='pointer-events-none'
            >
              {/* Left Panel - Repositories */}
              <ResizablePanel
                ref={leftPanelRef}
                defaultSize={25}
                minSize={0}
                maxSize={30}
                collapsible
                className='h-full pointer-events-none border-r-0 mt-16 z-50'
              >
                <div className='pointer-events-auto'>
                  <ChatPanel
                    messages={messages}
                    loading={loading}
                    input={input}
                    onKeyPress={onKeyPress}
                    submitAction={onSubmit}
                    onChange={onChange}
                    setSelectedModel={setSelectedModel}
                    selectedModel={selectedModel}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle className='border-l-none' />

              {/* Center Panel - Main Content */}
              <ResizablePanel
                ref={centerPanelRef}
                defaultSize={50}
                minSize={30}
                className='mt-8 h-[97vh] pointer-events-auto'
              >
                <div className='z-100'>
                  <div className='flex items-end justify-between w-full'>
                    <ReviewerStats />
                  </div>
                  <ReviewContent
                    entry={exampleMarkdown}
                    contentRef={contentRef}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle />

              {/* Right Panel - Chat */}
              <ResizablePanel
                ref={rightPanelRef}
                minSize={0}
                maxSize={20}
                defaultSize={20}
                className='mt-16 pointer-events-none'
              >
                <EncryptedChat />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      </div>
    </EventsCtxProvider>
  )
}
