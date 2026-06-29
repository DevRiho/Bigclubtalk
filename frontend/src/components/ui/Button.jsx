import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-brand-red text-white hover:bg-red-700",
  secondary: "bg-brand-ink text-white hover:bg-slate-800",
  outline: "border border-slate-300 bg-white text-brand-ink hover:border-brand-ink",
  ghost: "text-brand-ink hover:bg-slate-100"
};

export function Button({ className, variant = "primary", asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-extrabold uppercase tracking-normal transition focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
