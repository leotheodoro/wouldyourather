import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { type ModelMessage, streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const {
    messages,
    provider = 'anthropic',
  }: { messages: ModelMessage[]; provider?: 'anthropic' | 'openai' } = await req.json();

  const model = provider === 'openai' ? openai('gpt-4o') : anthropic('claude-sonnet-4-6');

  const result = streamText({
    model,
    messages,
  });

  return result.toTextStreamResponse();
}
