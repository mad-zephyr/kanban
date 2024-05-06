'use client'

import * as ToastPrimitive from '@radix-ui/react-toast'
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Toast, TToast } from './components'
import './style.sass'

type TToastContext = {
  success: (payload: any) => void
  error: (payload: any) => void
  base: (payload: TToast) => void
}

const ToastContextDefault: TToastContext = {
  success: () => {},
  error: () => {},
  base: () => {},
}

type TToastContextImpl = {
  sortToasts: () => void
  toastElementsMapRef?: RefObject<Map<string, HTMLElement>>
}

const ToastContextImplDefault: TToastContextImpl = {
  sortToasts: () => {},
}

const ToastContext = createContext<TToastContext>(ToastContextDefault)
const ToastContextImpl = createContext<TToastContextImpl>(
  ToastContextImplDefault
)

const ANIMATION_OUT_DURATION = 550

export const Toaster = ({ children, ...props }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState(new Map())
  const toastElementsMapRef = useRef(new Map())
  const viewportRef = useRef<HTMLOListElement>(null)

  const sortToasts = useCallback(() => {
    const toastElements = Array.from(toastElementsMapRef.current).reverse()
    const heights: number[] = []

    toastElements.forEach(([, toast], index) => {
      if (!toast) return
      const height = toast.clientHeight
      heights.push(height)
      const frontToastHeight = heights[0]
      toast.setAttribute('data-front', index === 0)
      toast.setAttribute('data-hidden', index > 2)
      toast.style.setProperty('--index', index)
      toast.style.setProperty('--height', `${height}px`)
      toast.style.setProperty('--front-height', `${frontToastHeight}px`)
      const hoverOffsetY = heights
        .slice(0, index)
        .reduce((res, next) => (res += next), 0)
      toast.style.setProperty('--hover-offset-y', `-${hoverOffsetY}px`)
    })
  }, [])

  const handleAddToast = useCallback((toast: TToast) => {
    setToasts((currentToasts) => {
      const newMap = new Map(currentToasts)
      newMap.set(String(Date.now()), { ...toast, open: true })
      return newMap
    })
  }, [])

  const handleRemoveToast = useCallback((key: string) => {
    setToasts((currentToasts) => {
      const newMap = new Map(currentToasts)
      newMap.delete(key)
      return newMap
    })
  }, [])

  const handleDispatchDefault = useCallback(
    (payload: TToast) => handleAddToast({ ...payload, status: 'default' }),
    [handleAddToast]
  )

  const handleDispatchSuccess = useCallback(
    (payload: any) => handleAddToast({ ...payload, status: 'success' }),
    [handleAddToast]
  )

  const handleDispatchError = useCallback(
    (payload: any) => handleAddToast({ ...payload, status: 'error' }),
    [handleAddToast]
  )

  useEffect(() => {
    const viewport = viewportRef.current

    if (viewport) {
      const handleFocus = () => {
        toastElementsMapRef.current.forEach((toast) => {
          toast.setAttribute('data-hovering', 'true')
        })
      }

      const handleBlur = (event: any) => {
        if (!viewport.contains(event.target) || viewport === event.target) {
          toastElementsMapRef.current.forEach((toast) => {
            toast.setAttribute('data-hovering', 'false')
          })
        }
      }

      viewport.addEventListener('pointermove', handleFocus)
      viewport.addEventListener('pointerleave', handleBlur)
      viewport.addEventListener('focusin', handleFocus)
      viewport.addEventListener('focusout', handleBlur)

      return () => {
        viewport.removeEventListener('pointermove', handleFocus)
        viewport.removeEventListener('pointerleave', handleBlur)
        viewport.removeEventListener('focusin', handleFocus)
        viewport.removeEventListener('focusout', handleBlur)
      }
    }
  }, [])

  return (
    <ToastContext.Provider
      value={useMemo(
        () => ({
          success: handleDispatchSuccess,
          error: handleDispatchError,
          base: handleDispatchDefault,
        }),
        [handleDispatchDefault, handleDispatchError, handleDispatchSuccess]
      )}
    >
      <ToastContextImpl.Provider
        value={useMemo(
          () => ({
            toastElementsMapRef,
            sortToasts,
          }),
          [sortToasts]
        )}
      >
        <ToastPrimitive.Provider {...props}>
          {children}
          {Array.from(toasts).map(([key, toast]) => (
            <Toast
              key={key}
              id={key}
              toast={toast}
              onOpenChange={(open: boolean) => {
                if (!open) {
                  toastElementsMapRef.current.delete(key)
                  sortToasts()
                  if (!open) {
                    setTimeout(() => {
                      handleRemoveToast(key)
                    }, ANIMATION_OUT_DURATION)
                  }
                }
              }}
            />
          ))}
          <ToastPrimitive.Viewport
            ref={viewportRef}
            className="ToastViewport"
          />
        </ToastPrimitive.Provider>
      </ToastContextImpl.Provider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context) return context
  throw new Error('useToast must be used within Toasts')
}

export const useToastContext = () => {
  const context = useContext(ToastContextImpl)
  if (context) return context
  throw new Error('useToast must be used within Toasts')
}
