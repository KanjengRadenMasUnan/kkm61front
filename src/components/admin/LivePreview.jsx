import { Sparkles, Calendar, User } from 'lucide-react'

export default function LivePreview({ formData, setFormData, blocks, updateBlock, getSecureImageUrl }) {
  // HELPER PARSER WEBP & RICH TEXT FORMAT
  const renderFormattedPreview = (text) => {
    if (!text) return ''
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&lt;u&gt;/g, '<u>')
      .replace(/&lt;\/u&gt;/g, '</u>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1.5 py-0.5 rounded text-red-600 font-mono text-[11px]">$1</code>')

    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="hidden lg:block w-1/2 bg-cream p-6 overflow-y-auto space-y-4 border-l border-gold/20 min-h-screen">
      
      {/* HEADER BAR PREVIEW */}
      <div className="flex items-center justify-between border-b border-gold/30 pb-3 sticky top-0 bg-cream/90 backdrop-blur-md z-10">
        <span className="text-xs font-bold text-gold uppercase tracking-wider bg-primary px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
          <Sparkles size={13} /> Live Preview Editorial
        </span>
        <span className="text-[11px] text-gray-500 font-medium">
          💡 Klik langsung teks di bawah untuk edit cepat
        </span>
      </div>

      {/* KANVAS KONTEN BERITA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-md space-y-5 font-body">
        
        {/* METADATA KATEGORI & TANGGAL */}
        <div className="flex items-center gap-2">
          <span className="bg-gold text-primary text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wide">
            {formData.kategori || 'Kegiatan KKM'}
          </span>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Calendar size={11} /> {formData.tanggal || 'Hari ini'}
          </span>
        </div>

        {/* JUDUL ARTIKEL */}
        <h1
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setFormData({ ...formData, judul: e.target.innerText })}
          className="text-xl sm:text-2xl font-bold font-display text-primary leading-snug hover:bg-gold/10 p-1.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {formData.judul || 'Judul Artikel Liputan...'}
        </h1>

        {/* RINGKASAN / LEAD PARAGRAPH */}
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setFormData({ ...formData, ringkasan: e.target.innerText })}
          className="text-xs sm:text-sm text-ink/80 font-medium leading-relaxed border-l-4 border-gold pl-3.5 py-1.5 bg-gold/5 rounded-r-xl hover:bg-gold/10 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {formData.ringkasan || 'Tulis ringkasan singkat artikel di sini...'}
        </p>

        {/* INFO PENULIS */}
        <div className="flex items-center gap-2.5 text-xs text-gray-500 border-t border-b border-gray-100 py-2.5">
          <div className="w-7 h-7 rounded-full bg-primary text-gold font-bold flex items-center justify-center text-[11px] shadow-2xs">
            <User size={13} />
          </div>
          <span>Oleh: <strong className="text-primary font-semibold">{formData.penulis || 'Tim Humas KKM 61'}</strong></span>
        </div>

        {/* PREVIEW COVER UTAMA (STUDIO FRAMING - ZERO CROP - FULL IMAGE) */}
        {formData.gambar ? (
          <div className="space-y-1.5 pt-1">
            <div className="w-full max-h-[420px] bg-slate-900/5 rounded-2xl border border-gray-200/80 p-1.5 flex items-center justify-center overflow-hidden shadow-2xs">
              <img 
                src={getSecureImageUrl(formData.gambar)} 
                alt="Preview Cover" 
                className="w-full h-auto max-h-[400px] object-contain rounded-xl mx-auto block" 
              />
            </div>
            <p className="text-[11px] text-gray-400 italic text-center">
              *Foto Cover Utama (Ditampilkan penuh sesuai resolusi asli)
            </p>
          </div>
        ) : (
          <div className="w-full h-40 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center text-primary font-semibold text-xs gap-1">
            <span>🖼️ Area Gambar Cover Utama</span>
            <span className="text-[10px] text-gray-400 font-normal">Belum ada foto yang diunggah</span>
          </div>
        )}

        {/* RENDER BLOK KONTEN DENGAN DUKUNGAN RICH TEXT & FULL IMAGE SISIPAN */}
        <div className="space-y-4 pt-3">
          {blocks.map((block) => (
            <div key={block.id} className="relative group">
              
              {/* BLOK PARAGRAF */}
              {block.type === 'paragraph' && (
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                  className="text-xs sm:text-[13px] text-gray-800 leading-relaxed hover:bg-gold/10 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  {renderFormattedPreview(block.content || 'Tulis isi paragraf di sini...')}
                </p>
              )}

              {/* BLOK SUB-JUDUL */}
              {block.type === 'heading' && (
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                  className="text-sm sm:text-base font-bold text-primary font-display pt-3 pb-0.5 hover:bg-gold/10 p-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  {renderFormattedPreview(block.content || 'Sub Judul Bagian...')}
                </h3>
              )}

              {/* BLOK KUTIPAN */}
              {block.type === 'quote' && (
                <blockquote
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                  className="border-l-4 border-gold pl-3.5 py-2 italic text-xs sm:text-[13px] text-primary font-semibold bg-gold/5 rounded-r-xl hover:bg-gold/10 transition-colors focus:outline-none focus:ring-1 focus:ring-gold my-2"
                >
                  "{renderFormattedPreview(block.content || 'Kutipan pernyataan narasumber...')}"
                </blockquote>
              )}

              {/* BLOK GAMBAR SISIPAN (STUDIO FRAMING - ZERO CROP) */}
              {block.type === 'image' && (
                <div className="space-y-2 my-4 bg-slate-50/80 p-2.5 rounded-2xl border border-gray-200/80 shadow-2xs">
                  {block.url ? (
                    <div className="w-full max-h-[340px] bg-slate-900/5 rounded-xl p-1 flex items-center justify-center overflow-hidden">
                      <img 
                        src={getSecureImageUrl(block.url)} 
                        alt="Sisipan" 
                        className="w-full h-auto max-h-[320px] block rounded-lg object-contain mx-auto" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 rounded-xl bg-gray-200/70 border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-xs font-medium">
                      [ Area Gambar Sisipan ]
                    </div>
                  )}
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlock(block.id, 'caption', e.target.innerText)}
                    className="text-[11px] text-gray-500 italic text-center hover:bg-gold/10 p-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {block.caption || 'Keterangan foto sisipan...'}
                  </p>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* PREVIEW HASHTAGS */}
        {formData.tags && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
            <span className="text-[11px] font-bold text-gray-400 mr-1 flex items-center">Topik:</span>
            {formData.tags.split(',').map((t, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-200/60 shadow-2xs">
                #{t.trim().replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}