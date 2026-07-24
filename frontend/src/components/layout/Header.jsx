import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, UserRound, Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "../../constants/brand";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import logo from "../../assets/WhatsApp Image 2026-06-20 at 9.53.17 PM.jpeg";

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.4,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: { 
    x: "100%",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3
    }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, x: 25 },
  visible: { opacity: 1, x: 0 },
};

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
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-brand-ink/40 backdrop-blur-md lg:hidden"
            />
            
            {/* Drawer container */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-[310px] flex-col border-l border-slate-200 bg-white/98 p-6 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/98 lg:hidden"
            >
              {/* BRAND HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                  <img src={logo} alt="BCT Logo" className="h-8 w-8 object-cover rounded-sm" />
                  <span className="font-headline text-lg font-black uppercase tracking-wider text-brand-ink dark:text-slate-100">
                    Big Club <span className="text-brand-red">Talk</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-9 w-9 px-0 rounded-full hover:rotate-90 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all duration-300"
                  aria-label="Close mobile menu"
                >
                  <X size={18} />
                </Button>
              </div>

              {/* SEARCH BOX */}
              <form onSubmit={handleSearchSubmit} className="mt-5 relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search sports stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-sm border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs font-medium outline-none focus:border-brand-red dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-red transition-all duration-200"
                />
              </form>

              {/* NAVIGATION LIST */}
              <nav className="mt-6 flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => (
                  <motion.div key={item.href} variants={navItemVariants}>
                    <NavLink
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `flex items-center justify-between text-sm font-extrabold uppercase py-2 px-3 border-l-4 rounded-r-sm transition-all duration-200 ${
                        isActive 
                          ? "border-brand-red text-brand-red bg-red-50/30 dark:bg-red-955/10" 
                          : "border-transparent text-slate-700 hover:text-brand-red hover:bg-slate-50 dark:text-slate-350 dark:hover:text-brand-red dark:hover:bg-slate-900/40"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">➜</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* THEME TOGGLER CARD */}
              <motion.div 
                variants={navItemVariants}
                className="mt-6 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-3 border border-slate-105 dark:border-slate-850 rounded-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Interface Style
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-sm text-[10px] font-black uppercase tracking-wider text-brand-ink dark:text-slate-200 hover:bg-slate-55 dark:hover:bg-slate-800 shadow-sm transition"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun size={13} className="text-brand-gold fill-current" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon size={13} className="text-slate-500" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              </motion.div>

              {/* USER PANEL */}
              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-900">
                {loading ? (
                  <div className="h-10 w-full bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded-sm" />
                ) : isAuthenticated ? (
                  <motion.div variants={navItemVariants} className="space-y-4">
                    <div className="flex items-center gap-3.5 bg-slate-50 dark:bg-slate-900/30 p-3 border border-slate-105 dark:border-slate-850 rounded-sm">
                      <div className="h-9 w-9 rounded-full bg-brand-red text-white font-bold flex items-center justify-center border border-white dark:border-slate-800 shadow-sm text-sm uppercase">
                        {user?.name ? user.name[0] : <UserRound size={16} />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-extrabold truncate text-brand-ink dark:text-slate-200 leading-tight">{user?.name}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{user?.role}</p>
                      </div>
                    </div>
                    <Button 
                      asChild 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full h-11 text-center font-headline text-xs font-bold uppercase tracking-wider"
                    >
                      <Link to={user?.role === "admin" ? "/admin" : "/dashboard"}>
                        Go to Dashboard
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div variants={navItemVariants}>
                    <Button 
                      asChild 
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full h-11 text-center font-headline text-xs font-bold uppercase tracking-wider"
                    >
                      <Link to="/login">Sign in</Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
