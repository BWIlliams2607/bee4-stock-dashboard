import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/Sidebar"
import Header from "@/components/Header";
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bee4 Stock Dashboard",
  description: "Modern stock control for print manufacturing",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 bg-background/90">
            {children}
          </main>
        </div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}