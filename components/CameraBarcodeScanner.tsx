"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/browser"
import type { Result } from "@zxing/library"
import { Camera, X } from "lucide-react"

interface ScannerProps {
  onDetected: (code: string) => void
  onClose: () => void
}

export function CameraBarcodeScanner({ onDetected, onClose }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const reader = new BrowserMultiFormatReader()

    reader
      .decodeOnceFromVideoDevice(undefined, videoRef.current!)
      .then((result: Result) => {
        onDetected(result.getText())
      })
      .catch(() => {
        setError("Scanning...")
      })

    // decodeOnceFromVideoDevice stops itself; no manual cleanup needed
  }, [onDetected])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1 text-gray-300 hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="mb-2 text-lg font-bold flex items-center gap-2 text-white">
          <Camera size={22} /> Scan Barcode
        </div>

        <video
          ref={videoRef}
          className="w-full aspect-video rounded-lg bg-black"
          muted
          playsInline
          autoPlay
        />

        {error && (
          <p className="mt-2 text-rose-500 text-xs text-center">{error}</p>
        )}

        <p className="mt-2 text-xs text-gray-400 text-center">
          Point at a barcode (GS1‑128, EAN, QR…).<br />
          Tap “X” or outside to close.
        </p>
      </div>
    </div>
  )
}
