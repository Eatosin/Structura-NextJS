import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

const InvoiceSchema = z.object({
  vendor: z.string().describe('Name of the company'),
  total_amount: z.number().describe('Total amount found'),
  currency: z.string().describe('Currency code'),
  date: z.string().describe('Date in YYYY-MM-DD format'),
  is_paid: z.boolean().describe('Payment status'),
  summary: z.string().describe('Short summary of the transaction'),
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: InvoiceSchema,
      prompt: `Extract structured data from this text: "${text}"`,
    });

    return result.toJsonResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate JSON', details: error }), { status: 500 });
  }
}
