'use server'

import { getUserByEmail } from '@/data/user'
import { verificationToken } from '@/data/verification-token'
import { db } from '@/lib/db'

export const newVerificationToken = async (
  token: string
): Promise<{
  type?: 'error' | 'success'
  message?: string
}> => {
  const dbVerificationToken = await verificationToken.getByToken(token)

  if (!dbVerificationToken) {
    return { type: 'error', message: 'Token doesnt exist' }
  }
  const hasExpired = new Date(dbVerificationToken.expires) < new Date()

  if (hasExpired) {
    return { type: 'error', message: 'Token has expired' }
  }

  const existingUser = await getUserByEmail(dbVerificationToken.email)
  if (!existingUser) {
    return { type: 'error', message: `User doen't exist` }
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: dbVerificationToken.email,
    },
  })

  await verificationToken.delete(token)

  return {
    type: 'success',
    message: `Your ${dbVerificationToken.email} email verified`,
  }
}
