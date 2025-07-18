// components/CameraBarcodeScanner.tsx
import dynamic from "next/dynamic"
import { useState } from "react"
import { Camera, X } from "lucide-react"

// Dynamically import so SSR doesn’t break
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
        {/* Close button */}
        <button
          onClick={() => {
            // Stop camera before closing to avoid iOS freezes
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

        {/* Scanner viewport */}
        <div className="w-full max-w-xs rounded-lg overflow-hidden">
          <BarcodeScannerComponent
            width={320}
            height={240}
            delay={300}
            // Force rear camera
            facingMode="environment"
            // Under the hood react-webcam uses videoConstraints if provided
            videoConstraints={{ facingMode: { ideal: "environment" } }}
            // Once we get a good scan, stop the camera
            stopStream={stopStream}
            // Camera‐level errors (permissions, device not found, etc.)
            onError={(cameraError) => {
              console.error("Camera error:", cameraError)
              if (cameraError.name === "NotAllowedError") {
                setError("Camera access was denied")
              } else {
                setError("Unable to access camera")
              }
            }}
            // ZXing‐level scan callback
            onUpdate={(_, result) => {
              if (result) {
                // Found a barcode!
                setStopStream(true)       // kill the camera
                onDetected(result.getText())
              }
            }}
          />
        </div>

        {/* Show any camera‐permission or other errors */}
        {error && (
          <div className="text-rose-500 text-xs mt-2 text-center">{error}</div>
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
