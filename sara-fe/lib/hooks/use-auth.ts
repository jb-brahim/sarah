import { useEffect, useState } from 'react'

export interface User {
  id: string
  name: string
  email: string
  isAdmin?: boolean
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore user and token from localStorage on mount
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('authToken')
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user:', e)
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }
    setLoading(false)
  }, [])

  const saveAuth = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return { user, setUser: saveAuth, logout, loading, isLoading: loading }
}
