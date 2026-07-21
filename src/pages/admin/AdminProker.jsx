import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Loader2 } from 'lucide-react'
import { DAFTAR_BIDANG } from '../ProgramKerja'

export default function AdminProker() {
  const [proker, setProker] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    bidang: DAFTAR_BIDANG[0],
    program: '',
    status: 'Rencana',
    progress: 0,
    laporan_hasil: ''
  })

  const loadProker = () => {
    fetch('http://127.0.0.1:8000/api/program-kerja')
      .then((res) => res.json())
      .then((data) => {
        setProker(data)
        setLoading(false)
      })
  }

  useEffect(() => { loadProker() }, [])

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditingId(data.id)
      setFormData({
        bidang: data.bidang,
        program: data.program,
        status: data.status,
        progress: data.progress,
        laporan_hasil: data.laporan_hasil || ''
      })
    } else {
      setEditingId(null)
      setFormData({
        bidang: DAFTAR_BIDANG[0],
        program: '',
        status: 'Rencana',
        progress: 0,
        laporan_hasil: ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const url = editingId
      ? `http://127.0.0.1:8000/api/program-kerja/${editingId}`
      : 'http://127.0.0.1:8000/api/program-kerja'
    const method = editingId ? 'PUT' : 'POST'

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).then(() => {
      setIsModalOpen(false)
      loadProker()
    })
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus program kerja ini?')) {
      fetch(`http://127.0.0.1:8000/api/program-kerja/${id}`, { method: 'DELETE' })
        .then(() => loadProker())
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#0D1F36]">Kelola Program Kerja & Laporan</h2>
          <p className="text-gray-500 text-sm">Atur 5 bidang proker, update progress %, dan laporan hasil.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0D1F36] text-[#C99738] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#163359] transition-all"
        >
          <Plus size={18} /> Tambah Proker
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-[#C99738]"><Loader2 className="animate-spin mx-auto" /></div>
      ) : (
        <div className="grid gap-4">
          {proker.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">
                  {item.bidang}
                </span>
                <h3 className="font-bold text-[#0D1F36] text-lg mt-1">{item.program}</h3>
                <p className="text-xs text-gray-500">Progress: <strong>{item.progress}%</strong> | Status: <strong>{item.status}</strong></p>
                {item.laporan_hasil && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mt-2">
                    <strong>Laporan:</strong> {item.laporan_hasil}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 my-8">
            <h3 className="text-xl font-bold text-[#0D1F36]">
              {editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Pilih Bidang Fokus</label>
                <select
                  value={formData.bidang}
                  onChange={(e) => setFormData({ ...formData, bidang: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-sm"
                >
                  {DAFTAR_BIDANG.map((bid, i) => (
                    <option key={i} value={bid}>{bid}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Nama Program Kerja</label>
                <input
                  type="text"
                  required
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200"
                  >
                    <option value="Rencana">Rencana</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-600">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Laporan Hasil / Progress Lapangan</label>
                <textarea
                  rows="3"
                  placeholder="Deskripsikan sejauh mana pencapaian proker ini..."
                  value={formData.laporan_hasil}
                  onChange={(e) => setFormData({ ...formData, laporan_hasil: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-500 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0D1F36] text-[#C99738] rounded-xl font-bold">
                  Simpan Proker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}