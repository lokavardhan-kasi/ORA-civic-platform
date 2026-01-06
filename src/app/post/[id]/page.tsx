
'use client';

import { use, useMemo } from 'react';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lightbulb, Users, Calendar, Loader2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SentimentChart } from "@/components/sentiment-chart";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useDoc, useMemoDoc, useUser } from "@/firebase";
import { AppLayout } from '@/components/app-layout';
import { Header } from '@/components/header';
import { PostActions } from '@/components/post-actions';
import { CommentSection } from '@/components/comment-section';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const postRef = useMemoDoc(`/posts/${id}`);
  const { data: post, loading, error } = useDoc<Post>(postRef);

  const voteData = useMemo(() => {
    if (!post || !post.votes) return [];
    return [
      { name: 'Agree', value: post.votes.agree, fill: 'var(--color-agree)' },
      { name: 'Mixed', value: post.votes.mixed, fill: 'var(--color-mixed)' },
      { name: 'Disagree', value: post.votes.disagree, fill: 'var(--color-disagree)' },
    ];
  }, [post]);


  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }
  
  if (!post || error) {
    notFound();
  }

  const isGovernmentPost = post.type === 'Central Government' || post.type === 'State Government';

  const PageContent = () => (
    <div className="bg-background flex-1 w-full">
      <div className="container mx-auto max-w-6xl py-4 md:py-8">
        <Button asChild variant="ghost" className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Feed
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                  <Badge variant={isGovernmentPost ? 'default' : 'secondary'} className="w-fit">{post.type}</Badge>
                  <h1 className="mt-2 text-2xl md:text-4xl font-bold tracking-tight">{post.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={post.authorAvatarUrl} />
                        <AvatarFallback>{post.author?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Invalid Date'}</span>
                    </div>
                  </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {post.mediaUrl && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    <Image src={post.mediaUrl} alt={post.title} fill className="object-cover" data-ai-hint={post.mediaHint} />
                  </div>
                )}
                
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed">
                  <p className="lead font-medium text-lg">{post.shortDescription}</p>
                  <p>{post.fullDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Sentiment Card */}
            <div className="lg:hidden">
              <SentimentCard />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl"><Lightbulb className="mr-3 h-6 w-6 text-primary" /> Expanded AI Analysis</CardTitle>
                <CardDescription>AI-generated insights based on the proposal and community feedback.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-base">
                <div>
                  <h4 className="font-semibold text-green-600">Key Summary Points</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                    {post.aiSummary?.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-amber-600 flex items-center"><Quote className="mr-2 h-4 w-4 transform -scale-x-100" />Comment Section Summary</h4>
                  <p className="mt-2 text-sm text-muted-foreground italic">
                    {post.aiCommentSummary || 'No comment summary available yet. More comments are needed for the AI to generate a summary.'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <CommentSection postId={post.id} />

          </div>

          {/* Desktop Sticky Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-24">
             <SentimentCard />
          </div>
        </div>
      </div>
    </div>
  );

  const SentimentCard = () => (
    <Card>
        <CardHeader>
        <CardTitle className="flex items-center text-xl"><Users className="mr-3 h-6 w-6 text-primary" /> Public Sentiment</CardTitle>
        </CardHeader>
        <CardContent>
        <PostActions post={post} />
        <Separator className="my-6" />
        <h3 className="font-semibold mb-2 text-center text-muted-foreground text-sm">Live Voting Breakdown</h3>
        <SentimentChart data={voteData} />
        </CardContent>
    </Card>
  );

  return user ? (
    <AppLayout>
      <PageContent />
    </AppLayout>
  ) : (
    <>
      <Header />
      <PageContent />
    </>
  );
}
