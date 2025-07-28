import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UIMessage } from "ai";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Icon } from "@/lib/icons";
import { IQuickAction } from "./types";
import { IconButton } from "@/components/icon-button";

interface ChatPanelProps {
  input: string;
  messages: UIMessage[];
  loading: boolean;
  onKeyPress: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  submitAction: VoidFunction;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  setSelectedModel: Dispatch<SetStateAction<string>>;
  selectedModel: string;
}
export const ChatPanel = ({
  input,
  messages,
  loading,
  onKeyPress,
  submitAction,
  onChange,
  setSelectedModel,
  selectedModel,
}: ChatPanelProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectModel = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value),
    [setSelectedModel],
  );

  return (
    <div
      className={`h-[calc(94lvh)] flex flex-col rounded-r-xl overflow-hidden`}
    >
      <div className="flex-1 bg-creamy/15 backdrop-blur-3xl flex flex-col">
        <div className="h-12 px-2 flex items-center justify-between border-b-[0.33px]">
          <div></div>
          <div>
            <IconButton
              fn={() => console.log("")}
              icon="px-code"
              // className="size-5"
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.role === "user" ? "You" : "Assistant"}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {message.role === "user"
                      ? message.content
                      : "Response rendered in center panel →"}
                  </div>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <>
                <div className="flex justify-end">
                  <div className="min-w-[95%] rounded-lg dark:inset-shadow-[0_1px_rgb(255_255_255/0.20)] p-3 bg-blue-500 text-white">
                    <div className="text-sm font-medium mb-1">You</div>
                    <div className="text-sm">
                      Can you explain how React hooks work?
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="min-w-[95%] rounded-md p-3 bg-gray-100 text-gray-900">
                    <div className="text-sm font-medium mb-1">Assistant</div>
                    <div className="text-sm">
                      Response rendered in center panel →
                    </div>
                  </div>
                </div>
                <div className="flex justify-end ">
                  <div className="min-w-[95%] rounded-lg dark:inset-shadow-[0_1px_rgb(255_255_255/0.20)] p-3 bg-blue-500 text-white">
                    <div className="text-sm font-medium mb-1">You</div>
                    <div className="text-sm">
                      Whats the difference between useState and useEffect?
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="min-w-[95%] rounded-lg p-3 bg-creamy  text-gray-900">
                    <div className="text-sm font-medium mb-1">Assistant</div>
                    <div className="text-sm">
                      Response rendered in center panel →
                    </div>
                  </div>
                </div>
              </>
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg p-3">
                  <div className="text-sm font-medium mb-1">Assistant</div>
                  <div className="text-sm text-gray-500">Thinking...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Actions - Only show when no messages exist */}
        {messages.length === 0 && (
          <div className="hidden px-4 py-2 border-t">
            <div className="text-xs text-gray-500 mb-2">Quick actions</div>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="h-8 justify-start text-xs rounded-md border border-gray-200 hover:border-gray-300"
                >
                  <Icon name={action.icon} className="h-3 w-3 mr-1" />
                  {action.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Panel */}
        <div className="border-t p-4 flex-shrink-0">
          <form onSubmit={submitAction} className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={onChange}
                  placeholder="Ask about programming concepts, languages, or frameworks..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pb-4 h-24"
                  disabled={loading}
                  onKeyDown={onKeyPress}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 bottom-2 h-8 w-8 p-0 rounded-md"
                  disabled={loading || !input?.trim()}
                >
                  <Icon name="px-arrow-up" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <SelectModel
                selectModel={selectModel}
                selectedModel={selectedModel}
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-sm bg-zinc-700"
              >
                <Icon solid name="px-chevrons-vertical" className="size-4" />
                New
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface SelectModelProps {
  selectedModel: string;
  selectModel: (e: ChangeEvent<HTMLSelectElement>) => void;
}
const SelectModel = ({ selectedModel, selectModel }: SelectModelProps) => (
  <div className="flex items-center gap-2">
    <select
      className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      value={selectedModel}
      onChange={selectModel}
    >
      {availableModels.map((model) => (
        <option key={model.id} value={model.id}>
          {model.name} ({model.provider})
        </option>
      ))}
    </select>
  </div>
);

const quickActions = [
  { icon: "px-code", text: "Explain a concept", prompt: "Explain how " },
  {
    icon: "px-chat",
    text: "Code example",
    prompt: "Show me a code example of ",
  },
  {
    icon: "px-chat",
    text: "Best practices",
    prompt: "What are the best practices for ",
  },
  { icon: "px-file", text: "Compare frameworks", prompt: "Compare " },
] as IQuickAction[];

// Available models
const availableModels = [
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google" },
  { id: "command-r-plus", name: "Command R+", provider: "Cohere" },
  { id: "command-r", name: "Command R", provider: "Cohere" },
];
