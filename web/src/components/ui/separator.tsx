/**
 * Separator Component
 * TeddyBear's Room Design System
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

// Text Separator (with label in middle)
interface TextSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const TextSeparator = React.forwardRef<HTMLDivElement, TextSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 w-full", className)}
      {...props}
    >
      <div className="flex-1 h-[1px] bg-border" />
      {children && (
        <span className="text-xs text-muted-foreground">{children}</span>
      )}
      <div className="flex-1 h-[1px] bg-border" />
    </div>
  )
);
TextSeparator.displayName = "TextSeparator";

export { Separator, TextSeparator };
