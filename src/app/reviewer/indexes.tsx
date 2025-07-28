// import { Button } from "@/components/ui/button";
// import { CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   ExternalLink,
//   Hash,
//   Download,
//   ChevronRight,
//   Maximize2,
//   Minimize2,
// } from "lucide-react";

// export const Indexes = () => {
//   return (
//     <div
//       className={` bg-white flex flex-col border-l border-gray-100 transition-all duration-300 ease-in-out`}
//     >
//       <CardHeader className="border-b h-16 flex-shrink-0 flex items-center bg-gray-50">
//         <div className="flex items-center justify-between w-full">
//           <CardTitle className="flex items-center gap-2 text-sm font-mono uppercase tracking-wide">
//             <Hash className="h-4 w-4" />
//             NAV
//           </CardTitle>
//           <div className="flex items-center gap-1">
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0 hover:bg-black hover:text-white transition-colors"
//               onClick={() => setNavExpanded(!navExpanded)}
//             >
//               {navExpanded ? (
//                 <Minimize2 className="h-3 w-3" />
//               ) : (
//                 <Maximize2 className="h-3 w-3" />
//               )}
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-6 w-6 p-0 hover:bg-black hover:text-white transition-colors"
//             >
//               <Download className="h-3 w-3" />
//             </Button>
//           </div>
//         </div>
//       </CardHeader>

//       <div className="flex-1 min-h-0 bg-gray-50">
//         <ScrollArea className="h-full">
//           <div
//             className={`${navExpanded ? "p-4" : "p-3"} space-y-4 transition-all duration-300`}
//           >
//             {/* Table of Contents */}
//             {tableOfContents.length > 0 && (
//               <div className="border border-gray-200 bg-white">
//                 <div className="px-3 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider">
//                   Contents
//                 </div>
//                 <div
//                   className={`${navExpanded ? "p-3" : "p-2"} space-y-1 transition-all duration-300`}
//                 >
//                   {tableOfContents.map((item) => (
//                     <button
//                       key={item.id}
//                       onClick={handleScrollToHeading(item.id)}
//                       className={`block w-full text-left ${navExpanded ? "text-sm" : "text-xs"} hover:bg-black hover:text-white transition-colors p-1 font-mono cursor-pointer ${
//                         item.level === 1
//                           ? "font-bold"
//                           : item.level === 2
//                             ? navExpanded
//                               ? "ml-3"
//                               : "ml-2"
//                             : item.level === 3
//                               ? navExpanded
//                                 ? "ml-6"
//                                 : "ml-4"
//                               : navExpanded
//                                 ? "ml-9"
//                                 : "ml-6"
//                       }`}
//                     >
//                       <span className="flex items-center gap-1">
//                         {item.level > 1 && (
//                           <ChevronRight
//                             className={`${navExpanded ? "h-3 w-3" : "h-2 w-2"}`}
//                           />
//                         )}
//                         <span
//                           className={`${navExpanded ? "leading-relaxed" : "leading-tight"} break-words`}
//                         >
//                           {navExpanded
//                             ? item.text
//                             : item.text.length > 20
//                               ? item.text.substring(0, 20) + "..."
//                               : item.text}
//                         </span>
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Highlights */}
//             {highlights.length > 0 && (
//               <div className="border border-gray-200 bg-white">
//                 <div className="px-3 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider">
//                   Highlights
//                 </div>
//                 <div
//                   className={`${navExpanded ? "p-3" : "p-2"} space-y-2 transition-all duration-300`}
//                 >
//                   {highlights
//                     .slice(0, navExpanded ? 12 : 8)
//                     .map((highlight) => (
//                       <div
//                         key={highlight.id}
//                         className={`border-l-2 pl-2 py-1 ${navExpanded ? "text-sm" : "text-xs"} font-mono ${
//                           highlight.type === "concept"
//                             ? "border-black bg-gray-100"
//                             : highlight.type === "code"
//                               ? "border-gray-400 bg-gray-50"
//                               : highlight.type === "math"
//                                 ? "border-gray-600 bg-gray-100"
//                                 : "border-gray-300 bg-white"
//                         }`}
//                       >
//                         <div className="font-bold uppercase text-[10px] tracking-wider mb-1">
//                           {highlight.type}
//                         </div>
//                         <div
//                           className={`break-words ${navExpanded ? "leading-relaxed" : "leading-tight"}`}
//                         >
//                           {navExpanded
//                             ? highlight.text
//                             : highlight.text.length > 25
//                               ? highlight.text.substring(0, 25) + "..."
//                               : highlight.text}
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {/* External Links */}
//             {externalLinks.length > 0 && (
//               <div className="border border-gray-200 bg-white">
//                 <div className="px-3 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider">
//                   Links
//                 </div>
//                 <div
//                   className={`${navExpanded ? "p-3" : "p-2"} space-y-1 transition-all duration-300`}
//                 >
//                   {externalLinks
//                     .slice(0, navExpanded ? 6 : 4)
//                     .map((link, index) => (
//                       <a
//                         key={index}
//                         href={link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className={`flex items-center gap-1 ${navExpanded ? "text-sm" : "text-xs"} font-mono hover:bg-black hover:text-white transition-colors p-1 break-all`}
//                       >
//                         <ExternalLink
//                           className={`${navExpanded ? "h-3 w-3" : "h-2 w-2"} flex-shrink-0`}
//                         />
//                         <span
//                           className={`${navExpanded ? "break-all" : "truncate"}`}
//                         >
//                           {navExpanded
//                             ? link.replace(/https?:\/\//, "")
//                             : link.replace(/https?:\/\//, "").substring(0, 15) +
//                               "..."}
//                         </span>
//                       </a>
//                     ))}
//                 </div>
//               </div>
//             )}

//             {/* Stats */}
//             <div className="border border-gray-200 bg-white">
//               <div className="px-3 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider">
//                 Stats
//               </div>
//               <div
//                 className={`${navExpanded ? "p-3" : "p-2"} space-y-1 ${navExpanded ? "text-sm" : "text-xs"} font-mono transition-all duration-300`}
//               >
//                 <div className="flex justify-between">
//                   <span>SECTIONS</span>
//                   <span>{tableOfContents.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>HIGHLIGHTS</span>
//                   <span>{highlights.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>LINKS</span>
//                   <span>{externalLinks.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>WORDS</span>
//                   <span>{exampleMarkdown.split(" ").length}</span>
//                 </div>
//                 {navExpanded && (
//                   <>
//                     <div className="flex justify-between">
//                       <span>CHARS</span>
//                       <span>{exampleMarkdown.length}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>READ TIME</span>
//                       <span>
//                         {Math.ceil(exampleMarkdown.split(" ").length / 200)}m
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {tableOfContents.length === 0 &&
//               highlights.length === 0 &&
//               externalLinks.length === 0 && (
//                 <div className="border border-gray-200 bg-white p-4 text-center">
//                   <Hash className="h-6 w-6 mx-auto mb-2 text-gray-400" />
//                   <p className="text-xs font-mono uppercase tracking-wide text-gray-500">
//                     No Data
//                   </p>
//                 </div>
//               )}
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// };
