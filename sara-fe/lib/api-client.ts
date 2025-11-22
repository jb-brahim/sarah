// Default API base should point to the deployed backend server.
// Uses `NEXT_PUBLIC_API_URL` when set (e.g. in Vercel/Render env), otherwise
// falls back to the production backend at `https://sarah-duke.onrender.com/api`.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://sarah-duke.onrender.com/api"
/*// Default API base should point to the backend server (port 3000).
// Next dev may run on 3001 if 3000 is busy, but the backend typically listens on 3000.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"*/
// Helper to get auth header with token
const getAuthHeader = () => {
  if (typeof window === 'undefined') return {}
  const token = localStorage.getItem('authToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const apiClient = {
  // Auth
  auth: {
    signUp: (email: string, password: string, name: string) =>
      fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }).then((r) => r.json()).then(res => {
        if (res.token) localStorage.setItem('authToken', res.token)
        return res
      }),

    login: (email: string, password: string) =>
      fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then((r) => r.json()).then(res => {
        if (res.token) localStorage.setItem('authToken', res.token)
        return res
      }),
    
    logout: () => {
      localStorage.removeItem('authToken')
    }
  },

  // Sites
  sites: {
    getAll: () => fetch(`${API_BASE_URL}/sites`).then((r) => r.json()),
    
    getOne: (id: string) => fetch(`${API_BASE_URL}/sites/${id}`).then((r) => r.json()),

    create: (data: { name: string; description: string; location: string; images: string[] }) =>
      fetch(`${API_BASE_URL}/sites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    update: (id: string, data: any) =>
      fetch(`${API_BASE_URL}/sites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    delete: (id: string) =>
      fetch(`${API_BASE_URL}/sites/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },

  // Hotels
  hotels: {
    getAll: (query?: string) => fetch(`${API_BASE_URL}/hotels${query ? `?${query}` : ""}`).then((r) => r.json()),
    
    getOne: (id: string) => fetch(`${API_BASE_URL}/hotels/${id}`).then((r) => r.json()),

    create: (data: { name: string; location: string; rating: number; price: number }) =>
      fetch(`${API_BASE_URL}/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    update: (id: string, data: any) =>
      fetch(`${API_BASE_URL}/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    delete: (id: string) =>
      fetch(`${API_BASE_URL}/hotels/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },

  // Tours
  tours: {
    getAll: () => fetch(`${API_BASE_URL}/tours`).then((r) => r.json()),
    
    getOne: (id: string) => fetch(`${API_BASE_URL}/tours/${id}`).then((r) => r.json()),

    create: (data: { name: string; destination: string; duration: number; price: number }) =>
      fetch(`${API_BASE_URL}/tours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    update: (id: string, data: any) =>
      fetch(`${API_BASE_URL}/tours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    delete: (id: string) =>
      fetch(`${API_BASE_URL}/tours/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },

  // Reservations
  reservations: {
    create: (data: { hotelId?: string; tourId?: string; dates: [string, string] }) =>
      fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(data),
      }).then((r) => r.json()),

    getUserReservations: () => fetch(`${API_BASE_URL}/reservations`, { 
      headers: getAuthHeader()
    }).then((r) => r.json()),
    
    getOne: (id: string) => fetch(`${API_BASE_URL}/reservations/${id}`, { 
      headers: getAuthHeader()
    }).then((r) => r.json()),
    
    update: (id: string, data: any) =>
      fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    
    cancel: (id: string) =>
      fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      }).then((r) => r.json()),
  },

  // Reviews
  reviews: {
    getByItem: (itemId: string) => fetch(`${API_BASE_URL}/reviews?itemId=${itemId}`).then((r) => r.json()),
    create: (data: { itemId: string; itemType: string; rating: number; comment?: string }) =>
      fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },

  // Wishlist
  wishlist: {
    get: () => fetch(`${API_BASE_URL}/wishlist`, { headers: getAuthHeader() }).then((r) => r.json()),
    add: (data: { itemId: string; itemType: string; meta?: any }) =>
      fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    remove: (itemId: string) =>
      fetch(`${API_BASE_URL}/wishlist/${itemId}`, { 
        method: 'DELETE', 
        headers: getAuthHeader()
      }).then((r) => r.json()),
  },

  // Payments
  payments: {
    createIntent: (amount: number) =>
      fetch(`${API_BASE_URL}/payments/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).then((r) => r.json()),
  },

  // Weather
  weather: {
    getSiteWeather: (siteId: string) => fetch(`${API_BASE_URL}/weather/${siteId}`).then((r) => r.json()),
  },

  // Translation
  translation: {
    translate: (text: string, targetLanguage: string) =>
      fetch(`${API_BASE_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ text, source: "auto", target: targetLanguage }),
      }).then((r) => r.json()),
  },

  // Recommendations
  recommendations: {
    getRecommendations: (query?: { interests?: string[]; language?: string }) =>
      fetch(`${API_BASE_URL}/recommendations${query ? `?${new URLSearchParams(query as any).toString()}` : ""}`).then(
        (r) => r.json(),
      ),

    getNearbySites: (latitude: number, longitude: number) =>
      fetch(`${API_BASE_URL}/recommendations/nearby?lat=${latitude}&lng=${longitude}`).then((r) => r.json()),
  },

  // Admin
  admin: {
    getStats: () => fetch(`${API_BASE_URL}/admin/stats`).then((r) => r.json()),

    getUsers: () => fetch(`${API_BASE_URL}/admin/users`).then((r) => r.json()),
  },
}
