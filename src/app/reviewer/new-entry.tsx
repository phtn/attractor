import "katex/dist/katex.min.css";
import { type FC, useMemo, type ComponentProps, type ReactNode } from "react";
import ReactMarkdown, { Components } from "react-markdown";
// import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "./codeblock";
import { Icon } from "@/lib/icons";
import { ClassName } from "../types";

interface MarkdownParserProps {
  content: string;
  className?: string;
  allowDangerousHtml?: boolean;
  maxWidth?: string;
}

// const CodeBlocks: FC<CodeBlockProps> = ({ children, className, ...props }) => {
//   const [copied, setCopied] = useState<boolean>(false);
//   const match = /language-(\w+)/.exec(className || "");
//   const language = match ? match[1] : "text";

//   const handleCopy = async (): Promise<void> => {
//     try {
//       await navigator.clipboard.writeText(children);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Failed to copy code:", err);
//     }
//   };

//   if (!match) {
//     return (
//       <code
//         className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
//         {...props}
//       >
//         {children}
//       </code>
//     );
//   }

//   return (
//     <div className="relative group">
//       <button
//         onClick={handleCopy}
//         className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
//         title={copied ? "Copied!" : "Copy code"}
//       >
//         {copied ? <Check size={16} /> : <Copy size={16} />}
//       </button>
//       <SyntaxHighlighter
//         language={language}
//         style={tomorrow}
//         showLineNumbers={true}
//         wrapLines={true}
//         customStyle={{
//           margin: 0,
//           borderRadius: "0.5rem",
//           fontSize: "0.875rem",
//         }}
//         {...props}
//       >
//         {children}
//       </SyntaxHighlighter>
//     </div>
//   );
// };

const LinkRenderer: FC<{ href?: string; children: ReactNode }> = ({
  href,
  children,
}) => {
  const isExternal =
    href && (href.startsWith("http") || href.startsWith("https"));

  return (
    <a
      href={href}
      className="text-blue-900 dark:text-zinc-900 dark:hover:decoration-geist-teal dark:hover:text-zinc-950 underline decoration underline-offset-4 hover:decoration-blue-600 dark:decoration-orange-300/30 transition-colors duration-200"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
      {isExternal && (
        <Icon
          name="px-check"
          className="inline ml-1 mb-1 size-4"
          aria-label="External link"
        />
      )}
    </a>
  );
};

const TableRenderer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
      {children}
    </table>
  </div>
);

const TableHeadRenderer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>;

const TableRowRenderer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
    {children}
  </tr>
);

const TableCellRenderer: React.FC<{
  children: React.ReactNode;
  isHeader?: boolean;
}> = ({ children, isHeader = false }) => {
  const Tag = isHeader ? "th" : "td";
  return (
    <Tag
      className={`px-4 py-2 text-left border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
        isHeader
          ? "font-semibold text-gray-900 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300"
      }`}
    >
      {children}
    </Tag>
  );
};

const BlockquoteRenderer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300">
    {children}
  </blockquote>
);

interface HeadingProps {
  children: ReactNode;
  id?: string;
}

const HeadingRenderer = (level: number) => {
  const HeadingComponent = ({ children, id }: HeadingProps) => {
    const sizes = {
      1: "text-3xl font-bold mt-8 mb-4",
      2: "text-2xl font-semibold mt-6 mb-3",
      3: "text-xl font-semibold mt-5 mb-2",
      4: "text-lg font-medium mt-4 mb-2",
      5: "text-base font-medium mt-3 mb-2",
      6: "text-sm font-medium mt-2 mb-1",
    };

    const className = `${sizes[level as keyof typeof sizes]} text-gray-900 dark:text-gray-100 group`;

    switch (level) {
      case 1:
        return (
          <h1 id={id} className={className}>
            {children}
          </h1>
        );
      case 2:
        return (
          <h2 id={id} className={className}>
            {children}
          </h2>
        );
      case 3:
        return (
          <h3 id={id} className={className}>
            {children}
          </h3>
        );
      case 4:
        return (
          <h4 id={id} className={className}>
            {children}
          </h4>
        );
      case 5:
        return (
          <h5 id={id} className={className}>
            {children}
          </h5>
        );
      case 6:
        return (
          <h6 id={id} className={className}>
            {children}
          </h6>
        );
      default:
        return (
          <h1 id={id} className={className}>
            {children}
          </h1>
        );
    }
  };

  HeadingComponent.displayName = `Heading${level}`;
  return HeadingComponent;
};

