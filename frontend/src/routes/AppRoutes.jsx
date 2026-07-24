import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { SkeletonHeroSection, SkeletonArticle, SkeletonStoryCard } from "../components/common/Skeleton";

// Lazy load named page exports
const HomePage = lazy(() => import("../pages/HomePage").then(m => ({ default: m.HomePage })));
const ArticlePage = lazy(() => import("../pages/ArticlePage").then(m => ({ default: m.ArticlePage })));
const SearchPage = lazy(() => import("../pages/SearchPage").then(m => ({ default: m.SearchPage })));
const CategoryPage = lazy(() => import("../pages/CategoryPage").then(m => ({ default: m.CategoryPage })));
const DashboardPage = lazy(() => import("../pages/DashboardPage").then(m => ({ default: m.DashboardPage })));

const LoginPage = lazy(() => import("../pages/AuthPages").then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import("../pages/AuthPages").then(m => ({ default: m.RegisterPage })));
const VerifyEmailPage = lazy(() => import("../pages/AuthPages").then(m => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import("../pages/AuthPages").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("../pages/AuthPages").then(m => ({ default: m.ResetPasswordPage })));
const SocialPopupPage = lazy(() => import("../pages/SocialPopupPage").then(m => ({ default: m.SocialPopupPage })));

// Premium fallback spinner for general pages
const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-brand-red rounded-full animate-spin dark:border-slate-800" />
  </div>
);

// Fallback grid skeleton for category and search pages
const GridLoader = () => (
  <div className="mx-auto max-w-7xl px-4 py-12">
    <div className="grid gap-7 md:grid-cols-3">
      <SkeletonStoryCard />
      <SkeletonStoryCard />
      <SkeletonStoryCard />
    </div>
  </div>
);

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route 
          index 
          element={
            <Suspense fallback={<SkeletonHeroSection />}>
              <HomePage />
            </Suspense>
          } 
        />
        <Route 
          path="article/:slug" 
          element={
            <Suspense fallback={<SkeletonArticle />}>
              <ArticlePage />
            </Suspense>
          } 
        />
        <Route 
          path="search" 
          element={
            <Suspense fallback={<GridLoader />}>
              <SearchPage />
            </Suspense>
          } 
        />
        <Route 
          path="category/:slug" 
          element={
            <Suspense fallback={<GridLoader />}>
              <CategoryPage />
            </Suspense>
          } 
        />
        <Route 
          path="dashboard" 
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          } 
        />
        <Route 
          path="admin" 
          element={
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          } 
        />
        <Route 
          path="login" 
          element={
            <Suspense fallback={<PageLoader />}>
              <LoginPage />
            </Suspense>
          } 
        />
        <Route 
          path="register" 
          element={
            <Suspense fallback={<PageLoader />}>
              <RegisterPage />
            </Suspense>
          } 
        />
        <Route 
          path="verify-email" 
          element={
            <Suspense fallback={<PageLoader />}>
              <VerifyEmailPage />
            </Suspense>
          } 
        />
        <Route 
          path="forgot-password" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ForgotPasswordPage />
            </Suspense>
          } 
        />
        <Route 
          path="reset-password" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ResetPasswordPage />
            </Suspense>
          } 
        />
      </Route>
      <Route 
        path="social-popup" 
        element={
          <Suspense fallback={<PageLoader />}>
            <SocialPopupPage />
          </Suspense>
        } 
      />
    </Routes>
  );
}
