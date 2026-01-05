'use server';

/**
 * @fileOverview A flow that summarizes public opinion on a post.
 *
 * - summarizePublicOpinion - A function that generates a summary of public opinion.
 * - SummarizePublicOpinionInput - The input type for the summarizePublicOpinion function.
 * - SummarizePublicOpinionOutput - The return type for the summarizePublicOpinion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePublicOpinionInputSchema = z.object({
  agreeCount: z.number().describe('The number of users who agree with the post.'),
  disagreeCount: z.number().describe('The number of users who disagree with the post.'),
  title: z.string().describe('The title of the post.'),
  description: z.string().describe('The description of the post.'),
});
export type SummarizePublicOpinionInput = z.infer<typeof SummarizePublicOpinionInputSchema>;

const SummarizePublicOpinionOutputSchema = z.object({
  summary: z.string().describe('A short, neutral summary of the public opinion on the post.'),
});
export type SummarizePublicOpinionOutput = z.infer<typeof SummarizePublicOpinionOutputSchema>;

export async function summarizePublicOpinion(input: SummarizePublicOpinionInput): Promise<SummarizePublicOpinionOutput> {
  return summarizePublicOpinionFlow(input);
}

const summarizePublicOpinionPrompt = ai.definePrompt({
  name: 'summarizePublicOpinionPrompt',
  input: {schema: SummarizePublicOpinionInputSchema},
  output: {schema: SummarizePublicOpinionOutputSchema},
  prompt: `Summarize the public opinion on the following post in a single, neutral sentence.

Title: {{{title}}}
Description: {{{description}}}
Agree Count: {{{agreeCount}}}
Disagree Count: {{{disagreeCount}}}

Summary: `,
});

const summarizePublicOpinionFlow = ai.defineFlow(
  {
    name: 'summarizePublicOpinionFlow',
    inputSchema: SummarizePublicOpinionInputSchema,
    outputSchema: SummarizePublicOpinionOutputSchema,
  },
  async input => {
    const {output} = await summarizePublicOpinionPrompt(input);
    return output!;
  }
);
