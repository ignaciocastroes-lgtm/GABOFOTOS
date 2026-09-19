"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { AboutPlansModal } from "./about-plans-modal"

const categoryLinks = [
  { href: "#social", label: "SOCIAL" },
  { href: "#colegios", label: "COLEGIOS" },
  { href: "#retratos", label: "RETRATOS" },
  { href: "#deporte", label: "DEPORTE" },
]

const linkClass = "transition-colors hover:text-yellow-500 dark:hover:text-yellow-400"

export function SiteNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [menuOpen])

  const closeAbout = useCallback(() => setAboutOpen(false), [])

  function openAbout() {
    setMenuOpen(false)
    setAboutOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/80 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#" className="flex items-center gap-3">
            {/* Logo dinámico según el tema: negro en modo día, blanco en modo noche */}
            <span className="relative block h-11 w-11">
              <Image
                src="/images/gabofotos-logo-black.jpg"
                alt="GABOFOTOS"
                width={44}
                height={44}
                className="h-11 w-11 rounded-sm object-contain dark:hidden"
              />
              <Image
                src="/images/gabofotos-logo.jpg"
                alt="GABOFOTOS"
                width={44}
                height={44}
                className="hidden h-11 w-11 rounded-sm object-contain dark:block"
              />
            </span>
            <span className="font-sans text-sm font-light tracking-[0.35em] text-slate-900 transition-colors duration-300 dark:text-zinc-100">
              GABOFOTOS
            </span>
          </a>

          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden items-center gap-8 text-xs tracking-[0.2em] text-slate-500 lg:flex dark:text-zinc-400">
              {categoryLinks.map((link) => (
                <a key={link.href} className={linkClass} href={link.href}>
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={openAbout} className={linkClass}>
                GABO &amp; PLANES
              </button>
              <a
                className="rounded-full border border-yellow-500 px-4 py-1.5 text-yellow-700 transition-colors hover:bg-yellow-500 hover:text-white dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-zinc-950"
                href="#contacto"
              >
                CONTACTO
              </a>
            </nav>

            <ThemeToggle />

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 ring-1 ring-slate-300 transition-colors hover:text-yellow-500 hover:ring-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 lg:hidden dark:text-zinc-200 dark:ring-zinc-700 dark:hover:text-yellow-400"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="menu-movil"
            aria-label="Menú principal"
            className="border-t border-slate-200 bg-slate-50/95 lg:hidden dark:border-zinc-800/80 dark:bg-zinc-950/95"
          >
            <div className="mx-auto flex max-w-6xl flex-col px-6 py-2 text-sm tracking-[0.2em] text-slate-600 dark:text-zinc-300">
              {categoryLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-3 ${linkClass}`}
                >
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={openAbout} className={`py-3 text-left ${linkClass}`}>
                GABO &amp; PLANES
              </button>
              <a
                href="#contacto"
                onClick={() => setMenuOpen(false)}
                className="py-3 text-yellow-700 dark:text-yellow-400"
              >
                CONTACTO
              </a>
            </div>
          </nav>
        )}
      </header>

      <AboutPlansModal open={aboutOpen} onClose={closeAbout} />
    </>
  )
}
