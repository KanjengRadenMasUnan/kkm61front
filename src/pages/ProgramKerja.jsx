import { Link } from 'react-router-dom'
import { Clock, ArrowLeft, ShieldAlert } from 'lucide-react'
import logoKkm from '../assets/logo-kkm.png'

// Ekspor data dummy agar file AdminProker dan DetailBidangProker tidak error saat impor
export const DAFTAR_BIDANG = []

export default function ProgramKerja() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center font-body p-4 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-primary via-[#163359] to-primary text-cream p-8 sm:p-16 rounded-3xl border border-gold/30 shadow-2xl text-center space-y-6 sm:space-y-8 relative overflow-hidden w-full">
        
        {/* ELEMENT HIASAN BACKDROP */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-gold/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* LOGO & BADGE KKM */}
        <div className="space-y-3 relative z-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-3xl p-3 border border-gold/30 backdrop-blur-md shadow-xl flex items-center justify-center mx-auto">
            <img src={logoKkm} alt="Logo KKM 61" className="w-full h-full object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold font-bold px-4 py-1.5 rounded-full text-xs border border-gold/30 uppercase tracking-wider">
            <ShieldAlert size={14} />
            <span>Dokumen Rahasia Internal KKM 61</span>
          </div>
        </div>

        {/* TEKS COMING SOON SANGAT BESAR */}
        <div className="space-y-2 relative z-10">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-gold uppercase drop-shadow-md">
            Coming Soon
          </h1>
          <p className="text-base sm:text-2xl font-bold text-cream tracking-wide">
            Program Kerja Sedang Dalam Finalisasi
          </p>
        </div>

        {/* DESKRIPSI SINGKAT */}
        <p className="text-xs sm:text-base text-cream/80 max-w-xl mx-auto leading-relaxed font-body relative z-10">
          Rangkaian agenda dan pilar kegiatan Kuliah Kerja Mahasiswa Kelompok 61 Universitas Bina Bangsa sedang diselaraskan bersama pihak Desa Waringinkurung.
        </p>

        {/* BADGE TIMELINE RELEASE */}
        <div className="pt-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-gold text-xs sm:text-sm font-semibold px-4 py-2 rounded-2xl border border-gold/20">
            <Clock size={16} />
            <span>Ditunggu Ya Kakakkk :)</span>
          </div>
        </div>

        {/* TOMBOL NAVIGASI KEMBALI */}
        <div className="pt-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gold text-primary font-bold text-xs sm:text-sm px-6 py-3 rounded-xl hover:bg-cream transition-all shadow-lg"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

      </div>
    </div>
  )
}