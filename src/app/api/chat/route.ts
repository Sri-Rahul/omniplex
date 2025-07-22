import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Initialize OpenAI with fallback
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const runtime = "edge";

export async function POST(req: Request) {
  // Check if OpenAI is configured
  if (!openai) {
    return new Response(
      JSON.stringify({
        error: "OpenAI API key is not configured. AI features are disabled.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const {
    messages,
    model,
    temperature,
    max_tokens,
    top_p,
    frequency_penalty,
    presence_penalty,
  } = await req.json();

  const response = await openai.chat.completions.create({
    stream: true,
    model: model,
    temperature: temperature,
    max_tokens: max_tokens,
    top_p: top_p,
    frequency_penalty: frequency_penalty,
    presence_penalty: presence_penalty,
    messages: messages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
