/**
 * Avatar Component
 * TeddyBear's Room Design System
 */

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "default" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      xs: "h-6 w-6",
      sm: "h-8 w-8",
      default: "h-10 w-10",
      lg: "h-14 w-14",
      xl: "h-20 w-20",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onLoadingStatusChange?: (status: "loading" | "loaded" | "error") => void;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onLoadingStatusChange, ...props }, ref) => {
    const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
      "loading"
    );

    React.useEffect(() => {
      onLoadingStatusChange?.(status);
    }, [status, onLoadingStatusChange]);

    if (status === "error") {
      return null;
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  delayMs?: number;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, delayMs = 0, children, ...props }, ref) => {
    const [show, setShow] = React.useState(delayMs === 0);

    React.useEffect(() => {
      if (delayMs > 0) {
        const timer = setTimeout(() => setShow(true), delayMs);
        return () => clearTimeout(timer);
      }
    }, [delayMs]);

    if (!show) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

// Avatar with initials helper
interface InitialsAvatarProps extends AvatarProps {
  name: string;
  imageUrl?: string | null;
}

function InitialsAvatar({
  name,
  imageUrl,
  size = "default",
  className,
  ...props
}: InitialsAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fontSize = {
    xs: "text-[10px]",
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
    xl: "text-xl",
  };

  return (
    <Avatar size={size} className={className} {...props}>
      {imageUrl && <AvatarImage src={imageUrl} alt={name} />}
      <AvatarFallback className={fontSize[size]}>{initials}</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, InitialsAvatar };
