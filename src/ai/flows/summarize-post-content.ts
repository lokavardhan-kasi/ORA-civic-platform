'use server';

/**
 * @fileOverview A flow that summarizes the content of a post for quick understanding.
 *
 * - summarizePostContent - A function that summarizes the post content.
 * - SummarizePostContentInput - The input type for the summarizePostContent function.
 * - SummarizePostContentOutput - The return type for the summarizePostContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePostContentInputSchema = z.object({
  title: z.string().describe('The title of the post.'),
  description: z.string().describe('The full description of the post.'),
});
export type SummarizePostContentInput = z.infer<typeof SummarizePostContentInputSchema>;

const SummarizePostContentOutputSchema = z.object({
  summary: z.array(
    z.string().describe('A single bullet point summarizing the post.')
  ).describe('A list of bullet points summarizing the post content.')
});
export type SummarizePostContentOutput = z.infer<typeof SummarizePostContentOutputSchema>;

export async function summarizePostContent(input: SummarizePostContentInput): Promise<SummarizePostContentOutput> {
  return summarizePostContentFlow(input);
}

const summarizePostContentPrompt = ai.definePrompt({
  name: 'summarizePostContentPrompt',
  input: {schema: SummarizePostContentInputSchema},
  output: {schema: SummarizePostContentOutputSchema},
  prompt: `Summarize the following post content into 2-3 bullet points.

Title: {{{title}}}
Description: {{{description}}}

Summary:`,
});

const summarizePostContentFlow = ai.defineFlow(
  {
    name: 'summarizePostContentFlow',
    inputSchema: SummarizePostContentInputSchema,
    outputSchema: SummarizePostContentOutputSchema,
  },
  async input => {
    const {output} = await summarizePostContentPrompt(input);
    return output!;
  }
);
