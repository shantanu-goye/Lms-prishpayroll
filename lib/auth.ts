import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET_KEY = process.env.SESSION_SECRET || 'super-secret-key'
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export interface SessionPayload {
  userId: number
  role: string
  name: string
  // jose adds exp, iat etc.
  [key: string]: any
}

export async function createSession(payload: SessionPayload) {
  // We need to sign a new token
  // Payload must be an object
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
  
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload as SessionPayload
    } catch (error) {
        return null
    }
}

export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null
  return await verifyToken(token)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
