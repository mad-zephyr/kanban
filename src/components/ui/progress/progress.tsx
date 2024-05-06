import React, { FC, useEffect, useState } from 'react'
import * as P from '@radix-ui/react-progress'

import styles from './styles.module.sass'

type TProgress = {
  background?: string
  progress: number
}

export const Progress: FC<TProgress> = ({
  background = 'var(--gray-7)',
  progress,
}) => {
  return (
    <P.Root
      className={styles.ProgressRoot}
      value={progress}
      style={{
        backgroundColor: `color-mix(in srgb, ${background} 30%, tranparent)`,
      }}
    >
      <P.Indicator
        className={styles.ProgressIndicator}
        style={{
          transform: `translateX(-${100 - progress}%)`,
          background,
        }}
      />
    </P.Root>
  )
}
