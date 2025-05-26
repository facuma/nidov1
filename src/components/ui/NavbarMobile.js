'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, Calendar, LayoutList, User } from 'lucide-react'

export default function NavbarMobile() {
  const pathname = usePathname()
  const ocultarEn = ['/resumen-reserva', '/pago']

  if (ocultarEn.includes(pathname)) return null

  const navItems = [
    { label: 'Descubrir', href: '/', icon: <Home size={20} /> },
    { label: 'Favoritos', href: '/favoritos', icon: <Heart size={20} /> },
    { label: 'Reservas', href: '/mis-reservas', icon: <Calendar size={20} /> },
    { label: 'Mis Espacios', href: '/mis-espacios', icon: <LayoutList size={20} /> },
    { label: 'Perfil', href: '/completar-perfil', icon: <User size={20} /> }
  ]

  return (
    <nav className="fixed nav bottom-0 left-0 right-0 z-50  border-t md:hidden">
      <div className="flex justify-around items-center h-16 text-xs">
        {navItems.map(({ label, href, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center transition ${
                isActive ? 'text-accent font-semibold' : 'text-gray-500'
              }`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
