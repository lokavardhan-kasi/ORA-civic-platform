import type { User, Post, Comment, Notification, TrendingTopic } from './types';

export const users: User[] = [
  { id: 'user1', name: 'Aarav Sharma', username: 'aaravs', avatar: '1', state: 'Maharashtra', region: 'Mumbai', followers: 125, following: 50 },
  { id: 'user2', name: 'Diya Patel', username: 'diyap', avatar: '2', state: 'Karnataka', region: 'Bengaluru', followers: 230, following: 78 },
  { id: 'user3', name: 'Rohan Gupta', username: 'rohang', avatar: '3', state: 'Delhi', region: 'New Delhi', followers: 50, following: 20 },
  { id: 'user4', name: 'Anika Reddy', username: 'anikar', avatar: '4', state: 'Telangana', region: 'Hyderabad', followers: 450, following: 150 },
];

export const posts: Post[] = [
  {
    id: 'post1',
    authorId: 'user1',
    level: 'Region',
    title: 'Should plastic bags be banned in Mumbai markets?',
    description: 'A proposal to completely ban single-use plastic bags in all local markets to curb pollution. This could impact small vendors and require shoppers to bring their own bags.',
    agreeCount: 1200,
    disagreeCount: 450,
    commentCount: 88,
    createdAt: '2024-07-21T10:00:00Z',
    hashtags: ['#Mumbai', '#PlasticBan', '#Environment']
  },
  {
    id: 'post2',
    authorId: 'user2',
    level: 'State',
    title: 'Proposal for a new metro line connecting Electronic City in Bengaluru.',
    description: 'The state government is considering a new metro line to ease traffic congestion towards Electronic City. This is a massive infrastructure project with long-term implications.',
    agreeCount: 8500,
    disagreeCount: 1200,
    commentCount: 450,
    createdAt: '2024-07-20T14:30:00Z',
    hashtags: ['#Bengaluru', '#Metro', '#Infrastructure']
  },
  {
    id: 'post3',
    authorId: 'user3',
    level: 'National',
    title: 'Should the Goods and Services Tax (GST) slabs be simplified?',
    description: 'There is an ongoing debate about reducing the number of GST slabs to simplify the tax structure for businesses and consumers across India.',
    agreeCount: 150000,
    disagreeCount: 95000,
    commentCount: 1200,
    createdAt: '2024-07-19T09:00:00Z',
    hashtags: ['#GST', '#TaxReform', '#IndianEconomy']
  },
  {
    id: 'post4',
    authorId: 'user4',
    level: 'State',
    title: 'Implementation of "Mission Kakatiya" phase 5 for tank restoration in Telangana.',
    description: 'The next phase of Mission Kakatiya aims to restore an additional 5,000 minor irrigation tanks across the state. Should this be the top priority for the water department?',
    agreeCount: 6200,
    disagreeCount: 800,
    commentCount: 230,
    createdAt: '2024-07-21T12:00:00Z',
    hashtags: ['#Telangana', '#Water', '#MissionKakatiya']
  },
];

export const comments: Comment[] = [
  { id: 'comment1', postId: 'post1', authorId: 'user3', text: 'This is long overdue. Our beaches are filled with plastic.', likeCount: 25, createdAt: '2024-07-21T10:05:00Z' },
  { id: 'comment2', postId: 'post1', authorId: 'user1', text: 'What about the alternative for vendors? We need a proper plan first.', likeCount: 42, createdAt: '2024-07-21T10:07:00Z' },
  { id: 'comment3', postId: 'post2', authorId: 'user2', text: 'Yes! My daily commute will be so much easier.', likeCount: 102, createdAt: '2024-07-20T14:35:00Z' },
];

export const notifications: Notification[] = [
  { id: 'notif1', userId: 'user1', message: 'Diya Patel created a new state-level post.', postId: 'post2', readStatus: false, createdAt: '2024-07-20T14:30:00Z' },
  { id: 'notif2', userId: 'user1', message: 'Your comment on "Should plastic bags be banned..." received 10 new likes.', postId: 'post1', readStatus: false, createdAt: '2024-07-21T11:00:00Z' },
  { id: 'notif3', userId: 'user1', message: 'Rohan Gupta created a new national-level post.', postId: 'post3', readStatus: true, createdAt: '2024-07-19T09:00:00Z' },
];


export const trendingTopics: TrendingTopic[] = [
    { hashtag: '#IndianEconomy', postCount: 42 },
    { hashtag: '#Infrastructure', postCount: 35 },
    { hashtag: '#Environment', postCount: 28 },
    { hashtag: '#TaxReform', postCount: 19 },
    { hashtag: '#Bengaluru', postCount: 15 },
]
