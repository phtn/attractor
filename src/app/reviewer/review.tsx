// "use client";

// import { useChat } from "@ai-sdk/react";
// import {
//   useState,
//   useEffect,
//   useRef,
//   type KeyboardEvent,
//   type ChangeEvent,
//   useCallback,
//   useMemo,
// } from "react";
// import { exampleMarkdown } from "./static-md";
// import { copyFn } from "@/utils/helpers";
// import { handleAsync } from "@/utils/async-handler";
// import { ReviewContent } from "./review-content";
// import { ChatPanel } from "./chat-panel";
// import { HighlightItem, TableOfContentsItem } from "./types";

// export const ReviewerPage = () => {
//   const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
//   const [navExpanded, setNavExpanded] = useState(false);
//   const [chatVisible, setChatVisible] = useState(true);
//   const [loading] = useState(false);
//   const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
//     [],
//   );
//   const contentRef = useRef<HTMLDivElement>(null);
//   const scrollToHeading = useCallback((headingId: string) => {
//     const element = contentRef.current?.querySelector(`#${headingId}`);
//     if (element) {
//       element.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   }, []);
//   const [highlights, setHighlights] = useState<HighlightItem[]>([]);
//   const [externalLinks, setExternalLinks] = useState<string[]>([]);
//   const { messages, input, handleInputChange, handleSubmit } = useChat({
//     body: {
//       model: selectedModel,
//     },
//   });

//   const headingMatches = useMemo(
//     () => exampleMarkdown.match(/^#{1,6}\s+(.+)$/gm),
//     [],
//   );
//   useEffect(() => {
//     if (headingMatches) {
//       const toc: TableOfContentsItem[] = headingMatches.map(
//         (heading, index) => {
//           const level = heading.match(/^#+/)?.[0].length || 1;
//           const text = heading.replace(/^#+\s+/, "");
//           return {
//             id: `heading-${index}`,
//             text,
//             level,
//           };
//         },
//       );
//       setTableOfContents(toc);
//     }
//   }, [headingMatches]);

//   const handleQuickAction = useCallback(
//     (prompt: string) => {
//       handleInputChange({
//         target: { value: prompt },
//       } as ChangeEvent<HTMLTextAreaElement>);
//     },
//     [handleInputChange],
//   );
//   // Function to scroll to heading in middle column

//   const assistantMessages = messages.filter((m) => m.role === "assistant");
//   const latestAssistantMessage = useMemo(
//     () => assistantMessages[assistantMessages.length - 1],
//     [assistantMessages],
//   );

//   // Calculate dynamic widths based on chat visibility and nav expansion
//   const getColumnWidths = () => {
//     if (!chatVisible) {
//       // Chat hidden - middle and nav columns expand
//       return {
//         chat: "w-0",
//         middle: navExpanded ? "w-9/12" : "w-10/12",
//         nav: navExpanded ? "w-3/12" : "w-2/12",
//       };
//     } else {
//       // Chat visible - original layout
//       return {
//         chat: navExpanded ? "w-3/12" : "w-4/12",
//         middle: "w-6/12",
//         nav: navExpanded ? "w-3/12" : "w-2/12",
//       };
//     }
//   };

//   const columnWidths = getColumnWidths();

//   const onKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSubmit();
//     }
//   };

//   const onCopy = useCallback(
//     (name: string, text: string) => async () => {
//       await handleAsync(copyFn)({ name, text });
//     },
//     [],
//   );

//   const handleScrollToHeading = useCallback(
//     (id: string) => () => scrollToHeading(id),
//     [scrollToHeading],
//   );

//   return (
//     <div className="flex h-screen bg-gray-50 relative">
//       {/* Left Column - Chat Interface */}

//       {/* Chat Messages */}
//       <ChatPanel
//         chatVisible={chatVisible}
//         chatColumn={columnWidths.chat}
//         messages={messages}
//         loading={loading}
//         onQuickAction={handleQuickAction}
//         input={input}
//         onKeyPress={onKeyPress}
//         submitAction={handleSubmit}
//         onChange={handleInputChange}
//         setSelectedModel={setSelectedModel}
//         selectedModel={selectedModel}
//       />

//       {/* Middle Column - Assistant Response */}
//       <ReviewContent
//         latestAssistantMessage={latestAssistantMessage}
//         onCopy={onCopy}
//         setChatVisible={setChatVisible}
//         chatVisible={chatVisible}
//         middleColumn={columnWidths.middle}
//         tableOfContents={tableOfContents}
//         setHighlights={setHighlights}
//         setExternalLinks={setExternalLinks}
//         contentRef={contentRef}
//       />

//       {/* Right Column - Navigation & Highlights */}
//       {/* <Indexes /> */}
//       <div
//         className={`${columnWidths.nav} bg-white flex flex-col border-l border-gray-100 transition-all duration-300 ease-in-out`}
//       >
//         <div>INDEXES</div>
//         <div>{highlights.length}</div>
//         <div>{externalLinks.length}</div>
//       </div>
//     </div>
//   );
// };
