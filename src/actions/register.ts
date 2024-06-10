'use server'

import bcrypt from 'bcryptjs'

import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { SignupAuthFormSchemaType } from '@/common/schemas/register'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationMail } from '@/lib/mail'

const registerUser = async (
  values: SignupAuthFormSchemaType
): Promise<{ type: 'error' | 'success'; message: string }> => {
  const { email, name, password } = values

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { type: 'error', message: 'This Email already registered' }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: { email, name, password: hashedPassword },
  })

  const verificationToken = await generateVerificationToken(email)
  // TODO: send verification token email

  if (verificationToken) {
    await sendVerificationMail(
      verificationToken?.email,
      verificationToken?.token
    )
  }

  if (!user) {
    return { type: 'error', message: 'Something goes wrong' }
  }

  return { type: 'success', message: `Confirmation email sent to ${email}` }
}

export default registerUser
