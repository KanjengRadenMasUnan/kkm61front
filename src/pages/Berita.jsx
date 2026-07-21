import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, Flame, Megaphone, TrendingUp, Filter, Layers, Search, ChevronRight } from 'lucide-react'
import logoKkm from '../assets/logo-kkm.png'

// Variabel memori cache sederhana di luar komponen agar tersimpan selama aplikasi berjalan
let cachedBeritaData = null

export default function Berita() {
  // Inisialisasi state langsung dari cache jika ada
  const [berita, setBerita] = useState(cachedBeritaData || [])
  const [loading, setLoading] = useState(!cachedBeritaData)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')

  const API_BASE_URL = `http://${window.location.hostname}:8000/api/berita`

  useEffect(() => {
    // Scroll ke atas dengan perilaku smooth/instan
    window.scrollTo({ top: 0, behavior: 'instant' })

    // Jika belum ada cache, aktifkan indikator loading
    if (!cachedBeritaData) {
      setLoading(true)
    }

    // Ambil data terbaru di background tanpa merusak UI yang sudah tampil
    fetch(API_BASE_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data dari server')
        return res.json()
      })
      .then((data) => {
        const result = Array.isArray(data) ? data : []
        cachedBeritaData = result // Simpan ke cache memori
        setBerita(result)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching berita:', err)
        if (!cachedBeritaData) {
          setBerita([])
        }
        setLoading(false)
      })
  }, [API_BASE_URL])

  const listBerita = Array.isArray(berita) ? berita : []
  const beritaUtama = listBerita[0]
  const beritaSamping = listBerita.slice(1, 3)
  const beritaPopuler = listBerita.slice(0, 5)

  const categories = ['Semua', 'Pendidikan', 'UMKM', 'Kesehatan', 'Lingkungan']

  const beritaFiltered = listBerita.filter((b) => {
    if (!b) return false
    const matchCat = activeCategory === 'Semua' || (b.kategori && b.kategori.toLowerCase() === activeCategory.toLowerCase())
    const matchSearch = (b.judul && b.judul.toLowerCase().includes(search.toLowerCase())) ||
                        (b.ringkasan && b.ringkasan.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  return (
    <div className="space-y-6 sm:space-y-8 pb-12 font-body max-w-7xl mx-auto min-h-screen">
      
      {/* 1. RUNNING TEXT TICKER */}
      <div className="bg-primary text-cream rounded-2xl p-2.5 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 border border-gold/30 shadow-md overflow-hidden text-xs">
        <div className="flex items-center gap-1 bg-gold text-primary font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl shrink-0 uppercase tracking-wider text-[9px] sm:text-[10px]">
          <Megaphone size={12} />
          <span>Terkini</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee font-medium text-cream/90 text-xs">
            {listBerita.length > 0 ? (
              listBerita.map((b) => `• ${b.judul} (${b.tanggal}) `).join('   ')
            ) : (
              'Portal Liputan & Kabar Pengabdian KKM Kelompok 61 Universitas Bina Bangsa'
            )}
          </div>
        </div>
      </div>

      {/* 2. HEADLINE NEWS GRID */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-lg border-b-2 border-gold/40 pb-2">
          <Flame className="text-gold shrink-0" size={20} />
          <h2>Berita Utama Hari Ini</h2>
        </div>

        {loading && listBerita.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 animate-pulse">
            <div className="lg:col-span-7 h-[320px] sm:h-[420px] bg-gray-200 rounded-3xl"></div>
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="h-[150px] sm:h-[200px] bg-gray-200 rounded-3xl"></div>
              <div className="h-[150px] sm:h-[200px] bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        ) : listBerita.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            {/* BERITA UTAMA BESAR */}
            {beritaUtama && (
              <div className="lg:col-span-7">
                <Link
                  to={`/berita/${beritaUtama.id}`}
                  className="group relative h-[320px] sm:h-[420px] rounded-3xl overflow-hidden border border-gold/30 shadow-lg flex flex-col justify-end p-4 sm:p-6 transition-all duration-300 block"
                >
                  {beritaUtama.gambar ? (
                    <img
                      src={beritaUtama.gambar}
                      alt={beritaUtama.judul}
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#163359] to-primary" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                  <div className="relative z-10 space-y-1.5 sm:space-y-2">
                    <span className="inline-flex items-center gap-1 bg-gold text-primary text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md font-body uppercase">
                      <Calendar size={10} />
                      {beritaUtama.tanggal}
                    </span>

                    <h1 className="font-body font-bold text-cream text-lg sm:text-2xl leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {beritaUtama.judul}
                    </h1>

                    <p className="text-xs sm:text-sm text-cream/80 font-body line-clamp-2 leading-relaxed">
                      {beritaUtama.ringkasan}
                    </p>

                    <div className="pt-1 sm:pt-2 flex items-center gap-1 text-gold text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* SUB-HEADLINE BERITA */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              {beritaSamping.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.id}`}
                  className="group relative flex-1 min-h-[160px] sm:min-h-[180px] rounded-3xl overflow-hidden border border-gold/30 shadow-md flex flex-col justify-end p-4 sm:p-5 transition-all duration-300 block"
                >
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#163359] to-primary" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />

                  <div className="relative z-10 space-y-1">
                    <span className="text-gold text-[10px] font-bold flex items-center gap-1">
                      <Calendar size={10} /> {item.tanggal}
                    </span>

                    <h3 className="font-body font-bold text-cream text-sm sm:text-base leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {item.judul}
                    </h3>

                    <p className="text-[10px] sm:text-[11px] text-cream/80 font-body line-clamp-1">
                      {item.ringkasan}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. SEARCH & KATEGORI FILTER BAR */}
      <section className="bg-white p-3 sm:p-4 rounded-2xl border border-gold/20 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kata kunci berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          <div className="flex items-center gap-1 text-xs font-bold text-primary px-2 border-r border-gold/20 shrink-0">
            <Filter size={13} className="text-gold" />
            <span>Kategori:</span>
          </div>
          <div className="flex gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-gold shadow-sm font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UTAMA & SIDEBAR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* KOLOM UTAMA DAFTAR BERITA */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <div className="flex justify-between items-center border-b-2 border-gold/20 pb-2 sm:pb-3">
            <h3 className="font-body font-bold text-primary text-base sm:text-xl flex items-center gap-2">
              <Layers size={18} className="text-gold" />
              <span>Arsip Berita & Liputan</span>
            </h3>
            <span className="text-[11px] sm:text-xs text-gray-500 font-medium">{beritaFiltered.length} Artikel</span>
          </div>

          {loading && listBerita.length === 0 ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          ) : beritaFiltered.length === 0 ? (
            <div className="bg-white p-6 rounded-3xl border border-gold/20 text-center text-gray-500 text-xs sm:text-sm">
              Tidak ditemukan berita pada kategori / pencarian ini.
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {beritaFiltered.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.id}`}
                  className="group bg-white p-3.5 sm:p-4 rounded-3xl border border-gold/20 hover:border-gold shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
                >
                  {item.gambar ? (
                    <div className="w-full sm:w-44 h-40 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-gold/10">
                      <img 
                        src={item.gambar} 
                        alt={item.judul} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ) : (
                    <div className="w-full sm:w-44 h-32 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      KKM 61
                    </div>
                  )}

                  <div className="space-y-1.5 sm:space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gold font-bold">
                      <Calendar size={11} />
                      <span>{item.tanggal}</span>
                    </div>

                    <h4 className="font-body font-bold text-primary text-base sm:text-lg group-hover:text-gold transition-colors leading-snug line-clamp-2">
                      {item.judul}
                    </h4>

                    <p className="text-xs text-ink/70 font-body line-clamp-2 leading-relaxed">
                      {item.ringkasan}
                    </p>

                    <div className="pt-1 flex items-center gap-1 text-primary text-xs font-bold group-hover:text-gold transition-colors">
                      <span>Selengkapnya</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR PORTAL BERITA */}
        <div className="lg:col-span-4 space-y-6">
          {/* WIDGET TERPOPULER */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold/20 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-gold/20 text-primary font-bold text-sm sm:text-base">
              <TrendingUp className="text-gold" size={18} />
              <h3>Terpopuler & Trending</h3>
            </div>

            <div className="space-y-3">
              {beritaPopuler.map((pop, idx) => (
                <Link
                  key={pop.id}
                  to={`/berita/${pop.id}`}
                  className="flex items-start gap-3 group border-b border-gray-100 pb-2.5 last:border-none last:pb-0"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-body font-semibold text-primary text-xs group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                      {pop.judul}
                    </h5>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{pop.tanggal}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* WIDGET PROFIL KELOMPOK */}
          <div className="bg-gradient-to-br from-primary via-[#163359] to-primary text-cream p-5 sm:p-6 rounded-3xl border border-gold/30 shadow-md space-y-3 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl p-2 flex items-center justify-center mx-auto border border-gold/30 backdrop-blur-sm">
              <img src={logoKkm} alt="Logo KKM 61" className="w-full h-full object-contain" />
            </div>
            <h4 className="font-body font-bold text-sm sm:text-base text-cream">KKM Kelompok 61</h4>
            <p className="text-xs text-cream/80 font-body leading-relaxed">
              Kuliah Kerja Mahasiswa Universitas Bina Bangsa. Mengabdi dengan aksi nyata di masyarakat.
            </p>
            <Link to="/anggota" className="inline-block mt-2 text-xs font-bold bg-gold text-primary px-4 py-2 rounded-xl hover:bg-cream transition-colors">
              Lihat Struktur Tim
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}