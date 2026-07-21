import { useState, useEffect } from 'react'
import { Loader2, Award, ShieldCheck, Users, Sparkles, GraduationCap } from 'lucide-react'

export default function Anggota() {
  const [anggota, setAnggota] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/anggota')
      .then((res) => res.json())
      .then((data) => {
        setAnggota(data)
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }, [])

  const dpl = anggota.find((a) => Number(a.urutan) === 1)
  const ketuaWakil = anggota.filter((a) => Number(a.urutan) === 2 || Number(a.urutan) === 3)
  
  const anggotaBiasa = anggota
    .filter((a) => Number(a.urutan) >= 4)
    .sort((a, b) => a.urutan - b.urutan)

  const baris1 = anggotaBiasa.slice(0, 4)
  const baris2 = anggotaBiasa.slice(4, 8)
  const baris3 = anggotaBiasa.slice(8, 11)
  const baris4 = anggotaBiasa.slice(11, 14)
  const baris5 = anggotaBiasa.slice(14, 16)

  const CardAnggota = ({ item, isLeader = false, isDpl = false }) => (
    <div className={`group relative bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col items-center p-3 sm:p-4 text-center shadow-sm hover:shadow-2xl hover:-translate-y-1 ${
      isDpl 
        ? 'border-gold shadow-gold/10 ring-1 ring-gold/30' 
        : isLeader 
        ? 'border-primary/30 hover:border-gold' 
        : 'border-gold/20 hover:border-gold/60'
    }`}>
      <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-primary text-gold text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gold/30 shadow-md">
        <span>#{item?.urutan}</span>
      </div>

      <div className="w-full max-w-[240px] aspect-[799/1265] rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-primary/5 to-gold/10 border border-gold/20 relative shadow-md group-hover:shadow-lg transition-all duration-300">
        {item?.foto ? (
          <img
            src={item.foto}
            alt={item.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        
        <div
          className="w-full h-full bg-gradient-to-br from-primary via-[#163359] to-primary flex flex-col items-center justify-center text-gold font-body font-semibold text-3xl sm:text-5xl"
          style={{ display: item?.foto ? 'none' : 'flex' }}
        >
          {item?.nama ? item.nama.charAt(0) : 'A'}
        </div>
      </div>

      <div className="mt-3 space-y-1 w-full">
        <h3 className={`font-body font-bold text-primary group-hover:text-gold transition-colors leading-tight line-clamp-1 ${
          isDpl ? 'text-base sm:text-xl' : isLeader ? 'text-sm sm:text-lg' : 'text-xs sm:text-base'
        }`}>
          {item?.nama}
        </h3>
        
        <p className="text-[10px] sm:text-xs text-ink/60 font-body flex items-center justify-center gap-1">
          <GraduationCap size={12} className="text-gold shrink-0" />
          <span>{item?.nim}</span>
        </p>

        <div className="pt-1.5">
          <span className={`inline-block px-2.5 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-full font-body border shadow-sm ${
            isDpl 
              ? 'bg-gold text-primary font-bold border-gold' 
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
    <div className="animate-fade-in-up space-y-8 sm:space-y-12 pb-12">
      
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-1.5 bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20 text-[11px] sm:text-xs font-semibold font-body">
          <Sparkles size={13} />
          <span>STRUKTUR ORGANISASI</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-body font-bold text-primary">
          Tim Pengabdian KKM 61
        </h1>
        <p className="text-ink/70 font-body text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
          Sinergi mahasiswa Universitas Bina Bangsa dalam pengabdian masyarakat desa.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gold">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="font-body font-medium text-xs sm:text-sm text-primary">Memuat struktur anggota...</p>
        </div>
      ) : (
        <div className="space-y-10 sm:space-y-16">

          {/* DPL */}
          {dpl && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-1.5 text-gold font-body font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full w-max mx-auto border border-gold/20">
                <Award size={14} />
                <span>Dosen Pembimbing Lapangan</span>
              </div>
              <div className="max-w-[200px] sm:max-w-[280px] mx-auto">
                <CardAnggota item={dpl} isLeader={true} isDpl={true} />
              </div>
            </div>
          )}

          {/* KETUA & WAKIL */}
          {ketuaWakil.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-1.5 text-gold font-body font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full w-max mx-auto border border-gold/20">
                <ShieldCheck size={14} />
                <span>Pimpinan Kelompok</span>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-8 max-w-2xl mx-auto">
                {ketuaWakil.map((pimpinan) => (
                  <div key={pimpinan.id} className="w-full sm:w-[260px]">
                    <CardAnggota item={pimpinan} isLeader={true} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANGGOTA BIASA */}
          <div className="space-y-6 sm:space-y-10 pt-6 sm:pt-10 border-t border-gold/20">
            <div className="flex items-center justify-center gap-1.5 text-gold font-body font-bold text-[10px] sm:text-xs uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full w-max mx-auto border border-gold/20">
              <Users size={14} />
              <span>Anggota Tim Pengabdian</span>
            </div>

            <div className="space-y-4 sm:space-y-8">
              {/* Formasi Grid 2 Kolom di HP, 4 Kolom di PC */}
              {baris1.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
                  {baris1.map((item) => <CardAnggota key={item.id} item={item} />)}
                </div>
              )}

              {baris2.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 max-w-6xl mx-auto">
                  {baris2.map((item) => <CardAnggota key={item.id} item={item} />)}
                </div>
              )}

              {baris3.length > 0 && (
                <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-6 max-w-5xl mx-auto">
                  {baris3.map((item) => (
                    <div key={item.id} className="w-full sm:w-[250px]">
                      <CardAnggota item={item} />
                    </div>
                  ))}
                </div>
              )}

              {baris4.length > 0 && (
                <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-6 max-w-5xl mx-auto">
                  {baris4.map((item) => (
                    <div key={item.id} className="w-full sm:w-[250px]">
                      <CardAnggota item={item} />
                    </div>
                  ))}
                </div>
              )}

              {baris5.length > 0 && (
                <div className="grid grid-cols-2 sm:flex sm:justify-center gap-3 sm:gap-6 max-w-3xl mx-auto">
                  {baris5.map((item) => (
                    <div key={item.id} className="w-full sm:w-[250px]">
                      <CardAnggota item={item} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}