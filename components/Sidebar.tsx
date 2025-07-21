"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Menu,
  X,
  Home,
  Package,
  PackageMinus,
  Truck,
  Settings,
  ClipboardList,
  Sun,
  Moon,
  Search as SearchIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const navSections = [
  {
    label: "Stock",
    links: [
      { name: "Dashboard",     href: "/",                  icon: <Home size={18} /> },
      { name: "Stock Summary", href: "/stock-summary",     icon: <Package size={18} /> },
    ],
  },
  {
    label: "Requests",
    links: [
      { name: "Order Requests", href: "/order-requests",  icon: <ClipboardList size={18} /> },
    ],
  },
  {
    label: "Transactions",
    links: [
      { name: "Goods In",      href: "/goods-in",         icon: <Package size={18} /> },
      { name: "Goods Out",     href: "/goods-out",        icon: <PackageMinus size={18} /> },
      { name: "Incoming Stock",href: "/incoming-stock",   icon: <Truck size={18} /> },
    ],
  },
  {
    label: "Admin",
    links: [
      { name: "Product Admin", href: "/admin/products",   icon: <Settings size={18} /> },
      { name: "Settings",      href: "/settings",         icon: <Settings size={18} /> },
    ],
  },
  // <-- in the future just add:
  // {
  //   label: "Maintenance",
  //   links: [
  //     { name: "Maintenance Ordering", href: "/maintenance-ordering", icon: <ClipboardList size={18} /> },
  //   ],
  // },
  // {
  //   label: "Status",
  //   links: [
  //     { name: "Printer Status", href: "/printer-status", icon: <Truck size={18} /> },
  //   ],
  // },
]

export function Sidebar() {
  const pathname = usePathname()
  const [openMobile, setOpenMobile] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // default: all expanded
  useEffect(() => {
    const init: Record<string, boolean> = {}
    navSections.forEach(s => (init[s.label] = true))
    setExpandedSections(init)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  // 1) filter by search
  const filtered = navSections
    .map(section => ({
      ...section,
      links: section.links.filter(link =>
        link.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(section => section.links.length > 0)

  // 2) sort sections & their links alphabetically
  const sortedSections = filtered
    .map(section => ({
      ...section,
      links: [...section.links].sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const renderNav = (mobile = false) => (
    <nav className="flex-1 flex flex-col gap-2 overflow-auto px-2 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-background">
      {!collapsed && (
        <div className="px-4 py-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-md bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500"
            />
            <SearchIcon size={16} className="absolute top-3 right-3 text-muted-foreground" />
          </div>
        </div>
      )}

      {sortedSections.map((section, idx) => (
        <div key={section.label} className="px-2">
          <button
            onClick={() =>
              setExpandedSections(prev => ({
                ...prev,
                [section.label]: !prev[section.label],
              }))
            }
            className="flex w-full items-center justify-between uppercase text-xs text-muted-foreground font-semibold px-4 py-2"
          >
            {!collapsed && section.label}
            {expandedSections[section.label]
              ? <ChevronUp size={14} />
              : <ChevronDown size={14} />}
          </button>

          <AnimatePresence initial={false}>
            {expandedSections[section.label] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col"
              >
                {section.links.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                      ${pathname === link.href
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow"
                        : "text-muted-foreground hover:bg-background/30"
                      }`}
                    onClick={() => mobile && setOpenMobile(false)}
                  >
                    {link.icon}
                    {!collapsed && <span className="flex-1">{link.name}</span>}
                    {pathname === link.href && (
                      <motion.div
                        layoutId="active-link"
                        className="w-2 h-2 rounded-full bg-pink-400"
                      />
                    )}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {idx < sortedSections.length - 1 && (
            <div className="border-t border-border my-2 mx-4" />
          )}
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* --- Desktop --- */}
      <aside
        className={`hidden md:flex flex-col h-screen fixed top-0 z-30 bg-background shadow-xl backdrop-blur-lg transition-all duration-300
          ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="h-16 flex items-center justify-between px-4">
          {!collapsed && <span className="font-bold text-lg">Bee4 Stock</span>}
          <div className="flex items-center gap-2">
            {!collapsed && (
              <button onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme" className="p-2 text-muted-foreground hover:text-white">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle collapse" className="p-2 text-muted-foreground hover:text-white">
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        </div>
        {renderNav(false)}
      </aside>

      {/* --- Mobile Header --- */}
      <div className="md:hidden flex items-center h-16 px-4 bg-background border-b border-border z-20">
        <button onClick={() => setOpenMobile(true)} className="p-2 text-muted-foreground hover:text-white" aria-label="Open menu">
          <Menu size={24} />
        </button>
        <span className="ml-4 font-bold text-lg">Bee4 Stock</span>
        <button onClick={() => setDarkMode(!darkMode)} className="ml-auto p-2 text-muted-foreground hover:text-white" aria-label="Toggle theme">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* --- Mobile Sidebar --- */}
      <AnimatePresence>
        {openMobile && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpenMobile(false)}
          >
            <motion.aside
              className="absolute left-0 top-0 h-full w-64 bg-background shadow-xl border-r border-border flex flex-col"
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="h-16 flex items-center justify-between px-4">
                <span className="font-bold text-lg">Bee4 Stock</span>
                <button onClick={() => setOpenMobile(false)} className="p-2 text-muted-foreground hover:text-white" aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              {renderNav(true)}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
