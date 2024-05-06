import { FC, useLayoutEffect, useRef } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import {
  CheckCircledIcon,
  Cross2Icon,
  CrossCircledIcon,
} from '@radix-ui/react-icons'

import { useToastContext } from '../../toaster'

export type TToast = {
  type: 'foreground' | 'background'
  status: 'default' | 'success' | 'error'
  duration?: number
  title: string
  description: string
  actionText?: string
}

type TToastProps = ToastPrimitive.ToastProps & {
  onOpenChange: (open: boolean) => void
  id: string
  toast: TToast
}

export const Toast: FC<TToastProps> = (props) => {
  const { onOpenChange, toast, id, ...toastProps } = props
  const ref = useRef<HTMLLIElement>(null)
  const { sortToasts, toastElementsMapRef } = useToastContext()
  const toastElementsMap = toastElementsMapRef?.current!

  useLayoutEffect(() => {
    if (ref.current) {
      toastElementsMap.set(id, ref.current)
      sortToasts()
    }
  }, [id, sortToasts, toastElementsMap])

  return (
    <ToastPrimitive.Root
      {...toastProps}
      ref={ref}
      type={toast.type}
      duration={toast.duration}
      className="ToastRoot"
      onOpenChange={onOpenChange}
    >
      <div className="ToastInner" data-status={toast.status}>
        <ToastStatusIcon status={toast.status} />
        <ToastPrimitive.Title className="ToastTitle">
          <p>{toast.title}</p>
        </ToastPrimitive.Title>
        <ToastPrimitive.Description className="ToastDescription">
          {toast.description}
        </ToastPrimitive.Description>
        {toast.actionText && (
          <ToastPrimitive.Action
            className="ToastAction Button small green"
            altText="Goto schedule to undo"
          >
            {toast.actionText}
          </ToastPrimitive.Action>
        )}
        <ToastPrimitive.Close aria-label="Close" className="ToastClose">
          <Cross2Icon />
        </ToastPrimitive.Close>
      </div>
    </ToastPrimitive.Root>
  )
}

const ToastStatusIcon = ({
  status,
}: {
  status: 'default' | 'success' | 'error'
}) => {
  return status !== 'default' ? (
    <div style={{ gridArea: 'icon', alignSelf: 'start' }}>
      {status === 'success' && <CheckCircledIcon />}
      {status === 'error' && <CrossCircledIcon />}
    </div>
  ) : null
}
