import Link from "next/link"

export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2L26 14L14 26L2 14L14 2Z" stroke={variant === "light" ? "#ffffff" : "#1a3c3c"} strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="14" r="2" fill={variant === "light" ? "#ffffff" : "#1a3c3c"} />
        <circle cx="10" cy="14" r="1.5" fill={variant === "light" ? "#ffffff" : "#1a3c3c"} />
        <circle cx="18" cy="14" r="1.5" fill={variant === "light" ? "#ffffff" : "#1a3c3c"} />
        <circle cx="14" cy="10" r="1.5" fill={variant === "light" ? "#ffffff" : "#1a3c3c"} />
        <circle cx="14" cy="18" r="1.5" fill={variant === "light" ? "#ffffff" : "#1a3c3c"} />
      </svg>
      <span className={`font-semibold text-sm tracking-wide ${variant === "light" ? "text-white" : "text-[#1a3c3c]"}`}>
        FONDOSCHILE
      </span>
    </Link>
  )
}
