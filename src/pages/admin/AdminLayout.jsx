import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Newspaper, Calendar, ClipboardList, LogOut, Shield, Menu, X } from 'lucide-react'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // State Sidebar (Default terbuka di layar besar, tertutup di HP)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Deteksi ukuran layar HP / Tablet / Desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true)
        setIsSidebarOpen(false) // HP: Default sembunyi
      } else {
        setIsMobile(false)
        setIsSidebarOpen(true)  // Desktop: Default terbuka
      }
    }

    handleResize() // Cek awal saat komponen dimuat
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Otomatis tutup sidebar di HP saat berpindah halaman
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('adminUser')
    navigate('/admin/login', { replace: true })
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap active:scale-95 ${
      isActive
        ? 'bg-gold text-primary shadow-md'
        : 'text-cream/80 hover:bg-white/10 hover:text-cream'
    }`

  return (
    <div className="w-full min-h-screen bg-white font-body flex flex-col overflow-x-hidden">
      
      {/* HEADER NAVBAR BAR ATAS */}
      <header className="bg-primary text-cream px-3 sm:px-6 py-3 flex items-center justify-between border-b border-gold/20 sticky top-0 z-30 shadow-md w-full shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* TOMBOL GARIS 3 (HAMBURGER MENU) - TOUCH FRIENDLY */}
          <button
            onClick={toggleSidebar}
            className="p-2.5 sm:p-2 text-cream hover:text-gold bg-white/10 active:bg-white/20 rounded-xl transition-all flex items-center justify-center focus:outline-none border border-gold/20 shrink-0"
            title="Sembunyikan/Tampilkan Sidebar"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 bg-gold text-primary rounded-xl flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
              <Shield size={16} />
            </div>
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-cream leading-tight">Panel KKM 61</h2>
              <span className="text-[9px] text-gold font-semibold uppercase tracking-wider block">Administrator</span>
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON DI HEADER */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 sm:gap-2 bg-red-500/20 text-red-300 active:bg-red-500 active:text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all border border-red-500/30 shrink-0"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </header>

      {/* OVERLAY / BACKGROUND GELAP KHUSUS SMARTPHONE SAAT SIDEBAR TERBUKA */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300"
        />
      )}

      {/* STRUKTUR BODY (SIDEBAR + KONTEN) */}
      <div className="flex flex-1 w-full relative">
        
        {/* SIDEBAR PANEL BIRU */}
        <aside
          className={`bg-primary text-cream flex flex-col justify-between shrink-0 border-r border-gold/20 transition-all duration-300 ease-in-out ${
            isMobile
              ? `fixed top-[57px] left-0 bottom-0 w-72 p-5 z-50 shadow-2xl ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : `relative ${
                  isSidebarOpen 
                    ? 'w-64 p-5 opacity-100' 
                    : 'w-0 p-0 opacity-0 overflow-hidden border-none'
                }`
          }`}
        >
          <div className="space-y-5 sm:space-y-6 w-full">
            <div className="border-b border-gold/20 pb-3 flex justify-between items-center">
              <span className="text-[11px] text-gold font-bold uppercase tracking-wider">
                Navigasi Utama
              </span>
              {isMobile && (
                <span className="text-[10px] text-cream/60">Sentuh menu untuk memilih</span>
              )}
            </div>

            {/* LIST MENU NAVIGASI */}
            <nav className="flex flex-col gap-1.5 sm:gap-2">
              <NavLink to="/admin/dashboard" className={linkStyle}>
                <LayoutDashboard size={18} /> Dashboard
              </NavLink>
              <NavLink to="/admin/anggota" className={linkStyle}>
                <Users size={18} /> Kelola Anggota
              </NavLink>
              <NavLink to="/admin/berita" className={linkStyle}>
                <Newspaper size={18} /> Kelola Berita
              </NavLink>
              <NavLink to="/admin/kegiatan" className={linkStyle}>
                <Calendar size={18} /> Kelola Agenda
              </NavLink>
              <NavLink to="/admin/program-kerja" className={linkStyle}>
                <ClipboardList size={18} /> Kelola Proker
              </NavLink>
            </nav>
          </div>

          {/* BOTTOM SIDEBAR */}
          <div className="pt-5 border-t border-gold/20 w-full mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-300 active:bg-red-500 active:text-white px-4 py-3 rounded-2xl text-xs font-bold transition-all border border-red-500/30"
            >
              <LogOut size={16} /> Keluar (Logout)
            </button>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <main className="flex-1 w-full bg-white p-3.5 sm:p-8 min-h-[calc(100vh-60px)] transition-all duration-300 ease-in-out overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  )
}