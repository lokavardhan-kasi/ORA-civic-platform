'use client';
import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Input } from '@/components/ui/input';
import { Search, Frown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useMemoQuery } from '@/firebase';
import type { Post } from '@/lib/data';
import { PostCard } from '@/components/post-card';
import { Skeleton } from '@/components/ui/skeleton';

const trendingTopics = ["#UrbanPlanning", "#Environment", "#Health", "#Transportation", "#Community", "#Technology", "#DataPrivacy"];

function PostSkeleton() {
  return (
    <div className="space-y-4 rounded-lg bg-card p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const postsQuery = useMemoQuery("posts");
  const { data: allPosts, loading } = useCollection<Post>(postsQuery);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    if (!allPosts) {
      return [];
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(lowercasedQuery) || 
      post.shortDescription.toLowerCase().includes(lowercasedQuery) ||
      post.topicTags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
    );
  }, [allPosts, searchQuery]);

  const handleTopicClick = (topic: string) => {
    setSearchQuery(topic.startsWith('#') ? topic.substring(1) : topic);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for topics, proposals, or hashtags..." 
            className="pl-10 w-full h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        
        {searchQuery ? (
          <div className='space-y-6'>
            <h2 className="text-2xl font-bold tracking-tight">
              Results for "{searchQuery}"
            </h2>
            {loading && (
              <div className="space-y-6">
                <PostSkeleton />
                <PostSkeleton />
              </div>
            )}
            {!loading && filteredPosts.length > 0 && (
              filteredPosts.map(post => <PostCard key={post.id} post={post} />)
            )}
            {!loading && filteredPosts.length === 0 && (
              <div className="text-center py-20 bg-card rounded-lg border border-dashed min-h-[20rem] flex flex-col justify-center items-center">
                <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No results found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try searching for something else.
                </p>
              </div>
            )}
          </div>
        ) : (
          <Card>
              <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                  {trendingTopics.map(topic => (
                      <Badge 
                        key={topic} 
                        variant="secondary" 
                        className="text-sm cursor-pointer hover:bg-primary/20"
                        onClick={() => handleTopicClick(topic)}
                      >
                        {topic}
                      </Badge>
                  ))}
              </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
