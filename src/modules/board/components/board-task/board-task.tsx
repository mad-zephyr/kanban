import { FC } from 'react'
import { Text } from '@radix-ui/themes'

import { Progress } from '@/components/ui/index'

import { TBoardTask } from './board-task.props'
import styles from './styles.module.sass'

export const BoardTask: FC<TBoardTask> = ({ data, onClick, progressBg }) => {
  const countDoneTasks = data.subTasks.filter((subTask) => subTask.done).length
  const totalSubTasks = data.subTasks.length

  return (
    <div className={styles.card} onClick={onClick}>
      <Text className={styles.title}>{data.name}</Text>
      <Text
        className={styles.subtitle}
      >{`${countDoneTasks} of ${totalSubTasks} subtasks`}</Text>
      <div className={styles.progress}>
        <Progress
          background={progressBg}
          progress={(100 / totalSubTasks) * countDoneTasks}
        />
      </div>
    </div>
  )
}
