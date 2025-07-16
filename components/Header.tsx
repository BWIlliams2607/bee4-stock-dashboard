"use client"

import { motion } from "framer-motion"

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-border bg-muted/50 backdrop-blur-md px-6 py-4 shadow-soft"
    >
      <h1 className="text-xl font-semibold tracking-tight">Bee4 Stock Dashboard</h1>
    </motion.header>
  );
}
