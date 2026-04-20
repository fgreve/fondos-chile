import Link from "next/link"

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" className="hover:opacity-80 transition-opacity">
      <span className={`font-semibold text-sm tracking-wide ${variant === "light" ? "text-white" : "text-[#1a3c3c]"}`}>
        FONDOSCHILE
      </span>
    </Link>
  )
}
