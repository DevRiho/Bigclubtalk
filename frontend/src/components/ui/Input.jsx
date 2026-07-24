import React from "react";
import { cn } from "../../utils/cn";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-red-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-red dark:focus:ring-brand-red/20",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

