'use server';

/**
 * @fileOverview Aggregates voting reasons for a given post and returns the most common ones.
 *
 * - aggregateVotingReasons - A function that handles the aggregation of voting reasons.
 * - AggregateVotingReasonsInput - The input type for the aggregateVotingReasons function.
 * - AggregateVotingReasonsOutput - The return type for the aggregateVotingReasons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AggregateVotingReasonsInputSchema = z.object({
  postId: z.string().describe('The ID of the post to aggregate voting reasons for.'),
  reasons: z.array(z.string()).describe('An array of reasons provided by voters.'),
});
export type AggregateVotingReasonsInput = z.infer<typeof AggregateVotingReasonsInputSchema>;

const AggregateVotingReasonsOutputSchema = z.object({
  aggregatedReasons: z
    .array(z.object({reason: z.string(), count: z.number()}))
    .describe('An array of aggregated reasons with their counts, sorted by count in descending order.'),
});
export type AggregateVotingReasonsOutput = z.infer<typeof AggregateVotingReasonsOutputSchema>;

export async function aggregateVotingReasons(input: AggregateVotingReasonsInput): Promise<AggregateVotingReasonsOutput> {
  return aggregateVotingReasonsFlow(input);
}

const aggregateVotingReasonsFlow = ai.defineFlow(
  {
    name: 'aggregateVotingReasonsFlow',
    inputSchema: AggregateVotingReasonsInputSchema,
    outputSchema: AggregateVotingReasonsOutputSchema,
  },
  async input => {
    const reasonCounts: {[reason: string]: number} = {};
    for (const reason of input.reasons) {
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    }

    const aggregatedReasons = Object.entries(reasonCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .map(([reason, count]) => ({reason, count}));

    return {aggregatedReasons};
  }
);
