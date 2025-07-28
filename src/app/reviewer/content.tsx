"use client";

import { EncryptedChat } from "@/components/encrypted-chat";
import { ResizeControls } from "@/components/resize-controls";
import { ReviewerHeader } from "@/components/reviewer-header";
import { ReviewerStats } from "@/components/reviewer/main";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { EventsCtxProvider } from "@/ctx/events-ctx";
import { useResizeCtx } from "@/ctx/resize-ctx";
import { useChat } from "@ai-sdk/react";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImperativePanelHandle } from "react-resizable-panels";
import { ChatPanel } from "./chat-panel";
import { ReviewContent } from "./review-content";
import { HighlightItem } from "./types";
import { exampleMarkdown } from "./static-md";

export const Content = () => {
  const { leftExpanded, rightExpanded, centerExpanded } = useResizeCtx();
  const leftPanelRef = useRef<ImperativePanelHandle>(null);
  const centerPanelRef = useRef<ImperativePanelHandle>(null);
  const rightPanelRef = useRef<ImperativePanelHandle>(null);

  // Handle panel size changes based on toggle states
  useEffect(() => {
    if (leftPanelRef.current) {
      if (!leftExpanded) {
        leftPanelRef.current.collapse();
      } else {
        leftPanelRef.current.expand();
      }
    }
  }, [leftExpanded]);

  useEffect(() => {
    if (rightPanelRef.current) {
      if (rightExpanded) {
        rightPanelRef.current.resize(25); // Expand to 25%
      } else {
        rightPanelRef.current.resize(20); // Default size
      }
    }
  }, [rightExpanded]);

  useEffect(() => {
    if (centerExpanded && centerPanelRef.current) {
      // Get current panel sizes to determine action
      const leftSize = leftPanelRef.current?.getSize() || 0;
      const rightSize = rightPanelRef.current?.getSize() || 0;

      // If left panel is not collapsed (> 0), collapse it
      if (leftSize > 0) {
        leftPanelRef.current?.collapse();
      }
      // If right panel is not at min size (> 20), collapse it to min
      else if (rightSize > 20) {
        rightPanelRef.current?.resize(20);
      }
      // If both are already at minimum, return to default
      else {
        leftPanelRef.current?.resize(25);
        rightPanelRef.current?.resize(20);
        centerPanelRef.current.resize(50);
      }
    }
  }, [centerExpanded]);

  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const [loading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [highlights] = useState<HighlightItem[]>([]);
  const [externalLinks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  // == useChat ==
  const { messages, sendMessage } = useChat({
    messages: [],
  });

  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setInput(e.target.value);
  }, []);

  const onKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Removed unused variables and functions

  return (
    <EventsCtxProvider>
      <div className="bg-radial-[at_60%_30%] from-background to-muted/20 dark:from-foreground/80 dark:to-card-origin/80 ">
        <ReviewerHeader />
        <main className="h-[calc(94lvh)] flex flex-col w-screen">
          <div className="overflow-hidden">
            {/* Fixed Resize Controls - Always Centered */}
            <ResizeControls />

            <ResizablePanelGroup
              direction="horizontal"
              className="h-[calc(100vh-50px)]"
            >
              {/* Left Panel - Repositories */}
              <ResizablePanel
                ref={leftPanelRef}
                defaultSize={25}
                minSize={0}
                maxSize={30}
                collapsible={true}
                className="border-r-0"
              >
                <div>
                  <ChatPanel
                    messages={messages}
                    loading={loading}
                    input={input}
                    onKeyPress={onKeyPress}
                    submitAction={sendMessage}
                    onChange={onChange}
                    setSelectedModel={setSelectedModel}
                    selectedModel={selectedModel}
                  />
                </div>
              </ResizablePanel>

              <ResizableHandle className="border-l-none" />

              {/* Center Panel - Main Content */}
              <ResizablePanel
                ref={centerPanelRef}
                defaultSize={50}
                minSize={30}
              >
                <div className="relative h-full">
                  <div className="flex items-center justify-between w-full">
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
                defaultSize={20}
                minSize={20}
                maxSize={25}
              >
                <EncryptedChat />
                <div className={` bg-white flex `}>
                  <div>INDEXES</div>
                  <div>
                    {highlights.length} | {externalLinks.length}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </main>
      </div>
    </EventsCtxProvider>
  );
};
