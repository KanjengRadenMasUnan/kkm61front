import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config'
import { Plus, Edit3, Trash2, Eye, X, Users, Upload, CheckCircle, GraduationCap } from 'lucide-react'

export default function AdminAnggota() {
  const [anggota, setAnggota] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewData, setPreviewData] = useState(null)
  
  // State Form (Tambah / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    peran: '',
    urutan: '',
    foto: '',
  })

  const ENDPOINT_ANGGOTA = `${API_BASE_URL}/anggota`

  useEffect(() => {
    fetchAnggota()
  }, [])

  const fetchAnggota = async () => {
    try {
      const res = await fetch(ENDPOINT_ANGGOTA)
      const data = await res.json()
      setAnggota(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (item = null) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        nama: item.nama || '',
        nim: item.nim || '',
        peran: item.peran || '',
        urutan: item.urutan || '',
        foto: item.foto || '',
      })
    } else {
      setEditingId(null)
      setFormData({ nama: '', nim: '', peran: '', urutan: '', foto: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = editingId
      ? `${ENDPOINT_ANGGOTA}/${editingId}`
      : ENDPOINT_ANGGOTA
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setIsModalOpen(false)
        fetchAnggota()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus anggota ini?')) return
    try {
      const res = await fetch(`${ENDPOINT_ANGGOTA}/${id}`, { method: 'DELETE' })
      if (res.ok) fetchAnggota()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6 font-body">
      {/* HEADER KELOLA ANGGOTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <Users className="text-gold" size={24} />
            <span>Kelola Anggota Kelompok</span>
          </h1>
          <p className="text-xs text-gray-500">Atur susunan tim, foto, nomor urut, dan peran struktur.</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-primary text-gold font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#163359] transition-all flex items-center gap-2 text-xs"
        >
          <Plus size={16} />
          <span>Tambah Anggota Baru</span>
        </button>
      </div>

      {/* TABEL ANGGOTA */}
      <div className="overflow-x-auto rounded-2xl border border-gold/20 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-primary text-cream font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5 text-center">Urutan</th>
              <th className="p-3.5">Foto</th>
              <th className="p-3.5">Nama & NIM</th>
              <th className="p-3.5">Peran / Jabatan</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">Memuat data anggota...</td>
              </tr>
            ) : anggota.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">Belum ada data anggota terdaftar.</td>
              </tr>
            ) : (
              anggota.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3.5 text-center font-bold text-primary">#{item.urutan}</td>
                  <td className="p-3.5">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gold/30">
                      {item.foto ? (
                        <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {item.nama?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-primary text-sm">{item.nama}</div>
                    <div className="text-[11px] text-gray-400">NIM: {item.nim}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="bg-gold/10 text-gold border border-gold/30 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                      {item.peran}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setPreviewData(item)}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Preview Kartu"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => handleOpenForm(item)}
                        className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        title="Edit Data"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-gold/30 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-primary text-base">
                {editingId ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-600 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-600 block mb-1">NIM</label>
                  <input
                    type="text"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    placeholder="1122001"
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-600 block mb-1">Nomor Urut</label>
                  <input
                    type="number"
                    required
                    value={formData.urutan}
                    onChange={(e) => setFormData({ ...formData, urutan: e.target.value })}
                    placeholder="1"
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">Peran / Jabatan</label>
                <input
                  type="text"
                  required
                  value={formData.peran}
                  onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
                  placeholder="Ketua / Anggota Divisi Humas"
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-600 block mb-1">URL Foto (Link Gambar)</label>
                <input
                  type="text"
                  value={formData.foto}
                  onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 border rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-primary text-gold rounded-xl font-bold hover:bg-[#163359]"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW KARTU ANGGOTA */}
      {previewData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cream rounded-3xl max-w-sm w-full p-6 relative border border-gold shadow-2xl space-y-4 text-center">
            <button
              onClick={() => setPreviewData(null)}
              className="absolute top-4 right-4 text-primary p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-bold text-gold uppercase tracking-wider bg-primary px-3 py-1 rounded-full inline-block">
              Pratinjau Tampilan Publik
            </span>

            {/* KARTU PREVIEW SAMA PERSIS SEPERTI HALAMAN ANGGOTA */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-gold/30 shadow-md flex flex-col items-center">
              <div className="w-full aspect-[799/1265] max-w-[180px] rounded-xl overflow-hidden border border-gold/30 shadow-md mb-3 bg-primary/10">
                {previewData.foto ? (
                  <img src={previewData.foto} alt={previewData.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold text-3xl">
                    {previewData.nama?.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">{previewData.nama}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <GraduationCap size={14} className="text-gold" />
                <span>NIM: {previewData.nim}</span>
              </p>
              <span className="mt-2 text-xs font-bold bg-gold/20 text-gold px-3 py-1 rounded-full border border-gold/30">
                {previewData.peran}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}