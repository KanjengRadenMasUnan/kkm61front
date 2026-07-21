import { Link } from 'react-router-dom'
import logoImage from '../assets/logo-kkm.png'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 select-none group">
      <img
        src={logoImage}
        alt="Logo KKM 61"
        className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-gold/30 group-hover:scale-105 transition-transform"
      />
      {/* Mengubah text-lg menjadi text-sm agar tulisan lebih kecil dan rapi */}
      <span className="text-cream font-display font-bold text-sm tracking-wide drop-shadow-sm group-hover:text-gold transition-colors">
        KKM 61 WARINGINKURUNG
      </span>
    </Link>
  )
}