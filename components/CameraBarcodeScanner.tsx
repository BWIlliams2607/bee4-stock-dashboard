// components/CameraBarcodeScanner.tsx
"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Camera, X } from "lucide-react"

// dynamically import so it only runs on the client
const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
)

interface ScannerProps {
  onDetected: (code: string) => void
  onClose: () => void
}

export function CameraBarcodeScanner({ onDetected, onClose }: ScannerProps) {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-800 rounded-xl p-4 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-white">
          <Camera size={22} /> Scan Barcode
        </div>

        <div className="w-full overflow-hidden rounded-lg">
          <BarcodeScanner
            width={320}
            height={240}
            delay={300}
            onError={(err: any) => setError(err?.message || "Camera error")}
            onUpdate={(err: any, result: any) => {
              if (err) {
                setError("No code detected")
              } else if (result) {
                onDetected(result.getText())
              }
            }}
          />
        </div>

        {error && (
          <p className="mt-2 text-rose-500 text-xs text-center">{error}</p>
        )}

        <p className="mt-2 text-xs text-gray-400 text-center">
          Point your camera at a barcode or QR code.<br />
          Tap outside or “X” to close.
        </p>
      </div>
    </div>
  )
}
