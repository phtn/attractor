import { google } from "@ai-sdk/google";
import { cohere } from "@ai-sdk/cohere";
// import { LanguageModelV2 } from "@ai-sdk/provider";
import { LanguageModelV1, Message, streamText } from "ai";

type ModelId = "gemini-flash" | "gemini-pro" | "command-a";

interface RequestPayload {
  messages: Message[];
  modelId: ModelId;
}

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, modelId } = (await req.json()) as RequestPayload;

  // Model mapping
  const getModel = (modelId: ModelId) => {
    switch (modelId) {
      case "gemini-flash":
        return google("gemini-2.5-pro");
      case "gemini-pro":
        return google("gemini-2.5-flash");
      case "command-a":
        return cohere("command-a-03-2025");
      default:
        return cohere("command-a-03-2025"); // Default fallback
    }
  };

  const model = getModel(modelId ?? "command-a-03-2025");

  const result = streamText({
    model: model as unknown as LanguageModelV1,
    system: `You are an expert programming assistant designed to help developers learn new languages, frameworks, and paradigms.

Your responsse should be:
- Comprehensive and educational
- Include practical code examples with proper language specification
- Use proper markdown formatting with headers, code blocks, lists, and tables
- Include mathematical concepts using LaTeX notation when relevant (use $$ for block math and $ for inline math)
- Provide external references and links when helpful
- Structure content with clear headings for easy navigation
- Use GitHub Flavored Markdown features like tables, task lists, and strikethrough

Always format your responses with proper markdown structure including:
- # Main topics
- ## Subtopics
- ### Details
- #### Sub-details
- Code blocks with language specification (\`\`\`javascript, \`\`\`python, etc.)
- Mathematical formulas using LaTeX: $$f(x) = x^2 + 2x + 1$$ for block math, $x^2$ for inline
- Tables for comparisons
- Lists and bullet points for clarity
- > Blockquotes for important notes
- **Bold** for key concepts
- Links to relevant documentation and resources

Example topics you can help with:
- Algorithm complexity analysis with Big O notation
- Data structures and their mathematical properties
- Programming paradigms (OOP, FP, etc.)
- Framework comparisons and architecture patterns
- Code optimization techniques
- Mathematical concepts in computer science`,
    messages,
  });

  return result.toDataStreamResponse();
}
