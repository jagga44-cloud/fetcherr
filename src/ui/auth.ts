import { randomBytes } from 'crypto'
import { config } from '../config.js'

// In-memory session store: token → expiry timestamp (ms)
const sessions = new Map<string, number>()

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export function createSession(): string {
  const token = randomBytes(32).toString('hex')
  sessions.set(token, Date.now() + SESSION_TTL_MS)
  return token
}

export function isValidSession(token: string): boolean {
  const expiry = sessions.get(token)
  if (!expiry) return false
  if (Date.now() > expiry) {
    sessions.delete(token)
    return false
  }
  return true
}

export function deleteSession(token: string): void {
  sessions.delete(token)
}

export function checkCredentials(username: string, password: string): boolean {
  if (!config.uiPassword) return true // no auth configured — accept anything
  return username === config.uiUsername && password === config.uiPassword
}

export function getSessionCookie(token: string): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000)
  return `infuse_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`
}

export function clearSessionCookie(): string {
  return `infuse_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
}

export function getTokenFromCookie(cookieHeader: string | undefined): string | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(/(?:^|;\s*)infuse_session=([^;]+)/)
  return match ? match[1] : null
}
