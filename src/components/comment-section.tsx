'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoQuery } from '@/firebase';
import type { Comment } from '@/lib/data';
import { analyzeComment } from '@/ai/flows/analyze-comment';
import { summarizeComments } from '@/ai/flows/summarize-comments';
import { addDoc, collection, serverTimestamp, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const commentSchema = z.object({
  text: z.string().min(1, 'Comment cannot be empty.').max(500, 'Comment is too long.'),
});

export function CommentSection({ postId }: { postId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const commentsQuery = useMemoQuery(
    `/posts/${postId}/comments`,
    orderBy('createdAt', 'desc')
  );
  const { data: comments, loading: commentsLoading } = useCollection<Comment>(commentsQuery);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { text: '' },
  });

  const triggerCommentSummarization = useCallback(async () => {
    if (!firestore) return;
    try {
      const commentsCollectionRef = collection(firestore, `/posts/${postId}/comments`);
      const commentsSnapshot = await getDocs(commentsCollectionRef);
      const allCommentsText = commentsSnapshot.docs.map(doc => doc.data().text as string);

      if (allCommentsText.length > 0) {
        const result = await summarizeComments({ comments: allCommentsText });
        const postRef = doc(firestore, 'posts', postId);
        await updateDoc(postRef, {
          aiCommentSummary: result.summary,
        });
      }
    } catch (error) {
      console.error('Failed to summarize comments:', error);
      // We don't show a toast here to avoid bothering the user with a background task failure.
    }
  }, [firestore, postId]);

  const onSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Not logged in',
        description: 'You need to be logged in to comment.',
        action: <Button onClick={() => router.push('/login')}>Login</Button>
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Analyze comment with AI
      const analysis = await analyzeComment({ comment: values.text });

      if (!analysis.isAppropriate) {
        toast({
          variant: 'destructive',
          title: 'Comment flagged',
          description: analysis.reason || 'Your comment was found to be inappropriate and was not posted.',
        });
        setIsSubmitting(false);
        return;
      }

      // 2. Save comment to Firestore
      const commentsCollection = collection(firestore, `/posts/${postId}/comments`);
      await addDoc(commentsCollection, {
        postId,
        authorId: user.uid,
        author: user.displayName || user.email,
        authorAvatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
        text: values.text,
        createdAt: serverTimestamp(),
      });

      form.reset();
      toast({
        title: 'Comment posted!',
      });

      // 3. Trigger comment summarization (don't wait for it)
      triggerCommentSummarization();

    } catch (error: any) {
      console.error('Error posting comment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not post your comment. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <MessageSquare className="mr-3 h-6 w-6 text-primary" />
          Community Discussion
        </CardTitle>
        <CardDescription>
          Share your thoughts and feedback on this proposal.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
              <Avatar className="hidden sm:block">
                <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Add your comment..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Post Comment
                </Button>
              </div>
            </form>
          </Form>
        )}

        <div className="space-y-6">
          {commentsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!commentsLoading && comments && comments.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
          {comments?.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar>
                <AvatarImage src={comment.authorAvatarUrl} />
                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
                <p className="mt-2 text-sm text-foreground/90">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
