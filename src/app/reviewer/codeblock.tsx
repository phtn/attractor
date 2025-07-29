"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopy } from "@/hooks/use-copy";
import { generateId } from "ai";
import {
  type CSSProperties,
  type Dispatch,
  type FC,
  type SetStateAction,
  memo,
  useCallback,
  useState,
} from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  a11yDark,
  dracula,
  materialDark,
  nightOwl,
  synthwave84,
  xonokai,
  zTouch,
  base16AteliersulphurpoolLight as base16,
  okaidia,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { szexTheme } from "./szex-theme";
import { IconMini } from "@/components/icon-mini";

interface Props {
  language: string;
  children: string;
}

interface languageMap {
  [key: string]: string | undefined;
}

export const programmingLanguages: languageMap = {
  javascript: ".js",
  python: ".py",
  java: ".java",
  c: ".c",
  cpp: ".cpp",
  "c++": ".cpp",
  "c#": ".cs",
  ruby: ".rb",
  php: ".php",
  swift: ".swift",
  "objective-c": ".m",
  kotlin: ".kt",
  typescript: ".ts",
  go: ".go",
  perl: ".pl",
  rust: ".rs",
  scala: ".scala",
  haskell: ".hs",
  lua: ".lua",
  shell: ".sh",
  sql: ".sql",
  html: ".html",
  css: ".css",
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
};

const styles = {
  dracula,
  xonokai,
  nightOwl,
  synthwave84,
  materialDark,
  a11yDark,
  zTouch,
  base16,
  okaidia,
  szex: szexTheme,
};

// Language normalization map for common aliases
const languageAliases: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  tsx: "typescript",
  jsx: "javascript",
  py: "python",
  rb: "ruby",
  sh: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  json: "javascript", // JSON highlighting works better with JS
};

const CodeBlock: FC<Props> = memo(({ language, children }) => {
  const { isCopied, copy } = useCopy({ timeout: 2000 });

  // Normalize language - handle aliases and fallbacks
  const normalizedLanguage =
    languageAliases[language?.toLowerCase()] ||
    language?.toLowerCase() ||
    "text";

  const downloadAsFile = () => {
    if (typeof window === "undefined") {
      return;
    }
    const fileExtension = programmingLanguages[normalizedLanguage] || ".file";
    const suggestedFileName = `file-${generateId()}${fileExtension}`;
    const fileName = window.prompt("Enter file name", suggestedFileName);

    if (!fileName) {
      // User pressed cancel on prompt.
      return;
    }

    const blob = new Blob([children], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onCopy = () => {
    if (isCopied) return;
    copy("code", children);
  };

  const [styleName, setStyleName] = useState<keyof typeof styles>("szex");

  return (
    <div className="relative w-full font-sans border-0 codeblock">
      <div className="flex items-center justify-between rounded-t-md w-full px-6 py-1 pr-4 -mb-0.5 bg-zinc-700/80">
        <span className="text-xs lowercase text-zinc-300">
          {normalizedLanguage}
        </span>
        <div className="flex items-center space-x-1.5">
          <StyleSelector styles={styles} setStyleName={setStyleName} />
          <IconMini icon="px-download" fn={downloadAsFile} />
          <IconMini fn={onCopy} icon={isCopied ? "px-check" : "px-copy"} />
        </div>
      </div>
      <SyntaxHighlighter
        PreTag="div"
        showLineNumbers
        language={normalizedLanguage}
        style={styles[styleName]}
        customStyle={{
          margin: 0,
          width: "100%",
          padding: "1.5rem 1rem",
          // Remove background: "transparent" to let the theme control colors
        }}
        lineNumberStyle={{
          userSelect: "none",
        }}
        codeTagProps={{
          style: {
            fontSize: "0.9rem",
            fontFamily: "var(--font-mono)",
          },
        }}
        className="rounded-t-0"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
});
CodeBlock.displayName = "CodeBlock";

interface StyleSelectorProps {
  styles: Record<string, Record<string, CSSProperties>>;
  setStyleName: Dispatch<SetStateAction<keyof typeof styles>>;
}

// Add a type guard for style keys
function isStyleKey(key: string): key is keyof typeof styles {
  return key in styles;
}

const StyleSelector = ({ styles, setStyleName }: StyleSelectorProps) => {
  const handleSet = useCallback(
    (name: keyof typeof styles) => () => {
      if (isStyleKey(name)) setStyleName(name);
    },
    [setStyleName],
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconMini
          asChild
          fn={() => console.log("trigger")}
          icon="px-chevrons-vertical"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.keys(styles)
          .filter(isStyleKey)
          .map((name) => (
            <DropdownMenuItem key={name} onClick={handleSet(name)}>
              <span className="font-space">{name}</span>
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CodeBlock };
