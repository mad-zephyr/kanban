import { v4 as uuid } from 'uuid'

import { verificationToken } from '@/data/verification-token'

export const generateVerificationToken = async (email: string) => {
  const token = uuid()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await verificationToken.getByEmail(email)

  if (existingToken) {
    await verificationToken.delete(existingToken.id)
  }

  const createdVerificationToken = await verificationToken.create(
    email,
    token,
    expires
  )

  return createdVerificationToken
}
