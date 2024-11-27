import { SignJWT, jwtVerify } from 'jose'
import * as v from 'valibot'

import { env } from '@/config/server'

const key = new TextEncoder().encode(env.AUTH_SECRET)

const SessionSchema = v.object({
  user: v.pipe(
    v.object({
      id: v.pipe(v.string(), v.nonEmpty()),
      role: v.pipe(v.string(), v.nonEmpty()),
    }),

    v.check(({ role }) => ['ADMIN', 'USER'].includes(role)),
  ),
  expires: v.pipe(v.string(), v.nonEmpty()),
})

export type SessionInput = v.InferInput<typeof SessionSchema>
export type Session = v.InferOutput<typeof SessionSchema>

export async function signToken(payload: SessionInput, expiresAt: Date) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(key)
}

export async function verifyToken(input: string) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })

  return v.parse(SessionSchema, payload)
}
