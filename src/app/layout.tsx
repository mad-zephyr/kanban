'use client'

import { ReactNode } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Flex } from '@radix-ui/themes'

import { Persist } from '@/modules/persist/persist'
import { MODAL_ROOT_ID } from '@/common/constants'
import { Header, InformCenter, Sidebar } from '@/modules'
import { ThemeProvider } from '@/common/providers/theme.provider'
import { Toaster } from '@/components/ui'
import { QueryProvider } from '@/common/providers/query.provider'
import { AuthProvider } from '@/common/providers/auth.provider'

import '@radix-ui/themes/styles.css'

import styles from './styles.module.sass'

import './globals.css'

const jakartaFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plus_jakarta_sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body className={jakartaFont.variable}>
          <ThemeProvider>
            <AuthProvider>
              <Toaster>
                <InformCenter>
                  <>
                    <Flex className={styles.main}>
                      <Header />
                      <Sidebar />
                      {children}
                    </Flex>
                    <div id={MODAL_ROOT_ID} />
                  </>
                </InformCenter>
              </Toaster>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </QueryProvider>
  )
}
