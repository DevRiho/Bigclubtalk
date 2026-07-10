import React from "react";
import { cn } from "../../utils/cn";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse bg-slate-200/80 rounded-sm", className)}
      {...props}
    />
  );
}

export function SkeletonStoryCard({ size = "standard" }) {
  return (
    <div className={cn("border-b border-slate-200 pb-5", size === "feature" && "border-0 pb-0")}>
      <Skeleton className={cn("h-48 w-full bg-slate-200/80", size === "feature" && "h-[420px]")} />
      <div className="mt-4">
        {/* Category tag skeleton */}
        <Skeleton className="h-3 w-16" />
        {/* Title skeleton */}
        <Skeleton className={cn("mt-3 h-7 w-5/6", size === "feature" && "h-14 w-full")} />
        {size === "feature" && <Skeleton className="mt-2 h-7 w-2/3" />}
        {/* Excerpt skeleton */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        {/* Meta info skeleton */}
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1.6fr_.8fr]">
      {/* Lead Story Skeleton */}
      <div className="space-y-5">
        <Skeleton className="h-[520px] w-full" />
        <div className="mt-5 space-y-3">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-12 w-11/12" />
          <Skeleton className="h-12 w-3/4" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>

      {/* Sidebar Skeletons */}
      <div className="border-l-0 border-slate-200 lg:border-l lg:pl-8 space-y-6">
        <Skeleton className="h-4 w-28 mb-6" />
        <div className="space-y-6">
          <SkeletonStoryCard />
          <SkeletonStoryCard />
          <SkeletonStoryCard />
        </div>
      </div>
    </section>
  );
}

export function SkeletonLatestNews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid gap-x-8 gap-y-7 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonStoryCard />
        <SkeletonStoryCard />
        <SkeletonStoryCard />
        <SkeletonStoryCard />
        <SkeletonStoryCard />
        <SkeletonStoryCard />
      </div>
    </section>
  );
}

export function SkeletonArticle() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-6 animate-pulse">
      <Skeleton className="h-3 w-20" />
      <div className="space-y-3">
        <Skeleton className="h-10 md:h-14 w-full" />
        <Skeleton className="h-10 md:h-14 w-3/4" />
      </div>
      <Skeleton className="h-6 w-11/12 mt-4" />
      <div className="flex gap-4 items-center pt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-[480px] w-full mt-6" />
      <div className="flex gap-3 mt-6">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-3 pt-6">
        <Skeleton className="h-4.5 w-full" />
        <Skeleton className="h-4.5 w-full" />
        <Skeleton className="h-4.5 w-11/12" />
        <Skeleton className="h-4.5 w-5/6" />
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4.5 w-full" />
        <Skeleton className="h-4.5 w-11/12" />
        <Skeleton className="h-4.5 w-2/3" />
      </div>
    </main>
  );
}

