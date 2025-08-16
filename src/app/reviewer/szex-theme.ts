/**
 * Szex theme for JavaScript, CSS and HTML
 * Based on 0x96f Theme in zed by http://www.monokai.nl/
 * @author xpriori
 * Converted to react-syntax-highlighter format
 */

import { type CSSProperties } from "react";

export const szexTheme: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: "#f8f8f2",
    background: "none",
    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
    fontFamily:
      '"JetBrainsMono Nerd Font Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: "1.25em",
    textAlign: "left" as const,
    whiteSpace: "pre" as const,
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none" as const,
    MozHyphens: "none" as const,
    msHyphens: "none" as const,
    hyphens: "none" as const,
  },
  'pre[class*="language-"]': {
    color: "#f8f8f2",
    background: "oklch(0.280 0.012 285)",
    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
    fontFamily:
      '"JetBrainsMono Nerd Font Mono", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: "17px",
    textAlign: "left" as const,
    whiteSpace: "pre" as const,
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none" as const,
    MozHyphens: "none" as const,
    msHyphens: "none" as const,
    hyphens: "none" as const,
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.1em",
  },
  ':not(pre) > code[class*="language-"]': {
    background: "oklch(0.3 0.0 0)",
    padding: "0.1em",
    borderRadius: "0.0em",
    whiteSpace: "normal" as const,
  },
  comment: {
    color: "#6b7280",
    fontStyle: "initial",
    fontWeight: "lighter",
  },
  prolog: {
    color: "#71717a",
  },
  doctype: {
    color: "#6b7280",
  },
  cdata: {
    color: "#71717a",
  },
  punctuation: {
    color: "#787190",
  },
  namespace: {
    opacity: "0.7",
  },
  property: {
    color: "#71717a",
  },
  tag: {
    color: "#6b7280",
  },
  constant: {
    color: "#6b7280",
  },
  symbol: {
    // color: "#71717a",
    color: "#6b7280",
  },
  deleted: {
    color: "#fbcb97",
  },
  boolean: {
    color: "#fbcb97",
  },
  number: {
    color: "#06b6d4",
  },
  selector: {
    color: "#fbcb97",
  },
  "attr-name": {
    color: "#b8b8bf",
  },
  string: {
    color: "#999999",
  },
  char: {
    color: "#a6e22e",
  },
  builtin: {
    color: "#aaaaaa",
  },
  inserted: {
    color: "#fbcb97", //#a7e22e
  },
  operator: {
    color: "#fbcb97",
  },
  entity: {
    color: "#fbcb97",
    cursor: "help",
  },
  url: {
    color: "#fbcb97",
  },
  ".language-css .token.string": {
    color: "#fbcb97",
  },
  ".style .token.string": {
    color: "#fbcb97",
  },
  variable: {
    color: "#ffedd5",
  },
  atrule: {
    color: "#ffedd5",
  },
  "attr-value": {
    color: "#ffedd5",
  },
  function: {
    color: "#fbcb97",
  },
  "class-name": {
    color: "#aaaaaa",
  },
  keyword: {
    color: "#ffedd5",
  },
  regex: {
    color: "#fd971f",
  },
  important: {
    color: "#fd971f",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
};
