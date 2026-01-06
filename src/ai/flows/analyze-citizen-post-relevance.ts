'use server';
/**
 * @fileOverview Analyzes citizen posts for relevance, duplicates, and inappropriate language.
 *
 * - analyzeCitizenPost - A function that analyzes the post.
 * - AnalyzeCitizenPostInput - The input type for the analyzeCitizenPost function.
 * - AnalyzeCitizenPostOutput - The return type for the analyzeCitizenPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCitizenPostInputSchema = z.object({
  title: z.string().describe('The title of the citizen post.'),
  description: z.string().describe('The description of the citizen post (200-300 words).'),
  topicTags: z.array(z.string()).describe('An array of topic tags associated with the post.'),
  mediaUrl: z.string().optional().describe('Optional URL of media attached to the post.'),
});
export type AnalyzeCitizenPostInput = z.infer<typeof AnalyzeCitizenPostInputSchema>;

const AnalyzeCitizenPostOutputSchema = z.object({
  isRelevant: z.boolean().describe('Whether the post is relevant to public policy.'),
  isDuplicate: z.boolean().describe('Whether the post is a duplicate of an existing post.'),
  isAppropriate: z.boolean().describe('Whether the post language is appropriate.'),
  summary: z.string().describe('A short summary of the AI analysis.'),
});
export type AnalyzeCitizenPostOutput = z.infer<typeof AnalyzeCitizenPostOutputSchema>;

export async function analyzeCitizenPost(input: AnalyzeCitizenPostInput): Promise<AnalyzeCitizenPostOutput> {
  return analyzeCitizenPostFlow(input);
}

const analyzeCitizenPostPrompt = ai.definePrompt({
  name: 'analyzeCitizenPostPrompt',
  input: {schema: AnalyzeCitizenPostInputSchema},
  output: {schema: AnalyzeCitizenPostOutputSchema},
  prompt: `You are an AI assistant responsible for analyzing citizen posts for relevance to public policy, potential duplicates, and inappropriate language.

Analyze the following citizen post:

Title: {{{title}}}
Description: {{{description}}}
Topic Tags: {{#each topicTags}}{{{this}}}, {{/each}}
Media URL: {{{mediaUrl}}}

Determine the following:
- Whether the post is relevant to public policy (isRelevant).
- Whether the post is a duplicate of an existing post (isDuplicate).
- Whether the post language is appropriate (isAppropriate).

Provide a short summary of your analysis (summary).

Output in JSON format.`,
});

const analyzeCitizenPostFlow = ai.defineFlow(
  {
    name: 'analyzeCitizenPostFlow',
    inputSchema: AnalyzeCitizenPostInputSchema,
    outputSchema: AnalyzeCitizenPostOutputSchema,
  },
  async input => {
    const {output} = await analyzeCitizenPostPrompt(input);
    return output!;
  }
);
