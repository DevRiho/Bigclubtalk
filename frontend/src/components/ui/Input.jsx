import React from "react";
import { cn } from "../../utils/cn";

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-red-100",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

