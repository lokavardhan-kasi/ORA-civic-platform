'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { summarizePublicOpinion } from '@/ai/flows/summarize-public-opinion';
import type { Post } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface AiSummaryButtonProps {
  post: Post;
}

export function AiSummaryButton({ post }: AiSummaryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsOpen(true);
    if (summary) return; // Don't re-generate if already have summary

    setIsLoading(true);
    try {
      const result = await summarizePublicOpinion({
        title: post.title,
        description: post.description,
        agreeCount: post.agreeCount,
        disagreeCount: post.disagreeCount,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI summary. Please try again later.',
      });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={handleGenerateSummary} aria-label="Generate AI Summary">
        <Sparkles className="mr-2 h-4 w-4" />
        Summary
      </Button>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Opinion Summary
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-base text-foreground">
              {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                summary
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
