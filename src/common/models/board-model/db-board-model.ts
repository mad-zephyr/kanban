import type { Board, Status, Subtask, Task } from '@prisma/client'

import type {
  Board as TBoard,
  Tasks as TTasks,
} from '@/common/context/todo.context'

type TDbBoardModelProps = {
  boards: TBoard[]
  tasks: TTasks
  ownerId: string
}

type DbBoardModel = {
  boards: Pick<Board, 'id' | 'name' | 'ownerId'>[]
  statuses: Pick<Status, 'bg' | 'id' | 'name' | 'boardId'>[]
  tasks: Pick<Task, 'id' | 'name' | 'statusId'>[]
  subtasks: Pick<Subtask, 'done' | 'id' | 'name' | 'taskId'>[]
}
export const DbBoardModel = ({
  boards,
  tasks,
  ownerId,
}: TDbBoardModelProps): DbBoardModel => {
  const dbBoards: DbBoardModel['boards'] = []
  const dbStatus: DbBoardModel['statuses'] = []
  const dbTasks: DbBoardModel['tasks'] = []
  const dbSubtasks: DbBoardModel['subtasks'] = []

  for (const board of boards) {
    const transformedDbStatuses = board.statuses.map((status) => ({
      id: status.id,
      bg: status.bg,
      name: status.name,
      boardId: board.id,
    }))

    dbStatus.push(...transformedDbStatuses)
    dbBoards.push({ id: board.id, name: board.name, ownerId: ownerId })
  }

  for (const statusKey in tasks) {
    dbTasks.push(
      ...tasks[statusKey].map((task) => {
        dbSubtasks.push(
          ...task.subTasks.map((subTask) => ({
            id: subTask.id,
            name: subTask.name,
            done: subTask.done,
            taskId: task.id,
          }))
        )

        return {
          id: task.id,
          name: task.name,
          statusId: task.statusId,
        }
      })
    )
  }

  return {
    boards: dbBoards,
    statuses: dbStatus,
    tasks: dbTasks,
    subtasks: dbSubtasks,
  }
}
