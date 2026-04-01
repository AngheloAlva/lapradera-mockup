import type { Access, Where } from 'payload'

interface UserWithRole {
  id: string
  role?: string
}

const getUser = (user: unknown): UserWithRole | null => {
  if (!user || typeof user !== 'object') return null
  return user as UserWithRole
}

export const isAdmin: Access = ({ req: { user } }) => {
  const u = getUser(user)
  if (!u) return false
  return u.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  const u = getUser(user)
  if (!u) return false
  return u.role === 'admin' || u.role === 'editor'
}

export const isPublished: Access = ({ req: { user } }): boolean | Where => {
  if (user) return true
  return {
    publicado: { equals: true },
  }
}
