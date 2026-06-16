import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",

        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",

        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost:
          "hover:bg-accent hover:text-accent-foreground",

        link:
          "text-primary underline-offset-4 hover:underline",

        /* ✅ NEW — Nextflow style */
        corner:
          "h-11 border border-black bg-white px-6 text-black hover:bg-black/5",
        
        cornerPrimary:
          "h-11 border border-black bg-black px-6 text-white hover:bg-neutral-800",
      },

      size: {
        default: "",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8",
        icon: "h-9 w-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const isCorner =
      variant === "corner" || variant === "cornerPrimary"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}

        {/* ✅ Corner Brackets */}
        {isCorner && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t !border-black/50" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t !border-black/50" />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l !border-black/50" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r !border-black/50" />
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }