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
        className="p-2 text-[#1a3c3c]"
        aria-label="Menú"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-[#e5e5e5] px-6 py-6">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-[#555555] hover:text-[#1a3c3c] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-3 border-[#e5e5e5]" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-[#1a3c3c]"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
