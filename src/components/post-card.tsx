import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/lib/types';
import { users } from '@/lib/data';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AiSummaryButton } from './ai-summary-button';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const author = users.find(u => u.id === post.authorId);
  const totalVotes = post.agreeCount + post.disagreeCount;
  const agreePercentage = totalVotes > 0 ? (post.agreeCount / totalVotes) * 100 : 0;
  const disagreePercentage = totalVotes > 0 ? (post.disagreeCount / totalVotes) * 100 : 0;

  const levelColor = {
    Region: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    State: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    National: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <Avatar>
          <AvatarImage src={`https://picsum.photos/seed/${author?.avatar}/100/100`} alt={author?.name} />
          <AvatarFallback>{author?.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${author?.id}`} className="font-semibold hover:underline">
              {author?.name}
            </Link>
            <span className="text-sm text-muted-foreground">@{author?.username}</span>
          </div>
          <p className="text-sm text-muted-foreground">{author?.region}, {author?.state}</p>
        </div>
        <Badge variant="outline" className={levelColor[post.level]}>{post.level}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <Link href={`/posts/${post.id}`} className="block">
          <h2 className="font-headline text-xl font-bold hover:underline">{post.title}</h2>
          <p className="mt-2 text-muted-foreground">{post.description}</p>
        </Link>
        <div className="space-y-2">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
                <div style={{ width: `${agreePercentage}%` }} className="bg-agree" />
                <div style={{ width: `${disagreePercentage}%` }} className="bg-disagree" />
            </div>
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
                <span className="text-agree">{agreePercentage.toFixed(1)}% Agree</span>
                <span className="text-disagree">{disagreePercentage.toFixed(1)}% Disagree</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-2">
        <div className="flex gap-2">
            <Button variant="outline" className="text-agree hover:bg-agree/10 hover:text-agree border-agree/50">
                <ThumbsUp className="mr-2 h-4 w-4"/>
                Agree
            </Button>
            <Button variant="outline" className="text-disagree hover:bg-disagree/10 hover:text-disagree border-disagree/50">
                <ThumbsDown className="mr-2 h-4 w-4"/>
                Disagree
            </Button>
        </div>
        <div className="flex items-center gap-4">
          <AiSummaryButton post={post} />
          <Button variant="ghost" asChild>
            <Link href={`/posts/${post.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" /> {post.commentCount}
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
