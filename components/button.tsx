import React from "react";
import { motion } from "framer-motion";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

// Standard Button component (no motion by default)
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={
        "px-4 py-2 rounded-lg font-semibold transition-all shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/80 " +
        className
      }
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

// Framer Motion-enhanced Button for animated buttons
export const MotionButton = motion(Button);
