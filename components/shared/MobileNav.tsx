"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface MobileNavProps {
  items: { href: string; label: string }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-text-dark"
        aria-label="Men\u00fa"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-surface-white border-b border-surface-border shadow-subtle p-4">
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-text-dark rounded-standard hover:bg-black/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-surface-border-light" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-medium text-brand-blue"
            >
              Iniciar sesi\u00f3n
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
