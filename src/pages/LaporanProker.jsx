import { useState, useEffect } from 'react'
import { Loader2, FileSpreadsheet, CheckCircle2, Clock, CalendarDays } from 'lucide-react'

export default function LaporanProker() {
  const [proker, setProker] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/program-kerja')
      .then((res) => res.json())
      .then((data) => {
        setProker(data)
        setLoading(false)
      })
      .catch((err) => console.error(err))
  }, [])

  const totalSelesai = proker.filter(p => p.status === 'Selesai').length
  const totalBerjalan = proker.filter(p => p.status === 'Sedang Berjalan').length
  const totalRencana = proker.filter(p => p.status === 'Rencana').length

  return (
    <div className="animate-fade-in-up space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 bg-gold/10 px-4 py-1.5 rounded-full text-gold font-bold text-xs uppercase tracking-widest font-body">
          <FileSpreadsheet size={16} /> Laporan Resmi KKM 61
        </div>
        <h1 className="text-4xl font-display font-extrabold text-primary">Rekapitulasi Hasil Program Kerja</h1>
        <p className="text-ink/70 font-body">Monitoring kemajuan dan hasil pelaksanaan di lapangan secara real-time.</p>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-green-200 shadow-sm text-center">
          <CheckCircle2 size={32} className="mx-auto text-green-600 mb-2" />
          <span className="block text-3xl font-display font-bold text-primary">{totalSelesai}</span>
          <span className="text-xs font-body font-bold text-ink/60 uppercase">Program Selesai</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm text-center">
          <Clock size={32} className="mx-auto text-amber-500 mb-2" />
          <span className="block text-3xl font-display font-bold text-primary">{totalBerjalan}</span>
          <span className="text-xs font-body font-bold text-ink/60 uppercase">Sedang Berjalan</span>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm text-center">
          <CalendarDays size={32} className="mx-auto text-blue-500 mb-2" />
          <span className="block text-3xl font-display font-bold text-primary">{totalRencana}</span>
          <span className="text-xs font-body font-bold text-ink/60 uppercase">Tahap Rencana</span>
        </div>
      </div>

      {/* Tabel Laporan LENGKAP */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gold">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-body font-medium text-primary">Menyusun lembar laporan...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gold/20 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body border-collapse">
              <thead>
                <tr className="bg-primary text-cream text-xs uppercase tracking-wider">
                  <th className="p-4">No</th>
                  <th className="p-4">Bidang Fokus</th>
                  <th className="p-4">Program Kerja</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Laporan / Hasil Lapangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {proker.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-cream/20 transition-colors">
                    <td className="p-4 font-bold text-primary">{idx + 1}</td>
                    <td className="p-4 font-bold text-xs uppercase text-wood max-w-xs">{item.bidang}</td>
                    <td className="p-4 font-medium text-primary">{item.program}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-bold border bg-gold/10 text-gold border-gold/20">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-primary whitespace-nowrap">{item.progress}%</td>
                    <td className="p-4 text-xs text-ink/80 leading-relaxed min-w-[250px]">
                      {item.laporan_hasil || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}