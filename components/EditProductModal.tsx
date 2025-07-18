"use client"

import { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"

interface Product {
  id: number
  barcode: string
  name: string
  description?: string
  categoryIds: number[]
}

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSave: (updated: Product) => void
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  onSave,
}: EditProductModalProps) {
  const [form, setForm] = useState<Product | null>(product)

  // Re‑initialize form whenever the `product` prop changes
  useEffect(() => {
    setForm(product)
  }, [product])

  // If there's no form (i.e. no product selected), render nothing
  if (!form) return null

  async function handleSave() {
    // Guard against null once more for TS
    if (!form) return

    // Bubble up the fully‑populated Product
    onSave(form)

    // Close the modal
    onClose()
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-40"
            leave="ease-in duration-150"
            leaveFrom="opacity-40"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-muted/80 p-6 text-left align-middle shadow-xl transition-all">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-foreground hover:text-rose-400"
              >
                <X size={20} />
              </button>
              <Dialog.Title className="text-lg font-medium">
                Edit Product
              </Dialog.Title>

              <div className="mt-4 space-y-4">
                <label className="block text-sm">
                  Barcode
                  <input
                    type="text"
                    value={form.barcode}
                    onChange={(e) =>
                      setForm({ ...form, barcode: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg bg-input px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  Name
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg bg-input px-3 py-2 text-sm"
                  />
                </label>

                <label className="block text-sm">
                  Description
                  <input
                    type="text"
                    value={form.description || ""}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg bg-input px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
