import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-brand-red text-white hover:bg-red-600 dark:bg-brand-red dark:hover:bg-red-700",
  secondary: "bg-brand-ink text-white hover:bg-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  outline: "border border-slate-200 bg-white text-brand-ink hover:border-brand-ink dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700",
  ghost: "text-brand-ink hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60"
};

export function Button({ className, variant = "primary", asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-xs font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-red disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
