import { OpenAI } from 'openai';

let client: OpenAI | null = null;

/**
 * Get or create the OpenAI client configured for OpenRouter
 * Uses environment variable OPENROUTER_API_KEY
 */
export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'OPENROUTER_API_KEY environment variable is not configured. ' +
        'Please set it to your OpenRouter API key starting with sk-or-v1-'
      );
    }

    client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    });
  }

  return client;
}

/**
 * Default model to use for educational content generation
 * openai/gpt-oss-120b:free is a capable open-source model available on OpenRouter
 */
export const DEFAULT_MODEL = 'openai/gpt-oss-120b:free';

/**
 * System message for teacher persona - used across all educational endpoints
 * Ensures consistent tone and quality in generated content
 */
export const TEACHER_SYSTEM_MESSAGE = `You are an experienced Indian school teacher following CBSE and NEP 2020 guidelines.
Respond in simple and local language.
Focus on engagement, practical examples, and learning outcomes.
Structure your output with clear headings.
Keep explanations simple, interactive, and age-appropriate.

Format rules (Must follow):
- Don't use markdown symbols (#, *, etc.)
- Use lists or bullet points where appropriate
- Generate structured, classroom-ready content
- Make content suitable for Indian students`;
