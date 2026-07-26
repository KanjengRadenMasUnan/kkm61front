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
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 px-1 py-0.5 rounded text-red-600 font-mono text-[11px]">$1</code>')

    return <span dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="hidden lg:block w-1/2 bg-cream p-6 overflow-y-auto space-y-4 border-l border-gold/20">
      <div className="flex items-center justify-between border-b border-gold/30 pb-2">
        <span className="text-xs font-bold text-gold uppercase tracking-wider bg-primary px-3 py-1 rounded-full flex items-center gap-1">
          <Sparkles size={12} /> Live Preview
        </span>
        <span className="text-[10px] text-gray-400">Klik langsung teks untuk mengedit cepat</span>
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

        {/* PREVIEW COVER DENGAN RASIO ASLI */}
        {formData.gambar ? (
          <div className="w-full rounded-2xl overflow-hidden border border-gold/20 bg-gray-50 p-2 flex items-center justify-center">
            <img 
              src={getSecureImageUrl(formData.gambar)} 
              alt="Preview Cover" 
              className="w-full h-auto max-h-[350px] object-contain rounded-xl" 
            />
          </div>
        ) : (
          <div className="w-full h-36 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
            Gambar Cover Utama
          </div>
        )}

        {/* RENDER BLOK DENGAN PREVIEW DUKUNGAN RICH TEXT */}
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
                  {renderFormattedPreview(block.content || 'Tulis isi paragraf di sini...')}
                </p>
              )}

              {block.type === 'heading' && (
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                  className="text-sm font-bold text-primary font-display pt-2 hover:bg-gold/10 p-1 rounded focus:outline-none"
                >
                  {renderFormattedPreview(block.content || 'Sub Judul...')}
                </h3>
              )}

              {block.type === 'quote' && (
                <blockquote
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateBlock(block.id, 'content', e.target.innerText)}
                  className="border-l-4 border-gold pl-3 py-1.5 italic text-xs text-primary font-semibold bg-gold/5 rounded-r-lg hover:bg-gold/10 focus:outline-none"
                >
                  "{renderFormattedPreview(block.content || 'Kutipan narasumber...')}"
                </blockquote>
              )}

              {block.type === 'image' && (
                <div className="space-y-1 my-3 bg-gray-50 p-2 rounded-2xl border border-gray-200">
                  {block.url ? (
                    /* PREVIEW GAMBAR SISIPAN DENGAN RASIO ASLI */
                    <div className="w-full rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center">
                      <img 
                        src={getSecureImageUrl(block.url)} 
                        alt="Sisipan" 
                        className="w-full h-auto max-h-[300px] object-contain rounded-lg" 
                      />
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

        {/* PREVIEW HASHTAGS */}
        {formData.tags && (
          <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-1">
            {formData.tags.split(',').map((t, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">
                #{t.trim().replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}