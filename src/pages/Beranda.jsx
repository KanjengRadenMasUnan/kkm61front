import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '../config'
import { 
  Users, 
  Target, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Newspaper,
  BookOpen,
  HeartPulse,
  Store,
  Trees,
  Building2
} from 'lucide-react'
import logoKkm from '../assets/logo-kkm.png'

export default function Beranda() {
  const [beritaHighlight, setBeritaHighlight] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Menggunakan API_BASE_URL dinamis dari config.js
    fetch(`${API_BASE_URL}/berita`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data berita')
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setBeritaHighlight(list.slice(0, 5))
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setBeritaHighlight([]) // Mencegah crash jika API 500
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (beritaHighlight.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % beritaHighlight.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [beritaHighlight])

  const nextSlide = () => {
    if (beritaHighlight.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % beritaHighlight.length)
  }

  const prevSlide = () => {
    if (beritaHighlight.length === 0) return
    setCurrentSlide((prev) => (prev - 1 + beritaHighlight.length) % beritaHighlight.length)
  }

  return (
    <div className="space-y-10 sm:space-y-14 font-body pb-6 animate-fade-in-up max-w-7xl mx-auto">
      
      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-primary via-[#163359] to-primary text-cream p-6 sm:p-12 rounded-3xl border border-gold/30 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 bg-gold/20 text-gold font-bold px-3 py-1 rounded-full text-xs border border-gold/30">
              <Award size={14} />
              <span>KKM Tematik Universitas Bina Bangsa 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-display leading-tight text-cream">
              KKM Kelompok 61 <br />
              <span className="text-gold">Waringinkurung</span>
            </h1>

            <p className="text-xs sm:text-base text-cream/80 leading-relaxed max-w-2xl">
              Kami adalah tim mahasiswa lintas disiplin ilmu dari Universitas Bina Bangsa yang berkomitmen untuk mengabdi, berinovasi, dan memberdayakan masyarakat melalui aksi nyata di bidang pendidikan, ekonomi UMKM, kesehatan, dan lingkungan.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link
                to="/anggota"
                className="bg-gold text-primary font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-cream transition-all shadow-md flex items-center gap-2"
              >
                <Users size={16} />
                <span>Profil Anggota Tim</span>
              </Link>
              <Link
                to="/program-kerja"
                className="bg-white/10 hover:bg-white/20 text-cream font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-gold/30 transition-all flex items-center gap-2"
              >
                <Target size={16} />
                <span>Lihat Program Kerja</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-40 h-40 sm:w-56 sm:h-56 bg-white/10 rounded-3xl p-4 sm:p-6 border border-gold/30 backdrop-blur-md shadow-2xl flex items-center justify-center">
              <img src={logoKkm} alt="Logo KKM 61" className="w-full h-full object-contain drop-shadow-md" />
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL BERITA PILIHAN */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-gold/20 pb-3">
          <div className="flex items-center gap-2 text-primary font-bold text-base sm:text-xl">
            <Newspaper className="text-gold" size={22} />
            <h2>Sorotan Berita & Informasi Pilihan</h2>
          </div>
          <Link
            to="/berita"
            className="text-xs font-bold text-primary hover:text-gold flex items-center gap-1 transition-colors"
          >
            <span>Lihat Semua Berita</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="h-64 sm:h-96 rounded-3xl bg-gray-100 flex items-center justify-center text-xs text-gray-400">
            Memuat slide berita...
          </div>
        ) : beritaHighlight.length === 0 ? (
          <div className="h-48 rounded-3xl bg-white border border-gray-100 flex items-center justify-center text-xs text-gray-500">
            Belum ada berita unggulan yang ditampilkan.
          </div>
        ) : (
          <div className="relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden border border-gold/30 shadow-lg group">
            {beritaHighlight[currentSlide]?.gambar ? (
              <img
                src={beritaHighlight[currentSlide].gambar}
                alt={beritaHighlight[currentSlide].judul}
                className="w-full h-full object-cover transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary to-[#163359]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

            <div className="absolute bottom-0 inset-x-0 p-5 sm:p-10 space-y-2 sm:space-y-3 z-10">
              <span className="bg-gold text-primary text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {beritaHighlight[currentSlide]?.kategori || 'Highlight KKM'}
              </span>

              <h3 className="font-display font-bold text-cream text-lg sm:text-3xl leading-snug line-clamp-2">
                {beritaHighlight[currentSlide]?.judul}
              </h3>

              <p className="text-xs sm:text-sm text-cream/80 line-clamp-2 max-w-3xl font-body">
                {beritaHighlight[currentSlide]?.ringkasan}
              </p>

              <div className="pt-2">
                <Link
                  to={`/berita/${beritaHighlight[currentSlide]?.slug || beritaHighlight[currentSlide]?.id}`}
                  className="inline-flex items-center gap-2 bg-gold text-primary text-xs font-bold px-4 py-2 rounded-xl hover:bg-cream transition-colors"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-gold hover:text-primary text-cream rounded-full flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              title="Slide Sebelumnya"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-gold hover:text-primary text-cream rounded-full flex items-center justify-center transition-all z-20 backdrop-blur-sm"
              title="Slide Selanjutnya"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 right-5 flex gap-1.5 z-20">
              {beritaHighlight.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === idx ? 'bg-gold w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* PILAR PENGABDIAN (5 PILAR UTAMA) */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="font-bold text-lg sm:text-2xl text-primary">5 Pilar Utama Pengabdian</h2>
          <p className="text-xs text-gray-500">Fokus program kerja utama KKM Kelompok 61</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-gold/20 text-primary rounded-xl flex items-center justify-center mx-auto font-bold">
              <BookOpen size={20} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-primary">1. Pendidikan & Karakter</h4>
            <p className="text-[11px] text-gray-500">Pendidikan, keagamaan dan penguatan karakter masyarakat.</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-gold/20 text-primary rounded-xl flex items-center justify-center mx-auto font-bold">
              <Store size={20} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-primary">2. Ekonomi & UMKM</h4>
            <p className="text-[11px] text-gray-500">Pemberdayaan ekonomi masyarakat, umkm, koperasi dan ekonomi kreatif.</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-gold/20 text-primary rounded-xl flex items-center justify-center mx-auto font-bold">
              <Users size={20} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-primary">3. Sosial & Hukum</h4>
            <p className="text-[11px] text-gray-500">Sosial, hukum, dan pemberdayaan masyarakat.</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 shadow-sm text-center space-y-2">
            <div className="w-10 h-10 bg-gold/20 text-primary rounded-xl flex items-center justify-center mx-auto font-bold">
              <HeartPulse size={20} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-primary">4. Lingkungan & Kesehatan</h4>
            <p className="text-[11px] text-gray-500">Lingkungan hidup, ketahanan pangan, dan Kesehatan masyarakat.</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gold/20 shadow-sm text-center space-y-2 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 bg-gold/20 text-primary rounded-xl flex items-center justify-center mx-auto font-bold">
              <Building2 size={20} />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-primary">5. Tata Kelola & Inovasi</h4>
            <p className="text-[11px] text-gray-500">Tata Kelola pemerintah desa/kelurahan, pelayanan public dan inovasi teknologi.</p>
          </div>
        </div>
      </section>

    </div>
  )
}