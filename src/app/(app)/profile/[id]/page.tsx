import { users, posts as allPosts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, UserPlus } from 'lucide-react';
import { PostCard } from '@/components/post-card';

export default function ProfilePage({ params }: { params: { id: string } }) {
  const user = users.find(u => u.id === params.id);
  const userPosts = allPosts.filter(p => p.authorId === params.id);

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="overflow-hidden">
        <div className="h-32 bg-secondary" />
        <CardContent className="p-6">
          <div className="-mt-20 flex items-end justify-between">
            <Avatar className="h-32 w-32 border-4 border-card">
              <AvatarImage src={`https://picsum.photos/seed/${user.avatar}/200/200`} />
              <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button><UserPlus className="mr-2 h-4 w-4"/> Follow</Button>
          </div>
          <div className="mt-4 space-y-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.region}, {user.state}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-1">
              <span className="font-bold">{user.following}</span>
              <span className="text-muted-foreground">Following</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{user.followers}</span>
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className='space-y-6'>
        <h2 className="text-xl font-bold">Posts by {user.name}</h2>
        {userPosts.length > 0 ? (
            userPosts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
            <p className="text-center text-muted-foreground">This user hasn't created any posts yet.</p>
        )}
      </div>
    </div>
  );
}
