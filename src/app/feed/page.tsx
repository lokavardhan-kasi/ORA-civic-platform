'use client';

import { PostCard } from "@/components/post-card";
import { FeedFilters } from "@/components/feed-filters";
import type { Post } from "@/lib/data";
import { useCollection, useMemoQuery } from "@/firebase/firestore/use-collection";
import { Skeleton } from "@/components/ui/skeleton";
import { Frown, AlertTriangle } from "lucide-react";
import { AppLayout } from "@/components/app-layout";
import { useUser } from "@/firebase";
import { Header } from "@/components/header";
import { where } from "firebase/firestore";
import { useMemo, useState, useCallback } from "react";
import { motion } from 'framer-motion';

function PostSkeleton() {
  return (
    <div className="space-y-4 rounded-lg bg-card p-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

function FeedContent({ 
  postTypeFilter,
  pageTitle,
  pageDescription
}: { 
  postTypeFilter?: string | string[],
  pageTitle?: string,
  pageDescription?: string
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('trending');

  const handleTopicChange = useCallback((topic: string, checked: boolean) => {
    setSelectedTopics(prev => 
      checked ? [...prev, topic] : prev.filter(t => t !== topic)
    );
  }, []);

  const filterConstraints = useMemo(() => {
    const constraints = [];
    if (postTypeFilter) {
      if (Array.isArray(postTypeFilter)) {
        if (postTypeFilter.length > 0) {
          constraints.push(where("type", "in", postTypeFilter));
        }
      } else {
        constraints.push(where("type", "==", postTypeFilter));
      }
    }

    if (searchQuery) {
      constraints.push(where("title", ">=", searchQuery));
      constraints.push(where("title", "<=", searchQuery + '\uf8ff'));
    }

    if (selectedTopics.length > 0) {
      constraints.push(where('topicTags', 'array-contains-any', selectedTopics));
    }
    
    return constraints;
  }, [postTypeFilter, searchQuery, selectedTopics]);

  const postsQuery = useMemoQuery("posts", ...filterConstraints);
  
  const { data: posts, loading, error } = useCollection<Post>(postsQuery);

  const sortedAndFilteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = [...posts];
    
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
            post.title.toLowerCase().includes(lowercasedQuery) ||
            post.shortDescription.toLowerCase().includes(lowercasedQuery)
        );
    }
    
    const sorted = [...filtered];

    switch (sortOrder) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'agree':
        sorted.sort((a, b) => (b.votes?.agree || 0) - (a.votes?.agree || 0));
        break;
      case 'disagree':
        sorted.sort((a, b) => (b.votes?.disagree || 0) - (a.votes?.disagree || 0));
        break;
      case 'trending':
      default:
        // Simple trending: total votes + recency
        sorted.sort((a, b) => {
          const scoreA = (a.totalVotes || 0) + new Date(a.createdAt).getTime() / 1e11;
          const scoreB = (b.totalVotes || 0) + new Date(b.createdAt).getTime() / 1e11;
          return scoreB - scoreA;
        });
        break;
    }
    
    if (activeTab === 'new') {
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return sorted;
  }, [posts, sortOrder, activeTab, searchQuery]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid md:grid-cols-2 gap-6">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )
    }
  
    if (error) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-20rem)] text-center p-4 bg-card rounded-lg border border-dashed">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold text-destructive mb-2">Error Loading Posts</h2>
            <p className="text-muted-foreground max-w-md">
              Something went wrong while fetching the feed. Please check the error message below and try refreshing the page.
            </p>
            <div className="mt-4 p-3 rounded-md bg-destructive/10 text-destructive font-mono text-sm text-left max-w-xl overflow-auto">
              <p><strong>Error Details:</strong> {error.message}</p>
            </div>
         </div>
      );
    }
    
    const hasPosts = sortedAndFilteredPosts && sortedAndFilteredPosts.length > 0;
  
    return hasPosts ? (
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {sortedAndFilteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </motion.div>
    ) : (
      <div className="text-center py-20 bg-card rounded-lg border border-dashed min-h-[calc(100dvh-20rem)] flex flex-col justify-center items-center">
        <Frown className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">No proposals yet</h3>
        <p className="mt-2 text-muted-foreground">
          There are no proposals matching your filter. Why not submit one?
        </p>
      </div>
    );
  }


  return (
    <>
      <div className="mb-8">
        {pageTitle && <h1 className="text-3xl font-bold tracking-tight mb-2">{pageTitle}</h1>}
        {pageDescription && <p className="text-muted-foreground max-w-2xl">{pageDescription}</p>}
      </div>
      <FeedFilters 
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        selectedTopics={selectedTopics}
        onTopicChange={handleTopicChange}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
      />
      {renderContent()}
    </>
  );
}

export default function FeedPage({ 
  postTypeFilter,
  pageTitle = "Home Feed",
  pageDescription = "Recent proposals from the community and government."
}: { 
  postTypeFilter?: string | string[],
  pageTitle?: string,
  pageDescription?: string
}) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const content = (
    <div className="w-full max-w-6xl mx-auto py-8">
      <FeedContent 
        postTypeFilter={postTypeFilter} 
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />
    </div>
  );

  if (!user) {
    return (
      <div className="w-full flex flex-col items-center">
        <Header />
        <div className="py-8 px-4 w-full">
          {content}
        </div>
      </div>
    )
  }

  return (
    <AppLayout>
      {content}
    </AppLayout>
  )
}
