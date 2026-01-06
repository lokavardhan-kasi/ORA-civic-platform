'use server';

/**
 * @fileOverview Ranks posts for the trending feed based on engagement and other factors.
 *
 * - rankPostsForTrendingFeed - A function that ranks posts for the trending feed.
 * - RankPostsInput - The input type for the rankPostsForTrendingFeed function.
 * - RankPostsOutput - The return type for the rankPostsForTrendingFeed function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankPostsInputSchema = z.array(
  z.object({
    postId: z.string().describe('The ID of the post.'),
    title: z.string().describe('The title of the post.'),
    description: z.string().describe('A short description of the post.'),
    agreeCount: z.number().describe('The number of agree votes.'),
    mixedCount: z.number().describe('The number of mixed votes.'),
    disagreeCount: z.number().describe('The number of disagree votes.'),
    topicTags: z.array(z.string()).describe('The topic tags associated with the post.'),
    aiSummary: z.string().describe('The AI-generated summary of the post.'),
  })
).describe('An array of posts to be ranked.');

export type RankPostsInput = z.infer<typeof RankPostsInputSchema>;

const RankPostsOutputSchema = z.array(
  z.object({
    postId: z.string().describe('The ID of the post.'),
    rankScore: z.number().describe('The ranking score of the post.'),
    reason: z.string().describe('The reason for the ranking score.'),
  })
).describe('An array of posts with their ranking scores and reasons.');

export type RankPostsOutput = z.infer<typeof RankPostsOutputSchema>;

export async function rankPostsForTrendingFeed(input: RankPostsInput): Promise<RankPostsOutput> {
  return rankPostsFlow(input);
}

const rankPostsPrompt = ai.definePrompt({
  name: 'rankPostsPrompt',
  input: {schema: RankPostsInputSchema},
  output: {schema: RankPostsOutputSchema},
  prompt: `You are an expert in ranking social media posts for trending feeds.

  Given the following array of posts, rank them based on their relevance, engagement, and potential virality.
  Consider factors such as the number of votes (agree, mixed, disagree), the topic tags, and the AI-generated summary.
  Provide a ranking score for each post and a brief reason for the score.

  Posts:
  {{#each this}}
  - Post ID: {{postId}}
    - Title: {{title}}
    - Description: {{description}}
    - Agree Votes: {{agreeCount}}
    - Mixed Votes: {{mixedCount}}
    - Disagree Votes: {{disagreeCount}}
    - Topic Tags: {{topicTags}}
    - AI Summary: {{aiSummary}}
  {{/each}}

  Format the output as a JSON array of objects, where each object contains the postId, rankScore (a number between 0 and 1), and a reason for the ranking.
  `,
});

const rankPostsFlow = ai.defineFlow(
  {
    name: 'rankPostsFlow',
    inputSchema: RankPostsInputSchema,
    outputSchema: RankPostsOutputSchema,
  },
  async input => {
    const {output} = await rankPostsPrompt(input);
    return output!;
  }
);
