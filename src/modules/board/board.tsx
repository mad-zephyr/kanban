'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'

import { useAppContext } from '@/context/app.context'
import type { BoardStatus, Task } from '@/context/todo.context'
import Modal from '@/components/ui/modal/modal'

import styles from './styles.module.sass'
import { BoardColumn, BoardTask } from './components'
import { BoardTaskCombinedForm } from './components/board-task/components/combined-form/board-task-combineed-form'

export const Board: FC = () => {
  const [showTaskModal, setShowTaskModal] = useState(false)

  const isSidebarOpen = useAppContext((state) => state.sidebarOpen)
  const editedTask = useAppContext((state) => state.editedTask)
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardID)
  )
  const allTasks = useAppContext((state) => state.tasks)
  const { setEditedTask } = useAppContext.getState()

  const statusesQty = activeBoard?.statuses.length

  const tasks = useMemo(
    () => groupTasksForCurrentBoard(activeBoard?.statuses || [], allTasks),
    [activeBoard?.statuses, allTasks]
  )

  const handleCloseModalTask = () => {
    setShowTaskModal(false)
    setEditedTask()
  }

  useEffect(() => {
    setShowTaskModal(!!editedTask)
  }, [editedTask])

  return (
    <div
      className={cn(styles.content, {
        [styles.content_expanded]: !isSidebarOpen,
      })}
    >
      {!!statusesQty && (
        <div className={styles.wrapper}>
          {activeBoard?.statuses?.map((status) => (
            <div className={styles.column} key={status.id}>
              <div className={styles.header}>
                <div
                  className={styles.indicator}
                  style={{ background: status.bg }}
                />
                {status.name}
              </div>

              <div
                className={cn(styles.column_content, {
                  [styles.column_empty]: !tasks?.[status.id].length,
                })}
              >
                {tasks?.[status.id]?.map((task) => (
                  <BoardTask
                    onClick={() => setEditedTask(task)}
                    key={task.id}
                    data={task}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <BoardColumn />

      <Modal isOpen={showTaskModal} onOpenChange={handleCloseModalTask}>
        <BoardTaskCombinedForm handleCloseModalTask={handleCloseModalTask} />
      </Modal>
    </div>
  )
}

function groupTasksForCurrentBoard(statuses: BoardStatus[], allTasks: Task[]) {
  return statuses.reduce<Record<string, Task[]>>((all, status) => {
    const taskLinkedWithStatus = allTasks.filter(
      (task) => task.statusID === status.id
    )

    return {
      ...all,
      [status.id]: taskLinkedWithStatus,
    }
  }, {})
}
