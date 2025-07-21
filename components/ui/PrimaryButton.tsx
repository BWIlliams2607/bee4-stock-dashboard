// components/ui/PrimaryButton.tsx
import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef } from "react";

export function PrimaryButton(
  props: ComponentPropsWithoutRef<typeof motion.button>
) {
  return (
    <motion.button
      {...props}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`h-12 px-6 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 ${props.className ?? ""}`}
    />
  );
}
