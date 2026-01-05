import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostCard } from '@/components/post-card';
import { posts, users } from '@/lib/data';

export default function HomePage() {
  const currentUser = users[0];

  const regionPosts = posts.filter(p => p.level === 'Region'); // Simplified logic
  const statePosts = posts.filter(p => p.level === 'State');
  const nationalPosts = posts.filter(p => p.level === 'National');

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Home Feed</h1>
        <Button asChild>
          <Link href="/posts/create">
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Create Post
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="region" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="region">My Region</TabsTrigger>
          <TabsTrigger value="state">My State</TabsTrigger>
          <TabsTrigger value="national">National</TabsTrigger>
        </TabsList>
        <TabsContent value="region">
            <div className="mt-6 space-y-6">
                {regionPosts.length > 0 ? (
                    regionPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <p className="text-center text-muted-foreground">No posts in your region yet.</p>
                )}
            </div>
        </TabsContent>
        <TabsContent value="state">
            <div className="mt-6 space-y-6">
                {statePosts.length > 0 ? (
                    statePosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <p className="text-center text-muted-foreground">No posts in your state yet.</p>
                )}
            </div>
        </TabsContent>
        <TabsContent value="national">
            <div className="mt-6 space-y-6">
                {nationalPosts.length > 0 ? (
                    nationalPosts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                    <p className="text-center text-muted-foreground">No national posts yet.</p>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
