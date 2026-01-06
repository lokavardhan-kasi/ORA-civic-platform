'use server';

/**
 * @fileOverview A flow to summarize the comments on a post.
 *
 * - summarizeComments - A function that summarizes comments.
 * - SummarizeCommentsInput - The input type for the summarizeComments function.
 * - SummarizeCommentsOutput - The return type for the summarizeComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCommentsInputSchema = z.object({
  comments: z.array(z.string()).describe('A list of comments to be summarized.'),
});
export type SummarizeCommentsInput = z.infer<typeof SummarizeCommentsInputSchema>;

const SummarizeCommentsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key themes and overall sentiment of the comments.'),
});
export type SummarizeCommentsOutput = z.infer<typeof SummarizeCommentsOutputSchema>;

export async function summarizeComments(input: SummarizeCommentsInput): Promise<SummarizeCommentsOutput> {
  return summarizeCommentsFlow(input);
}

const summarizeCommentsPrompt = ai.definePrompt({
  name: 'summarizeCommentsPrompt',
  input: {schema: SummarizeCommentsInputSchema},
  output: {schema: SummarizeCommentsOutputSchema},
  prompt: `You are an expert at summarizing discussions. Analyze the following list of user comments for a policy proposal. Many comments may come from users who disagree or have mixed feelings.

Your task is to create a neutral, one-paragraph summary that captures the main arguments, recurring themes, and overall sentiment expressed in the comments.

Comments:
{{#each comments}}
- "{{{this}}}"
{{/each}}

Based on these comments, provide a summary.`,
});

const summarizeCommentsFlow = ai.defineFlow(
  {
    name: 'summarizeCommentsFlow',
    inputSchema: SummarizeCommentsInputSchema,
    outputSchema: SummarizeCommentsOutputSchema,
  },
  async input => {
    if (input.comments.length === 0) {
      return { summary: 'No comments have been posted yet.' };
    }
    const {output} = await summarizeCommentsPrompt(input);
    return output!;
  }
);
