
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, CheckCircle } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { analyzeCitizenPost } from '@/ai/flows/analyze-citizen-post-relevance';
import { summarizePostContent } from '@/ai/flows/summarize-post-content';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
  title: z
    .string()
    .min(10, {
      message: 'Title must be at least 10 characters.',
    })
    .max(100, {
      message: 'Title must not exceed 100 characters.',
    }),
  description: z
    .string()
    .min(50, {
      message: 'Description must be at least 50 characters.',
    })
    .max(500, {
      message: 'Description must not exceed 500 words.',
    }),
  topicTags: z.string().min(1, {
    message: 'Please enter at least one topic tag.',
  }),
  mediaUrl: z.string().url().optional().or(z.literal('')),
  governmentLevel: z.enum(['Central Government', 'State Government']).optional(),
});

export function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisState, setAnalysisState] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  
  // This is a placeholder for checking user roles.
  // In a real app, you would get this from the user's profile/claims.
  const isGovernmentUser = true; 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      topicTags: '',
      mediaUrl: '',
      governmentLevel: 'Central Government',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to submit a proposal.',
      });
      return;
    }

    setIsSubmitting(true);
    setAnalysisState('analyzing');

    try {
      const postType = isGovernmentUser ? (values.governmentLevel || 'Central Government') : 'Citizen';

      // Skip AI analysis for government posts for now
      if (postType === 'Citizen') {
        const analysisResult = await analyzeCitizenPost({
          title: values.title,
          description: values.description,
          topicTags: values.topicTags.split(',').map((tag) => tag.trim()),
          mediaUrl: values.mediaUrl,
        });

        if (!analysisResult.isRelevant || !analysisResult.isAppropriate) {
          toast({
            variant: 'destructive',
            title: 'Submission Rejected',
            description: analysisResult.summary || 'Your proposal was flagged as inappropriate or irrelevant.',
          });
          setIsSubmitting(false);
          setAnalysisState('idle');
          return;
        }
      }
      
      setAnalysisState('done');
      
      const summaryResult = await summarizePostContent({
        title: values.title,
        description: values.description,
      });

      const postsCollection = collection(firestore, 'posts');
      const newPostRef = doc(postsCollection);
      await setDoc(newPostRef, {
        id: newPostRef.id,
        type: postType,
        authorId: user.uid,
        author: user.displayName || user.email?.split('@')[0],
        authorAvatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`,
        title: values.title,
        shortDescription: values.description.substring(0, 150) + '...',
        fullDescription: values.description,
        topicTags: values.topicTags.split(',').map((tag) => tag.trim()),
        mediaUrl: values.mediaUrl || '',
        mediaHint: '',
        aiSummary: summaryResult.summary,
        votes: { agree: 0, mixed: 0, disagree: 0 },
        totalVotes: 0,
        sentimentTrend: 'Mixed',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Proposal Submitted!',
        description: 'Your proposal has been published to the feed.',
      });

      router.push(`/post/${newPostRef.id}`);
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not submit your proposal. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setAnalysisState('idle');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {isGovernmentUser && (
           <FormField
              control={form.control}
              name="governmentLevel"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Government Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Central Government" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Central Government
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="State Government" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          State Government
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Community Gardens in Every Neighborhood" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your proposal in detail. Explain the problem and your proposed solution."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topicTags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Environment, Community, Health" {...field} />
              </FormControl>
              <FormDescription>Comma-separated tags that help categorize your proposal.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mediaUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Optional Media</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormDescription>Link to an image or infographic that supports your proposal.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {analysisState !== 'idle' && (
          <div className="rounded-lg border bg-secondary/50 p-4">
            <div className="flex items-center">
              {analysisState === 'analyzing' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">AI analyzing your proposal...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Analysis complete! Preparing to submit...</span>
                </>
              )}
            </div>
            <ul className="mt-2 space-y-1 list-disc pl-10 text-xs text-muted-foreground">
              <li>Checking for relevance to public policy...</li>
              <li>Scanning for duplicate proposals...</li>
              <li>Analyzing language and tone...</li>
            </ul>
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" /> Analyze & Submit
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
