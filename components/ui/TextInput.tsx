// components/ui/TextInput.tsx
import React from "react";

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className="h-12 rounded-lg border border-gray-700 px-4 bg-gray-700 text-sm placeholder-gray-400 text-white focus:ring-2 focus:ring-green-500 w-full"
    />
  );
});

TextInput.displayName = "TextInput";
