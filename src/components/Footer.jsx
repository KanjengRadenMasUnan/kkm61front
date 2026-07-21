import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Home, Heart } from 'lucide-react'
import logoKkm from '../assets/logo-kkm.png'

export default function Footer() {
  return (
    <footer className="bg-primary text-cream border-t border-gold/30 font-body relative overflow-hidden mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* SISI KIRI: IDENTITAS KKM & LOGO */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl p-2 border border-gold/30 backdrop-blur-sm shrink-0">
                <img src={logoKkm} alt="Logo KKM 61" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-base text-cream">KKM Kelompok 61</h3>
                <span className="text-xs text-gold font-semibold">Universitas Bina Bangsa 2026</span>
              </div>
            </div>
            <p className="text-xs text-cream/80 leading-relaxed">
              Wadah publikasi resmi pengabdian, dokumentasi kegiatan lapangan, dan laporan program kerja mahasiswa KKM Kelompok 61 di Kecamatan Waringinkurung.
            </p>
          </div>

          {/* SISI TENGAH: NAVIGASI CEPAT & LAYANAN POSKO */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-bold text-sm text-gold border-b border-gold/20 pb-2">Informasi & Kontak Posko</h4>
            <ul className="space-y-2.5 text-xs text-cream/80">
              <li className="flex items-start gap-2">
                <Home size={15} className="text-gold shrink-0 mt-0.5" />
                <span>Posko KKM 61 Waringinkurung, Kab. Serang, Banten</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-gold shrink-0" />
                <a href="mailto:kkm61waringinkurung@gmail.com" className="hover:text-gold transition-colors">
                  kkm61waringinkurung@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-gold shrink-0" />
                <span>+62 812-3456-7890 (Humas)</span>
              </li>
            </ul>
          </div>

          {/* POJOK KANAN BAWAH: MAPS GOOGLE POSKO (BENTUK MENGOTAK) */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center justify-between border-b border-gold/20 pb-2">
              <h4 className="font-bold text-sm text-gold flex items-center gap-1.5">
                <MapPin size={16} />
                <span>Titik Lokasi Posko</span>
              </h4>
              <span className="text-[10px] text-cream/60">Waringinkurung</span>
            </div>
            
            {/* Aspect Ratio Mengotak (aspect-square / aspect-4/3) */}
            <div className="w-full aspect-4/3 max-h-56 rounded-2xl overflow-hidden border border-gold/30 shadow-md">
              <iframe
                title="Peta Lokasi Posko KKM 61"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.123!2d106.088!3d-6.115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e418df4d9893d2d%3A0x401e8f1fc28c1f0!2sWaringinkurung%2C%20Serang%20Regency%2C%20Banten!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>

        {/* COPYRIGHT BOTTOM BAR */}
        <div className="border-t border-gold/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/60">
          <p>© 2026 KKM Kelompok 61 Universitas Bina Bangsa. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart size={13} className="text-red-400 fill-red-400" />
            <span>oleh Tim Humas & IT KKM 61</span>
          </p>
        </div>
      </div>
    </footer>
  )
}