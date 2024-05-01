import { Switch } from '@radix-ui/themes'
import { FC, MouseEvent, ReactElement } from 'react'

import styles from './styles.module.sass'

type TSwitcher = {
  onChange: (name: string) => void
  name: string
  prefix?: ReactElement | string | number
  postfix?: ReactElement | string | number
  isOn: boolean
}

export const Switcher: FC<TSwitcher> = ({
  postfix,
  prefix,
  name,
  onChange,
  isOn,
}) => {
  const changeHandler = ({ target }: MouseEvent<HTMLButtonElement>) => {
    onChange(name)
  }
  return (
    <div className={styles.main}>
      {prefix}
      <Switch checked={isOn} name={name} size={'2'} onClick={changeHandler} />
      {postfix}
    </div>
  )
}
