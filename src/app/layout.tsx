'use client'

import { ReactNode } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Flex } from '@radix-ui/themes'

import { ThemeProvider } from '@/providers/theme.provider'
import { Header, InformCenter, Sidebar } from '@/modules'
import { Toaster } from '@/components/ui'
import { MODAL_ROOT_ID } from '@/common/constants'

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
    <html lang="en">
      <body className={jakartaFont.variable}>
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  )
}
