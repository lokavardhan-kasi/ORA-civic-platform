
"use client";

import { cn } from "@/lib/utils";
import type { Post } from "@/lib/data";

interface AgreementBarProps {
  post: Post;
}

export function AgreementBar({ post }: AgreementBarProps) {
  const votes = post.votes || { agree: 0, mixed: 0, disagree: 0 };
  const totalVotes = post.totalVotes || 0;

  const getPercentage = (value: number) => {
    if (totalVotes === 0) return 0;
    return (value / totalVotes) * 100;
  };

  const agreePercent = getPercentage(votes.agree);
  const mixedPercent = getPercentage(votes.mixed);
  const disagreePercent = getPercentage(votes.disagree);

  return (
    <div className="w-full pt-4">
        <div className="flex text-xs text-muted-foreground mb-2">
            <div style={{ width: `${agreePercent}%` }} className={cn("text-center font-semibold text-vote-agree", agreePercent < 10 && "text-transparent")}>{Math.round(agreePercent)}%</div>
            <div style={{ width: `${mixedPercent}%` }} className={cn("text-center font-semibold text-vote-mixed", mixedPercent < 10 && "text-transparent")}>{Math.round(mixedPercent)}%</div>
            <div style={{ width: `${disagreePercent}%` }} className={cn("text-center font-semibold text-vote-disagree", disagreePercent < 10 && "text-transparent")}>{Math.round(disagreePercent)}%</div>
        </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="bg-vote-agree transition-all duration-500"
          style={{ width: `${agreePercent}%` }}
        />
        <div
          className="bg-vote-mixed transition-all duration-500"
          style={{ width: `${mixedPercent}%` }}
        />
        <div
          className="bg-vote-disagree transition-all duration-500"
          style={{ width: `${disagreePercent}%` }}
        />
      </div>
    </div>
  );
}
