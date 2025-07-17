"use client"

import { Disclosure } from "@headlessui/react"
import { ChevronsUpDown } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"

interface Dispatch {
  timestamp: string
}

interface DispatchedSummaryProps {
  details: Dispatch[]
}

export function DispatchedSummary({ details }: DispatchedSummaryProps) {
  const sparkData = details
    .slice(-10)
    .map((d) => ({ time: new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), count: 1 }))

  return (
    <Disclosure>
      {({ open }) => (
        <div className="bg-background/80 p-4 rounded-lg shadow-md">
          <Disclosure.Button className="w-full flex justify-between items-center">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Dispatched Today
              </div>
              <div className="text-2xl font-bold">{details.length}</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData}>
                    <Line dataKey="count" stroke="#DB2777" strokeWidth={2} dot={false}/>
                    <XAxis dataKey="time" hide/>
                    <YAxis hide/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <ChevronsUpDown
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
                {new Date(d.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            ))}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