interface ICode {
  children: string;
  className: ClassName;
  props: Record<string, string | number | boolean>;
}

const MarkdownParser: FC<MarkdownParserProps> = ({
  content,
  className = "",
  allowDangerousHtml = false,
  maxWidth = "none",
}) => {
  const components = useMemo(
    () =>
      ({
        code: ({ className, children, ...props }: ICode) => {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "text";

          // If it's a code block (has className with language-), use CodeBlock
          if (match && typeof children === "string") {
            return <CodeBlock language={language}>{children}</CodeBlock>;
          }

          // Otherwise, it's inline code
          return (
            <code
              className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        a: LinkRenderer,
        table: TableRenderer,
        thead: TableHeadRenderer,
        tr: TableRowRenderer,
        td: (props: ComponentProps<typeof TableCellRenderer>) => (
          <TableCellRenderer {...props} isHeader={false} />
        ),
        th: (props: ComponentProps<typeof TableCellRenderer>) => (
          <TableCellRenderer {...props} isHeader={true} />
        ),
        blockquote: BlockquoteRenderer,
        h1: HeadingRenderer(1),
        h2: HeadingRenderer(2),
        h3: HeadingRenderer(3),
        h4: HeadingRenderer(4),
        h5: HeadingRenderer(5),
        h6: HeadingRenderer(6),
        p: ({ children }: { children: React.ReactNode }) => (
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-7">
            {children}
          </p>
        ),
        ul: ({ children }: { children: React.ReactNode }) => (
          <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
            {children}
          </ul>
        ),
        ol: ({ children }: { children: React.ReactNode }) => (
          <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
            {children}
          </ol>
        ),
        li: ({ children }: { children: React.ReactNode }) => (
          <li className="leading-6">{children}</li>
        ),
        hr: () => (
          <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />
        ),
        strong: ({ children }: { children: React.ReactNode }) => (
          <strong className="font-semibold text-gray-900 dark:text-gray-100">
            {children}
          </strong>
        ),
        em: ({ children }: { children: React.ReactNode }) => (
          <em className="italic text-gray-800 dark:text-gray-200">
            {children}
          </em>
        ),
      }) as unknown as Components,
    [],
  );

  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);

  const rehypePlugins = useMemo(
    () =>
      [
        rehypeKatex,
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noopener", "noreferrer"],
            content: { type: "text", value: " ↗" },
          },
        ],
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: "heading-link",
            },
          },
        ],
        ...(allowDangerousHtml ? [rehypeRaw] : []),
      ] as unknown as [],
    [allowDangerousHtml],
  );

  return (
    <div
      className={`markdown-parser prose prose-lg dark:prose-invert max-w-none ${className}`}
      style={{ maxWidth }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
        // className="leading-relaxed"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const MultiParser: FC<{ markdown: string }> = ({ markdown }) => (
  <div className="w-full p-8 ">
    <MarkdownParser content={markdown} maxWidth="100%" />
  </div>
);

// Demo component
export const MultiParserDemo: React.FC = () => {
  const sampleMarkdown = `# Advanced Markdown Parser Demo

This component demonstrates **comprehensive markdown parsing** with TypeScript strict mode.

## Features

- ✅ **Math Support**: $E = mc^2$ and block math:

$$\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}$$

- ✅ **Syntax Highlighting** with copy functionality
- ✅ **External Links** with indicators
- ✅ **GitHub Flavored Markdown**
- ✅ **Tables** with styling
- ✅ **Strict TypeScript** (no \`any\` types)

## Code Example

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" }
];

const getUserById = (id: number): User | undefined => {
  return users.find(user => user.id === id);
};
\`\`\`

## Table Example

| Feature | Status | Notes |
|---------|--------|-------|
| Math Support | ✅ | KaTeX integration |
| Syntax Highlighting | ✅ | Prism with copy button |
| External Links | ✅ | Auto-detection with icons |
| Dark Mode | ✅ | Tailwind CSS classes |

## External Link

Check out [React Markdown](https://github.com/remarkjs/react-markdown) for more information.

> This is a styled blockquote with proper formatting and visual hierarchy.

### Inline Code
Use \`const result: string = "Hello World";\` for inline code snippets.
`;

  return (
    <div className="w-full p-8 ">
      <MarkdownParser content={sampleMarkdown} maxWidth="100%" />
    </div>
  );
};
