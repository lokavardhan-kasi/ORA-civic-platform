import { PostCard } from '@/components/post-card';
import { posts } from '@/lib/data';

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || '';
  const results = query 
    ? posts.filter(p => p.hashtags.some(h => h.toLowerCase().includes(query.toLowerCase())))
    : posts;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        Search Results {query && `for "#${query}"`}
      </h1>
      
      <div className="space-y-6">
        {results.length > 0 ? (
          results.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-center text-muted-foreground">No posts found matching your search.</p>
        )}
      </div>
    </div>
  );
}
