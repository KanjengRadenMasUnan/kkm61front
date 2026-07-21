import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../../config'
import { 
  Users, 
  Newspaper, 
  Calendar, 
  ClipboardList, 
  ArrowUpRight, 
  Sparkles, 
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    anggota: 0,
    berita: 0,
    kegiatan: 0,
    proker: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ambil data dari Backend menggunakan API_BASE_URL terpusat
    Promise.all([
      fetch(`${API_BASE_URL}/anggota`).then((res) => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/berita`).then((res) => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/kegiatan`).then((res) => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/program-kerja`).then((res) => res.json()).catch(() => []),
    ]).then(([resAnggota, resBerita, resKegiatan, resProker]) => {
      setStats({
        anggota: Array.isArray(resAnggota) ? resAnggota.length : 0,
        berita: Array.isArray(resBerita) ? resBerita.length : 0,
        kegiatan: Array.isArray(resKegiatan) ? resKegiatan.length : 0,
        proker: Array.isArray(resProker) ? resProker.length : 0,
      })
      setLoading(false)
    })
  }, [])

  const statCards = [
    {
      title: 'Total Anggota',
      count: stats.anggota,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-600 border-blue-200',
      link: '/admin/anggota',
      label: 'Kelola Tim',
    },
    {
      title: 'Berita & Liputan',
      count: stats.berita,
      icon: Newspaper,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      link: '/admin/berita',
      label: 'Kelola Berita',
    },
    {
      title: 'Agenda Kegiatan',
      count: stats.kegiatan,
      icon: Calendar,
      color: 'bg-amber-500/10 text-amber-600 border-amber-200',
      link: '/admin/kegiatan',
      label: 'Kelola Agenda',
    },
    {
      title: 'Program Kerja',
      count: stats.proker,
      icon: ClipboardList,
      color: 'bg-purple-500/10 text-purple-600 border-purple-200',
      link: '/admin/program-kerja',
      label: 'Kelola Proker',
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8 font-body">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary to-[#163359] p-6 rounded-2xl sm:rounded-3xl text-cream border border-gold/30 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-cream">
            Selamat Datang, Admin KKM 61
          </h1>
          <p className="text-xs text-cream/80">
            Kelola seluruh data publikasi, struktur anggota, dan laporan kegiatan dari satu panel.
          </p>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-primary font-display">
                  {loading ? '...' : card.count}
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Data terdaftar di sistem</p>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Link
                  to={card.link}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-gold transition-colors"
                >
                  <span>{card.label}</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* INFORMASI SIKLUS & PANDUAN CEPAT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANDUAN KELOLA DATA */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3 text-primary font-bold text-base">
            <Activity className="text-gold" size={18} />
            <h2>Status & Aksi Cepat Dashboard</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-gray-600">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-primary block font-semibold">Pengelolaan Anggota</strong>
                Pastikan seluruh anggota kelompok terdaftar beserta foto dan nomor urut jabatannya.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-primary block font-semibold">Publikasi Berita</strong>
                Tambahkan foto liputan kegiatan agar artikel di halaman depan tampil lebih menarik.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <Clock className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div>
                <strong className="text-primary block font-semibold">Pembaruan Program Kerja</strong>
                Perbarui status ketercapaian proker secara berkala untuk laporan pertanggungjawaban.
              </div>
            </div>
          </div>
        </div>

        {/* PROFIL SERVER & AKUN */}
        <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-primary text-cream p-6 rounded-2xl sm:rounded-3xl border border-gold/20 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="inline-block bg-gold/20 text-gold text-[10px] font-bold px-2.5 py-1 rounded-lg border border-gold/30">
              INFORMASI AKUN
            </span>
            <h3 className="text-lg font-bold text-cream font-display">Administrator KKM 61</h3>
            <p className="text-xs text-cream/70 leading-relaxed">
              Anda terhubung menggunakan hak akses penuh. Seluruh perubahan data akan langsung berdampak pada tampilan website publik.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gold">
            <span>Status Koneksi API:</span>
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Terhubung (Laravel)
            </span>
          </div>
        </div>

      </div>

    </div>
  )
}