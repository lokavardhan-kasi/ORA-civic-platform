
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Lightbulb, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/data";
import { AgreementBar } from "./agreement-bar";
import { PostActions } from "./post-actions";
import { Separator } from "./ui/separator";
import { motion } from 'framer-motion';

interface PostCardProps {
  post: Post;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function PostCard({ post }: PostCardProps) {
  const sentimentColor =
    post.sentimentTrend === "Mostly Agree"
      ? "text-vote-agree"
      : post.sentimentTrend === "Mostly Disagree"
      ? "text-vote-disagree"
      : "text-vote-mixed";
      
  const sentimentBgColor =
    post.sentimentTrend === "Mostly Agree"
      ? "bg-vote-agree-bg"
      : post.sentimentTrend === "Mostly Disagree"
      ? "bg-vote-disagree-bg"
      : "bg-vote-mixed-bg";

  const totalVotes = post.totalVotes ?? 0;
  const isGovernmentPost = post.type === 'Central Government' || post.type === 'State Government';

  return (
    <motion.div variants={cardVariants}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
        
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={post.authorAvatarUrl} alt={`${post.author} avatar`} />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{post.author}</p>
                <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <Badge variant={isGovernmentPost ? 'default' : 'secondary'}>
                {post.type}
              </Badge>
            </div>
          </CardHeader>
          <Link href={`/post/${post.id}`} className="block flex-grow">
            <CardContent className="space-y-4 px-4 sm:px-6 pt-0">
              <h2 className="text-xl font-bold leading-snug tracking-tight">
                {post.title}
              </h2>
              
              {post.mediaUrl && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    data-ai-hint={post.mediaHint}
                  />
                </div>
              )}
              
              <p className="text-foreground/80 line-clamp-3 text-sm">{post.shortDescription}</p>

              {post.aiSummary && post.aiSummary.length > 0 && (
                <div className="rounded-lg bg-gradient-to-tr from-primary/10 to-secondary p-4 border border-primary/10">
                  <h3 className="flex items-center font-semibold text-sm mb-2 text-primary">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    AI Summary
                  </h3>
                  <ul className="space-y-1.5 list-disc pl-5 text-sm text-foreground/90">
                    {post.aiSummary.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              <AgreementBar post={post} />
            </CardContent>
          </Link>
        
        <CardFooter className="flex flex-col items-stretch gap-4 bg-card p-4 mt-auto">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                  <div className="flex items-center font-medium">
                      <Users className="mr-1.5 h-4 w-4" />
                      <span>{totalVotes.toLocaleString()} votes</span>
                  </div>
                  {post.sentimentTrend && (
                  <div className={`flex items-center font-semibold px-2 py-1 rounded-full text-xs ${sentimentColor} ${sentimentBgColor}`}>
                      <TrendingUp className="mr-1.5 h-4 w-4" />
                      <span>{post.sentimentTrend}</span>
                  </div>
                  )}
              </div>
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                  <Link href={`/post/${post.id}`}>
                      View Details
                      <ExternalLink className="ml-2 h-4 w-4"/>
                  </Link>
              </Button>
          </div>
          <Separator />
          <PostActions post={post} variant="feed" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
