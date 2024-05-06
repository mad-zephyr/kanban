'use client'

import { FC, useEffect, useMemo, useState } from 'react'
import cn from 'classnames'
import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd'

import { useAppContext } from '@/context/app.context'
import type { BoardStatus, Task } from '@/context/todo.context'
import Modal from '@/components/ui/modal/modal'

import styles from './styles.module.sass'
import { BoardColumn, BoardColumnNew } from './components'
import { BoardTaskCombinedForm } from './components/board-task/components/combined-form/board-task-combined-form'

export const Board: FC = () => {
  const [showTaskModal, setShowTaskModal] = useState(false)

  const isSidebarOpen = useAppContext((state) => state.sidebarOpen)
  const editedTask = useAppContext((state) => state.editedTask)
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardId)
  )

  const boardStatuses =
    activeBoard?.statuses && activeBoard?.statuses.length
      ? activeBoard.statuses
      : []

  const allTasks = useAppContext((state) => state.tasks)
  const { setEditedTask, updateTasks } = useAppContext.getState()

  const statusesQty = boardStatuses?.length

  const handleCloseModalTask = () => {
    setShowTaskModal(false)
    setEditedTask()
  }

  useEffect(() => {
    setShowTaskModal(!!editedTask)
  }, [editedTask])

  // const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
  //   if (result.combine) {
  //     if (result.type === 'COLUMN') {
  //       const shallow = [...ordered]
  //       shallow.splice(result.source.index, 1)
  //       setOrdered(shallow)
  //       return
  //     }

  //     const column = columns[result.source.droppableId]
  //     const withQuoteRemoved = [...column]

  //     withQuoteRemoved.splice(result.source.index, 1)

  //     const orderedColumns = {
  //       ...columns,
  //       [result.source.droppableId]: withQuoteRemoved,
  //     }
  //     setColumns(orderedColumns)
  //     return
  //   }

  //   // dropped nowhere
  //   if (!result.destination) {
  //     return
  //   }

  //   const source = result.source
  //   const destination = result.destination

  //   // did not move anywhere - can bail early
  //   if (
  //     source.droppableId === destination.droppableId &&
  //     source.index === destination.index
  //   ) {
  //     return
  //   }

  //   // reordering column
  //   if (result.type === 'COLUMN') {
  //     const reorderedorder = reorder(ordered, source.index, destination.index)

  //     setOrdered(reorderedorder)

  //     return
  //   }

  //   const data = reorderQuoteMap({
  //     quoteMap: columns,
  //     source,
  //     destination,
  //   })

  //   setColumns(data.quoteMap)
  // }

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, draggableId, type, source } = result

    console.log('DRAAAAD', result)
    if (!destination || !draggableId) {
      return
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    if (type === 'COLUMN') {
      const updatedSourceTasks = allTasks[source.droppableId]
      const updatedDestinationTasks = allTasks[destination?.droppableId]?.length
        ? allTasks[destination?.droppableId]
        : []

      const dragableTask = updatedSourceTasks[source.index]

      if (!dragableTask) return

      updatedSourceTasks.splice(source.index, 1)
      updatedDestinationTasks.splice(destination.index, 0, dragableTask)

      updateTasks({
        ...allTasks,
        [destination.droppableId]: updatedDestinationTasks,
        [source.droppableId]: updatedSourceTasks,
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className={cn(styles.content, {
          [styles.content_expanded]: !isSidebarOpen,
        })}
      >
        {!!statusesQty && (
          <div className={styles.wrapper}>
            {boardStatuses?.map((boardStatus, index) => (
              <BoardColumn
                key={boardStatus.id}
                column={boardStatus}
                tasks={allTasks[boardStatus.id]}
              />
            ))}
          </div>
        )}

        <BoardColumnNew />

        <Modal isOpen={showTaskModal} onOpenChange={handleCloseModalTask}>
          <BoardTaskCombinedForm handleCloseModalTask={handleCloseModalTask} />
        </Modal>
      </div>
    </DragDropContext>
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
