// app/admin/page.tsx
"use client";

import { Tab } from "@headlessui/react";
import CategorySection from "@/components/admin/CategorySection";
import SupplierSection from "@/components/admin/SupplierSection";
import LocationSection from "@/components/admin/LocationSection";
import ShelfSection from "@/components/admin/ShelfSection";
import ProductSection from "@/components/admin/ProductSection";

const sections = [
  { name: "Categories", Component: CategorySection },
  { name: "Suppliers",  Component: SupplierSection },
  { name: "Locations",  Component: LocationSection },
  { name: "Shelves",    Component: ShelfSection },
  { name: "Products",   Component: ProductSection },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">
        Product Administration
      </h1>

      <Tab.Group>
        <Tab.List className="flex space-x-2 mb-4">
          {sections.map((s) => (
            <Tab
              key={s.name}
              className={({ selected }) =>
                `px-4 py-2 rounded-lg transition ${
                  selected
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`
              }
            >
              {s.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {sections.map(({ name, Component }) => (
            <Tab.Panel
              key={name}
              className="bg-gray-800 p-6 rounded-2xl shadow-lg"
            >
              <Component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
