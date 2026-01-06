'use server';

/**
 * @fileOverview Analyzes comments for inappropriate language.
 *
 * - analyzeComment - A function that analyzes the comment.
 * - AnalyzeCommentInput - The input type for the analyzeComment function.
 * - AnalyzeCommentOutput - The return type for the analyzeComment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommentInputSchema = z.object({
  comment: z.string().describe('The text of the comment to analyze.'),
});
export type AnalyzeCommentInput = z.infer<typeof AnalyzeCommentInputSchema>;

const AnalyzeCommentOutputSchema = z.object({
  isAppropriate: z.boolean().describe('Whether the comment language is appropriate.'),
  reason: z.string().optional().describe('The reason why the comment was flagged as inappropriate.'),
});
export type AnalyzeCommentOutput = z.infer<typeof AnalyzeCommentOutputSchema>;

export async function analyzeComment(input: AnalyzeCommentInput): Promise<AnalyzeCommentOutput> {
  return analyzeCommentFlow(input);
}

const analyzeCommentPrompt = ai.definePrompt({
  name: 'analyzeCommentPrompt',
  input: {schema: AnalyzeCommentInputSchema},
  output: {schema: AnalyzeCommentOutputSchema},
  prompt: `You are an AI moderator for a public forum. Your task is to analyze user comments for inappropriate content.

Inappropriate content includes, but is not limited to:
- Hate speech (racism, sexism, homophobia, etc.)
- Personal attacks or harassment
- Profanity or vulgar language
- Spam or advertising
- Spreading misinformation

Analyze the following comment:

"{{{comment}}}"

Determine if the comment's language is appropriate for a public forum. 
If it is inappropriate, set isAppropriate to false and provide a brief, neutral reason.
If it is appropriate, set isAppropriate to true.

Output in JSON format.`,
});

const analyzeCommentFlow = ai.defineFlow(
  {
    name: 'analyzeCommentFlow',
    inputSchema: AnalyzeCommentInputSchema,
    outputSchema: AnalyzeCommentOutputSchema,
  },
  async input => {
    const {output} = await analyzeCommentPrompt(input);
    return output!;
  }
);
