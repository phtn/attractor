// Example markdown content for testing
export const exampleMarkdown = `# React Hooks: A Complete Guide

React Hooks revolutionized how we write React components by allowing us to use state and other React features in functional components.

## What are React Hooks?

**Hooks** are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8.

### Key Benefits

- **Simpler Code**: No need for class components
- **Better Logic Reuse**: Custom hooks enable sharing stateful logic
- **Easier Testing**: Functions are easier to test than classes


## React markdown
\`\`\`typescript

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { ExternalLink, Copy, Check } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface CodeBlockProps {
  children: string;
  className?: string;
  node?: unknown;
}

interface MarkdownParserProps {
  content: string;
  className?: string;
  enableLineNumbers?: boolean;
  enableCopyButton?: boolean;
  customTheme?: Record<string, unknown>;
  allowDangerousHtml?: boolean;
  maxWidth?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, ...props }) => {
  const [copied, setCopied] = React.useState<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'text';

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = React.useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);

      // Clear existing timeout to prevent memory leaks
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [children]);

  // Butt fuck yeah!

  if (!match) {
    return (
      <code
        className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={tomorrow}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
        }}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

const LinkRenderer: React.FC<{ href?: string; children: React.ReactNode }> = ({
  href,
  children
}) => {
  const isExternal = href && (href.startsWith('http') || href.startsWith('https'));

  return (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-600 dark:hover:decoration-blue-400 transition-colors duration-200"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {isExternal && (
        <ExternalLink
          size={14}
          className="inline ml-1 mb-1"
          aria-label="External link"
        />
      )}
    </a>
  );
};

const TableRenderer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="overflow-x-auto my-4">
    <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
      {children}
    </table>
  </div>
);

const TableHeadRenderer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">
    {children}
  </thead>
);

const TableRowRenderer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
    {children}
  </tr>
);

const TableCellRenderer: React.FC<{ children: React.ReactNode; isHeader?: boolean }> = ({
  children,
  isHeader = false
}) => {
  const Tag = isHeader ? 'th' : 'td';
  return (
    <Tag className={\`px-4 py-2 text-left border-r border-gray-200 dark:border-gray-700 last:border-r-0 \${
      isHeader
        ? 'font-semibold text-gray-900 dark:text-gray-100'
        : 'text-gray-700 dark:text-gray-300'
    }\`}>
      {children}
    </Tag>
  );
};

const BlockquoteRenderer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300">
    {children}
  </blockquote>
);

const HeadingRenderer = (level: number) =>
  ({ children, id }: { children: React.ReactNode; id?: string }) => {
    const Tag = \`h\${level}\` as keyof JSX.IntrinsicElements;
    const sizes = {
      1: 'text-3xl font-bold mt-8 mb-4',
      2: 'text-2xl font-semibold mt-6 mb-3',
      3: 'text-xl font-semibold mt-5 mb-2',
      4: 'text-lg font-medium mt-4 mb-2',
      5: 'text-base font-medium mt-3 mb-2',
      6: 'text-sm font-medium mt-2 mb-1'
    };

    return (
      <Tag
        id={id}
        className={\`\${sizes[level as keyof typeof sizes]} text-gray-900 dark:text-gray-100 group\`}
      >
        {children}
      </Tag>
    );
  };

const MarkdownParser: React.FC<MarkdownParserProps> = ({
  content,
  className = '',
  enableLineNumbers = true,
  enableCopyButton = true,
  customTheme,
  allowDangerousHtml = false,
  maxWidth = 'none'
}) => {
  const components = React.useMemo(() => ({
    code: CodeBlock,
    a: LinkRenderer,
    table: TableRenderer,
    thead: TableHeadRenderer,
    tr: TableRowRenderer,
    td: (props: { children: React.ReactNode }) =>
      <TableCellRenderer {...props} isHeader={false} />,
    th: (props: { children: React.ReactNode }) =>
      <TableCellRenderer {...props} isHeader={true} />,
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
      <em className="italic text-gray-800 dark:text-gray-200">{children}</em>
    ),
  }), []);

  const remarkPlugins = React.useMemo(() => [
    remarkGfm,
    remarkMath,
  ], []);

  const rehypePlugins = React.useMemo(() => [
    rehypeKatex,
    [rehypeExternalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
      content: { type: 'text', value: ' ↗' }
    }],
    rehypeSlug,
    [rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: 'heading-link'
      }
    }],
    ...(allowDangerousHtml ? [rehypeRaw] : [])
  ], [allowDangerousHtml]);

  return (
    <div
      className={\`markdown-parser prose prose-lg dark:prose-invert max-w-none \${className}\`}
      style={{ maxWidth }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
        className="leading-relaxed"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

// Demo component
const Demo: React.FC = () => {
  const sampleMarkdown = \`# Advanced Markdown Parser Demo

This component demonstrates **comprehensive markdown parsing** with TypeScript strict mode.

## Features

- ✅ **Math Support**: $E = mc^2$ and block math:

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

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

## Core Hooks

### useState Hook
\`\`\`JavaScript
The \`useState\` hook lets you add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

---
### useEffect Hook

The \`useEffect\` hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const title = \`You clicked \${count} times\`;
    return () => {
      title = document.title
    }
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

---
## Advanced Hooks

### useContext

For consuming React context:

\`\`\`javascript
const ThemeContext = React.createContext();

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background }}>
      I am styled by theme context!
    </button>
  );
}
\`\`\`

---
### useReducer

For complex state logic:

\`\`\`javascript
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
\`\`\`

---
## Hook Rules

> **Important**: Hooks have specific rules that must be followed:

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call them from React function components or custom hooks

## Mathematical Concepts

The time complexity of React's reconciliation algorithm is **O(n)** where n is the number of elements.

For state updates, React uses a batching mechanism that can be expressed as:

$$\\text{BatchedUpdates} = \\sum_{i=1}^{n} \\text{Update}_i$$

## Comparison Table

| Hook | Purpose | When to Use |
|------|---------|-------------|
| useState | Local state | Simple state values |
| useEffect | Side effects | API calls, subscriptions |
| useContext | Context consumption | Avoiding prop drilling |
| useReducer | Complex state | State with multiple sub-values |
| useMemo | Memoization | Expensive calculations |
| useCallback | Function memoization | Preventing unnecessary re-renders |

## Best Practices

- ✅ Use multiple state variables instead of one complex object
- ✅ Extract custom hooks for reusable logic
- ✅ Use useCallback for event handlers passed to optimized child components
- ❌ Don't call hooks conditionally
- ❌ Don't call hooks in regular JavaScript functions

## External Resources

- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)
- [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html)

## Conclusion

React Hooks provide a more direct API to the React concepts you already know. They offer a powerful way to compose behavior and share logic between components.

**Remember**: Hooks are backwards-compatible and you can start using them gradually in your existing projects.`
