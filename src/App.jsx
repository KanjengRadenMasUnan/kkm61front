import { useEffect, useState } from 'react'
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

// Helper agar posisi scroll otomatis di paling atas
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

// =========================================================================
// KOMPONEN SITEMAP MANDIRI (TANPA NAVBAR / FOOTER / LAYOUT)
// =========================================================================
const StandaloneSitemap = () => {
  const [xmlContent, setXmlContent] = useState('Loading Sitemap XML...')

  useEffect(() => {
    document.title = "sitemap.xml"
    const baseUrl = 'https://kkm61waringinkurungnews.my.id'

    fetch('https://kkm61backend.onrender.com/api/berita')
      .then((res) => res.json())
      .then((data) => {
        let beritaList = []
        if (Array.isArray(data)) {
          beritaList = data
        } else if (data && Array.isArray(data.data)) {
          beritaList = data.data
        }

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
        xml += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n`
        xml += `  <url><loc>${baseUrl}/berita</loc><priority>0.9</priority><changefreq>daily</changefreq></url>\n`
        xml += `  <url><loc>${baseUrl}/anggota</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>\n`
        xml += `  <url><loc>${baseUrl}/program-kerja</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>\n`

        beritaList.forEach((item) => {
          const slug = item.slug || 'berita'
          const date = item.tanggal || item.created_at || '2026-01-01'
          const formattedDate = date.substring(0, 10)

          xml += `  <url>\n`
          xml += `    <loc>${baseUrl}/berita/${slug}</loc>\n`
          xml += `    <lastmod>${formattedDate}</lastmod>\n`
          xml += `    <changefreq>monthly</changefreq>\n`
          xml += `    <priority>0.8</priority>\n`
          xml += `  </url>\n`
        })

        xml += `</urlset>`
        setXmlContent(xml)
      })
      .catch(() => {
        setXmlContent(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${baseUrl}/berita</loc><priority>0.9</priority></url>
  <url><loc>${baseUrl}/anggota</loc><priority>0.8</priority></url>
  <url><loc>${baseUrl}/program-kerja</loc><priority>0.8</priority></url>
</urlset>`)
      })
  }, [])

  return (
    <pre style={{ margin: 0, padding: '16px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: '100vh' }}>
      {xmlContent}
    </pre>
  )
}

// Layout Publik Utama
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative bg-cream font-body overflow-x-hidden">
      <Navbar />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 flex-1 max-w-7xl">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:slug" element={<DetailBerita />} />
          <Route path="/anggota" element={<Anggota />} />
          <Route path="/program-kerja" element={<ProgramKerja />} />
          <Route path="/program-kerja/bidang/:id" element={<DetailBidangProker />} />
          <Route path="/program-kerja/laporan" element={<LaporanProker />} />
          
          {/* Catch-all publik mengarah ke Beranda */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <FloatingNewsWidget />
      <Footer />
    </div>
  )
}

// Komponen Pembungkus Utama
function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

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

  return <PublicLayout />
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* RUTE SITEMAP DILETAKKAN DI LEVEL TERATAS AGAR BISA DI-ACCESS LANGSUNG */}
        <Route path="/sitemap.xml" element={<StandaloneSitemap />} />
        
        {/* SISANYA DIOPER KE APP CONTENT */}
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}