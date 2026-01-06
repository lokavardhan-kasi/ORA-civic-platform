
import { PlaceHolderImages } from './placeholder-images';

export type VoteType = 'agree' | 'mixed' | 'disagree';
export type PostType = 'Central Government' | 'State Government' | 'Citizen';
export type SentimentTrend = 'Mostly Agree' | 'Mixed' | 'Mostly Disagree';
export type ReasonTag = 'Economic' | 'Employment' | 'Environment' | 'Inclusion' | 'Implementation' | 'Corruption Risk' | 'Other';

export interface Post {
  id: string;
  type: PostType;
  author: string;
  authorId: string;
  authorAvatarUrl: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mediaUrl: string;
  mediaHint: string;
  aiSummary: string[];
  aiCommentSummary?: string;
  votes: {
    agree: number;
    mixed: number;
    disagree: number;
  };
  totalVotes: number;
  sentimentTrend: SentimentTrend;
  topicTags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: string;
  authorAvatarUrl: string;
  text: string;
  createdAt: string;
}


// Note: The mock data is no longer used in the feed but is kept for other components that have not been migrated yet.
const calculateTotalsAndTrends = (post: Omit<Post, 'totalVotes' | 'sentimentTrend' | 'author' | 'id'> & { id?: string; author?: string }): Post => {
  const totalVotes = post.votes.agree + post.votes.mixed + post.votes.disagree;
  const agreePercentage = totalVotes > 0 ? post.votes.agree / totalVotes : 0;
  
  let sentimentTrend: SentimentTrend;
  if (agreePercentage > 0.6) {
    sentimentTrend = 'Mostly Agree';
  } else if (agreePercentage < 0.4) {
    sentimentTrend = 'Mostly Disagree';
  } else {
    sentimentTrend = 'Mixed';
  }

  // Add default author if not provided
  const author = post.author || 'Anonymous';
  const id = post.id || Math.random().toString(36).substring(2, 15);


  return { ...post, totalVotes, sentimentTrend, author, id };
};

export const reasonTags: ReasonTag[] = ['Economic', 'Employment', 'Environment', 'Inclusion', 'Implementation', 'Corruption Risk', 'Other'];
