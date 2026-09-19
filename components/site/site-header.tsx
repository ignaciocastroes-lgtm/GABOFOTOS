'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CLUB } from '@/lib/club'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'El Club', href: '/el-club' },
  { label: 'Profesores', href: '/profesores' },
  { label: 'Escuela', href: '/escuela' },
  { label: 'Nuestras series', href: '/series' },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Qué es el hockey patín', href: '/hockey-patin' },
  { label: 'Apóyanos', href: '/apoyanos' },
  { label: 'Auspiciadores', href: '/auspiciadores' },
  { label: 'Pases entre clubes', href: '/pases' },
  { label: 'Transparencia', href: '/transparencia' },
  { label: 'Contacto', href: '/contacto' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/80'
          : 'bg-background/70 backdrop-blur-sm',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/escudo.webp"
            alt={`Escudo del ${CLUB.nombreLargo}`}
            width={56}
            height={56}
            className="h-11 w-11 shrink-0 md:h-14 md:w-14"
            priority
          />
          <span className="font-heading text-sm font-bold uppercase leading-tight tracking-tight text-foreground md:text-lg">
            {CLUB.nombreLogo.linea1}
            <span className="block text-primary">{CLUB.nombreLogo.linea2}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-2 py-2 text-[13px] font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/escuela"
            className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
          >
            Inscríbete
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground xl:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden border-t border-border bg-background transition-[max-height] duration-300 xl:hidden',
          open ? 'max-h-96' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
