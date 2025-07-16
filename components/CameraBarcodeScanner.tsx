"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Camera, X } from "lucide-react"

const BarcodeScannerComponent = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
)

export function CameraBarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void
  onClose: () => void
}) {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-background rounded-xl shadow-2xl p-4 max-w-md w-full flex flex-col items-center gap-2">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={22} />
        </button>
        <div className="mb-2 text-lg font-bold flex items-center gap-2">
          <Camera size={22} /> Scan Barcode
        </div>
        <div className="w-full max-w-xs rounded-lg overflow-hidden">
          <BarcodeScannerComponent
            width={320}
            height={240}
            delay={300}
            onUpdate={(err, result) => {
              if (err) setError("No barcode detected")
              if (result) onDetected(result.text)
            }}
          />
        </div>
        {error && (
          <div className="text-rose-500 text-xs mt-2">{error}</div>
        )}
        <div className="text-xs text-muted-foreground mt-2">
          Point your camera at a barcode or QR code.<br />
          Tap outside or X to close.
        </div>
      </div>
    </div>
  )
}
