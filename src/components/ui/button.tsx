import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer shrink-0 leading-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white border border-amber-600/30 shadow-xs hover:bg-amber-600 active:scale-[0.98]",
        secondary:
          "border border-border bg-card text-foreground shadow-2xs hover:bg-muted/70 hover:text-foreground active:scale-[0.98]",
        outline:
          "border border-border bg-background text-foreground shadow-2xs hover:bg-muted/60 hover:text-foreground active:scale-[0.98]",
        ghost:
          "text-muted-foreground hover:bg-muted/70 hover:text-foreground active:scale-[0.98]",
        destructive:
          "bg-rose-600 text-white border border-rose-700/30 shadow-xs hover:bg-rose-700 active:scale-[0.98]",
        success:
          "bg-emerald-600 text-white border border-emerald-700/30 shadow-xs hover:bg-emerald-700 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        default: "h-9.5 px-4 py-2 text-xs sm:text-sm gap-2 [&_svg]:size-4",
        sm: "h-8.5 px-3 text-xs gap-1.5 rounded-md [&_svg]:size-3.5",
        xs: "h-7.5 px-2.5 text-xs gap-1.5 rounded-md [&_svg]:size-3.5",
        lg: "h-10.5 px-5 text-sm sm:text-base gap-2 rounded-lg [&_svg]:size-4",
        icon: "h-9.5 w-9.5 p-0 rounded-lg [&_svg]:size-4",
        "icon-sm": "h-8.5 w-8.5 p-0 rounded-md [&_svg]:size-3.5",
        "icon-xs": "h-7.5 w-7.5 p-0 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

