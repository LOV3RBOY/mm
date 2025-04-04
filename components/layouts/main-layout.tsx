"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SkipNavLink, SkipNavContent } from "@/components/ui/skip-nav"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  return (
    <main className="min-h-screen bg-white">
      <SkipNavLink>Skip to content</SkipNavLink>

      <header className="bg-black text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <Link href="/models" aria-label="Return to models page">
                <h1 className="text-2xl font-light tracking-tight hover:text-neutral-200 transition-colors">
                  MODEL MANAGEMENT
                </h1>
              </Link>
              <p className="text-neutral-400 mt-0.5 text-sm">Manage your talent portfolio with ease</p>
            </div>
            <nav className="flex items-center gap-8" aria-label="Main Navigation">
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${pathname === "/dashboard" ? "text-white" : "text-neutral-400"} hover:text-white transition-colors`}
                aria-current={pathname === "/dashboard" ? "page" : undefined}
              >
                DASHBOARD
              </Link>
              <Link
                href="/settings"
                className={`text-sm font-medium ${pathname === "/settings" ? "text-white" : "text-neutral-400"} hover:text-white transition-colors`}
                aria-current={pathname === "/settings" ? "page" : undefined}
              >
                SETTINGS
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <SkipNavContent />
      {children}

      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/models" aria-label="Return to models page">
                <p className="text-neutral-400 hover:text-white transition-colors">
                  © 2025 Model Management. All rights reserved.
                </p>
              </Link>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-neutral-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

