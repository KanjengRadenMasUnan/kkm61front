import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../config'
import { Loader2, Award, ShieldCheck, Users, Sparkles, GraduationCap, UserCheck, HeartHandshake } from 'lucide-react'

export default function Anggota() {
  const [anggota, setAnggota] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/anggota`)
      .then((res) => res.json())
      .then((data) => {
        setAnggota(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching anggota:', err)
        setAnggota([])
        setLoading(false)
      })
  }, [])

  const dpl = anggota.find((a) => Number(a.urutan) === 1)
  const ketuaWakil = anggota.filter((a) => Number(a.urutan) === 2 || Number(a.urutan) === 3)
  const anggotaBiasa = anggota
    .filter((a) => Number(a.urutan) >= 4)
    .sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0))

  const CardAnggota = ({ item, isLeader = false, isDpl = false }) => (
    <div className={`group relative bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col items-center p-4 sm:p-5 text-center shadow-md hover:shadow-2xl hover:-translate-y-1.5 ${
      isDpl 
        ? 'border-gold shadow-gold/20 ring-2 ring-gold/40' 
        : isLeader 
        ? 'border-primary/40 ring-1 ring-primary/20 hover:border-gold' 
        : 'border-gold/20 hover:border-gold/60'
    }`}>
      {/* Background Accent Lines inside Card */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none group-hover:bg-gold/20 transition-colors" />

      {/* Badge Nomor Posisi */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-primary text-gold text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gold/40 shadow-md">
        <span>#{item?.urutan}</span>
      </div>

      {/* Frame Foto Profile */}
      <div className="w-full aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-primary/10 via-gold/5 to-primary/10 border border-gold/30 relative shadow-inner group-hover:shadow-lg transition-all duration-300">
        {item?.foto ? (
          <img
            src={item.foto}
            alt={item.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        <div
          className="w-full h-full bg-gradient-to-br from-primary via-[#163359] to-primary flex flex-col items-center justify-center text-gold font-bold text-3xl sm:text-5xl"
          style={{ display: item?.foto ? 'none' : 'flex' }}
        >
          {item?.nama ? item.nama.charAt(0) : 'A'}
        </div>
      </div>

      {/* Detail Informasi */}
      <div className="mt-4 space-y-1.5 w-full relative z-10">
        <h3 className={`font-bold text-primary group-hover:text-gold transition-colors leading-tight line-clamp-1 ${
          isDpl ? 'text-base sm:text-lg' : isLeader ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
        }`}>
          {item?.nama}
        </h3>
        
        <p className="text-[11px] sm:text-xs text-gray-500 flex items-center justify-center gap-1">
          <GraduationCap size={13} className="text-gold shrink-0" />
          <span>{item?.nim}</span>
        </p>

        <div className="pt-2">
          <span className={`inline-block px-3.5 py-1 text-[10px] sm:text-xs font-bold rounded-full border shadow-xs ${
            isDpl 
              ? 'bg-gold text-primary border-gold shadow-gold/20' 
              : isLeader 
              ? 'bg-primary text-gold border-gold/30' 
              : 'bg-gold/10 text-gold border-gold/30'
          }`}>
            {item?.peran}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in space-y-10 sm:space-y-14 pb-16 max-w-7xl mx-auto px-2 sm:px-4 font-body">
      
      {/* HEADER HERO SECTION DENGAN CARD RINGKASAN */}
      <div className="relative bg-gradient-to-b from-white/90 to-cream/80 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-md text-center space-y-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10" />
        
        <div className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-1.5 rounded-full border border-gold/30 text-xs font-bold tracking-wider uppercase shadow-xs">
          <Sparkles size={14} />
          <span>Struktur Organisasi Tim</span>
        </div>

        <div className="max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight">
            Tim Pengabdian KKM 61
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Sinergi dan kolaborasi mahasiswa Universitas Bina Bangsa dalam pengabdian masyarakat desa.
          </p>
        </div>

        {/* RINGKASAN STATISTIK */}
        {!loading && anggota.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto pt-2">
            <div className="bg-white/80 p-3 rounded-2xl border border-gold/20 shadow-xs flex flex-col items-center">
              <UserCheck size={18} className="text-gold mb-1" />
              <span className="text-lg font-bold text-primary">{anggota.length}</span>
              <span className="text-[10px] text-gray-500 font-medium">Total Anggota</span>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-gold/20 shadow-xs flex flex-col items-center">
              <Award size={18} className="text-gold mb-1" />
              <span className="text-lg font-bold text-primary">{dpl ? 1 : 0}</span>
              <span className="text-[10px] text-gray-500 font-medium">DPL</span>
            </div>
            <div className="bg-white/80 p-3 rounded-2xl border border-gold/20 shadow-xs flex flex-col items-center col-span-2 sm:col-span-1">
              <HeartHandshake size={18} className="text-gold mb-1" />
              <span className="text-lg font-bold text-primary">{anggotaBiasa.length}</span>
              <span className="text-[10px] text-gray-500 font-medium">Anggota Divisi</span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gold bg-white/50 rounded-3xl border border-dashed border-gold/30">
          <Loader2 className="w-9 h-9 animate-spin mb-3 text-gold" />
          <p className="font-semibold text-xs sm:text-sm text-primary">Memuat struktur tim...</p>
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16">

          {/* DPL */}
          {dpl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-gold font-bold text-xs uppercase tracking-widest bg-gold/15 px-4 py-1.5 rounded-full w-max mx-auto border border-gold/30 shadow-xs">
                <Award size={16} />
                <span>Dosen Pembimbing Lapangan</span>
              </div>
              <div className="max-w-[240px] sm:max-w-[280px] mx-auto">
                <CardAnggota item={dpl} isLeader={true} isDpl={true} />
              </div>
            </div>
          )}

          {/* KETUA & WAKIL KETUA */}
          {ketuaWakil.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-gold font-bold text-xs uppercase tracking-widest bg-gold/15 px-4 py-1.5 rounded-full w-max mx-auto border border-gold/30 shadow-xs">
                <ShieldCheck size={16} />
                <span>Pimpinan Kelompok</span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-8 max-w-2xl mx-auto">
                {ketuaWakil.map((pimpinan) => (
                  <div key={pimpinan.id} className="w-full sm:w-[260px]">
                    <CardAnggota item={pimpinan} isLeader={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANGGOTA TIM & DIVISI */}
          {anggotaBiasa.length > 0 && (
            <div className="space-y-6 pt-8 border-t border-gold/20">
              <div className="flex items-center justify-center gap-2 text-gold font-bold text-xs uppercase tracking-widest bg-gold/15 px-4 py-1.5 rounded-full w-max mx-auto border border-gold/30 shadow-xs">
                <Users size={16} />
                <span>Anggota Tim Pengabdian</span>
              </div>

              {/* GRID 4 KOLOM RESPONSIVE */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {anggotaBiasa.map((item) => (
                  <CardAnggota key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}