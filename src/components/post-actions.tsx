
'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Hand, MessageSquare, Loader2, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Post, VoteType } from '@/lib/data';
import { useUser, useFirestore } from '@/firebase';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useMemoDoc } from '@/firebase/firestore/use-doc';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostActionsProps {
  post: Post;
  variant?: 'detail' | 'feed';
}

type UserVote = {
  voteType: VoteType;
};

export function PostActions({ post: initialPost, variant = 'detail' }: PostActionsProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const postRef = useMemoDoc(`/posts/${initialPost.id}`);
  const { data: post } = useDoc<Post>(postRef, initialPost);

  const userVoteRef = useMemoDoc(user ? `/posts/${initialPost.id}/votes/${user.uid}` : null);
  const { data: userVote, loading: userVoteLoading } = useDoc<UserVote>(userVoteRef);

  const [isSubmitting, setIsSubmitting] = useState<VoteType | 'comment' | null>(null);

  const handleVote = async (newVoteType: VoteType) => {
    if (!user || !firestore || !postRef) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to vote.',
        action: (
            <Button onClick={() => router.push('/login')}>Login</Button>
        )
      });
      return;
    }
    
    const currentUserVoteRef = doc(firestore, `/posts/${initialPost.id}/votes/${user.uid}`);
    setIsSubmitting(newVoteType);

    const isDeselecting = userVote?.voteType === newVoteType;
    const oldVoteType = userVote?.voteType;

    try {
      await runTransaction(firestore, async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists()) {
          throw "Post does not exist!";
        }

        let newVotes = { ...(postDoc.data().votes || { agree: 0, mixed: 0, disagree: 0 }) };
        let newTotalVotes = postDoc.data().totalVotes || 0;

        if (oldVoteType) {
          newVotes[oldVoteType] = Math.max(0, newVotes[oldVoteType] - 1);
          newTotalVotes = Math.max(0, newTotalVotes - 1);
        }

        if (!isDeselecting) {
          newVotes[newVoteType] = (newVotes[newVoteType] || 0) + 1;
          newTotalVotes++;
        }
        
        transaction.update(postRef, { votes: newVotes, totalVotes: newTotalVotes });

        if (isDeselecting) {
          transaction.delete(currentUserVoteRef);
        } else {
          transaction.set(currentUserVoteRef, {
            postId: initialPost.id,
            userId: user.uid,
            voteType: newVoteType,
            createdAt: serverTimestamp(),
          });
        }
      });

    } catch (error: any) {
      console.error("Vote transaction failed: ", error);
      toast({ 
        variant: 'destructive', 
        title: 'Error casting vote.', 
        description: error.message || 'An error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(null);
    }
  };
  
  const currentPost = post || initialPost;
  const voted = userVote?.voteType;
  const isDetailView = variant === 'detail';

  const buttonSize = isDetailView ? 'lg' : 'default';
  const buttonClass = isDetailView ? 'flex-col h-auto p-3 text-xs sm:text-sm' : 'flex-grow';
  const gridCols = isDetailView ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className="space-y-4">
      <div className={`grid ${gridCols} gap-2`}>
        {(['agree', 'mixed', 'disagree'] as const).map((voteType) => {
            const Icon = voteType === 'agree' ? ThumbsUp : voteType === 'mixed' ? Hand : ThumbsDown;
            
            const isVoted = voted === voteType;

            const style = isVoted
            ? (voteType === 'agree' ? "bg-vote-agree hover:bg-vote-agree/90 text-vote-agree-foreground shadow-md border-transparent" : voteType === 'mixed' ? "bg-vote-mixed hover:bg-vote-mixed/90 text-vote-mixed-foreground shadow-md border-transparent" : "bg-vote-disagree hover:bg-vote-disagree/90 text-vote-disagree-foreground shadow-md border-transparent")
            : (voteType === 'agree' ? "border-vote-agree/50 text-vote-agree hover:bg-vote-agree-bg hover:text-vote-agree" : voteType === 'mixed' ? "border-vote-mixed/50 text-vote-mixed hover:bg-vote-mixed-bg hover:text-vote-mixed" : "border-vote-disagree/50 text-vote-disagree hover:bg-vote-disagree-bg hover:text-vote-disagree");

            return (
                 <Button
                    key={voteType}
                    size={buttonSize}
                    variant={"outline"}
                    className={cn("transition-all", buttonClass, style)}
                    onClick={() => handleVote(voteType)}
                    disabled={userVoteLoading || !!isSubmitting}
                >
                    {isSubmitting === voteType ? (
                        <Loader2 className={cn("animate-spin", isDetailView && "mb-1")} />
                    ) : (
                        <Icon className={cn(isDetailView && "mb-1")} />
                    )}
                    <span className="font-semibold capitalize">{voteType}</span>
                </Button>
            )
        })}
        {!isDetailView && (
             <Button
                asChild
                size={buttonSize}
                variant="outline"
                className={cn("transition-all flex-grow", buttonClass)}
            >
                <Link href={`/post/${initialPost.id}#comments`}>
                    <MessageSquare />
                    <span className="font-semibold capitalize">Comment</span>
                </Link>
            </Button>
        )}
      </div>
       {isDetailView && (
             <Button
                size="lg"
                variant="outline"
                className="w-full h-auto p-3 transition-all"
                onClick={() => document.getElementById('comment-section')?.focus()}
            >
                <MessageSquare className="h-5 w-5 mr-2" />
                <span className="font-semibold capitalize">Add a Comment</span>
            </Button>
        )}
    </div>
  );
}
