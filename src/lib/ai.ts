import OpenAI from "openai";
import { DENTIST_SYSTEM_PROMPT } from "@/lib/system-prompt";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "sk-dummy-key",
});

console.log("=== AI KEY Debug ===");
console.log("OPENROUTER_API_KEY from env is:", process.env.OPENROUTER_API_KEY);
console.log("Key length:", process.env.OPENROUTER_API_KEY?.length);
console.log("Using key:", openai.apiKey);

export async function getAIResponse(
  messages: { role: "user" | "assistant"; content: string }[],
) {
  const completion = await openai.chat.completions.create({
    model: process.env.AI_MODEL || "anthropic/claude-3.5-sonnet",
    messages: [
      {
        role: "system",
        content: DENTIST_SYSTEM_PROMPT,
      },
      ...messages,
    ],
  });

  return (
    completion.choices[0]?.message?.content ||
    "Sorry, I couldn't generate a response."
  );
}
