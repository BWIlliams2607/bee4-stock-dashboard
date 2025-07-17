// components/Card.tsx
"use client"

export function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "bg-background/70 border border-border rounded-2xl shadow-lg p-6 " +
        className
      }
    >
      {children}
    </div>
  )
}
