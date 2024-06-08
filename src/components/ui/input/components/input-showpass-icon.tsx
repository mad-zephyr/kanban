import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import { FC, HTMLInputTypeAttribute } from 'react'

type TPassIconEye = {
  className?: string
  type?: HTMLInputTypeAttribute
  onClick?: () => void
}

export const PassIconEye: FC<TPassIconEye> = ({ type, className, onClick }) => {
  return type === 'password' ? (
    <EyeClosedIcon onClick={onClick} className={className} />
  ) : (
    <EyeOpenIcon onClick={onClick} className={className} />
  )
}
