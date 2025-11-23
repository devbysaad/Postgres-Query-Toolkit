export const API_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : 'https://postgres-query-toolkit-backend.vercel.app/';