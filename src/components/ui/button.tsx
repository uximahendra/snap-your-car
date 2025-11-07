import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[var(--elevation-2)] hover:bg-primary/90 hover:shadow-[var(--elevation-3)] active:shadow-[var(--elevation-1)]",
        destructive: "bg-destructive text-destructive-foreground shadow-[var(--elevation-2)] hover:bg-destructive/90 hover:shadow-[var(--elevation-3)]",
        outline: "border-2 border-border text-foreground bg-transparent hover:bg-accent hover:border-primary/30 hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-[var(--elevation-1)] hover:bg-secondary/80 hover:shadow-[var(--elevation-2)]",
        ghost: "hover:bg-accent/80 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground shadow-[var(--elevation-2)] hover:bg-success/90 hover:shadow-[var(--elevation-3)]",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm [&_svg]:size-4",
        sm: "h-9 px-4 py-2 text-xs [&_svg]:size-3.5",
        lg: "h-14 px-8 py-3.5 text-base [&_svg]:size-5",
        icon: "h-11 w-11 [&_svg]:size-5",
        fab: "h-14 w-14 rounded-full shadow-[var(--elevation-4)] hover:shadow-[var(--elevation-5)] [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
