import { 
  Type, Heading, ImageIcon, Quote, Trash2, ArrowUp, ArrowDown, 
  Upload, Loader2, Bold, Italic, Underline, Code, Tag, AlignLeft 
} from 'lucide-react'

export default function BlockEditor({
  formData,
  setFormData,
  categories,
  uploadingCover,
  handleFileUpload,
  blocks,
  updateBlock,
  moveBlock,
  removeBlock,
  addBlock,
  applyFormatting,
  uploadingBlockId,
  handleBlockImageUpload
}) {
  return (
    <div className="space-y-5">
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
                placeholder="URL Cloudinary Otomatis..."
                className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
              />
              <label className="bg-gold/20 hover:bg-gold/30 p-2.5 rounded-xl border border-gold/30 cursor-pointer flex items-center justify-center shrink-0 min-w-[36px]">
                {uploadingCover ? (
                  <Loader2 size={14} className="animate-spin text-primary font-bold" />
                ) : (
                  <Upload size={14} className="text-primary font-bold" />
                )}
                <input type="file" accept="image/*" disabled={uploadingCover} onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* INPUT HASHTAG / TAGS SEO */}
        <div>
          <label className="font-bold text-gray-700 text-xs flex items-center justify-between mb-1">
            <span className="flex items-center gap-1"><Tag size={13} className="text-gold" /> Hashtag / Tag SEO Artikel</span>
            <span className="text-[10px] text-gray-400 font-normal">Pisahkan dengan koma</span>
          </label>
          <input
            type="text"
            value={formData.tags || ''}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Contoh: KKM 61, Waringinkurung, UNIBA 2026, UMKM Desa"
            className="w-full p-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
          />
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

              {/* MINI TOOLBAR UNTUK FORMAT TEKS */}
              {(block.type === 'paragraph' || block.type === 'quote' || block.type === 'heading') && (
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={() => applyFormatting(block.id, 'bold')}
                    className="p-1 hover:bg-white text-gray-700 hover:text-primary rounded font-bold transition-colors"
                    title="Tebal (Bold)"
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting(block.id, 'italic')}
                    className="p-1 hover:bg-white text-gray-700 hover:text-primary rounded italic transition-colors"
                    title="Miring (Italic)"
                  >
                    <Italic size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting(block.id, 'underline')}
                    className="p-1 hover:bg-white text-gray-700 hover:text-primary rounded underline transition-colors"
                    title="Garis Bawah (Underline)"
                  >
                    <Underline size={13} />
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    onClick={() => applyFormatting(block.id, 'code')}
                    className="p-1 hover:bg-white text-gray-700 hover:text-primary rounded font-mono text-[10px] transition-colors"
                    title="Kode Singkat"
                  >
                    <Code size={13} />
                  </button>
                  <span className="text-[9px] text-gray-400 ml-auto px-1">
                    Sorot teks & klik format
                  </span>
                </div>
              )}

              {block.type === 'paragraph' && (
                <textarea
                  id={`textarea-block-${block.id}`}
                  rows="3"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                  placeholder="Tuliskan isi paragraf di sini... (gunakan toolbar di atas untuk format B/I/U)"
                  className="w-full p-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold"
                ></textarea>
              )}

              {block.type === 'heading' && (
                <input
                  id={`textarea-block-${block.id}`}
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, 'content', e.target.value)}
                  placeholder="Sub Judul Bagian Artikel..."
                  className="w-full p-2 border border-gray-200 rounded-xl text-xs font-bold text-primary focus:outline-none focus:border-gold"
                />
              )}

              {block.type === 'quote' && (
                <textarea
                  id={`textarea-block-${block.id}`}
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
                      placeholder="URL Cloudinary Gambar Sisipan..."
                      className="w-full p-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-gold bg-white"
                    />
                    <label className="bg-gold/20 hover:bg-gold/30 p-2 rounded-xl border border-gold/30 cursor-pointer flex items-center justify-center shrink-0 min-w-[36px]">
                      {uploadingBlockId === block.id ? (
                        <Loader2 size={14} className="animate-spin text-primary font-bold" />
                      ) : (
                        <Upload size={14} className="text-primary font-bold" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingBlockId === block.id}
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
    </div>
  )
}