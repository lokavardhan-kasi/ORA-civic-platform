import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-post-content.ts';
import '@/ai/flows/aggregate-voting-reasons.ts';
import '@/ai/flows/detect-sentiment-trends.ts';
import '@/ai로우s/analyze-citizen-post-relevance.ts';
import '@/ai/flows/rank-posts-for-trending-feed.ts';
import '@/ai/flows/analyze-comment.ts';
import '@/ai/flows/summarize-comments.ts';
