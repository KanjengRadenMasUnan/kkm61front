// src/config.js

// Otomatis mendeteksi apakah aplikasi berjalan secara lokal atau sudah di-deploy di Render
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

// Ganti URL Render di bawah ini dengan URL backend Render Anda yang sebenarnya
export const API_BASE_URL = isProduction
  ? 'https://kkm61backend.onrender.com/api'
  : `http://${window.location.hostname}:8000/api`