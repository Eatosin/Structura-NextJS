import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// 1. Define the "Unbreakable" Schema (Zod)
// This is exactly like Pydantic, but for TypeScript
const InvoiceSchema = z.object({
  vendor: z.string().describe('Name of the company or service provider'),
  total_amount: z.number().describe('Total cost extracted'),
  currency: z.string().describe('Currency code (USD, EUR, NGN)'),
  date: z.string().describe('Date of transaction (YYYY-MM-DD)'),
  is_paid: z.boolean().describe('True if payment is confirmed'),
  items: z.array(z.string()).describe('List of items purchased'),
});

// 2. The API Route Handler
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    // 3. The AI Generation (Type-Safe)
    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: InvoiceSchema,
      prompt: `Extract structured data from this messy text: "${text}"`,
    });

    // 4. Return the valid JSON
    return result.toJsonResponse();
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Extraction failed' }), { status: 500 });
  }
}
