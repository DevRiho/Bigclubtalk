import { Link } from "react-router-dom";
import { Twitter, Instagram, Youtube, ArrowUp } from "lucide-react";
import { NAV_ITEMS } from "../../constants/brand";
import logo from "../../assets/WhatsApp Image 2026-06-20 at 9.53.17 PM.jpeg";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-900 dark:bg-slate-950/80 dark:text-slate-400 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div className="flex flex-col items-start gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Big Club Talk Logo" className="h-9 w-9 object-cover rounded-sm" />
              <span>
                <span className="block font-headline text-xl font-black uppercase leading-none text-brand-ink dark:text-slate-100">
                  Big Club
                </span>
                <span className="block font-headline text-lg font-black uppercase leading-none text-brand-red">
                  Talk
                </span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Uncompromising football journalism. Inside stories, tactical breakdowns, transfer insights, and fan-driven narratives.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="rounded-full bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 transition hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white" 
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="rounded-full bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 transition hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white" 
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="rounded-full bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-400 shadow-sm border border-slate-100 dark:border-slate-800 transition hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white" 
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-850 pb-2 mb-4">
                Coverage
              </p>
              <div className="grid gap-3">
                {NAV_ITEMS.map((item) => (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-brand-red transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-200 border-b border-slate-200 dark:border-slate-850 pb-2 mb-4">
                Company
              </p>
              <div className="grid gap-3">
                <Link to="/authors" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-brand-red transition-colors">
                  Writers & Staff
                </Link>
                <Link to="/newsletter" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-brand-red transition-colors">
                  Newsletter
                </Link>
                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-brand-red dark:text-slate-400 dark:hover:text-brand-red transition-colors">
                  Author Console
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 dark:border-slate-900 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Big Club Talk. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-900 dark:hover:text-slate-100">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900 dark:hover:text-slate-100">Terms of Service</Link>
            <button 
              onClick={scrollToTop} 
              className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-brand-red dark:text-slate-400 dark:hover:text-brand-red transition-colors" 
              aria-label="Back to top"
            >
              Back to top <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
