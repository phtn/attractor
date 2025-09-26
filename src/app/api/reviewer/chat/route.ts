import { ChatMetadata } from '@/schema/chat/metadata'
import { cohere } from '@ai-sdk/cohere'
import { convertToModelMessages, streamText, UIMessage } from 'ai'

export async function POST (req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const isDebug = process.env.DEBUG === 'true'
  if (isDebug) {
    console.log('messages', messages)
  }

  const startTime = Date.now()
  const result = streamText({
    model: cohere('command-a-03-2025'),
    prompt: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }): ChatMetadata | undefined => {
      // send custom information to the client on start:
      if (part.type === 'start') {
        return {
          model: 'gpt-4o', // initial model id
        }
      }

      // send additional model information on finish-step:
      if (part.type === 'finish-step') {
        return {
          model: part.response.modelId, // update with the actual model id
          duration: Date.now() - startTime,
        }
      }

      // when the message is finished, send additional information:
      if (part.type === 'finish') {
        return {
          totalTokens: part.totalUsage.totalTokens,
        }
      }
    },
  })
}
