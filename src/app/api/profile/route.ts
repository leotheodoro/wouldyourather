import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { anthropic, generateText } from '@/lib/ai/client';
import { buildProfilePrompt } from '@/lib/ai/prompts/profile';
import { archetypeProfileSchema, historyItemSchema } from '@/lib/ai/validation';

const bodySchema = z.object({
  history: z.array(historyItemSchema).max(7),
  language: z.enum(['pt', 'en']).default('pt'),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success || parsed.data.history.length === 0) {
    return new Response(JSON.stringify({ error: 'History must have at least one item' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { history, language } = parsed.data;

  let profile: z.infer<typeof archetypeProfileSchema>;
  try {
    const result = await generateText({
      model: anthropic('claude-sonnet-4-5'),
      messages: [{ role: 'user', content: buildProfilePrompt(history, language) }],
    });
    const raw = result.text;
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON in response');
    profile = archetypeProfileSchema.parse(JSON.parse(match[0]));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'MNEMOSYNE não respondeu';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const textToStream = `"${profile.quote}"\n\n${profile.verdict}`;

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        for (const char of textToStream) {
          controller.enqueue(enc.encode(`data: ${JSON.stringify({ token: char })}\n\n`));
          await new Promise<void>((r) => setTimeout(r, 12));
        }
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ done: true, profile })}\n\n`));
      } catch {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ done: true, error: true })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
