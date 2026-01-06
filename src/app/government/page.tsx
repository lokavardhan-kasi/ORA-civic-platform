'use client';
import FeedPage from '../feed/page';

export default function GovernmentFeedPage() {
  return (
    <FeedPage 
      postTypeFilter={['State Government', 'Central Government']} 
      pageTitle="Government Proposals"
      pageDescription="Official proposals from state and central government bodies."
    />
  );
}
