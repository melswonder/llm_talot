import { NextRequest } from "next/server";
import OpenAI from "openai";
import { auth } from "@/lib/auth";
import { buildReadingPrompt } from "@/lib/reading-prompt";
import { validateQuestion } from "@/lib/content-filter";
import { ReadingRequest } from "@/lib/types";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: ReadingRequest = await req.json();

  const validation = validateQuestion(body.question);
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const prompt = buildReadingPrompt(
    body.question,
    body.category,
    body.drawnCards
  );

  const stream = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    stream: true,
    max_tokens: 1024,
    temperature: 0.8,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(encoder.encode(text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
