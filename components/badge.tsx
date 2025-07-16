import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground shadow-sm",
        className
      )}
    >
      {children}
    </motion.span>
  )
}
