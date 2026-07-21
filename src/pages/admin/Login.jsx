import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config'
import { Lock, User, Loader2, LogIn } from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()
  const ENDPOINT_LOGIN = `${API_BASE_URL}/login`

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const response = await fetch(ENDPOINT_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Simpan status login
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('adminUser', JSON.stringify(data.user || { username }))

        // Pindah halaman ke dashboard admin
        navigate('/admin/dashboard', { replace: true })
      } else {
        setErrorMsg(data.message || 'Username atau password salah!')
      }
    } catch (err) {
      console.error('Error logging in:', err)
      setErrorMsg('Gagal terhubung ke server backend. Pastikan koneksi dan API aktif.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center font-body p-4">
      <div className="bg-white rounded-3xl border border-gold/30 shadow-xl p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary text-gold rounded-2xl flex items-center justify-center mx-auto border border-gold/30">
            <Lock size={22} />
          </div>
          <h2 className="text-2xl font-bold text-primary">Login Administrator</h2>
          <p className="text-xs text-gray-500">
            Masukan kredensial untuk mengelola data KKM Kelompok 61.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-xl border border-red-200 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-600">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-gold font-bold py-3 rounded-xl shadow-md hover:bg-[#163359] transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Masuk ke Panel Admin</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}