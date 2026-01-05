import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { trendingTopics, posts } from '@/lib/data';

export function RightSidebar() {
  return (
    <aside className="hidden w-80 shrink-0 border-l bg-card p-6 lg:block">
      <div className="flex flex-col gap-8">
        <Card className="border-none shadow-none">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Trending Now</CardTitle>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            <ul className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <li key={topic.hashtag}>
                  <Link href={`/search?q=${topic.hashtag.substring(1)}`} className="group block">
                    <p className="text-sm font-medium text-foreground group-hover:underline">{topic.hashtag}</p>
                    <p className="text-xs text-muted-foreground">{topic.postCount}k posts</p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Separator />

        <Card className="border-none shadow-none">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Active Discussions</CardTitle>
          </CardHeader>
          <CardContent className="mt-4 p-0">
            <ul className="space-y-3">
              {posts.slice(0, 3).map(post => (
                <li key={post.id}>
                   <Link href={`/posts/${post.id}`} className="group block">
                    <p className="truncate text-sm font-medium text-foreground group-hover:underline">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.commentCount} comments</p>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
