import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[12px] font-black transition-all duration-500 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-[0.2em] cursor-pointer overflow-hidden relative group",
          {
            "bg-gradient-gold text-text-on-gold shadow-btn hover:translate-y-[-3px] hover:shadow-gold active:translate-y-0 active:scale-[0.98]":
              variant === "gold",
            "border border-gold-border/40 bg-transparent text-gold hover:bg-gold-subtle/20 hover:border-gold hover:translate-y-[-2px] hover:shadow-gold/10 active:translate-y-0":
              variant === "outline",
            "border border-gold-border/10 bg-transparent text-text-primary hover:border-gold-border/30 hover:text-gold hover:bg-white/5 active:scale-[0.98]":
              variant === "ghost",
          },
          {
            "px-10 py-4": size === "default",
            "px-7 py-3 text-[10px]": size === "sm",
            "px-14 py-6 text-[14px]": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2 group-hover:scale-105 transition-transform duration-500">{props.children}</span>
        
        {/* Luxury Shine Effect */}
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
        </div>

        {/* Backdrop for outline/ghost */}
        {variant !== "gold" && (
          <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
