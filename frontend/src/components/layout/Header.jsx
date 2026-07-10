import { Link, NavLink } from "react-router-dom";
import { Search, UserRound } from "lucide-react";
import { NAV_ITEMS } from "../../constants/brand";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/WhatsApp Image 2026-06-20 at 9.53.17 PM.jpeg";

export function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="editorial-rule h-1" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Big Club Talk Logo" className="h-11 w-11 object-cover rounded-sm" />
          <span>
            <span className="block font-headline text-2xl font-black uppercase leading-none text-brand-ink">Big Club</span>
            <span className="block font-headline text-xl font-black uppercase leading-none text-brand-red">Talk</span>
          </span>
        </Link>


        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} to={item.href} className="text-xs font-black uppercase text-slate-700 hover:text-brand-red">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="h-10 w-10 px-0" aria-label="Search">
            <Link to="/search">
              <Search size={18} />
            </Link>
          </Button>
          {isAuthenticated ? (
            <Button asChild variant="secondary">
              <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                <UserRound size={16} />
                Account
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
