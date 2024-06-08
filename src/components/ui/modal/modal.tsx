import * as Dialog from '@radix-ui/react-dialog'
import { Cross2Icon } from '@radix-ui/react-icons'
import { FC, ReactElement } from 'react'
import { IconButton } from '@radix-ui/themes'

import { ThemeProvider } from '@/common/providers/theme.provider'

import styles from './styles.module.sass'

type TModalBoardCreate = {
  title?: string
  isOpen: boolean
  onOpenChange: () => void
  children: ReactElement
  showCloseBtn?: boolean
}

const Modal: FC<TModalBoardCreate> = ({
  isOpen,
  onOpenChange,
  title,
  children,
  showCloseBtn = false,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <ThemeProvider>
          <Dialog.Content className={styles.modal}>
            {!!title && (
              <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            )}
            {children}

            {showCloseBtn && (
              <Dialog.Close asChild>
                <IconButton
                  size={'2'}
                  variant="ghost"
                  aria-label="Close"
                  className={styles.close}
                >
                  <Cross2Icon />
                </IconButton>
              </Dialog.Close>
            )}
          </Dialog.Content>
          <Dialog.Overlay className={styles.overlay} />
        </ThemeProvider>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Modal
