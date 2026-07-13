import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { HomePage } from "../pages/HomePage";
import { ArticlePage } from "../pages/ArticlePage";
import { SearchPage } from "../pages/SearchPage";
import { CategoryPage } from "../pages/CategoryPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage, VerifyEmailPage } from "../pages/AuthPages";
import { SocialPopupPage } from "../pages/SocialPopupPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="article/:slug" element={<ArticlePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="admin" element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="social-popup" element={<SocialPopupPage />} />
    </Routes>
  );
}
