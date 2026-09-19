"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // Before hydration we don't know the real theme, so keep the control neutral
  // to avoid an aria-label / icon mismatch that self-corrects after mount.
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "Activar modo día" : "Activar modo noche") : "Cambiar tema"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-300 text-slate-700 transition-colors duration-300 hover:ring-yellow-400 hover:text-yellow-500 dark:ring-zinc-700 dark:text-zinc-200 dark:hover:text-yellow-400"
    >
      {isDark ? <MoonIcon className="h-4 w-4" /> : <SunIcon className="h-4 w-4" />}
      <span className="sr-only">{mounted ? (isDark ? "Modo noche activo" : "Modo día activo") : ""}</span>
    </button>
  )
}
