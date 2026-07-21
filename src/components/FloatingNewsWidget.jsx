import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, X, ArrowRight, Newspaper } from 'lucide-react'

export default function FloatingNewsWidget() {
  const [berita, setBerita] = useState([])
  const [closedLeft, setClosedLeft] = useState(false)
  const [closedRight, setClosedRight] = useState(false)
  const location = useLocation()

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/berita')
      .then((res) => res.json())
      .then((data) => setBerita(data))
      .catch((err) => console.error(err))
  }, [])

  // Sembunyikan di halaman admin
  if (location.pathname.startsWith('/admin')) {
    return null
  }

  const beritaKiri = berita[0]  // Berita terbaru 1
  const beritaKanan = berita[1] // Berita terbaru 2

  return (
    <>
      {/* WIDGET FLOATING POJOK KIRI */}
      {beritaKiri && !closedLeft && (
        <div className="fixed left-4 bottom-6 z-40 hidden xl:block w-64 group animate-fade-in-up">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-gold/30 shadow-2xl p-3 space-y-2 hover:border-gold transition-all duration-300">
            {/* Tombol Tutup */}
            <button
              onClick={() => setClosedLeft(true)}
              className="absolute -top-2 -right-2 bg-primary text-gold p-1 rounded-full border border-gold/40 shadow-md hover:scale-110 transition-transform"
              title="Tutup Widget"
            >
              <X size={12} />
            </button>

            {/* Label Header */}
            <div className="flex items-center gap-1.5 text-gold text-[10px] font-bold font-body uppercase tracking-wider">
              <Newspaper size={12} />
              <span>Berita Terbaru</span>
            </div>

            {/* Gambar Mini Berita */}
            {beritaKiri.gambar && (
              <div className="h-28 rounded-xl overflow-hidden border border-gold/20 relative">
                <img src={beritaKiri.gambar} alt={beritaKiri.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-primary/80 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border border-gold/30 flex items-center gap-1">
                  <Calendar size={10} /> {beritaKiri.tanggal}
                </div>
              </div>
            )}

            {/* Judul & Teks Singkat */}
            <div className="space-y-1">
              <h4 className="font-body font-bold text-primary text-xs line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                {beritaKiri.judul}
              </h4>
              <p className="text-[10px] text-ink/70 font-body line-clamp-2 leading-tight">
                {beritaKiri.ringkasan}
              </p>
            </div>

            {/* Tombol Buka */}
            <Link
              to={`/berita/${beritaKiri.id}`}
              className="mt-1 flex items-center justify-between text-primary font-bold text-[11px] pt-1 border-t border-gold/10 hover:text-gold transition-colors"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}

      {/* WIDGET FLOATING POJOK KANAN */}
      {beritaKanan && !closedRight && (
        <div className="fixed right-4 bottom-6 z-40 hidden xl:block w-64 group animate-fade-in-up">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-gold/30 shadow-2xl p-3 space-y-2 hover:border-gold transition-all duration-300">
            {/* Tombol Tutup */}
            <button
              onClick={() => setClosedRight(true)}
              className="absolute -top-2 -right-2 bg-primary text-gold p-1 rounded-full border border-gold/40 shadow-md hover:scale-110 transition-transform"
              title="Tutup Widget"
            >
              <X size={12} />
            </button>

            {/* Label Header */}
            <div className="flex items-center gap-1.5 text-gold text-[10px] font-bold font-body uppercase tracking-wider">
              <Newspaper size={12} />
              <span>Sorotan Kegiatan</span>
            </div>

            {/* Gambar Mini Berita */}
            {beritaKanan.gambar && (
              <div className="h-28 rounded-xl overflow-hidden border border-gold/20 relative">
                <img src={beritaKanan.gambar} alt={beritaKanan.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-primary/80 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border border-gold/30 flex items-center gap-1">
                  <Calendar size={10} /> {beritaKanan.tanggal}
                </div>
              </div>
            )}

            {/* Judul & Teks Singkat */}
            <div className="space-y-1">
              <h4 className="font-body font-bold text-primary text-xs line-clamp-2 leading-snug group-hover:text-gold transition-colors">
                {beritaKanan.judul}
              </h4>
              <p className="text-[10px] text-ink/70 font-body line-clamp-2 leading-tight">
                {beritaKanan.ringkasan}
              </p>
            </div>

            {/* Tombol Buka */}
            <Link
              to={`/berita/${beritaKanan.id}`}
              className="mt-1 flex items-center justify-between text-primary font-bold text-[11px] pt-1 border-t border-gold/10 hover:text-gold transition-colors"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}