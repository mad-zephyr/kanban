import { FC, ReactNode, useRef } from 'react'
import cn from 'classnames'
import { Droppable, DroppableStateSnapshot } from 'react-beautiful-dnd'

import { BoardStatus, Task } from '@/context/todo.context'

import styles from './styles.module.sass'
import { BoardTask } from '../board-task/board-task'

type TBoardColumn = {
  column: BoardStatus
  tasks: Task[]
}

type D = {
  ddd: DroppableStateSnapshot
}

export const BoardColumn: FC<TBoardColumn> = ({ tasks = [], column }) => {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} className={styles.column}>
      <div className={styles.header}>
        <div className={styles.indicator} style={{ background: column.bg }} />
        <span>
          {column.name} <sup>{tasks?.length}</sup>
        </span>
      </div>

      <Droppable droppableId={column.id} type="COLUMN">
        {(provided, dropState) => (
          <div
            className={cn(styles.column_content, {
              [styles.column_empty]: !tasks.length,
            })}
            {...provided.droppableProps}
            {...dropState}
            data-using-placeholder={dropState.isUsingPlaceholder}
            ref={provided.innerRef}
          >
            {tasks?.map((task, index) => (
              <BoardTask
                index={index}
                key={task.id}
                data={task}
                progressBg={column.bg}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
