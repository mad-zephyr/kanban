import React, { FC, forwardRef } from 'react'
// import * as Av from '@radix-ui/react-avatar'
import { Avatar as Av, AvatarProps } from '@radix-ui/themes'

import styles from './styles.module.sass'

type TAvatar = AvatarProps & {
  name: string
  image?: string
}

export const Avatar: FC<TAvatar> = forwardRef(
  ({ name, image = '', fallback, size = '4', ...rest }, ref) => {
    return <Av size={size} src={image} fallback={name} {...rest} />
  }
)

Avatar.displayName = 'Avatar'
