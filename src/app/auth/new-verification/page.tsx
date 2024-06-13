import { Suspense } from 'react'

import NewUserVerification from '@/views/newUserVerificationView'

export default function NewVerification() {
  return (
    <Suspense>
      <NewUserVerification />
    </Suspense>
  )
}
