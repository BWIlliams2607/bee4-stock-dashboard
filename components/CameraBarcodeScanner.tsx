// components/CameraBarcodeScanner.tsx
"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Camera, X } from "lucide-react"

// Dynamically import the scanner so SSR doesn’t break
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
  const [stopStream, setStopStream] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-background rounded-xl shadow-2xl p-4 max-w-md w-full flex flex-col items-center gap-2">
        <button
          onClick={() => {
            // stop camera before closing
            setStopStream(true)
            setTimeout(onClose, 0)
          }}
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
            // Prefer the rear camera
            facingMode="environment"
            videoConstraints={{ facingMode: { ideal: "environment" } }}
            stopStream={stopStream}
            onError={(cameraError) => {
              console.error("Camera error:", cameraError)
              // Only DOMException has a .name field
              if (
                cameraError instanceof DOMException &&
                cameraError.name === "NotAllowedError"
              ) {
                setError("Camera access was denied")
              } else {
                setError("Unable to access camera")
              }
            }}
            onUpdate={(_, result) => {
              if (result) {
                // Got a barcode!
                setStopStream(true)
                onDetected(result.getText())
              }
            }}
          />
        </div>

        {error && (
          <div className="text-rose-500 text-xs mt-2 text-center">
            {error}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2 text-center">
          Point your camera at a barcode or QR code.
          <br />
          Tap outside or “X” to close.
        </div>
      </div>
    </div>
  )
}
