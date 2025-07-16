"use client"

import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Check, ChevronDown } from "lucide-react"

const productOptions = ["Vinyl Roll", "Label Sheet", "PVC Board"]

export function ProductDropdown({
  value,
  onChange,
  label = "Product"
}: {
  value: string,
  onChange: (val: string) => void,
  label?: string
}) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="w-full rounded-xl bg-input border border-border px-4 py-2 text-left text-foreground focus:outline-none focus:ring-2 focus:ring-accent flex justify-between items-center">
            <span>{value || "Select a product"}</span>
            <ChevronDown size={16} />
          </Listbox.Button>
          <Transition as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-40 mt-2 w-full rounded-xl bg-background border border-border shadow-xl">
              {productOptions.map((option) => (
                <Listbox.Option
                  key={option}
                  value={option}
                  className={({ active, selected }) =>
                    `cursor-pointer select-none px-4 py-2 rounded transition-colors ${
                      active ? "bg-muted text-accent-foreground" : "text-foreground"
                    } ${selected ? "font-semibold" : ""}`
                  }
                >
                  {({ selected }) => (
                    <span className="flex items-center">
                      {selected && <Check size={16} className="mr-2 text-accent-foreground" />}
                      {option}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}
