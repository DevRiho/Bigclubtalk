import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, UserRound, Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "../../constants/brand";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/WhatsApp Image 2026-06-20 at 9.53.17 PM.jpeg";

export function Header() {
  const { isAuthenticated, user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const searchInputRef = useRef(null);

  // Hook into scroll to adjust navbar height & drop shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Autofocus search input when toggled open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 border-b bg-white/95 backdrop-blur dark:bg-slate-950/95 ${
      scrolled 
        ? "py-2 shadow-md border-slate-200 dark:border-slate-800" 
        : "py-4 border-slate-100 dark:border-slate-900"
    }`}>
      <div className="editorial-rule h-1 w-full" />
      
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
        {/* LOGO SECTION */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="overflow-hidden rounded-sm transition-transform duration-300 group-hover:scale-105">
            <img src={logo} alt="Big Club Talk Logo" className="h-10 w-10 object-cover" />
          </div>
          <span>
            <span className="block font-headline text-xl md:text-2xl font-black uppercase leading-none text-brand-ink dark:text-slate-100 transition-colors duration-200">
              Big Club
            </span>
            <span className="block font-headline text-lg md:text-xl font-black uppercase leading-none text-brand-red">
              Talk
            </span>
          </span>
        </Link>

        {/* DESKTOP NAV ITEMS */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.href} 
              to={item.href} 
              className={({ isActive }) => `text-xs font-black uppercase tracking-wider transition-colors relative py-1.5 ${
                isActive 
                  ? "text-brand-red dark:text-brand-red font-black" 
                  : "text-slate-700 hover:text-brand-red dark:text-slate-300 dark:hover:text-brand-red"
              }`}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ACTIONS PANEL */}
        <div className="flex items-center gap-2">
          {/* SEARCH BAR WIDGET */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onSubmit={handleSearchSubmit}
                  className="mr-2"
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setSearchOpen(false);
                    }}
                    placeholder="Search stories..."
                    className="h-9 w-full rounded-sm border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-brand-red focus:ring-1 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-red"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <Button 
              variant="ghost" 
              className="h-10 w-10 px-0 rounded-full" 
              onClick={() => {
                if (searchOpen && searchQuery) {
                  // submit search
                  const mockEvent = { preventDefault: () => {} };
                  handleSearchSubmit(mockEvent);
                } else {
                  setSearchOpen(!searchOpen);
                }
              }}
              aria-label="Search stories"
            >
              <Search size={18} />
            </Button>
          </div>

          {/* DARK MODE SWITCHER */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="h-10 w-10 px-0 rounded-full"
            aria-label="Toggle theme mode"
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun size={18} className="text-brand-gold" /> : <Moon size={18} />}
            </motion.div>
          </Button>

          {/* USER ACCOUNT BTN */}
          <div className="hidden sm:block">
            {loading ? (
              <div className="h-10 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-sm" />
            ) : isAuthenticated ? (
              <Button asChild variant="secondary" className="h-10 px-4">
                <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                  <UserRound size={14} />
                  <span>Account</span>
                </Link>
              </Button>
            ) : (
              <Button asChild className="h-10 px-5">
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>

          {/* MOBILE MENU TOGGLER */}
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(true)}
            className="h-10 w-10 px-0 rounded-full lg:hidden"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-brand-ink backdrop-blur-sm lg:hidden"
            />
            
            {/* Drawer container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-[290px] flex-col border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950 lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
                <span className="font-headline text-lg font-black uppercase text-brand-ink dark:text-slate-100">
                  Navigation
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-9 w-9 px-0 rounded-full"
                  aria-label="Close mobile menu"
                >
                  <X size={18} />
                </Button>
              </div>

              {/* Mobile search */}
              <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 flex-1 rounded-sm border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-brand-red dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
                <Button type="submit" className="h-9 px-3">
                  <Search size={14} />
                </Button>
              </form>

              {/* Navigation list */}
              <nav className="mt-6 flex flex-col gap-4">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `text-sm font-extrabold uppercase py-2 border-b border-slate-100/50 dark:border-slate-900/50 transition-colors ${
                      isActive 
                        ? "text-brand-red dark:text-brand-red" 
                        : "text-slate-700 hover:text-brand-red dark:text-slate-300 dark:hover:text-brand-red"
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {/* Bottom user action info */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-900">
                {loading ? (
                  <div className="h-10 w-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-sm" />
                ) : isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-2 px-1">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200">
                        <UserRound size={16} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold truncate dark:text-slate-100">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      variant="secondary" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full h-10 text-center"
                    >
                      <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                        Go to Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    asChild 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full h-10 text-center"
                  >
                    <Link to="/login">Sign in</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
