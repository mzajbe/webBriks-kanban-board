import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-800 text-white shadow hover:bg-emerald-900",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-slate-200 bg-white shadow-xs hover:bg-slate-100/80 hover:text-slate-900 text-slate-700",
        secondary:
          "bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
        link: "text-primary underline-offset-4 hover:underline",
        emerald: "bg-emerald-900 text-white shadow hover:bg-emerald-950",
        pill: "border border-slate-200 bg-white rounded-full text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-2xs font-normal",
        darkPill: "bg-emerald-900 text-white rounded-full hover:bg-emerald-950 shadow-sm font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        pillSm: "h-8 rounded-full px-3 text-xs",
        pillMd: "h-9 rounded-full px-3.5 text-xs",
        icon: "h-8 w-8 rounded-full p-0 flex items-center justify-center",
        iconSm: "h-7 w-7 rounded-md p-0 flex items-center justify-center",
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
