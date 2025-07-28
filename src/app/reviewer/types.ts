import { type IconName } from "@/lib/icons";

export interface IQuickAction {
  icon: IconName;
  text: string;
  prompt: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface HighlightItem {
  id: string;
  text: string;
  type: "concept" | "code" | "reference" | "math";
}
