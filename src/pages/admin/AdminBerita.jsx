import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config'
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Newspaper, 
  Calendar, 
  Monitor, 
  CheckCircle2 
} from 'lucide-react'
import BlockEditor from '../../components/admin/BlockEditor'
import LivePreview from '../../components/admin/LivePreview'

// Helper pembuat slug otomatis dari judul
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export default function AdminBerita() {
  const [berita, setBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [uploadingBlockId, setUploadingBlockId] = useState(null)
  const [uploadingCover, setUploadingCover] = useState(false)

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
    tags: 'KKM 61, Waringinkurung, UNIBA 2026'
  })

  // Block Content State
  const [blocks, setBlocks] = useState([
    { id: 1, type: 'paragraph', content: '' }
  ])

  const [imageFile, setImageFile] = useState(null)

  const categories = ['Pendidikan', 'UMKM & Ekonomi', 'Kesehatan', 'Lingkungan', 'Sosial Budaya']
  const ENDPOINT_BERITA = `${API_BASE_URL}/berita`

  // Helper Pembersih URL Gambar
  const getSecureImageUrl = (url) => {
    if (!url) return ''
    if (url.startsWith('blob:')) return url
    if (url.startsWith('http://')) return url.replace('http://', 'https://')
    if (url.startsWith('/')) {
      const backendDomain = API_BASE_URL.replace(/\/api$/, '')
      return `${backendDomain}${url}`.replace('http://', 'https://')
    }
    return url
  }

  useEffect(() => {
    fetchBerita()
  }, [])

  const fetchBerita = async () => {
    setLoading(true)
    try {
      const res = await fetch(ENDPOINT_BERITA)
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

    try {
      const parsedJSON = JSON.parse(isiText)
      if (Array.isArray(parsedJSON) && parsedJSON.length > 0) {
        return parsedJSON
      }
    } catch (e) {
      // Fallback data teks lama
    }

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
        tags: item.tags || 'KKM 61, Waringinkurung, UNIBA 2026'
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
        tags: 'KKM 61, Waringinkurung, UNIBA 2026'
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

  // FUNGSI UTAMA TOOLBAR FORMATTING (BOLD, ITALIC, UNDERLINE, CODE)
  const applyFormatting = (blockId, formatType) => {
    const textarea = document.getElementById(`textarea-block-${blockId}`)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)

    let prefix = ''
    let suffix = ''

    if (formatType === 'bold') {
      prefix = '**'
      suffix = '**'
    } else if (formatType === 'italic') {
      prefix = '*'
      suffix = '*'
    } else if (formatType === 'underline') {
      prefix = '<u>'
      suffix = '</u>'
    } else if (formatType === 'code') {
      prefix = '`'
      suffix = '`'
    }

    const textToInsert = selectedText || 'teks'
    const newText = textarea.value.substring(0, start) + prefix + textToInsert + suffix + textarea.value.substring(end)

    updateBlock(blockId, 'content', newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, end + prefix.length)
    }, 50)
  }

  // UPLOAD COVER LANGSUNG KE CLOUDINARY SAAT FILE DIPILIH
  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingCover(true)

    const payload = new FormData()
    payload.append('gambar', file)
    payload.append('judul', 'Cover Temp')
    payload.append('slug', 'cover-temp')
    payload.append('tanggal', new Date().toISOString().split('T')[0])
    payload.append('ringkasan', 'Temp Cover')

    try {
      const res = await fetch(ENDPOINT_BERITA, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: payload
      })

      if (res.ok) {
        const resData = await res.json()
        const uploadedUrl = resData.data?.gambar || resData.gambar
        if (uploadedUrl && !uploadedUrl.startsWith('blob:')) {
          setFormData((prev) => ({ ...prev, gambar: uploadedUrl }))
          setImageFile(null)
        }
      } else {
        alert('Gagal mengunggah foto cover.')
      }
    } catch (err) {
      console.error('Error uploading cover:', err)
      alert('Terjadi kesalahan jaringan saat mengunggah foto cover.')
    } finally {
      setUploadingCover(false)
    }
  }

  // UPLOAD GAMBAR SISIPAN BLOK LANGSUNG KE CLOUDINARY
  const handleBlockImageUpload = async (id, e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingBlockId(id)

    const payload = new FormData()
    payload.append('gambar', file)
    payload.append('judul', 'Sisipan Temp')
    payload.append('slug', 'sisipan-temp')
    payload.append('tanggal', new Date().toISOString().split('T')[0])
    payload.append('ringkasan', 'Temp Sisipan')

    try {
      const res = await fetch(ENDPOINT_BERITA, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: payload
      })

      if (res.ok) {
        const resData = await res.json()
        const uploadedUrl = resData.data?.gambar || resData.gambar

        if (uploadedUrl && !uploadedUrl.startsWith('blob:')) {
          updateBlock(id, 'url', uploadedUrl)
        } else {
          alert('Gagal mendapatkan URL gambar sisipan dari server.')
        }
      } else {
        alert('Gagal mengunggah gambar sisipan ke server.')
      }
    } catch (err) {
      console.error('Error uploading block image:', err)
      alert('Terjadi kesalahan jaringan saat unggah gambar sisipan.')
    } finally {
      setUploadingBlockId(null)
    }
  }

  // SIMPAN DATA SEBAGAI JSON STRUKTUR BLOK & TAGS SEO
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)

    const hasBlobBlock = blocks.some(b => b.type === 'image' && b.url && b.url.startsWith('blob:'))
    if (hasBlobBlock || (formData.gambar && formData.gambar.startsWith('blob:'))) {
      setSubmitLoading(false)
      return alert('Masih ada gambar yang berupa preview temporary (blob). Silakan pilih/upload ulang gambar Anda.')
    }

    const jsonIsi = JSON.stringify(blocks)

    const dataToSend = new FormData()
    dataToSend.append('judul', formData.judul)
    dataToSend.append('slug', createSlug(formData.judul))
    dataToSend.append('ringkasan', formData.ringkasan)
    dataToSend.append('isi', jsonIsi)
    dataToSend.append('tanggal', formData.tanggal)
    dataToSend.append('kategori', formData.kategori)
    dataToSend.append('penulis', formData.penulis)
    dataToSend.append('tags', formData.tags)

    if (imageFile) {
      dataToSend.append('gambar', imageFile)
    } else if (formData.gambar && !formData.gambar.startsWith('blob:')) {
      dataToSend.append('gambar', formData.gambar)
    }

    let url = ENDPOINT_BERITA
    if (editingId) {
      url = `${ENDPOINT_BERITA}/${editingId}`
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
      const res = await fetch(`${ENDPOINT_BERITA}/${id}`, { method: 'DELETE' })
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
                        <img src={getSecureImageUrl(item.gambar)} alt={item.judul} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                          KKM 61
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <div className="font-bold text-primary text-sm line-clamp-1">{item.judul}</div>
                    <div className="text-[10px] text-gray-400 font-mono truncate">/berita/{item.slug || 'tanpa-slug'}</div>
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
              
              {/* FORM KIRI (BLOCK EDITOR) */}
              <form
                onSubmit={handleSubmit}
                className={`p-5 space-y-5 overflow-y-auto transition-all duration-300 ${
                  showPreview ? 'w-full lg:w-1/2 border-r border-gray-200' : 'w-full max-w-3xl mx-auto'
                }`}
              >
                <BlockEditor
                  formData={formData}
                  setFormData={setFormData}
                  categories={categories}
                  uploadingCover={uploadingCover}
                  handleFileUpload={handleFileUpload}
                  blocks={blocks}
                  updateBlock={updateBlock}
                  moveBlock={moveBlock}
                  removeBlock={removeBlock}
                  addBlock={addBlock}
                  applyFormatting={applyFormatting}
                  uploadingBlockId={uploadingBlockId}
                  handleBlockImageUpload={handleBlockImageUpload}
                />

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
                    disabled={submitLoading || uploadingBlockId !== null || uploadingCover}
                    className="w-2/3 py-2.5 bg-primary text-gold rounded-xl font-bold hover:bg-[#163359] text-xs shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{submitLoading ? 'Menyimpan...' : 'Simpan & Publikasikan Berita'}</span>
                  </button>
                </div>
              </form>

              {/* LIVE PREVIEW KANAN */}
              {showPreview && (
                <LivePreview
                  formData={formData}
                  setFormData={setFormData}
                  blocks={blocks}
                  updateBlock={updateBlock}
                  getSecureImageUrl={getSecureImageUrl}
                />
              )}

            </div>

          </div>
        </div>
      )}
    </div>
  )
}