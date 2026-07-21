import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { LayoutDashboard, Users, Newspaper, CheckSquare, Calendar, LogOut } from 'lucide-react'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn')
    localStorage.removeItem('adminUser')
    navigate('/login')
  }

  const menus = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Kegiatan', path: '/admin/kegiatan', icon: Calendar },
    { name: 'Berita', path: '/admin/berita', icon: Newspaper },
    { name: 'Anggota', path: '/admin/anggota', icon: Users },
    { name: 'Program Kerja', path: '/admin/proker', icon: CheckSquare },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex font-body">
      <aside className="w-64 bg-[#0D1F36] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-display font-bold text-[#C99738]">Admin KKM</h2>
          <p className="text-sm text-gray-400 mt-1">Panel Pengelola Data</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon
            const isActive = location.pathname === menu.path
            return (
              <Link
                key={menu.name}
                to={menu.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-[#C99738] text-[#0D1F36] font-bold' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {menu.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white text-sm">
            Lihat Website Utama
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/10 rounded-lg transition-colors font-bold"
          >
            <LogOut size={20} />
            Keluar (Logout)
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm px-8 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0D1F36] font-display">Sistem Informasi KKM 61</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#C99738] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="font-semibold text-gray-700">
              {localStorage.getItem('adminUser') || 'Admin'}
            </span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}