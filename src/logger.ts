// In-memory ring buffer — captures console.* and Fastify logger calls for the UI log viewer

import type { FastifyInstance } from 'fastify'

export interface LogEntry {
  time: string
  level: 'info' | 'warn' | 'error'
  msg: string
}

const MAX = 1000
const buf: LogEntry[] = []

function add(level: LogEntry['level'], msg: string) {
  buf.push({ time: new Date().toISOString(), level, msg })
  if (buf.length > MAX) buf.shift()
}

// Capture console.* calls (trakt.ts, tmdb.ts etc. use console.log)
const _clog   = console.log.bind(console)
const _cwarn  = console.warn.bind(console)
const _cerror = console.error.bind(console)

console.log   = (...a: unknown[]) => { _clog(...a);   add('info',  a.map(String).join(' ')) }
console.warn  = (...a: unknown[]) => { _cwarn(...a);  add('warn',  a.map(String).join(' ')) }
console.error = (...a: unknown[]) => { _cerror(...a); add('error', a.map(String).join(' ')) }

// Wrap Fastify's pino logger after app creation
function extract(obj: unknown, msg?: string): string {
  if (typeof obj === 'string') return obj
  if (msg)                     return msg
  if (obj && typeof obj === 'object' && 'msg' in obj) return String((obj as Record<string, unknown>).msg)
  return ''
}

export function wrapFastifyLogger(app: FastifyInstance) {
  const o = { info: app.log.info.bind(app.log), warn: app.log.warn.bind(app.log), error: app.log.error.bind(app.log) }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(app.log as any).info  = (obj: unknown, msg?: string) => { o.info(obj as never, msg as never);  add('info',  extract(obj, msg)) }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(app.log as any).warn  = (obj: unknown, msg?: string) => { o.warn(obj as never, msg as never);  add('warn',  extract(obj, msg)) }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(app.log as any).error = (obj: unknown, msg?: string) => { o.error(obj as never, msg as never); add('error', extract(obj, msg)) }
}

export function getLogs(level?: string): LogEntry[] {
  const all = [...buf].reverse()
  if (!level || level === 'all') return all
  return all.filter(e => e.level === level)
}
