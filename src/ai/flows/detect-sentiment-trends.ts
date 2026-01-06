'use server';

/**
 * @fileOverview A flow to detect sentiment trends (Mostly Agree/Mixed/Mostly Disagree) for a given text.
 *
 * - detectSentimentTrends - A function that analyzes the sentiment of a given text and returns the trend.
 * - DetectSentimentTrendsInput - The input type for the detectSentimentTrends function.
 * - DetectSentimentTrendsOutput - The return type for the detectSentimentTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSentimentTrendsInputSchema = z.object({
  text: z
    .string()
    .describe('The text to analyze for sentiment trends.'),
});
export type DetectSentimentTrendsInput = z.infer<typeof DetectSentimentTrendsInputSchema>;

const DetectSentimentTrendsOutputSchema = z.object({
  sentimentTrend: z
    .enum(['Mostly Agree', 'Mixed', 'Mostly Disagree'])
    .describe('The sentiment trend detected in the text.'),
});
export type DetectSentimentTrendsOutput = z.infer<typeof DetectSentimentTrendsOutputSchema>;

export async function detectSentimentTrends(input: DetectSentimentTrendsInput): Promise<DetectSentimentTrendsOutput> {
  return detectSentimentTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectSentimentTrendsPrompt',
  input: {schema: DetectSentimentTrendsInputSchema},
  output: {schema: DetectSentimentTrendsOutputSchema},
  prompt: `Analyze the following text and determine the overall sentiment trend. The sentiment trend should be one of the following: "Mostly Agree", "Mixed", or "Mostly Disagree".

Text: {{{text}}}

Sentiment Trend:`,
});

const detectSentimentTrendsFlow = ai.defineFlow(
  {
    name: 'detectSentimentTrendsFlow',
    inputSchema: DetectSentimentTrendsInputSchema,
    outputSchema: DetectSentimentTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
