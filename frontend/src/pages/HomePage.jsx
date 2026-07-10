import { useQuery } from "@tanstack/react-query";
import { postService } from "../services/postService";
import { metaService } from "../services/metaService";
import { BreakingTicker } from "../components/home/BreakingTicker";
import { HeroSection } from "../components/home/HeroSection";
import { TrendingStories } from "../components/home/TrendingStories";
import { TransferCentre } from "../components/home/TransferCentre";
import { ClubRail } from "../components/home/ClubRail";
import { LatestNews } from "../components/home/LatestNews";
import { FeaturedWriters } from "../components/home/FeaturedWriters";
import { NewsletterSection } from "../components/home/NewsletterSection";
import { SkeletonHeroSection, SkeletonLatestNews } from "../components/common/Skeleton";

export function HomePage() {
  const featured = useQuery({ queryKey: ["featured-posts"], queryFn: postService.featured });
  const trending = useQuery({ queryKey: ["trending-posts"], queryFn: postService.trending });
  const latest = useQuery({ queryKey: ["latest-posts"], queryFn: () => postService.list({ limit: 9 }) });
  const authors = useQuery({ queryKey: ["authors"], queryFn: metaService.authors });

  const isLoading = featured.isLoading || trending.isLoading || latest.isLoading;

  if (isLoading) {
    return (
      <main>
        <SkeletonHeroSection />
        <SkeletonLatestNews />
      </main>
    );
  }

  const featuredPosts = featured.data?.data || [];
  const trendingPosts = trending.data?.data || [];
  const latestPosts = latest.data?.data || [];

  return (
    <main>
      <HeroSection featured={featuredPosts} trending={trendingPosts} />
      <BreakingTicker posts={trendingPosts} />
      <TrendingStories posts={trendingPosts} />
      <TransferCentre posts={latestPosts} />
      <ClubRail />
      <LatestNews posts={latestPosts} />
      <FeaturedWriters authors={authors.data || []} />
      <NewsletterSection />
    </main>
  );
}

