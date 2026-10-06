import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  const save = ({ user, token }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const login = async (email, password) =>
    save((await api.post('/login', { email, password })).data)

  const register = async (form) =>
    save((await api.post('/register', form)).data)

  const logout = async () => {
    await api.post('/logout').catch(() => {})
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  // Met à jour l'utilisateur affiché (après modification du profil).
  const updateUser = (newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser))
    setUser(newUser)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
