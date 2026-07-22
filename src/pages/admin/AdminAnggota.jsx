import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config'
import { Plus, Edit3, Trash2, Eye, X, Users, GraduationCap, LayoutGrid, Award, ShieldCheck, CheckCircle2, Upload, Image as ImageIcon, UserCheck } from 'lucide-react'

export default function AdminAnggota() {
  const [anggota, setAnggota] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewData, setPreviewData] = useState(null)
  
  // State Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nama: '',
    nim: '',
    peran: '',
    urutan: 1,
    foto: null,
  })
  const [imagePreview, setImagePreview] = useState('')

  const ENDPOINT_ANGGOTA = `${API_BASE_URL}/anggota`

  useEffect(() => {
    fetchAnggota()
  }, [])

  const fetchAnggota = async () => {
    setLoading(true)
    try {
      const res = await fetch(ENDPOINT_ANGGOTA)
      const data = await res.json()
      const sorted = Array.isArray(data) 
        ? data.sort((a, b) => (Number(a.urutan) || 0) - (Number(b.urutan) || 0)) 
        : []
      setAnggota(sorted)
    } catch (err) {
      console.error('Error fetching anggota:', err)
      setAnggota([])
    } finally {
      setLoading(false)
    }
  }

  // Pengelompokan Hirarki
  const dpl = anggota.find(a => Number(a.urutan) === 1)
  const pimpinan = anggota.filter(a => Number(a.urutan) === 2 || Number(a.urutan) === 3)
  const anggotaLain = anggota.filter(a => Number(a.urutan) > 3)

  const handleOpenForm = (item = null, defaultUrutan = null) => {
    if (item) {
      setEditingId(item.id)
      setFormData({
        nama: item.nama || '',
        nim: item.nim || '',
        peran: item.peran || '',
        urutan: Number(item.urutan) || 1,
        foto: null,
      })
      setImagePreview(item.foto || '')
    } else {
      setEditingId(null)
      let recommendedUrutan = defaultUrutan
      if (!recommendedUrutan) {
        const usedUrutans = anggota.map(a => Number(a.urutan))
        let searchIndex = 1
        while (usedUrutans.includes(searchIndex)) {
          searchIndex++
        }
        recommendedUrutan = searchIndex
      }
      setFormData({ 
        nama: '', 
        nim: '', 
        peran: recommendedUrutan === 1 ? 'DPL' : recommendedUrutan === 2 ? 'Ketua Kelompok' : recommendedUrutan === 3 ? 'Wakil Ketua' : 'Anggota', 
        urutan: recommendedUrutan, 
        foto: null 
      })
      setImagePreview('')
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!')
        return
      }
      setFormData((prev) => ({ ...prev, foto: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = new FormData()
    payload.append('nama', formData.nama)
    payload.append('nim', formData.nim)
    payload.append('peran', formData.peran)
    payload.append('urutan', formData.urutan)

    if (formData.foto instanceof File) {
      payload.append('foto', formData.foto)
    }

    let url = ENDPOINT_ANGGOTA
    let method = 'POST'

    if (editingId) {
      url = `${ENDPOINT_ANGGOTA}/${editingId}`
      payload.append('_method', 'PUT')
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
        },
        body: payload,
      })

      if (res.ok) {
        setIsModalOpen(false)
        fetchAnggota()
      } else {
        const errData = await res.json()
        alert(`Gagal menyimpan: ${errData.message || 'Terjadi kesalahan pada server.'}`)
      }
    } catch (err) {
      console.error('Error saving anggota:', err)
      alert('Terjadi kesalahan jaringan atau server!')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data anggota ini?')) return
    try {
      const res = await fetch(`${ENDPOINT_ANGGOTA}/${id}`, { method: 'DELETE' })
      if (res.ok) fetchAnggota()
    } catch (err) {
      console.error('Error deleting anggota:', err)
    }
  }

  return (
    <div className="space-y-8 font-body max-w-7xl mx-auto pb-10">
      
      {/* HEADER PAGE */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <Users size={22} />
            </div>
            <span>Struktur & Anggota Tim</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Kelola susunan anggota KKM mulai dari DPL, Pimpinan, hingga seluruh Tim.</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="bg-primary hover:bg-[#163359] text-white font-semibold px-5 py-3 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 text-xs cursor-pointer"
        >
          <Plus size={18} />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* SECTION PRATINJAU HIRARKI */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-base">
            <LayoutGrid size={20} className="text-primary" />
            <h2>Bagan Visual Kelompok</h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full font-medium border border-gray-100">
            Total Anggota: {anggota.length} Orang
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-gray-400 font-medium">Memuat struktur anggota...</div>
        ) : anggota.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Belum ada data anggota. Klik <strong className="text-primary">"Tambah Anggota"</strong> untuk memulai.
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* TINGKAT 1: DPL */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full mb-4 border border-amber-200/60">
                <Award size={14} /> Dosen Pembimbing Lapangan
              </div>
              
              {dpl ? (
                <div className="w-full max-w-sm bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-md hover:shadow-lg transition-all flex flex-col items-center text-center relative group">
                  <span className="absolute top-3 left-3 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                    #1 DPL
                  </span>
                  
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-50 border-2 border-amber-400 my-2 shadow-inner shrink-0">
                    {dpl.foto ? (
                      <img src={dpl.foto} alt={dpl.nama} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
                        {dpl.nama?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-base mt-1">{dpl.nama}</h3>
                  <p className="text-xs font-semibold text-amber-600">{dpl.peran || 'DPL'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">NIP/NIDN: {dpl.nim}</p>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 w-full justify-center">
                    <button onClick={() => setPreviewData(dpl)} className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors">
                      <Eye size={14} /> Lihat
                    </button>
                    <button onClick={() => handleOpenForm(dpl)} className="px-3 py-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors">
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(dpl.id)} className="px-3 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors">
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => handleOpenForm(null, 1)} className="w-full max-w-sm p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-amber-400 bg-gray-50/50 hover:bg-amber-50/30 text-gray-400 hover:text-amber-600 flex flex-col items-center gap-2 transition-all group">
                  <Plus size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">Isi Data DPL (Posisi #1)</span>
                </button>
              )}
            </div>

            {/* TINGKAT 2: KETUA & WAKIL */}
            <div className="flex flex-col items-center border-t border-gray-100 pt-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full mb-4 border border-blue-100">
                <ShieldCheck size={14} /> Pimpinan Kelompok
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
                {[2, 3].map((pos) => {
                  const item = pimpinan.find(p => Number(p.urutan) === pos)
                  return item ? (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center relative">
                      <span className="absolute top-3 left-3 bg-blue-50 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                        #{item.urutan} {pos === 2 ? 'Ketua' : 'Wakil'}
                      </span>
                      
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 border-2 border-primary/20 my-2 shrink-0">
                        {item.foto ? (
                          <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {item.nama?.charAt(0)}
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm truncate w-full">{item.nama}</h4>
                      <p className="text-xs text-primary font-semibold truncate w-full">{item.peran}</p>
                      <p className="text-xs text-gray-400 mt-0.5">NIM: {item.nim}</p>

                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 w-full justify-center">
                        <button onClick={() => setPreviewData(item)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleOpenForm(item)} className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button key={pos} onClick={() => handleOpenForm(null, pos)} className="p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/50 bg-gray-50/50 hover:bg-blue-50/20 text-gray-400 hover:text-primary flex flex-col items-center justify-center gap-2 transition-all min-h-[180px]">
                      <Plus size={22} />
                      <span className="text-xs font-bold">Isi {pos === 2 ? 'Ketua' : 'Wakil Ketua'}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* TINGKAT 3: ANGGOTA TIM (GRID 4 KOLOM) */}
            <div className="border-t border-gray-100 pt-8">
              <div className="text-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">
                  Anggota Tim & Divisi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {anggotaLain.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center relative group">
                    <span className="absolute top-3 left-3 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      #{item.urutan}
                    </span>

                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-50 border border-gray-200 my-2 shrink-0">
                      {item.foto ? (
                        <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                          {item.nama?.charAt(0)}
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-gray-900 text-xs truncate w-full">{item.nama}</h4>
                    <p className="text-[11px] text-gray-600 font-medium truncate w-full mt-0.5">{item.peran}</p>
                    <p className="text-[10px] text-gray-400">NIM: {item.nim}</p>

                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100 w-full justify-center">
                      <button onClick={() => setPreviewData(item)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs transition-colors" title="Preview">
                        <Eye size={13} />
                      </button>
                      <button onClick={() => handleOpenForm(item)} className="p-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs transition-colors" title="Edit">
                        <Edit3 size={13} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg text-xs transition-colors" title="Hapus">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* CARD TAMBAH CEPAT */}
                <button
                  onClick={() => handleOpenForm()}
                  className="p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 bg-gray-50/50 hover:bg-gray-50 text-gray-400 hover:text-primary flex flex-col items-center justify-center gap-2 transition-all min-h-[180px]"
                >
                  <Plus size={22} />
                  <span className="text-xs font-bold">+ Tambah Anggota</span>
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* TABEL DATA ANGGOTA */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <UserCheck size={16} className="text-primary" />
            <span>Daftar Seluruh Anggota Terdaftar</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 text-center">Urutan</th>
                <th className="p-4">Foto</th>
                <th className="p-4">Nama & Identitas</th>
                <th className="p-4">Jabatan / Peran</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">Memuat data...</td>
                </tr>
              ) : anggota.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">Belum ada data anggota.</td>
                </tr>
              ) : (
                anggota.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 text-center font-bold text-primary">#{item.urutan}</td>
                    <td className="p-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {item.foto ? (
                          <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {item.nama?.charAt(0)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900 text-sm">{item.nama}</div>
                      <div className="text-[11px] text-gray-400">NIM/NIP: {item.nim}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-primary font-bold px-2.5 py-1 rounded-lg text-[10px] border border-blue-100">
                        {item.peran}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setPreviewData(item)}
                          className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                          title="Preview Kartu"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleOpenForm(item)}
                          className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
                          title="Edit Data"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
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
      </div>

      {/* MODAL INPUT & EDIT DATA ANGGOTA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 border border-gray-100 shadow-2xl my-8">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {editingId ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Lengkapi biodata dan tentukan urutan posisi anggota
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Posisi Hirarki / Urutan</label>
                <select
                  value={formData.urutan}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setFormData({
                      ...formData,
                      urutan: val,
                      peran: val === 1 ? 'DPL' : val === 2 ? 'Ketua Kelompok' : val === 3 ? 'Wakil Ketua' : formData.peran || 'Anggota'
                    })
                  }}
                  className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary bg-white font-medium text-gray-800"
                >
                  <option value={1}>Posisi #1 - Dosen Pembimbing Lapangan (DPL)</option>
                  <option value={2}>Posisi #2 - Ketua Kelompok</option>
                  <option value={3}>Posisi #3 - Wakil Ketua</option>
                  {Array.from({ length: 17 }, (_, i) => i + 4).map((num) => (
                    <option key={num} value={num}>
                      Posisi #{num} - Anggota Tim / Divisi
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Dr. Ahmad, M.Pd / Budi Santoso"
                  className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary bg-white text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">NIM / NIP / NIDN</label>
                  <input
                    type="text"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    placeholder="1122001"
                    className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1.5">Peran / Jabatan Label</label>
                  <input
                    type="text"
                    required
                    value={formData.peran}
                    onChange={(e) => setFormData({ ...formData, peran: e.target.value })}
                    placeholder="DPL / Ketua / Humas / Anggota"
                    className="w-full p-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary bg-white text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1.5">Foto Profil</label>
                <div className="flex items-center gap-4 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                  <div className="w-14 h-14 rounded-full bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={22} className="text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold text-xs cursor-pointer hover:bg-[#163359] transition-all shadow-xs">
                      <Upload size={14} />
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-gray-400 block">Format JPG, PNG (Maksimal 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-3 border border-gray-200 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-[#163359] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Data</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL PREVIEW KARTU */}
      {previewData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 relative border border-gray-100 shadow-2xl text-center space-y-4">
            <button
              onClick={() => setPreviewData(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full inline-block border border-blue-100">
              Pratinjau Kartu Anggota
            </span>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md mb-3 bg-white">
                {previewData.foto ? (
                  <img src={previewData.foto} alt={previewData.nama} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl">
                    {previewData.nama?.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-base">{previewData.nama}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <GraduationCap size={14} className="text-primary" />
                <span>NIM/NIP: {previewData.nim}</span>
              </p>
              <span className="mt-3 text-xs font-bold bg-primary text-white px-3 py-1 rounded-full shadow-xs">
                {previewData.peran}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}