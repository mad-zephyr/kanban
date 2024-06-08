'use server'

import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import {
  LoginAuthFormSchema,
  LoginAuthFormSchemaType,
} from '@/common/schemas/login'

export const login = async (
  values: LoginAuthFormSchemaType
): Promise<{ type: 'error' | 'success'; message: string }> => {
  const validatedFields = LoginAuthFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return { type: 'error', message: 'Wrong credentials' }
  }

  const { email, password } = validatedFields.data

  try {
    const redirectUrl = await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })

    if (redirectUrl) {
      goToPage()
      return { type: 'success', message: 'Welcome back' }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return {
            type: 'error',
            message: 'Wrong credentials or user doesn`t exist',
          }
        }
        default: {
          return { type: 'error', message: 'Something goes wrong' }
        }
      }
    }
    throw error
  }

  return { type: 'success', message: 'Welcome back' }
}

function goToPage() {
  console.log('DEFAULT_LOGIN_REDIRECT: ', DEFAULT_LOGIN_REDIRECT)
  redirect(DEFAULT_LOGIN_REDIRECT)
}
