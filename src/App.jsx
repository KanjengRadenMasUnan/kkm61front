import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingNewsWidget from './components/FloatingNewsWidget'

// Pages - Public
import Beranda from './pages/Beranda'
import Berita from './pages/Berita'
import DetailBerita from './pages/DetailBerita'
import Anggota from './pages/Anggota'
import ProgramKerja from './pages/ProgramKerja'
import DetailBidangProker from './pages/DetailBidangProker'
import LaporanProker from './pages/LaporanProker'

// Pages - Admin & Layouts
import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminAnggota from './pages/admin/AdminAnggota'
import AdminBerita from './pages/admin/AdminBerita'
import AdminKegiatan from './pages/admin/AdminKegiatan'
import AdminProker from './pages/admin/AdminProker'

// Helper agar posisi scroll otomatis di paling atas setiap kali pindah halaman
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  return isLoggedIn ? children : <Navigate to="/admin/login" replace />
}

// Komponen Pembungkus Utama untuk Memisahkan Layout Admin & Publik
function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Layout Khusus Admin
  if (isAdminRoute) {
    return (
      <main className="w-full min-h-screen bg-white">
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="anggota" element={<AdminAnggota />} />
            <Route path="berita" element={<AdminBerita />} />
            <Route path="kegiatan" element={<AdminKegiatan />} />
            <Route path="program-kerja" element={<AdminProker />} />
          </Route>

          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </main>
    )
  }

  // Layout Publik
  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-cream font-body overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 max-w-7xl">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/berita" element={<Berita />} />
          
          {/* DIUBAH: Menggunakan :slug untuk URL ramah SEO */}
          <Route path="/berita/:slug" element={<DetailBerita />} />

          <Route path="/anggota" element={<Anggota />} />
          <Route path="/program-kerja" element={<ProgramKerja />} />
          <Route path="/program-kerja/bidang/:id" element={<DetailBidangProker />} />
          <Route path="/program-kerja/laporan" element={<LaporanProker />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <FloatingNewsWidget />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  )
}