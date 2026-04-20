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
        className="p-2 text-[#1a1a1a]"
        aria-label="Menú"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 bg-[#fafafa] border-b border-[#e8e8e8] px-6 py-4">
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-[#e8e8e8]" />
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-medium text-[#0055FF]"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
