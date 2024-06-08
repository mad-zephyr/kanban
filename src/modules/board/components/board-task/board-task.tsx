import { FC } from 'react'
import { Text } from '@radix-ui/themes'
import { Draggable } from 'react-beautiful-dnd'

import { Progress } from '@/components/ui/index'
import { useAppContext } from '@/common/context/app.context'

import { TBoardTask } from './board-task.props'
import styles from './styles.module.sass'

export const BoardTask: FC<TBoardTask> = ({ data, progressBg, index }) => {
  const countDoneTasks = data.subTasks.filter((subTask) => subTask.done).length
  const totalSubTasks = data.subTasks.length

  const { setEditedTask } = useAppContext.getState()

  const handleEditTask = () => {
    setEditedTask(data)
  }

  return (
    <Draggable key={data.id} draggableId={data.id} index={index}>
      {(provide) => (
        <div
          ref={provide.innerRef}
          className={styles.card}
          onClick={handleEditTask}
          {...provide.dragHandleProps}
          {...provide.draggableProps}
        >
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
      )}
    </Draggable>
  )
}
