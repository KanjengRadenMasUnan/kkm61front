import { useState, useEffect } from 'react'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Newspaper, 
  Calendar, 
  Monitor, 
  Sparkles, 
  Quote, 
  Heading, 
  Upload, 
  User, 
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Type,
  AlignLeft
} from 'lucide-react'

export default function AdminBerita() {
  const [berita, setBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Canvas & Preview State
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [editingId, setEditingId] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    judul: '',
    ringkasan: '',
    tanggal: new Date().toISOString().split('T')[0],
    gambar: '',
    kategori: 'Pendidikan',
    penulis: 'Humas KKM 61',
  })

  // Block Content State
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: '' }
  ])

  const [imageFile, setImageFile] = useState(null)

  const categories = ['Pendidikan', 'UMKM & Ekonomi', 'Kesehatan', 'Lingkungan', 'Sosial Budaya']
  const API_BASE_URL = `http://${window.location.hostname}:8000/api/berita`

  useEffect(() => {
    fetchBerita()
  }, [])

  const fetchBerita = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_BASE_URL)
      if (!res.ok) throw new Error('Gagal mengambil data dari server')
      const data = await res.json()
      setBerita(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching berita:', err)
      setBerita([])
    } finally {
      setLoading(false)
    }
  }

  // PARSER PRESISI DARI DATABASE KE BLOK FORM EDIT
  const parseIsiToBlocks = (isiText) => {
    if (!isiText || typeof isiText !== 'string') {
      return [{ id: Date.now(), type: 'paragraph', content: '' }]
    }

    // 1. Coba dekode format JSON Murni (Prioritas Utama)
    try {
      const parsedJSON = JSON.parse(isiText)
      if (Array.isArray(parsedJSON) && parsedJSON.length > 0) {
        return parsedJSON
      }
    } catch (e) {
      // Jika data lama dalam bentuk teks biasa, gunakan pemisah paragraf
    }

    // 2. Fallback untuk data lama berbasis teks
    const paragraphs = isiText.split(/\n\n+/)
    const parsedBlocks = []

    paragraphs.forEach((p, idx) => {
      const trimmed = p.trim()
      if (!trimmed) return

      if (trimmed.startsWith('###')) {
        parsedBlocks.push({
          id: Date.now() + idx,
          type: 'heading',
          content: trimmed.replace(/^###\s*/, '')
        })
      } else if (trimmed.startsWith('>')) {
        parsedBlocks.push({
          id: Date.now() + idx,
          type: 'quote',
          content: trimmed.replace(/^>\s*"?/, '').replace(/"?$/, '')
        })
      } else if (trimmed.startsWith('![')) {
        const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/)
        if (match) {
          parsedBlocks.push({
            id: Date.now() + idx,
            type: 'image',
            url: match[2] || '',
            caption: match[1] || ''
          })
        } else {
          parsedBlocks.push({ id: Date.now() + idx, type: 'paragraph', content: trimmed })
        }
      } else {
        parsedBlocks.push({ id: Date.now() + idx, type: 'paragraph', content: trimmed })
      }
    })

    return parsedBlocks.length > 0 ? parsedBlocks : [{ id: Date.now(), type: 'paragraph', content: isiText }]
  }

  // Buka Editor Canvas
  const handleOpenCanvas = (item = null) => {
    setImageFile(null)
    if (item) {
      setEditingId(item.id)
      setFormData({
        judul: item.judul || '',
        ringkasan: item.ringkasan || '',
        tanggal: item.tanggal || new Date().toISOString().split('T')[0],
        gambar: item.gambar || '',
        kategori: item.kategori || 'Pendidikan',
        penulis: item.penulis || 'Humas KKM 61',
      })
      setBlocks(parseIsiToBlocks(item.isi))
    } else {
      setEditingId(null)
      setFormData({
        judul: '',
        ringkasan: '',
        tanggal: new Date().toISOString().split('T')[0],
        gambar: '',
        kategori: 'Pendidikan',
        penulis: 'Humas KKM 61',
      })
      setBlocks([{ id: Date.now(), type: 'paragraph', content: '' }])
    }
    setShowPreview(true)
    setIsCanvasOpen(true)
  }

  // MANAJEMEN BLOK
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
      caption: type === 'image' ? '' : undefined,
      url: type === 'image' ? '' : undefined
    }
    setBlocks((prev) => [...prev, newBlock])
  }

  const updateBlock = (id, key, value) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, [key]: value } : block))
    )
  }

  const removeBlock = (id) => {
    if (blocks.length === 1) return alert('Artikel minimal harus memiliki 1 blok konten.')
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return
    const temp = newBlocks[index]
    newBlocks[index] = newBlocks[targetIndex]
    newBlocks[targetIndex] = temp
    setBlocks(newBlocks)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setFormData({ ...formData, gambar: URL.createObjectURL(file) })
    }
  }

  const handleBlockImageUpload = (id, e) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      updateBlock(id, 'url', url)
    }
  }

  // SIMPAN DATA SEBAGAI JSON STRUKTUR BLOK
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)

    // Simpan susunan blok utuh sebagai JSON string
    const jsonIsi = JSON.stringify(blocks)

    const dataToSend = new FormData()
    dataToSend.append('judul', formData.judul)
    dataToSend.append('ringkasan', formData.ringkasan)
    dataToSend.append('isi', jsonIsi)
    dataToSend.append('tanggal', formData.tanggal)
    dataToSend.append('kategori', formData.kategori)
    dataToSend.append('penulis', formData.penulis)

    if (imageFile) {
      dataToSend.append('gambar', imageFile)
    } else if (formData.gambar && !formData.gambar.startsWith('blob:')) {
      dataToSend.append('gambar', formData.gambar)
    }

    let url = API_BASE_URL
    if (editingId) {
      url = `${API_BASE_URL}/${editingId}`
      dataToSend.append('_method', 'PUT')
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: dataToSend,
      })

      const resData = await res.json()

      if (res.ok) {
        alert('Berita berhasil dipublikasikan!')
        setIsCanvasOpen(false)
        await fetchBerita()
      } else {
        alert(`Gagal menyimpan: ${resData.message || 'Periksa kembali data masukan.'}`)
      }
    } catch (err) {
      console.error('Error submitting berita:', err)
      alert('Gagal terhubung ke server backend.')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Berita berhasil dihapus.')
        fetchBerita()
      } else {
        alert('Gagal menghapus berita.')
      }
    } catch (err) {
      console.error('Error deleting berita:', err)
      alert('Gagal terhubung ke server backend.')
    }
  }

  return (
    <div className="space-y-6 font-body w-full">
      {/* HEADER KELOLA BERITA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <Newspaper className="text-gold" size={24} />
            <span>Studio Pengelola Berita</span>
          </h1>
          <p className="text-xs text-gray-500">Buat berita dengan canvas terstruktur yang mempertahankan format blok saat diedit.</p>
        </div>
        <button
          onClick={() => handleOpenCanvas()}
          className="bg-primary text-gold font-bold px-4 py-2.5 rounded-xl shadow-md hover:bg-[#163359] transition-all flex items-center gap-2 text-xs"
        >
          <Plus size={16} />
          <span>Buka Canvas Berita</span>
        </button>
      </div>

      {/* TABEL BERITA */}
      <div className="overflow-x-auto rounded-2xl border border-gold/20 shadow-sm w-full">
        <table className="w-full text-left text-xs">
          <thead className="bg-primary text-cream font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="p-3.5">Cover</th>
              <th className="p-3.5">Judul Liputan</th>
              <th className="p-3.5">Kategori & Penulis</th>
              <th className="p-3.5">Tanggal</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">Memuat data artikel...</td>
              </tr>
            ) : berita.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-400">Belum ada berita terdaftar. Silakan buat berita baru.</td>
              </tr>
            ) : (
              berita.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gold/20">
                      {item.gambar ? (
                        <img src={item.gambar} alt={item.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                          KKM 61
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-bold text-primary text-sm line-clamp-1">{item.judul}</div>
                    <div className="text-[11px] text-gray-400 line-clamp-1">{item.ringkasan}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="bg-gold/10 text-gold font-bold px-2 py-0.5 rounded text-[10px] inline-block mb-1 border border-gold/20">
                      {item.kategori || 'Pendidikan'}
                    </span>
                    <div className="text-[10px] text-gray-500">{item.penulis || 'Humas KKM'}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap text-gray-600 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-gold" />
                      <span>{item.tanggal}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenCanvas(item)}
                        className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        title="Edit Berita di Canvas"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus Berita"
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

      {/* CANVAS STUDIO MODAL FULLSCREEN */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden shadow-2xl border border-gold/30">
            
            {/* CANVAS HEADER */}
            <div className="bg-primary text-cream px-6 py-3.5 flex justify-between items-center border-b border-gold/20 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gold text-primary flex items-center justify-center font-bold">
                  <Newspaper size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-cream">
                    {editingId ? 'Studio Canvas: Edit Berita' : 'Studio Canvas: Tulis Berita Baru'}
                  </h3>
                  <span className="text-[10px] text-gold">Setiap blok tersimpan secara mandiri sehingga tidak akan menggumpal saat diedit.</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    showPreview ? 'bg-gold text-primary shadow-md' : 'bg-white/10 text-cream hover:bg-white/20'
                  }`}
                >
                  <Monitor size={15} />
                  <span>{showPreview ? 'Sembunyikan Live Preview' : 'Tampilkan Live Preview'}</span>
                </button>

                <button
                  onClick={() => setIsCanvasOpen(false)}
                  className="p-1.5 text-cream/70 hover:text-cream bg-white/10 rounded-xl transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* CANVAS BODY: SPLIT VIEW */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* FORM KIRI */}
              <form
                onSubmit={handleSubmit}
                className={`p-5 space-y-5 overflow-y-auto transition-all duration-300 ${
                  showPreview ? 'w-full lg:w-1/2 border-r border-gray-200' : 'w-full max-w-3xl mx-auto'
                }`}
              >
                {/* INFORMASI DASAR */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 border-b pb-2">
                    <AlignLeft size={14} className="text-gold" /> Informasi Utama Artikel
                  </h4>

                  <div>
                    <label className="font-bold text-gray-700 text-xs block mb-1">Judul Artikel Berita</label>
                    <input
                      type="text"
                      required
                      value={formData.judul}
                      onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                      placeholder="Contoh: KKM Kelompok 61 Gelar Pelatihan Digitalisasi UMKM..."
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold font-bold text-primary bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 text-xs block mb-1">Kategori</label>
                      <select
                        value={formData.kategori}
                        onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 text-xs block mb-1">Penulis / Reporter</label>
                      <input
                        type="text"
                        value={formData.penulis}
                        onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
                        placeholder="Tim Humas KKM 61"
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 text-xs block mb-1">Tanggal Publikasi</label>
                      <input
                        type="date"
                        required
                        value={formData.tanggal}
                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                        className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 text-xs block mb-1">Upload Foto Cover Utama</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.gambar}
                          onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                          placeholder="URL Gambar / File"
                          className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                        />
                        <label className="bg-gold/20 hover:bg-gold/30 p-2.5 rounded-xl border border-gold/30 cursor-pointer flex items-center justify-center shrink-0">
                          <Upload size={14} className="text-primary font-bold" />
                          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 text-xs block mb-1">Ringkasan / Lead Paragraph</label>
                    <textarea
                      rows="2"
                      required
                      value={formData.ringkasan}
                      onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                      placeholder="Gambarkan poin utama artikel dalam 1-2 kalimat..."
                      className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                    ></textarea>
                  </div>
                </div>

                {/* EDITOR KONTEN MODULAR */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <label className="font-bold text-gray-700 text-xs flex items-center gap-1.5">
                      <Type size={14} className="text-gold" /> Susunan Blok Konten Artikel
                    </label>
                    <span className="text-[10px] text-gray-400">{blocks.length} Blok Digunakan</span>
                  </div>

                  {/* LIST BLOK */}
                  <div className="space-y-3">
                    {blocks.map((block, index) => (
                      <div
                        key={block.id}
                        className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-gold/50 transition-all space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-[10px] font-bold uppercase bg-gold/10 text-primary px-2 py-0.5 rounded border border-gold/20">
                            Blok {index + 1}: {block.type}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveBlock(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-primary disabled:opacity-30"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveBlock(index, 'down')}
                              disabled={index === blocks.length - 1}
                              className="p-1 text-gray-400 hover:text-primary disabled:opacity-30"
                            >
                              <ArrowDown size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBlock(block.id)}
                              className="p-1 text-red-400 hover:text-red-600 ml-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {block.type === 'paragraph' && (
                          <textarea
                            rows="3"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                            placeholder="Tuliskan isi paragraf di sini..."
                            className="w-full p-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
                          ></textarea>
                        )}

                        {block.type === 'heading' && (
                          <input
                            type="text"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                            placeholder="Sub Judul Bagian Artikel..."
                            className="w-full p-2 border border-gray-200 rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-gold"
                          />
                        )}

                        {block.type === 'quote' && (
                          <textarea
                            rows="2"
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                            placeholder="Tuliskan kutipan/pernyataan narasumber..."
                            className="w-full p-2 border border-gold/30 bg-gold/5 rounded-xl text-xs italic focus:outline-none"
                          ></textarea>
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={block.url || ''}
                                onChange={(e) => updateBlock(block.id, 'url', e.target.value)}
                                placeholder="URL Gambar Sisipan..."
                                className="w-full p-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
                              />
                              <label className="bg-gold/20 hover:bg-gold/30 p-2 rounded-xl border border-gold/30 cursor-pointer flex items-center justify-center shrink-0">
                                <Upload size={14} className="text-primary font-bold" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleBlockImageUpload(block.id, e)}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <input
                              type="text"
                              value={block.caption || ''}
                              onChange={(e) => updateBlock(block.id, 'caption', e.target.value)}
                              placeholder="Keterangan foto / Caption..."
                              className="w-full p-2 border border-gray-200 rounded-xl text-[11px] italic focus:outline-none focus:border-gold"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* TAMBAH BLOK BARU */}
                  <div className="pt-2">
                    <label className="text-[11px] font-bold text-gray-500 block mb-1.5">Tambah Blok Konten Baru:</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => addBlock('paragraph')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gold/20 hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all"
                      >
                        <Type size={13} /> + Paragraf
                      </button>
                      <button
                        type="button"
                        onClick={() => addBlock('heading')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gold/20 hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all"
                      >
                        <Heading size={13} /> + Sub Judul
                      </button>
                      <button
                        type="button"
                        onClick={() => addBlock('image')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gold/20 hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all"
                      >
                        <ImageIcon size={13} /> + Gambar Sisipan & Caption
                      </button>
                      <button
                        type="button"
                        onClick={() => addBlock('quote')}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gold/20 hover:text-primary rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all"
                      >
                        <Quote size={13} /> + Kutipan
                      </button>
                    </div>
                  </div>
                </div>

                {/* TOMBOL SIMPAN */}
                <div className="pt-4 flex gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => setIsCanvasOpen(false)}
                    className="w-1/3 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100 text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-2/3 py-2.5 bg-primary text-gold rounded-xl font-bold hover:bg-[#163359] text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitLoading ? 'Menyimpan...' : 'Simpan & Publikasikan Berita'}</span>
                  </button>
                </div>
              </form>

              {/* LIVE PREVIEW KANAN */}
              {showPreview && (
                <div className="hidden lg:block w-1/2 bg-cream p-6 overflow-y-auto space-y-4 border-l border-gold/20">
                  <div className="flex items-center justify-between border-b border-gold/30 pb-2">
                    <span className="text-xs font-bold text-gold uppercase tracking-wider bg-primary px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={12} /> Live Preview
                    </span>
                    <span className="text-[10px] text-gray-400">Klik langsung untuk mengedit teks</span>
                  </div>

                  <div className="bg-white rounded-3xl p-6 border border-gold/30 shadow-md space-y-4 font-body">
                    <div className="flex items-center gap-2">
                      <span className="bg-gold text-primary text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        {formData.kategori}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar size={10} /> {formData.tanggal}
                      </span>
                    </div>

                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setFormData({ ...formData, judul: e.target.innerText })}
                      className="text-xl font-bold font-display text-primary leading-snug hover:bg-gold/10 p-1 rounded transition-colors focus:outline-none"
                    >
                      {formData.judul || 'Judul Artikel...'}
                    </h1>

                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setFormData({ ...formData, ringkasan: e.target.innerText })}
                      className="text-xs text-ink/80 font-medium leading-relaxed border-l-3 border-gold pl-3 py-1 bg-gold/5 rounded-r-lg hover:bg-gold/10 transition-colors focus:outline-none"
                    >
                      {formData.ringkasan || 'Ringkasan artikel...'}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 border-t border-b py-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-gold font-bold flex items-center justify-center text-[10px]">
                        <User size={12} />
                      </div>
                      <span>Oleh: <strong>{formData.penulis}</strong></span>
                    </div>

                    {formData.gambar ? (
                      <div className="w-full h-48 rounded-2xl overflow-hidden border border-gold/20">
                        <img src={formData.gambar} alt="Preview Cover" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-36 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        Gambar Cover Utama
                      </div>
                    )}

                    {/* RENDER BLOK DI PREVIEW */}
                    <div className="space-y-4 pt-2">
                      {blocks.map((block) => (
                        <div key={block.id} className="relative group">
                          {block.type === 'paragraph' && (
                            <p
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                              className="text-xs text-gray-800 leading-relaxed hover:bg-gold/10 p-1 rounded transition-colors focus:outline-none"
                            >
                              {block.content || 'Tulis isi paragraf di sini...'}
                            </p>
                          )}

                          {block.type === 'heading' && (
                            <h3
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                              className="text-sm font-bold text-primary font-display pt-2 hover:bg-gold/10 p-1 rounded focus:outline-none"
                            >
                              {block.content || 'Sub Judul...'}
                            </h3>
                          )}

                          {block.type === 'quote' && (
                            <blockquote
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                              className="border-l-4 border-gold pl-3 py-1.5 italic text-xs text-primary font-semibold bg-gold/5 rounded-r-lg hover:bg-gold/10 focus:outline-none"
                            >
                              "{block.content || 'Kutipan narasumber...'}"
                            </blockquote>
                          )}

                          {block.type === 'image' && (
                            <div className="space-y-1 my-3 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                              {block.url ? (
                                <div className="w-full h-40 rounded-xl overflow-hidden">
                                  <img src={block.url} alt="Sisipan" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-full h-28 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                  [ Gambar Sisipan ]
                                </div>
                              )}
                              <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateBlock(block.id, 'caption', e.target.innerText)}
                                className="text-[11px] text-gray-500 italic text-center hover:bg-gold/10 p-1 rounded focus:outline-none"
                              >
                                {block.caption || 'Keterangan foto...'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  )
}