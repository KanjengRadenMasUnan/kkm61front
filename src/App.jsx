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

// Helper agar posisi scroll otomatis di paling atas setiap pindah halaman
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

// Helper untuk sanitasi karakter spesial XML agar tidak corrupt/break di Google
const escapeXml = (str) => {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// =========================================================================
// KOMPONEN ADVANCED SITEMAP (SUPER OPTIMIZED FOR GOOGLE SEO)
// =========================================================================
const StandaloneSitemap = () => {
  const [xmlContent, setXmlContent] = useState('<!-- Generating SEO Optimized Sitemap... -->')

  useEffect(() => {
    document.title = "Sitemap Index | KKM 61 Waringinkurung"
    const baseUrl = 'https://kkm61waringinkurungnews.my.id'

    // Fetch data berita dinamis dari backend
    fetch('https://kkm61backend.onrender.com/api/berita')
      .then((res) => res.json())
      .then((data) => {
        let beritaList = []
        if (Array.isArray(data)) {
          beritaList = data
        } else if (data && Array.isArray(data.data)) {
          beritaList = data.data
        }

        const today = new Date().toISOString().split('T')[0]

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`
        xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`
        xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n\n`

        // 1. Halaman Utama (Prioritas Tertinggi)
        xml += `  <!-- Main Core Pages -->\n`
        xml += `  <url>\n`
        xml += `    <loc>${baseUrl}/</loc>\n`
        xml += `    <lastmod>${today}</lastmod>\n`
        xml += `    <changefreq>daily</changefreq>\n`
        xml += `    <priority>1.00</priority>\n`
        xml += `  </url>\n`

        // 2. Hub Berita (Update Setiap Hari)
        xml += `  <url>\n`
        xml += `    <loc>${baseUrl}/berita</loc>\n`
        xml += `    <lastmod>${today}</lastmod>\n`
        xml += `    <changefreq>daily</changefreq>\n`
        xml += `    <priority>0.90</priority>\n`
        xml += `  </url>\n`

        // 3. Halaman Informasi Publik (Update Mingguan)
        xml += `  <url>\n`
        xml += `    <loc>${baseUrl}/program-kerja</loc>\n`
        xml += `    <lastmod>${today}</lastmod>\n`
        xml += `    <changefreq>weekly</changefreq>\n`
        xml += `    <priority>0.80</priority>\n`
        xml += `  </url>\n`
        xml += `  <url>\n`
        xml += `    <loc>${baseUrl}/anggota</loc>\n`
        xml += `    <lastmod>${today}</lastmod>\n`
        xml += `    <changefreq>weekly</changefreq>\n`
        xml += `    <priority>0.80</priority>\n`
        xml += `  </url>\n\n`

        // 4. Artikel & Berita Dinamis (Diurutkan dari yang terbaru)
        xml += `  <!-- Dynamic News Articles -->\n`
        beritaList.forEach((item) => {
          const rawSlug = item.slug || 'berita'
          const slug = escapeXml(rawSlug)
          const rawDate = item.tanggal || item.created_at || today
          const formattedDate = rawDate.substring(0, 10)

          xml += `  <url>\n`
          xml += `    <loc>${baseUrl}/berita/${slug}</loc>\n`
          xml += `    <lastmod>${formattedDate}</lastmod>\n`
          xml += `    <changefreq>monthly</changefreq>\n`
          xml += `    <priority>0.85</priority>\n`
          xml += `  </url>\n`
        })

        xml += `</urlset>`
        setXmlContent(xml)
      })
      .catch(() => {
        const today = new Date().toISOString().split('T')[0]
        setXmlContent(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><lastmod>${today}</lastmod><priority>1.00</priority></url>
  <url><loc>${baseUrl}/berita</loc><lastmod>${today}</lastmod><priority>0.90</priority></url>
  <url><loc>${baseUrl}/program-kerja</loc><lastmod>${today}</lastmod><priority>0.80</priority></url>
  <url><loc>${baseUrl}/anggota</loc><lastmod>${today}</lastmod><priority>0.80</priority></url>
</urlset>`)
      })
  }, [])

  return (
    <pre style={{ margin: 0, padding: '20px', backgroundColor: '#0f172a', color: '#38bdf8', fontFamily: 'Fira Code, monospace', fontSize: '13px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: '100vh', lineHeight: '1.6' }}>
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
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <FloatingNewsWidget />
      <Footer />
    </div>
  )
}

// Pembungkus Utama Logika Layout
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
        {/* RUTE SITEMAP SEO TEROPTIMASI */}
        <Route path="/sitemap" element={<StandaloneSitemap />} />
        
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}