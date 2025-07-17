// components/IncomingSummary.tsx
"use client"

import { Disclosure } from "@headlessui/react"
import { ChevronUpIcon } from "@heroicons/react/20/solid"
import { Sparklines, SparklinesLine } from "recharts"

interface Incoming {
  timestamp: string
  qty: number
}

interface IncomingSummaryProps {
  details: Incoming[]
}

export function IncomingSummary({ details }: IncomingSummaryProps) {
  // Keep only last 10 points for sparkline
  const sparkData = details.slice(-10).map((d) => ({ qty: d.qty }))

  return (
    <Disclosure>
      {({ open }) => (
        <div className="bg-background/80 p-4 rounded-lg shadow-md">
          <Disclosure.Button className="w-full flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Incoming Shipments
              </div>
              <div className="text-2xl font-bold">{details.length}</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-24 h-8">
                <Sparklines data={sparkData}>
                  <SparklinesLine style={{ strokeWidth: 2, stroke: "#4F46E5" }} />
                </Sparklines>
              </div>
              <ChevronUpIcon
                className={`w-5 h-5 text-muted-foreground transform transition ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </Disclosure.Button>

          <Disclosure.Panel className="mt-4 space-y-2 text-sm">
            {details.map((d, i) => (
              <div
                key={i}
                className="flex justify-between px-2 py-1 hover:bg-muted/50 rounded"
              >
                <span>
                  {new Date(d.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>×{d.qty}</span>
              </div>
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
