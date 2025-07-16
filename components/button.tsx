import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.03 }}
        ref={ref}
        className={cn(
          // Always visible on dark backgrounds!
          "inline-flex items-center justify-center rounded-xl px-6 py-2 text-base font-semibold shadow-soft transition focus:outline-none",
          "bg-white text-black hover:bg-gray-100 active:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:active:bg-gray-600",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
