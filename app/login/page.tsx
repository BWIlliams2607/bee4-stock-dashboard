"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/button"

export default function LoginPage() {
  return (
    <motion.div
      className="flex items-center justify-center h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-card p-8 rounded-2xl shadow-soft max-w-sm w-full space-y-4">
        <h2 className="text-xl font-bold mb-2">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-xl bg-input text-foreground border border-border"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-xl bg-input text-foreground border border-border"
        />
        <Button className="w-full mt-2">Login</Button>
      </div>
    </motion.div>
  )
}
