import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white text-brand-ink">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
