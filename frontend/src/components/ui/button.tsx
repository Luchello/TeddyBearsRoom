import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_4px_15px_rgba(255,182,193,0.4)] hover:shadow-[0_6px_20px_rgba(255,182,193,0.5)] dark:shadow-[0_0_15px_rgba(255,105,180,0.4)] dark:hover:shadow-[0_0_25px_rgba(255,105,180,0.6)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-[0_4px_15px_rgba(255,107,107,0.3)]",
        outline:
          "border-2 border-primary/30 bg-background hover:bg-primary/10 hover:border-primary hover:text-primary dark:bg-input/30 dark:border-primary/50 dark:hover:bg-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-[0_4px_15px_rgba(245,208,224,0.4)]",
        ghost:
          "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline",
        cute: "bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground shadow-[0_4px_20px_rgba(255,182,193,0.5)] hover:shadow-[0_8px_30px_rgba(197,163,255,0.5)] hover:-translate-y-0.5",
        jirai: "bg-gradient-to-r from-jirai-pink via-jirai-lavender to-jirai-pink text-white shadow-[0_4px_20px_rgba(255,182,193,0.5)] hover:shadow-[0_8px_30px_rgba(197,163,255,0.6)] hover:-translate-y-1 dark:from-jirai-hot-pink dark:via-jirai-purple dark:to-jirai-hot-pink dark:shadow-[0_0_20px_rgba(255,105,180,0.4)] dark:hover:shadow-[0_0_35px_rgba(255,105,180,0.7)]",
      },
      size: {
        default: "h-10 px-5 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-xl gap-1.5 px-4 has-[>svg]:px-3",
        lg: "h-12 rounded-2xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-12 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
