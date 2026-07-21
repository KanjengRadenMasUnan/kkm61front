import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config'
import { Plus, Trash2, Edit2, Loader2, Calendar, MapPin, Sprout, Brush, BookOpen } from 'lucide-react'

const pilihanIkon = [
  { name: 'MapPin', label: 'Lokasi / Survey', Icon: MapPin },
  { name: 'Sprout', label: 'Pertanian / Penghijauan', Icon: Sprout },
  { name: 'Brush', label: 'Kerja Bakti / Fasilitas', Icon: Brush },
  { name: 'BookOpen', label: 'Pendidikan / Bimbel', Icon: BookOpen },
]

export default function AdminKegiatan() {
  const [kegiatan, setKegiatan] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [judul, setJudul] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [ikon, setIkon] = useState('MapPin')

  const ENDPOINT_KEGIATAN = `${API_BASE_URL}/kegiatan`

  const loadKegiatan = () => {
    fetch(ENDPOINT_KEGIATAN)
      .then((res) => res.json())
      .then((data) => {
        setKegiatan(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching kegiatan:', err)
        setKegiatan([])
        setLoading(false)
      })
  }

  useEffect(() => { loadKegiatan() }, [])

  const handleOpenModal = (data = null) => {
    if (data) {
      setEditingId(data.id)
      setJudul(data.judul || '')
      setTanggal(data.tanggal || '')
      setDeskripsi(data.deskripsi || '')
      setIkon(data.ikon || 'MapPin')
    } else {
      setEditingId(null)
      setJudul('')
      setTanggal('')
      setDeskripsi('')
      setIkon('MapPin')
    }
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('judul', judul)
    formData.append('tanggal', tanggal)
    formData.append('deskripsi', deskripsi)
    formData.append('ikon', ikon)

    const url = editingId
      ? `${ENDPOINT_KEGIATAN}/${editingId}`
      : ENDPOINT_KEGIATAN

    if (editingId) {
      formData.append('_method', 'PUT')
    }

    fetch(url, {
      method: 'POST',
      body: formData
    })
      .then(() => {
        setIsModalOpen(false)
        loadKegiatan()
      })
      .catch((err) => console.error('Error saving kegiatan:', err))
  }

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus kegiatan ini?')) {
      fetch(`${ENDPOINT_KEGIATAN}/${id}`, { method: 'DELETE' })
        .then(() => loadKegiatan())
        .catch((err) => console.error('Error deleting kegiatan:', err))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-display font-bold text-[#0D1F36]">Kelola Kegiatan Lapangan</h2>
          <p className="text-gray-500 text-sm">Tambah, perbarui, dan hapus agenda kegiatan harian KKM.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0D1F36] text-[#C99738] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#163359] transition-all"
        >
          <Plus size={18} /> Tambah Kegiatan
        </button>
      </div>

      {loading ? (
        <div className="py-10 text-center text-[#C99738]"><Loader2 className="animate-spin mx-auto" /></div>
      ) : (
        <div className="grid gap-4">
          {kegiatan.map((item) => {
            const IconObj = pilihanIkon.find(i => i.name === item.ikon)?.Icon || MapPin
            return (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#0D1F36]/5 text-[#C99738] rounded-xl shrink-0">
                    <IconObj size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#C99738] font-bold">
                      <Calendar size={14} /> {item.tanggal}
                    </div>
                    <h3 className="font-bold text-[#0D1F36] text-lg">{item.judul}</h3>
                    <p className="text-sm text-gray-500">{item.deskripsi}</p>
                  </div>
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
            )
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-xl font-bold text-[#0D1F36]">
              {editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Pilih Ikon Kegiatan</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {pilihanIkon.map((item) => {
                    const IconComp = item.Icon
                    const isSelected = ikon === item.name
                    return (
                      <button
                        type="button"
                        key={item.name}
                        onClick={() => setIkon(item.name)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#0D1F36] text-[#C99738] border-[#0D1F36]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <IconComp size={16} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-600">Deskripsi Singkat</label>
                <textarea
                  required
                  rows="3"
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-500 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0D1F36] text-[#C99738] rounded-xl font-bold">
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}