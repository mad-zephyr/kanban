import { Heading } from '@radix-ui/themes'
import { FC, ReactElement } from 'react'
import cn from 'classnames'

import ListIcon from '@/assets/icon-board.svg'

import styles from './styles.module.sass'

type TListItem = {
  text: string
  prefix?: ReactElement
  className?: string
  onClick: () => void
  isActive?: boolean
}

export type Ref = HTMLLIElement

export const ListItem: FC<TListItem> = ({
  text,
  prefix,
  onClick,
  className,
  isActive,
}) => {
  const handlerOnClick = () => {
    onClick()
  }
  return (
    <li
      className={cn(styles.item, { [styles.active]: isActive }, className)}
      onClick={handlerOnClick}
    >
      {prefix ? prefix : <ListIcon />}
      <Heading as="h4" size={'3'}>
        {text}
      </Heading>
    </li>
  )
}
