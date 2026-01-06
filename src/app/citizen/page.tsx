'use client';
import FeedPage from '../feed/page';

export default function CitizenFeedPage() {
  return (
    <FeedPage 
      postTypeFilter="Citizen" 
      pageTitle="Citizen Proposals"
      pageDescription="Ideas and proposals submitted by the community."
    />
  );
}
