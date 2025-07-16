"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  Menu, X, Home, Package, PackageMinus, Truck, Settings
} from "lucide-react"

const navSections = [
  {
    label: "Stock",
    links: [
      { name: "Dashboard", href: "/", icon: <Home size={18} /> },
      { name: "Stock Summary", href: "/stock-summary", icon: <Package size={18} /> },
    ]
  },
  {
    label: "Transactions",
    links: [
      { name: "Goods In", href: "/goods-in", icon: <Package size={18} /> },
      { name: "Goods Out", href: "/goods-out", icon: <PackageMinus size={18} /> },
      { name: "Incoming Stock", href: "/incoming-stock", icon: <Truck size={18} /> },
    ]
  },
  {
    label: "Admin",
    links: [
      { name: "Product Admin", href: "/admin/products", icon: <Settings size={18} /> },
      { name: "Settings", href: "/settings", icon: <Settings size={18} /> },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // For mobile: slide-in/out
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-30 bg-gradient-to-b from-background/90 to-background/70 border-r border-border shadow-xl backdrop-blur-lg">
        <div className="h-16 flex items-center px-6 font-bold text-xl tracking-tight select-none">
          Bee4 Stock
        </div>
        <nav className="flex-1 flex flex-col gap-4 mt-6">
          {navSections.map((section, idx) => (
            <div key={section.label}>
              {idx !== 0 && (
                <div className="border-t border-border my-3" />
              )}
              <div className="uppercase text-xs text-muted-foreground font-semibold px-6 py-1 tracking-wider">
                {section.label}
              </div>
              {section.links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-6 py-2 my-1 rounded-lg group transition
                    ${pathname === link.href
                      ? "bg-gradient-to-r from-blue-600/70 to-purple-700/80 text-white shadow"
                      : "text-muted-foreground hover:bg-muted/40"}`}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                  {pathname === link.href && (
                    <motion.div
                      layoutId="active-link"
                      className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                    />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile: hamburger + slide-in */}
      <div className="md:hidden flex items-center h-16 px-4 bg-background border-b border-border z-20">
        <div className="font-bold text-lg tracking-tight flex-1">
          Bee4 Stock
        </div>
        <button
          className="p-2 text-muted-foreground"
          onClick={() => setOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.aside
              className="absolute left-0 top-0 h-full w-64 bg-background shadow-xl border-r border-border flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-16 flex items-center px-6 font-bold text-lg">
                Bee4 Stock
                <button
                  className="ml-auto p-2 text-muted-foreground"
                  onClick={() => setOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>
              <nav className="flex-1 flex flex-col gap-4 mt-4">
                {navSections.map((section, idx) => (
                  <div key={section.label}>
                    {idx !== 0 && (
                      <div className="border-t border-border my-3" />
                    )}
                    <div className="uppercase text-xs text-muted-foreground font-semibold px-6 py-1 tracking-wider">
                      {section.label}
                    </div>
                    {section.links.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-3 px-6 py-2 my-1 rounded-lg group transition
                          ${pathname === link.href
                            ? "bg-gradient-to-r from-blue-600/70 to-purple-700/80 text-white shadow"
                            : "text-muted-foreground hover:bg-muted/40"}`}
                        onClick={() => setOpen(false)}
                      >
                        {link.icon}
                        <span className="font-medium">{link.name}</span>
                        {pathname === link.href && (
                          <motion.div
                            layoutId="active-link"
                            className="ml-auto w-2 h-2 rounded-full bg-blue-500"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
