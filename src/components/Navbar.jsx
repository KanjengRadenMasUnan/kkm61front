import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Users, ClipboardList, Newspaper, Menu, X } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Sembunyikan Navbar publik jika di halaman admin
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  const baseLink =
    'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 font-body'
  const activeLink = 'bg-gold text-primary shadow-md font-bold'
  const inactiveLink = 'text-cream/80 hover:text-cream hover:bg-cream/10'

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg border-b border-gold/20">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Logo />

        {/* TAMPILAN DESKTOP (Sama persis seperti sebelumnya di PC) */}
        <div className="hidden md:flex gap-2">
          <NavLink to="/" end className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Home size={18} /> Beranda
          </NavLink>
          <NavLink to="/berita" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Newspaper size={18} /> Berita
          </NavLink>
          <NavLink to="/anggota" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <Users size={18} /> Anggota
          </NavLink>
          <NavLink to="/program-kerja" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
            <ClipboardList size={18} /> Proker
          </NavLink>
        </div>

        {/* TOMBOL HAMBURGER (Khusus Smartphone) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-gold hover:text-cream focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MENU MELAYANG ESTETIK (Khusus Smartphone saat diklik) */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 z-50 bg-primary/95 backdrop-blur-xl border border-gold/30 rounded-3xl p-5 shadow-2xl animate-fade-in-up space-y-2">
          <NavLink
            to="/"
            end
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `${baseLink} w-full ${isActive ? activeLink : inactiveLink}`}
          >
            <Home size={18} /> Beranda
          </NavLink>
          <NavLink
            to="/berita"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `${baseLink} w-full ${isActive ? activeLink : inactiveLink}`}
          >
            <Newspaper size={18} /> Berita
          </NavLink>
          <NavLink
            to="/anggota"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `${baseLink} w-full ${isActive ? activeLink : inactiveLink}`}
          >
            <Users size={18} /> Anggota
          </NavLink>
          <NavLink
            to="/program-kerja"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `${baseLink} w-full ${isActive ? activeLink : inactiveLink}`}
          >
            <ClipboardList size={18} /> Proker
          </NavLink>
        </div>
      )}
    </nav>
  )
}