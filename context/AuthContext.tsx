'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type User = {
  username: string
  role: 'admin' | 'warehouse'
}

type AuthContextType = {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const mockUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'warehouse', password: 'wh123', role: 'warehouse' },
]

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('bee4-user')
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  const login = (username: string, password: string) => {
    const found = mockUsers.find(u => u.username === username && u.password === password)
    if (found) {
      const user = { username: found.username, role: found.role }
      setUser(user)
      localStorage.setItem('bee4-user', JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bee4-user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
