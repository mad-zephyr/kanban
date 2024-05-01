import { FC } from 'react'

import styles from './styles.module.sass'

type TLabel = {
  text: string | number
}

export const Label: FC<TLabel> = ({ text }) => {
  return <span className={styles.main}>{text}</span>
}
