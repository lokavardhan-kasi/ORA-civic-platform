# **App Name**: ORA: Civic Dialogue

## Core Features:

- User Authentication: Secure user authentication using Firebase Authentication with email or OTP.
- Location Selection: On first login, users must select their state and region (city/district).
- Profile Creation: Create a public civic profile for each user, storing their state, region, and followers in Firestore.
- Post Creation: Users can create posts by selecting the post level (Region, State, National). Each post functions as an Agree/Disagree poll.
- Dynamic Feed: Display posts based on user's location and post level (Region, State, National) in real-time. National posts are visible to all.
- Real-time Voting: Enable users to vote (Agree/Disagree) only once per post, with live poll percentage updates.
- AI Summary: Tool to generate a short, neutral summary of public opinion for a post using generative AI.

## Style Guidelines:

- Primary background: Deep navy (#0F172A), providing a professional feel.
- Card background: Dark gray (#111827), offering subtle contrast.
- Borders/dividers: Dark gray (#1F2933), delineating sections without harsh lines.
- Primary text: Light gray (#E5E7EB) for readability.
- Secondary text: Medium gray (#9CA3AF) for less critical information.
- Primary accent (buttons/links): Sky blue (#1D9BF0), providing a modern touch.
- Agree action color: Forest green (#22C55E), signaling positive sentiment.
- Disagree action color: Soft red (#EF4444), indicating dissent.
- Body and headline font: 'Inter', a sans-serif font known for its modern and neutral appearance, suitable for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use simple, scalable vector icons relevant to civic engagement.
- Three-column desktop layout: Left sidebar, center feed, right sidebar. Mobile responsive design for single-column feed.
- Top navigation bar with logo, search, notifications, and profile avatar.
- Subtle animations for voting updates and new notifications.