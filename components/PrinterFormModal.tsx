"use client";
import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { MotionButton } from "./button";
import type { PrinterState } from "@prisma/client";

export default function PrinterFormModal({
  isOpen, onClose, onSave, initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initial?: any;
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
      setLastSeen(new Date(initial.lastSeen).toISOString().slice(0,16));
    }
  }, [initial]);

  const handleSave = () =>
    onSave({ name, model, location, status, lastSeen });

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <Dialog.Title className="text-xl font-semibold text-white mb-4">
          {initial ? "Edit Printer" : "Add Printer"}
        </Dialog.Title>

        <div className="space-y-4">
          {[
            { label: "Name", state: name, setter: setName, type: "text" },
            { label: "Model", state: model, setter: setModel, type: "text" },
            { label: "Location", state: location, setter: setLocation, type: "text" },
            { label: "Last Seen", state: lastSeen, setter: setLastSeen, type: "datetime-local" },
          ].map(({ label, state, setter, type }) => (
            <div key={label}>
              <label className="block text-white text-sm mb-1">{label}</label>
              <input
                type={type}
                value={state}
                onChange={(e) => setter(e.target.value)}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
              />
            </div>
          ))}

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
          <button onClick={onClose} className="text-gray-300 hover:text-white">Cancel</button>
          <MotionButton onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white">
            Save
          </MotionButton>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
