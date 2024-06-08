import React, { FC } from 'react'
// import * as Av from '@radix-ui/react-avatar'
import { Avatar as Av, AvatarProps } from '@radix-ui/themes'

import styles from './styles.module.sass'

type TAvatar = AvatarProps & {
  name: string
  image?: string
}

export const Avatar: FC<TAvatar> = ({
  name,
  image = '',
  fallback,
  size = '4',
  ...rest
}) => <Av size={size} src={image} fallback={name} {...rest} />
