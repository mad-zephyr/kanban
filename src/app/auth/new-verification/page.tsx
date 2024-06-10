'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'

import { newVerificationToken } from '@/actions/new-verification'
import { Callout } from '@/components/ui'

export default function NewVerification() {
  const searchParams = useSearchParams()
  const [formStatus, setFormStatus] = useState<{
    type?: 'error' | 'success'
    message?: string
  }>({})

  const token = searchParams.get('token')

  const onSubmit = useCallback(async () => {
    if (token) {
      setFormStatus({ type: 'error', message: `Missing token` })
    }

    if (token) {
      const verificationStatus = await newVerificationToken(token)
      setFormStatus(verificationStatus)
    }
  }, [token])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <div style={{ padding: '24px' }}>
      <h1>Email verification</h1>
      {!formStatus?.type && <BeatLoader />}

      {formStatus?.message && (
        <Callout
          text={formStatus?.message}
          color={formStatus?.type === 'error' ? 'red' : 'green'}
          size={'1'}
          variant="outline"
        />
      )}
    </div>
  )
}
