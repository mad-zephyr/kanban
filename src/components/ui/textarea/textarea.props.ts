import { ReactElement, TextareaHTMLAttributes } from 'react'
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
} from 'react-hook-form'

export type TTextarea = TextareaHTMLAttributes<HTMLInputElement> &
  FieldValues &
  FieldErrors & {
    label?: string
    fieldState: ControllerFieldState
    field: ControllerRenderProps
    postfix?: ReactElement
    prefix?: ReactElement
  }
