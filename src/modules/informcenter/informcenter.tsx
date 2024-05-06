'use client'

import { FC, ReactElement, useEffect } from 'react'

import { useToast } from '@/components/ui'
import { TToast } from '@/components/ui/toaster/components'

type TInformCenter = {
  children: ReactElement
}

const BASE_TOAST: TToast = {
  type: 'background',
  description:
    'This web app utilizes `localStorage` to store your data. Please log in to access your data across devices.',
  title: 'HI THERE!!',
  status: 'default',
}

export const InformCenter: FC<TInformCenter> = ({ children }) => {
  const { base } = useToast()

  const isAuthenticated = false

  useEffect(() => {
    if (!isAuthenticated) {
      base(BASE_TOAST)
    }
  }, [base, isAuthenticated])
  return <>{children}</>
}
