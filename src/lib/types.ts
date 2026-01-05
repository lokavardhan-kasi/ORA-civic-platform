export type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  state: string;
  region: string;
  followers: number;
  following: number;
};

export type Post = {
  id: string;
  authorId: string;
  level: 'Region' | 'State' | 'National';
  title: string;
  description: string;
  agreeCount: number;
  disagreeCount: number;
  commentCount: number;
  createdAt: string;
  hashtags: string[];
};

export type Comment = {
  id: string;
  postId: string;
  authorId: string;
  text: string;
  likeCount: number;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  postId: string;
  readStatus: boolean;
  createdAt: string;
};

export type TrendingTopic = {
  hashtag: string;
  postCount: number;
};
