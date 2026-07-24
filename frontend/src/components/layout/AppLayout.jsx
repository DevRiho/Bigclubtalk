import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-brand-ink dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
