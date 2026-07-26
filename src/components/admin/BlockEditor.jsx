import { 
  Upload, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Bold, 
  Italic, 
  Underline, 
  Code, 
  Image as ImageIcon, 
  Heading, 
  Quote, 
  AlignLeft, 
  Loader2 
} from 'lucide-react'

export default function BlockEditor({
  formData,
  setFormData,
  categories,
  uploadingCover,
  handleFileUpload,
  handleRemoveCover,
  previewGambar,
  blocks,
  updateBlock,
  moveBlock,
  removeBlock,
  addBlock,
  applyFormatting,
  uploadingBlockId,
  handleBlockImageUpload
}) {
  // Gambar yang akan ditampilkan (bisa dari previewGambar atau formData.gambar)
  const coverImageSrc = previewGambar || formData.gambar

  return (
    <div className="space-y-6 font-body">
      
      {/* 1. INFORMASI DASAR BERITA */}
      <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-4">
        <h4 className="font-bold text-xs text-primary uppercase tracking-wider border-b border-gray-200 pb-2">
          Metadata Liputan
        </h4>

        {/* JUDUL */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Judul Berita / Liputan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Pengabdian Masyarakat KKM 61 Desa Waringinkurung..."
            value={formData.judul}
            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
            className="w-full text-xs font-semibold p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
          />
        </div>

        {/* RINGKASAN / LEAD */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Ringkasan Singkat (Lead) <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            placeholder="Tulis ringkasan 1-2 kalimat untuk preview di kartu berita..."
            value={formData.ringkasan}
            onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white leading-relaxed"
          />
        </div>

        {/* GRID KATEGORI, TANGGAL & PENULIS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Kategori</label>
            <select
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white font-medium"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Tanggal Terbit</label>
            <input
              type="date"
              value={formData.tanggal}
              onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
              className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1">Penulis / Reporst</label>
            <input
              type="text"
              value={formData.penulis}
              onChange={(e) => setFormData({ ...formData, penulis: e.target.value })}
              className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white font-medium"
            />
          </div>
        </div>

        {/* TAGS SEO */}
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">Topik / Hashtag (Pisahkan dengan koma)</label>
          <input
            type="text"
            placeholder="KKM 61, Waringinkurung, Edukasi, UNIBA"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full text-xs p-2 rounded-xl border border-gray-300 bg-white"
          />
        </div>
      </div>

      {/* 2. AREA FOTO COVER UTAMA DENGAN FITUR HAPUS */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-primary uppercase tracking-wider">
          Foto Cover Utama <span className="text-red-500">*</span>
        </label>

        {uploadingCover ? (
          <div className="w-full h-36 rounded-2xl bg-gray-50 border-2 border-dashed border-gold/50 flex flex-col items-center justify-center text-primary gap-2">
            <Loader2 size={24} className="animate-spin text-gold" />
            <span className="text-xs font-semibold">Mengunggah foto cover ke server...</span>
          </div>
        ) : coverImageSrc ? (
          /* TAMPILAN PREVIEW JIKA FOTO SUDAH DIPILIH / ADA DARI DATABASE */
          <div className="relative w-full max-h-[360px] bg-slate-900/5 rounded-2xl border border-gray-200 p-2 flex items-center justify-center overflow-hidden group shadow-2xs">
            <img 
              src={coverImageSrc} 
              alt="Cover Berita" 
              className="w-full h-auto max-h-[340px] object-contain rounded-xl mx-auto block" 
            />
            
            {/* TOMBOL HAPUS FOTO COVER */}
            <button
              type="button"
              onClick={handleRemoveCover}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 text-xs font-bold z-10 hover:scale-105"
              title="Hapus Foto Cover"
            >
              <Trash2 size={14} />
              <span>Hapus Foto Cover</span>
            </button>
          </div>
        ) : (
          /* BOX UPLOAD JIKA BELUM ADA FOTO COVER */
          <label 
            htmlFor="input-cover-editor"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50/80 hover:bg-gold/5 hover:border-gold/50 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-2xs flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:scale-110 transition-all mb-1.5">
              <Upload size={20} />
            </div>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-primary">
              Klik untuk memilih foto cover berita
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5">
              Mendukung JPG, PNG, WEBP (Ditampilkan 100% Full Image)
            </span>
            <input 
              id="input-cover-editor"
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        )}
      </div>

      {/* 3. BLOK EDITOR NARASI BERITA */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h4 className="font-bold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
            <AlignLeft size={15} /> Isi Konten Liputan (Sistem Blok)
          </h4>
          <span className="text-[10px] text-gray-400">Gunakan toolbar untuk format teks</span>
        </div>

        {/* DAFTAR BLOK */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div 
              key={block.id} 
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200/90 shadow-2xs space-y-2 hover:border-gold/40 transition-colors"
            >
              {/* HEADER KONTROL PER BLOK */}
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl text-xs">
                <span className="font-bold text-gray-600 uppercase text-[10px] flex items-center gap-1">
                  {block.type === 'paragraph' && <AlignLeft size={12} />}
                  {block.type === 'heading' && <Heading size={12} />}
                  {block.type === 'quote' && <Quote size={12} />}
                  {block.type === 'image' && <ImageIcon size={12} />}
                  Blok {index + 1}: {block.type}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    title="Pindah ke Atas"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    title="Pindah ke Bawah"
                  >
                    <ArrowDown size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded ml-1"
                    title="Hapus Blok Ini"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* ISI BLOK Sesuai Tipe */}
              {block.type === 'paragraph' && (
                <div className="space-y-1.5">
                  {/* TOOLBAR FORMATTING */}
                  <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg w-fit">
                    <button
                      type="button"
                      onClick={() => applyFormatting(block.id, 'bold')}
                      className="p-1 hover:bg-white rounded font-bold text-xs px-2"
                      title="Bold (**teks**)"
                    >
                      <Bold size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting(block.id, 'italic')}
                      className="p-1 hover:bg-white rounded italic text-xs px-2"
                      title="Italic (*teks*)"
                    >
                      <Italic size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting(block.id, 'underline')}
                      className="p-1 hover:bg-white rounded text-xs px-2"
                      title="Underline (<u>teks</u>)"
                    >
                      <Underline size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => applyFormatting(block.id, 'code')}
                      className="p-1 hover:bg-white rounded font-mono text-xs px-2"
                      title="Code (`teks`)"
                    >
                      <Code size={13} />
                    </button>
                  </div>

                  <textarea
                    id={`textarea-block-${block.id}`}
                    rows={3}
                    placeholder="Tulis narasi paragraf di sini... Gunakan toolbar di atas untuk format BOLD/ITALIC."
                    value={block.content}
                    onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
                  />
                </div>
              )}

              {block.type === 'heading' && (
                <input
                  type="text"
                  placeholder="Tulis Sub Judul Bagian..."
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              )}

              {block.type === 'quote' && (
                <textarea
                  rows={2}
                  placeholder="Tulis kutipan narasumber di sini..."
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                  className="w-full text-xs italic font-semibold p-2.5 rounded-xl border border-gold/40 bg-gold/5 focus:outline-none"
                />
              )}

              {/* FOTO NARASI SISIPAN */}
              {block.type === 'image' && (
                <div className="space-y-2 pt-1">
                  {uploadingBlockId === block.id ? (
                    <div className="w-full h-24 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-xs text-gray-500 gap-1">
                      <Loader2 size={18} className="animate-spin text-primary" />
                      <span>Mengunggah foto narasi...</span>
                    </div>
                  ) : block.url ? (
                    <div className="space-y-2">
                      <div className="relative w-full max-h-[260px] bg-slate-900/5 rounded-xl border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                        <img 
                          src={block.url} 
                          alt="Sisipan" 
                          className="max-w-full h-auto max-h-[240px] object-contain rounded-lg mx-auto block" 
                        />
                        <button
                          type="button"
                          onClick={() => updateBlock(block.id, 'url', '')}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg hover:bg-red-600 shadow-md text-[10px] font-bold"
                          title="Ganti Foto Sisipan"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gold/5 transition-all">
                      <Upload size={16} className="text-gray-400 mb-1" />
                      <span className="text-[11px] font-semibold text-gray-600">Klik untuk upload foto narasi</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBlockImageUpload(block.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}

                  <input
                    type="text"
                    placeholder="Tulis keterangan foto (caption)..."
                    value={block.caption || ''}
                    onChange={(e) => updateBlock(block.id, 'caption', e.target.value)}
                    className="w-full text-xs italic p-2 rounded-xl border border-gray-300"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* TOMBOL TAMBAH BLOK */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-primary hover:text-gold text-primary font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Paragraf
          </button>
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-primary hover:text-gold text-primary font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Sub Judul
          </button>
          <button
            type="button"
            onClick={() => addBlock('quote')}
            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-primary hover:text-gold text-primary font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Kutipan
          </button>
          <button
            type="button"
            onClick={() => addBlock('image')}
            className="flex-1 py-2 px-3 bg-gray-100 hover:bg-primary hover:text-gold text-primary font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} /> Foto Narasi
          </button>
        </div>
      </div>

    </div>
  )
}