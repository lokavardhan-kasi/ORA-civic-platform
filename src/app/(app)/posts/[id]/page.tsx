import { PostCard } from '@/components/post-card';
import { posts, comments as allComments, users } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

function CommentCard({ comment }: { comment: (typeof allComments)[0] }) {
  const author = users.find(u => u.id === comment.authorId);
  return (
    <div className="flex gap-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src={`https://picsum.photos/seed/${author?.avatar}/100/100`} />
        <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Link href={`/profile/${author?.id}`} className="font-semibold hover:underline">{author?.name}</Link>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-foreground/90">{comment.text}</p>
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
            <ThumbsUp className="h-4 w-4" /> {comment.likeCount}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === params.id);
  const comments = allComments.filter(c => c.postId === params.id);

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PostCard post={post} />
      
      <Card>
        <CardHeader>
          <CardTitle>Discussion ({post.commentCount})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={`https://picsum.photos/seed/${users[0].avatar}/100/100`} />
                <AvatarFallback>{users[0].name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                 <Textarea placeholder="Add to the discussion..." />
                 <div className="flex justify-end">
                    <Button>Comment</Button>
                 </div>
              </div>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-8">
            {comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
