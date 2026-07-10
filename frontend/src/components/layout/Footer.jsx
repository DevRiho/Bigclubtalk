import { Link } from "react-router-dom";
import { Twitter, Instagram, Youtube, ArrowUp } from "lucide-react";
import { NAV_ITEMS } from "../../constants/brand";
import logo from "../../assets/WhatsApp Image 2026-06-20 at 9.53.17 PM.jpeg";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          <div className="flex flex-col items-start gap-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Big Club Talk Logo" className="h-10 w-10 object-cover rounded-sm" />
              <span>
                <span className="block font-headline text-2xl font-black uppercase leading-none text-brand-ink">Big Club</span>
                <span className="block font-headline text-xl font-black uppercase leading-none text-brand-red">Talk</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Uncompromising football journalism. Inside stories, tactical breakdowns, transfer insights, and fan-driven narratives.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-brand-red hover:text-white" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-brand-red hover:text-white" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-brand-red hover:text-white" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">Coverage</p>
              <div className="grid gap-3">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} to={item.href} className="text-sm font-medium text-slate-600 transition hover:text-brand-red">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">Company</p>
              <div className="grid gap-3">
                <Link to="/authors" className="text-sm font-medium text-slate-600 transition hover:text-brand-red">Writers & Staff</Link>
                <Link to="/newsletter" className="text-sm font-medium text-slate-600 transition hover:text-brand-red">Newsletter</Link>
                <Link to="/login" className="text-sm font-medium text-slate-600 transition hover:text-brand-red">Author Console</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Big Club Talk. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms of Service</Link>
            <button onClick={scrollToTop} className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-brand-red transition" aria-label="Back to top">
              Back to top <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

