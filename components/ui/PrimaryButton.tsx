// components/ui/PrimaryButton.tsx
import React from "react";
import { motion } from "framer-motion";

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-12 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
    />
  );
}
