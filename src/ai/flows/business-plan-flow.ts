
'use server';
/**
 * @fileOverview An AI-powered business plan generator.
 *
 * - generateBusinessPlan - A function that generates a foundational business plan.
 * - BusinessPlanInput - The input type for the business plan generation.
 * - BusinessPlanOutput - The return type for the business plan generation.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BusinessPlanInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  industry: z.string().describe('The industry the business operates in.'),
  targetAudience: z.string().describe('The primary target audience for the business.'),
});
export type BusinessPlanInput = z.infer<typeof BusinessPlanInputSchema>;

const BusinessPlanOutputSchema = z.object({
  plan: z.string().describe('The generated business plan content in Markdown format.'),
});
export type BusinessPlanOutput = z.infer<typeof BusinessPlanOutputSchema>;

export async function generateBusinessPlan(
  input: BusinessPlanInput
): Promise<BusinessPlanOutput> {
  const result = await businessPlanFlow(input);
  return { plan: result };
}

const prompt = ai.definePrompt({
  name: 'businessPlanPrompt',
  input: { schema: BusinessPlanInputSchema },
  prompt: `You are an expert business consultant specializing in helping Micro, Small, and Medium Enterprises (MSMEs) in India.

  A user has provided the following information about their business idea:
  - Business Name: {{{businessName}}}
  - Industry: {{{industry}}}
  - Target Audience: {{{targetAudience}}}

  Based on this, generate a clear, concise, and professional foundational business plan for them. The plan should be written in Markdown format and include the following sections:

  1.  **Executive Summary:** A brief, compelling overview of the business.
  2.  **Mission Statement:** A clear and concise statement of the company's purpose.
  3.  **Products/Services:** A description of what the business will offer.
  4.  **Market Analysis:** A brief analysis of the industry and target market in India.
  5.  **Marketing & Sales Strategy:** Simple, actionable ideas on how to reach the target audience.

  Keep the language simple, encouraging, and easy to understand for a first-time entrepreneur. The entire output must be a single string of Markdown.`,
});

const businessPlanFlow = ai.defineFlow(
  {
    name: 'businessPlanFlow',
    inputSchema: BusinessPlanInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
