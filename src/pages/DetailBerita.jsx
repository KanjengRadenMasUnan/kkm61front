import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { API_BASE_URL } from '../config'
import { 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  ArrowLeft, 
  Check, 
  Copy, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  Newspaper
} from 'lucide-react'

// HELPER PARSER MARKDOWN (MENGONVERSI **bold**, *italic*, DAN LINK KE HTML)
const parseFormattedText = (text) => {
  if (!text) return ''

  // 1. Convert **bold** -> <strong>bold</strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  // 2. Convert *italic* atau _italic_ -> <em>italic</em>
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
  formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>')

  // 3. Convert [text](url) -> <a href="url">text</a>
  formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary font-bold underline hover:text-gold transition-colors">$1</a>')

  return <span dangerouslySetInnerHTML={{ __html: formatted }} />
}

export default function DetailBerita() {
  const { slug, id: paramId } = useParams()
  const identifier = slug || paramId
  const [berita, setBerita] = useState(null)
  const [beritaTerkait, setBeritaTerkait] = useState([])
  const [semuaBerita, setSemuaBerita] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [fontSize, setFontSize] = useState('base')

  const ENDPOINT_BERITA = `${API_BASE_URL}/berita`

  // HELPER PEMBERSIH & KONVERSI OTOMATIS CLOUDINARY KE WEBP
  const getSecureImageUrl = (url) => {
    if (!url) return 'https://kkm61waringinkurungnews.my.id/logo-kkm.png'

    let cleanUrl = url

    if (cleanUrl.includes('localhost:8000') || cleanUrl.includes('127.0.0.1:8000')) {
      const cleanPath = cleanUrl.replace(/^https?:\/\/[^\/]+/, '')
      const backendDomain = API_BASE_URL.replace(/\/api$/, '')
      cleanUrl = `${backendDomain}${cleanPath}`
    }

    if (cleanUrl.startsWith('http://')) {
      cleanUrl = cleanUrl.replace('http://', 'https://')
    } else if (cleanUrl.startsWith('/')) {
      const backendDomain = API_BASE_URL.replace(/\/api$/, '')
      cleanUrl = `${backendDomain}${cleanUrl}`.replace('http://', 'https://')
    }

    if (cleanUrl.includes('cloudinary.com') && cleanUrl.includes('/upload/') && !cleanUrl.includes('/f_auto,q_auto/')) {
      cleanUrl = cleanUrl.replace('/upload/', '/upload/f_auto,q_auto/')
    }

    return cleanUrl
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setLoading(true)

    const fetchPrimary = fetch(`${ENDPOINT_BERITA}/slug/${identifier}`)
      .then((res) => {
        if (!res.ok) return fetch(`${ENDPOINT_BERITA}/${identifier}`).then((r) => r.json())
        return res.json()
      })

    fetchPrimary
      .then((data) => {
        if (data && (data.id || data.slug)) {
          setBerita(data)
        } else {
          setBerita(null)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching detail berita:', err)
        setBerita(null)
        setLoading(false)
      })

    fetch(ENDPOINT_BERITA)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const filtered = data.filter((item) => String(item.id) !== String(identifier) && item.slug !== identifier)
          setBeritaTerkait(filtered.slice(0, 4))
          setSemuaBerita(filtered)
        }
      })
      .catch((err) => console.error('Error fetching berita terkait:', err))
  }, [identifier, ENDPOINT_BERITA])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWA = () => {
    const text = `*${berita?.judul}*\n\nBaca selengkapnya di Portal KKM 61:\n${window.location.href}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
  }

  const calculateReadTime = (text) => {
    if (!text) return '1 min baca'
    const words = text.trim().split(/\s+/).length
    const time = Math.ceil(words / 200)
    return `${time} min baca`
  }

  // FUNGSI UTAMA: MENGERJAKAN DEKODE BLOK JSON MENJADI ELEMEN HTML
  const renderKontenBerita = (isiContent) => {
    if (!isiContent) return <p className="text-gray-400 italic">Tidak ada isi berita.</p>

    let blocks = null

    try {
      const parsed = JSON.parse(isiContent)
      if (Array.isArray(parsed)) {
        blocks = parsed
      }
    } catch (e) {
      blocks = null
    }

    if (blocks && blocks.length > 0) {
      return blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={block.id || index} className="leading-relaxed text-ink/90">
              {parseFormattedText(block.content)}
            </p>
          )
        }

        if (block.type === 'heading') {
          return (
            <h3 key={block.id || index} className="text-lg sm:text-xl font-bold font-display text-primary pt-3 pb-1">
              {parseFormattedText(block.content)}
            </h3>
          )
        }

        if (block.type === 'quote') {
          return (
            <blockquote key={block.id || index} className="border-l-4 border-gold bg-gold/5 p-4 rounded-r-2xl italic text-primary font-semibold my-4 text-sm sm:text-base">
              "{parseFormattedText(block.content)}"
            </blockquote>
          )
        }

        if (block.type === 'image') {
          return (
            <figure key={block.id || index} className="my-6 space-y-2">
              {block.url ? (
                /* UKURAN GAMBAR SISIPAN FLUESIBEL MENGIKUTI RASIO ASLI */
                <div className="w-full rounded-2xl overflow-hidden border border-gold/20 shadow-sm bg-gray-50 p-2 flex items-center justify-center">
                  <img 
                    src={getSecureImageUrl(block.url)} 
                    alt={block.caption ? `${block.caption} - ${berita.judul} Waringinkurung Serang` : `Dokumentasi ${berita.judul} - KKM 61 Waringinkurung`} 
                    className="w-full h-auto max-h-[550px] object-contain rounded-xl" 
                  />
                </div>
              ) : null}
              {block.caption && (
                <figcaption className="text-center text-xs text-gray-500 italic">
                  {parseFormattedText(block.caption)}
                </figcaption>
              )}
            </figure>
          )
        }

        return null
      })
    }

    return (
      <div className="whitespace-pre-line leading-relaxed text-ink/90">
        {parseFormattedText(isiContent)}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4 font-body">
        <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 text-xs sm:text-sm">Memuat artikel liputan...</p>
      </div>
    )
  }

  if (!berita) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white p-8 rounded-3xl border border-gold/20 shadow-sm font-body">
        <Helmet>
          <title>Berita Tidak Ditemukan - KKM 61 Waringinkurung News</title>
          <meta name="description" content="Artikel atau berita yang Anda cari di portal KKM Kelompok 61 Waringinkurung tidak ditemukan atau telah dipindahkan." />
        </Helmet>
        <h2 className="text-lg font-bold text-primary">Artikel Tidak Ditemukan</h2>
        <p className="text-xs text-gray-500">Artikel yang Anda cari mungkin telah dihapus atau dipindahkan.</p>
        <Link to="/berita" className="inline-flex items-center gap-2 bg-primary text-gold text-xs font-bold px-4 py-2 rounded-xl">
          <ArrowLeft size={16} /> Kembali ke Berita
        </Link>
      </div>
    )
  }

  const currentUrl = window.location.href
  const secureCoverImage = getSecureImageUrl(berita.gambar)
  const metaKeywords = berita.tags || `${berita.kategori}, KKM 61, Waringinkurung, UNIBA 2026, Kabupaten Serang`

  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": berita.judul,
    "image": [secureCoverImage],
    "datePublished": berita.created_at || berita.tanggal,
    "dateModified": berita.updated_at || berita.tanggal,
    "author": [{
        "@type": "Person",
        "name": berita.penulis || "Humas KKM 61",
        "jobTitle": "Reporter KKM 61 Waringinkurung"
    }],
    "publisher": {
        "@type": "Organization",
        "name": "KKM 61 Waringinkurung News",
        "logo": {
            "@type": "ImageObject",
            "url": "https://kkm61waringinkurungnews.my.id/logo-kkm.png"
        }
    },
    "description": berita.ringkasan
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://kkm61waringinkurungnews.my.id/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Berita",
        "item": "https://kkm61waringinkurungnews.my.id/berita"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": berita.judul,
        "item": currentUrl
      }
    ]
  }

  return (
    <article className="animate-fade-in-up space-y-8 font-body max-w-7xl mx-auto pb-16">
      
      <Helmet>
        <title>{`${berita.judul} - KKM 61 Waringinkurung News`}</title>
        <meta name="description" content={berita.ringkasan} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="canonical" href={currentUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={berita.judul} />
        <meta property="og:description" content={berita.ringkasan} />
        <meta property="og:image" content={secureCoverImage} />
        <meta property="og:image:secure_url" content={secureCoverImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="KKM 61 Waringinkurung News" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={berita.judul} />
        <meta name="twitter:description" content={berita.ringkasan} />
        <meta name="twitter:image" content={secureCoverImage} />

        <script type="application/ld+json">
          {JSON.stringify(newsArticleSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      {/* NAVIGASI BREADCRUMB */}
      <div className="flex items-center justify-between border-b border-gold/20 pb-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">Beranda</Link>
          <ChevronRight size={12} />
          <Link to="/berita" className="hover:text-primary transition-colors">Liputan Berita</Link>
          <ChevronRight size={12} />
          <span className="text-primary font-semibold truncate max-w-[150px] sm:max-w-xs">{berita.judul}</span>
        </div>

        <Link
          to="/berita"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-gold transition-colors bg-white px-3 py-1.5 rounded-xl border border-gold/20 shadow-sm"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Kembali</span>
        </Link>
      </div>

      {/* HEADER ARTIKEL */}
      <div className="max-w-4xl space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-gold text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {berita.kategori || 'Kegiatan KKM'}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={13} /> {calculateReadTime(berita.isi || berita.ringkasan)}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-display text-primary leading-tight sm:leading-snug">
          {berita.judul}
        </h1>

        <p className="text-sm sm:text-lg text-ink/80 font-medium leading-relaxed border-l-4 border-gold pl-4 py-1 bg-gold/5 rounded-r-2xl">
          {parseFormattedText(berita.ringkasan)}
        </p>

        {/* METADATA PENULIS */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-b border-gray-100 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-gold flex items-center justify-center font-bold text-sm border border-gold/30 shadow-sm">
              <User size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-primary block">
                {berita.penulis || 'Tim Humas KKM 61'}
              </span>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Calendar size={12} className="text-gold" /> {berita.tanggal}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-0.5 text-xs rounded-lg font-bold ${fontSize === 'sm' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                title="Teks Kecil"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-0.5 text-xs rounded-lg font-bold ${fontSize === 'base' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                title="Teks Standar"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-0.5 text-xs rounded-lg font-bold ${fontSize === 'lg' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
                title="Teks Besar"
              >
                A+
              </button>
            </div>

            <button
              onClick={handleShareWA}
              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
              title="Bagikan ke WhatsApp"
            >
              <Share2 size={16} />
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 bg-primary/5 text-primary rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors flex items-center gap-1 text-xs font-bold"
              title="Salin Tautan"
            >
              {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GAMBAR COVER UTAMA (FLEKSIBER MENGIKUTI UKURAN ASLI FOTO) */}
      {berita.gambar && (
        <div className="space-y-2 max-w-5xl mx-auto">
          <div className="w-full rounded-3xl overflow-hidden border border-gold/30 shadow-lg relative bg-primary/5 p-2 flex items-center justify-center">
            <img 
              src={secureCoverImage} 
              alt={`Foto Cover Liputan: ${berita.judul} - KKM 61 Desa Waringinkurung Kabupaten Serang`} 
              className="w-full h-auto max-h-[600px] object-contain rounded-2xl" 
            />
          </div>
          <p className="text-[11px] sm:text-xs text-gray-500 italic text-center">
            Dokumentasi Liputan: {berita.judul}
          </p>
        </div>
      )}

      {/* PARAGRAF KONTEN & SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-gold/20 shadow-sm space-y-6">
          
          {/* HASIL DEKODE RENDER KONTEN BERITA */}
          <div
            className={`font-body text-ink/90 leading-relaxed space-y-4 ${
              fontSize === 'sm' ? 'text-xs sm:text-sm' : fontSize === 'lg' ? 'text-base sm:text-xl' : 'text-sm sm:text-base'
            }`}
          >
            {renderKontenBerita(berita.isi)}
          </div>

          {/* HASHTAG / TOPIK TERKAIT SEO */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-primary">Topik Terkait:</span>
            {(berita.tags ? berita.tags.split(',') : [berita.kategori || 'Pengabdian', 'KKM 61', 'Waringinkurung', 'UNIBA 2026'])
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag, idx) => (
                <span 
                  key={idx} 
                  className="bg-gray-100 hover:bg-gold/20 hover:text-primary text-gray-600 text-[11px] font-semibold px-3 py-1 rounded-full transition-colors cursor-pointer"
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
          </div>
        </div>

        {/* SIDEBAR REKOMENDASI */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3 text-primary font-bold text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-gold" size={18} />
                <h3>Liputan Terkait</h3>
              </div>
              <span className="text-[10px] text-gray-400 font-normal">Pilihan</span>
            </div>

            <div className="space-y-4">
              {beritaTerkait.map((item) => (
                <Link
                  key={item.id}
                  to={`/berita/${item.slug || item.id}`}
                  className="group flex items-start gap-3 border-b border-gray-100 pb-3 last:border-none last:pb-0"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gold/20 bg-primary/10">
                    {item.gambar ? (
                      <img 
                        src={getSecureImageUrl(item.gambar)} 
                        alt={`Thumbnail Berita: ${item.judul} - KKM 61 Waringinkurung`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xs">
                        KKM
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gold font-bold flex items-center gap-1">
                      <Calendar size={10} /> {item.tanggal}
                    </span>
                    <h5 className="font-bold text-primary text-xs leading-snug group-hover:text-gold transition-colors line-clamp-2">
                      {item.judul}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gold/20 pb-3 text-primary font-bold text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <Newspaper className="text-gold" size={18} />
                <h3>Berita Lainnya</h3>
              </div>
              <Link to="/berita" className="text-[11px] text-gold hover:underline font-bold">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {semuaBerita.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Belum ada berita lainnya.</p>
              ) : (
                semuaBerita.map((item) => (
                  <Link
                    key={item.id}
                    to={`/berita/${item.slug || item.id}`}
                    className="group bg-gray-50 hover:bg-gold/10 p-3 rounded-2xl border border-gray-100 hover:border-gold/30 transition-all flex gap-3 items-center block shadow-2xs"
                  >
                    <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-white">
                      {item.gambar ? (
                        <img 
                          src={getSecureImageUrl(item.gambar)} 
                          alt={`Foto Berita: ${item.judul} - Desa Waringinkurung`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold text-[10px]">
                          KKM 61
                        </div>
                      )}
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 text-[9px] text-gray-400">
                        <span className="bg-gold/20 text-primary font-bold px-1.5 py-0.5 rounded uppercase">
                          {item.kategori || 'Berita'}
                        </span>
                        <span>{item.tanggal}</span>
                      </div>
                      <h5 className="font-bold text-primary text-xs leading-snug group-hover:text-gold transition-colors line-clamp-2">
                        {item.judul}
                      </h5>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary via-[#163359] to-primary text-cream p-5 rounded-3xl border border-gold/30 shadow-md text-center space-y-3">
            <div className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center mx-auto border border-gold/30">
              <Sparkles size={18} />
            </div>
            <h4 className="font-bold text-sm text-cream">Kirim Berita / Pers Release?</h4>
            <p className="text-xs text-cream/80 leading-relaxed">
              Punya informasi kegiatan desa atau kerja sama publikasi? Hubungi tim Humas KKM 61.
            </p>
            <a
              href="mailto:kkm61waringinkurung@gmail.com"
              className="inline-block bg-gold text-primary font-bold text-xs px-4 py-2 rounded-xl hover:bg-cream transition-colors"
            >
              Hubungi Humas
            </a>
          </div>

        </div>
      </div>

    </article>
  )
}