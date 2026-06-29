import { Link } from "react-router-dom";
import { NAV_ITEMS } from "../../constants/brand";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_2fr]">
        <div>
          <p className="font-headline text-4xl font-black uppercase text-brand-ink">Big Club Talk</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
            Football news, transfers, match analysis, club stories, player features, and fan opinion with a sharp editorial voice.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase text-brand-red">Coverage</p>
            <div className="mt-4 grid gap-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} to={item.href} className="text-sm font-semibold text-slate-700 hover:text-brand-red">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-brand-red">Company</p>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              <Link to="/authors">Writers</Link>
              <Link to="/newsletter">Newsletter</Link>
              <Link to="/login">Author Login</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase text-brand-red">Platform</p>
            <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">
              <span>Vercel Frontend</span>
              <span>Render API</span>
              <span>MongoDB Atlas</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
