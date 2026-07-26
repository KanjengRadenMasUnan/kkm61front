import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config'
import { Calendar, ArrowRight, Flame, Megaphone, TrendingUp, Filter, Layers, Search, ChevronRight } from 'lucide-react'
import logoKkm from '../assets/logo-kkm.png'

let cachedBeritaData = null

export default function Berita() {
  const [berita, setBerita] = useState(cachedBeritaData || [])
  const [loading, setLoading] = useState(!cachedBeritaData)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')

  const getSecureImageUrl = (url) => {
    if (!url) return 'https://kkm61waringinkurungnews.my.id/logo-kkm.png'

    let cleanUrl = url

    if (cleanUrl.includes('localhost:8000') || cleanUrl.includes('127.0.0.1:8000')) {
      const cleanPath = cleanUrl.replace(/^https?:\/\/[^\/]+/, '')
      const backendDomain = API_BASE_URL.replace(/\/api$/, '')
      cleanUrl = `${backendDomain}${cleanPath}`
    }

    if (cleanUrl.startsWith('http://')) {
      cleanUrl = cleanUrl.replace('http://', 'https://')
    } else if (cleanUrl.startsWith('/')) {
      const backendDomain = API_BASE_URL.replace(/\/api$/, '')
      cleanUrl = `${backendDomain}${cleanUrl}`.replace('http://', 'https://')
    }

    if (cleanUrl.includes('cloudinary.com') && cleanUrl.includes('/upload/') && !cleanUrl.includes('/f_auto,q_auto/')) {
      cleanUrl = cleanUrl.replace('/upload/', '/upload/f_auto,q_auto/')
    }

    return cleanUrl
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })

    if (!cachedBeritaData) {
      setLoading(true)
    }

    fetch(`${API_BASE_URL}/berita`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil data dari server')
        return res.json()
      })
      .then((data) => {
        const result = Array.isArray(data) ? data : []
        cachedBeritaData = result
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
  }, [])

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
    <div className="space-y-4 sm:space-y-8 pb-12 font-body max-w-7xl mx-auto min-h-screen px-3 sm:px-6 lg:px-8">
      
      {/* 1. RUNNING TEXT TICKER (MINIMALIS DI HP) */}
      <div className="bg-primary text-cream rounded-xl sm:rounded-2xl p-2 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 border border-gold/30 shadow-sm overflow-hidden text-xs">
        <div className="flex items-center gap-1 bg-gold text-primary font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl shrink-0 uppercase tracking-wider text-[9px] sm:text-[10px]">
          <Megaphone size={11} />
          <span>Terkini</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full">
          <div className="inline-block animate-marquee font-medium text-cream/90 text-[11px] sm:text-xs">
            {listBerita.length > 0 ? (
              listBerita.map((b) => `• ${b.judul} (${b.tanggal}) `).join('    ')
            ) : (
              'Portal Liputan & Kabar Pengabdian KKM Kelompok 61 Universitas Bina Bangsa'
            )}
          </div>
        </div>
      </div>

      {/* 2. HEADLINE NEWS GRID */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-lg border-b-2 border-gold/40 pb-1.5 sm:pb-2">
          <Flame className="text-gold shrink-0" size={18} />
          <h2>Berita Utama Hari Ini</h2>
        </div>

        {loading && listBerita.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 animate-pulse">
            <div className="lg:col-span-7 h-[220px] sm:h-[420px] bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
            <div className="hidden sm:flex lg:col-span-5 flex-col gap-4">
              <div className="h-[150px] sm:h-[200px] bg-gray-200 rounded-3xl"></div>
              <div className="h-[150px] sm:h-[200px] bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        ) : listBerita.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
            
            {/* BERITA UTAMA BESAR (ANDROID COMPACT / PC FULL) */}
            {beritaUtama && (
              <div className="lg:col-span-7">
                <Link
                  to={`/berita/${beritaUtama.slug || beritaUtama.id}`}
                  className="group relative h-[240px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-gold/30 shadow-md sm:shadow-lg flex flex-col justify-end p-3.5 sm:p-6 transition-all duration-300 block"
                >
                  {beritaUtama.gambar ? (
                    <img
                      src={getSecureImageUrl(beritaUtama.gambar)}
                      alt={beritaUtama.judul}
                      loading="eager"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#163359] to-primary" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />

                  <div className="relative z-10 space-y-1 sm:space-y-2">
                    <span className="inline-flex items-center gap-1 bg-gold text-primary text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md uppercase">
                      <Calendar size={9} />
                      {beritaUtama.tanggal}
                    </span>

                    <h1 className="font-bold text-cream text-base sm:text-2xl leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {beritaUtama.judul}
                    </h1>

                    {/* Ringkasan Disembunyikan di Android agar hemat ruang */}
                    <p className="hidden sm:block text-xs sm:text-sm text-cream/80 line-clamp-2 leading-relaxed">
                      {beritaUtama.ringkasan}
                    </p>

                    <div className="pt-0.5 sm:pt-2 flex items-center gap-1 text-gold text-[11px] sm:text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* SUB-HEADLINE BERITA (DI TAMPILAN PC SAJA, DI ANDROID DISEMBUNYIKAN AGAR TIDAK ANIK/PENUH) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col justify-between gap-4">
              {beritaSamping.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.slug || item.id}`}
                  className="group relative flex-1 min-h-[180px] rounded-3xl overflow-hidden border border-gold/30 shadow-md flex flex-col justify-end p-5 transition-all duration-300 block"
                >
                  {item.gambar ? (
                    <img
                      src={getSecureImageUrl(item.gambar)}
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

                    <h3 className="font-bold text-cream text-base leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {item.judul}
                    </h3>

                    <p className="text-[11px] text-cream/80 line-clamp-1">
                      {item.ringkasan}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. SEARCH & KATEGORI FILTER BAR (MINIMALIS MOBIL FEED) */}
      <section className="bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gold/20 shadow-xs flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg sm:rounded-xl text-xs focus:outline-none focus:border-gold bg-gray-50/50 sm:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-0.5 sm:pb-0">
          <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-primary px-2 border-r border-gold/20 shrink-0">
            <Filter size={13} className="text-gold" />
            <span>Kategori:</span>
          </div>
          <div className="flex gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-gold shadow-xs font-bold'
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        
        {/* KOLOM UTAMA DAFTAR BERITA */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-6">
          <div className="flex justify-between items-center border-b border-gold/20 pb-1.5 sm:pb-3">
            <h3 className="font-bold text-primary text-sm sm:text-xl flex items-center gap-1.5 sm:gap-2">
              <Layers size={16} className="text-gold" />
              <span>Arsip Berita & Liputan</span>
            </h3>
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">{beritaFiltered.length} Artikel</span>
          </div>

          {loading && listBerita.length === 0 ? (
            <div className="space-y-3 sm:space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-24 sm:h-32 bg-gray-200 rounded-2xl sm:rounded-3xl"></div>
              ))}
            </div>
          ) : beritaFiltered.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gold/20 text-center text-gray-500 text-xs sm:text-sm">
              Tidak ditemukan berita pada kategori / pencarian ini.
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-4">
              {beritaFiltered.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.slug || item.id}`}
                  className="group bg-white p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl border border-gray-100 sm:border-gold/20 hover:border-gold shadow-xs sm:shadow-sm hover:shadow-md transition-all flex flex-row gap-3 items-center"
                >
                  {/* GAMBAR MINI KECIL DI HP */}
                  {item.gambar ? (
                    <div className="w-24 h-20 sm:w-44 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border border-gray-100 sm:border-gold/10">
                      <img 
                        src={getSecureImageUrl(item.gambar)} 
                        alt={item.judul} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-20 sm:w-44 sm:h-32 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px] sm:text-xs shrink-0">
                      KKM 61
                    </div>
                  )}

                  <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-gold font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {item.tanggal}
                      </span>
                      <span className="bg-gold/10 text-primary px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] uppercase tracking-wide border border-gold/20 sm:hidden">
                        {item.kategori || 'Berita'}
                      </span>
                    </div>

                    <h4 className="font-bold text-primary text-xs sm:text-lg group-hover:text-gold transition-colors leading-snug line-clamp-2">
                      {item.judul}
                    </h4>

                    {/* Ringkasan disembunyikan di HP agar kartu tipis & rapi */}
                    <p className="hidden sm:block text-xs text-ink/70 line-clamp-2 leading-relaxed">
                      {item.ringkasan}
                    </p>

                    <div className="pt-0.5 hidden sm:flex items-center gap-1 text-primary text-xs font-bold group-hover:text-gold transition-colors">
                      <span>Selengkapnya</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* SIDEBAR PORTAL BERITA (TAMPIL DI PC, TETAP RAPI) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* WIDGET TERPOPULER */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gold/20 shadow-xs sm:shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 border-b pb-2.5 sm:pb-3 border-gold/20 text-primary font-bold text-xs sm:text-base">
              <TrendingUp className="text-gold" size={16} />
              <h3>Terpopuler & Trending</h3>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              {beritaPopuler.map((pop, idx) => (
                <Link
                  key={pop.id}
                  to={`/berita/${pop.slug || pop.id}`}
                  className="flex items-start gap-2.5 sm:gap-3 group border-b border-gray-100 pb-2 sm:pb-2.5 last:border-none last:pb-0"
                >
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gold/20 text-primary font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="font-semibold text-primary text-xs group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                      {pop.judul}
                    </h5>
                    <span className="text-[9px] sm:text-[10px] text-gray-400 block mt-0.5">{pop.tanggal}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* WIDGET PROFIL KELOMPOK (DISEMBUNYIKAN DI MOBILE UNTUK MEMINIMALISIR HALAMAN) */}
          <div className="hidden sm:block bg-gradient-to-br from-primary via-[#163359] to-primary text-cream p-5 sm:p-6 rounded-3xl border border-gold/30 shadow-md space-y-3 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl p-2 flex items-center justify-center mx-auto border border-gold/30 backdrop-blur-sm">
              <img src={logoKkm} alt="Logo KKM 61" className="w-full h-full object-contain" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-cream">KKM Kelompok 61</h4>
            <p className="text-xs text-cream/80 leading-relaxed">
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