import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#100AED] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#100AED] text-white shadow-sm hover:bg-[#0E08C9] active:bg-[#0C08B2] disabled:bg-[#C6C6C6] disabled:text-white",
        destructive:
          "bg-[#FF0021] text-white shadow-sm hover:bg-[#CC001A] active:bg-[#990014] disabled:bg-[#C6C6C6] disabled:text-white",
        outline:
          "border border-[#100AED] bg-white text-[#100AED] shadow-sm hover:bg-[#F2F4F8] hover:border-[#100AED] active:bg-[#C3C2FB] active:border-[#100AED] disabled:border-[#EAEAEA] disabled:text-[#A9A9A9] disabled:bg-white",
        "outline-neutral":
          "border border-[#EAEAEA] bg-white text-[#282828] shadow-sm hover:bg-white hover:border-[#100AED] hover:text-[#100AED] active:bg-white active:border-[#100AED] active:text-[#100AED] disabled:border-transparent disabled:text-[#A9A9A9] disabled:bg-white",
        "outline-danger":
          "border border-[#FF0021] bg-white text-[#FF0021] shadow-sm hover:bg-[#FFE6E9] hover:border-[#FF0021] active:bg-[#FF99A6] active:border-[#FF0021] disabled:border-transparent disabled:text-[#A9A9A9] disabled:bg-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "text-[#100AED] hover:bg-[#F2F4F8] active:bg-[#C3C2FB] disabled:text-[#A9A9A9]",
        "ghost-neutral":
          "text-[#282828] hover:bg-[#EAEAEA] active:bg-[#C6C6C6] disabled:text-[#A9A9A9]",
        "ghost-danger":
          "text-[#FF0021] hover:bg-[#FFE6E9] active:bg-[#FF99A6] disabled:text-[#A9A9A9]",
        link: "text-[#100AED] underline-offset-4 hover:underline hover:text-[#0E08C9] active:text-[#0C08B2] disabled:text-[#A9A9A9]",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded px-3 text-sm",
        lg: "h-12 rounded px-6 text-sm",
        xs: "h-6 rounded px-2 text-xs",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
