"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { MotionButton } from "./button";
import type { PrinterState, Printer } from "@prisma/client";

export interface PrinterFormData {
  name: string;
  model: string;
  location: string;
  status: PrinterState;
  lastSeen: string; // ISO datetime-local string
}

export default function PrinterFormModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PrinterFormData) => void;
  initial?: Printer;
}) {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<PrinterState>("online");
  const [lastSeen, setLastSeen] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setModel(initial.model);
      setLocation(initial.location);
      setStatus(initial.status);
      setLastSeen(new Date(initial.lastSeen).toISOString().slice(0, 16));
    }
  }, [initial]);

  const handleSave = () => {
    onSave({ name, model, location, status, lastSeen });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-semibold text-white mb-4">
          {initial ? "Edit Printer" : "Add Printer"}
        </Dialog.Title>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-white text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            />
          </div>

          {/* Model */}
          <div>
            <label className="block text-white text-sm mb-1">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-white text-sm mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            />
          </div>

          {/* Last Seen */}
          <div>
            <label className="block text-white text-sm mb-1">Last Seen</label>
            <input
              type="datetime-local"
              value={lastSeen}
              onChange={(e) => setLastSeen(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-white text-sm mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PrinterState)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            Cancel
          </button>
          <MotionButton
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white"
          >
            Save
          </MotionButton>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
