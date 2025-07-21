"use client";

import { Dialog } from "@headlessui/react";
import { useState, useEffect, ChangeEvent } from "react";
import { MotionButton } from "./button";
import type { PrinterLog, PrinterState } from "@prisma/client";

export default function PrinterLogsModal({
  isOpen,
  onClose,
  printerId,
}: {
  isOpen: boolean;
  onClose: () => void;
  printerId: number;
}) {
  const [logs, setLogs] = useState<PrinterLog[]>([]);
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<PrinterLog["state"]>("online");

  useEffect(() => {
    if (!isOpen) return;
    fetch(`/api/printers/${printerId}/logs`)
      .then((r) => r.json())
      .then(setLogs);
  }, [isOpen, printerId]);

  const addLog = async () => {
    await fetch(`/api/printers/${printerId}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state, notes }),
    });
    const updated = await fetch(
      `/api/printers/${printerId}/logs`
    ).then((r) => r.json());
    setLogs(updated);
    setNotes("");
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <Dialog.Panel className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <Dialog.Title className="text-xl text-white mb-4">
          Printer Logs
        </Dialog.Title>

        {/* Logs List */}
        <div className="space-y-4 mb-6 max-h-64 overflow-auto">
          {logs.map((log) => (
            <div key={log.id} className="p-2 bg-gray-700 rounded-md">
              <div className="flex justify-between text-sm text-gray-300">
                <span>{new Date(log.timestamp).toLocaleString()}</span>
                <span
                  className={`px-2 rounded-full text-xs ${
                    log.state === "online"
                      ? "bg-green-600"
                      : log.state === "offline"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  } text-white`}
                >
                  {log.state}
                </span>
              </div>
              {log.notes && (
                <p className="mt-1 text-gray-200 text-sm">{log.notes}</p>
              )}
            </div>
          ))}
        </div>

        {/* New Log Form */}
        <div className="space-y-4">
          <div>
            <label className="text-white block mb-1">New State</label>
            <select
              value={state}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setState(e.target.value as PrinterState)
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label className="text-white block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
              rows={3}
            />
          </div>
          <MotionButton
            onClick={addLog}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
          >
            Record Log
          </MotionButton>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
