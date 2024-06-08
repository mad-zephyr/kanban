'use client'

import { Theme } from '@radix-ui/themes'
import { FC, ReactElement } from 'react'

import { useAppContext } from '@/common/context/app.context'

type TThemeProvider = {
  children: ReactElement | ReactElement[]
}

export const ThemeProvider: FC<TThemeProvider> = ({ children }) => {
  const lightTheme = useAppContext((state) => state.lightTheme)

  return (
    <Theme radius={'full'} appearance={lightTheme ? 'light' : 'dark'}>
      {children}
    </Theme>
  )
}
