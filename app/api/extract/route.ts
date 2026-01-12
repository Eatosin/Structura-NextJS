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

const RequestSchema = z.object({
  text: z.string().min(1, 'Text cannot be empty').max(10000, 'Text too long (max 10000 characters)'),
});

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ error: 'Content-Type must be application/json' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const validation = RequestSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { text } = validation.data;

    const result = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: InvoiceSchema,
      prompt: `Extract structured data from this text: "${text}"`,
    });

    return result.toJsonResponse();
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate JSON' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
