'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, type Variants } from 'motion/react'

import { useScrollY } from '@/components/smooth-scroll'
import { useReducedMotion } from '@/lib/motion'

interface NavLink {
  label: string
  href: string
}

interface NavbarClientProps {
  clubName: string
  logoUrl: string | null
  logoAlt: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Áreas/Servicios', href: '/instalaciones' },
  { label: 'Actividades', href: '/actividades' },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Contacto', href: '/contacto' },
]

const SCROLL_THRESHOLD = 100
const REAPPEAR_DELAY = 500

const NAVBAR_STATE = {
  TOP: 'top',
  HIDDEN: 'hidden',
  FIXED: 'fixed',
} as const

type NavbarState = (typeof NAVBAR_STATE)[keyof typeof NAVBAR_STATE]

const navbarVariants: Variants = {
  top: { y: 0 },
  hidden: { y: '-100%' },
  fixed: { y: 0 },
}

export function NavbarClient({ clubName, logoUrl, logoAlt }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [navState, setNavState] = useState<NavbarState>(NAVBAR_STATE.TOP)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const scrollY = useScrollY()

  useEffect(() => {
    if (scrollY <= SCROLL_THRESHOLD) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setNavState(NAVBAR_STATE.TOP)
      return
    }

    if (navState === NAVBAR_STATE.TOP) {
      setNavState(NAVBAR_STATE.HIDDEN)

      timerRef.current = setTimeout(() => {
        setNavState(NAVBAR_STATE.FIXED)
        timerRef.current = null
      }, REAPPEAR_DELAY)
    }
  }, [scrollY, navState])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => !prev)
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false)
  }

  const isScrolled = navState === NAVBAR_STATE.FIXED

  return (
    <motion.header
      className={`fixed top-0 right-0 left-0 z-50 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent shadow-none'
      }`}
      variants={prefersReducedMotion ? undefined : navbarVariants}
      initial="top"
      animate={navState}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }
      }
    >
      <nav className="mx-auto flex items-center justify-between px-4 py-1.5 md:px-14 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={closeMobileMenu}>
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt}
              width={70}
              height={70}
              className={`w-auto object-contain transition-all ${isScrolled ? 'h-14' : 'h-17'}`}
            />
          ) : (
            <span className="font-display text-2xl font-bold text-gray-900">{clubName}</span>
          )}
        </Link>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => {
            const isContacto = link.href === '/contacto'

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    isContacto
                      ? 'ml-4 inline-flex rounded-full bg-pradera-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-pradera-700 uppercase tracking-wide'
                      : 'px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:text-neutral-900 uppercase tracking-wide'
                  }
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-pradera-50 hover:text-pradera-700 lg:hidden"
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <ul className="flex flex-col px-4 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2.5 text-sm font-medium text-gray-600 uppercase tracking-wide transition-colors hover:bg-pradera-50 hover:text-gray-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.header>
  )
}
