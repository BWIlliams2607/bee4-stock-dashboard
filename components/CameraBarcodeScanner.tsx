// components/CameraBarcodeScanner.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader, Result } from "@zxing/browser"
import { Camera, X } from "lucide-react"

interface ScannerProps {
  onDetected: (code: string) => void
  onClose: () => void
}

export function CameraBarcodeScanner({ onDetected, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader()
    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
      },
    }

    codeReader
      .decodeFromConstraints(constraints, videoRef.current!)
      .then((result: Result) => {
        onDetected(result.getText())
        codeReader.reset()
      })
      .catch((err: any) => {
        console.error("ZXing error:", err)
        setError("No barcode detected yet…")
        // keep trying, so we don't stop the reader
      })

    return () => {
      codeReader.reset()
    }
  }, [onDetected])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-background rounded-xl shadow-2xl p-4 max-w-md w-full flex flex-col items-center gap-2">
        {/* Close */}
        <button
          onClick={() => {
            onClose()
          }}
          className="absolute right-3 top-3 p-1 text-muted-foreground hover:text-foreground"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <div className="mb-2 text-lg font-bold flex items-center gap-2">
          <Camera size={22} /> Scan Barcode
        </div>

        {/* Video feed */}
        <div className="w-full max-w-xs overflow-hidden rounded-lg bg-black">
          <video
            ref={videoRef}
            className="w-full h-auto"
            muted
            playsInline
            autoPlay
          />
        </div>

        {/* Status / error */}
        {error && (
          <div className="mt-2 text-rose-500 text-xs text-center">
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground mt-2 text-center">
          Point your camera at a barcode (GS1‑128, EAN, QR, etc.).
          <br />
          Tap outside or “X” to close.
        </div>
      </div>
    </div>
  )
}
