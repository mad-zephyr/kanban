import { v4 as uuid4 } from 'uuid'

import {
  Board,
  BoardStatus,
  SubTask,
  Task,
} from '@/common/context/todo.context'

type ServerSubTask = {
  id?: string
  name: string
  done: boolean
}

type ServerTask = {
  id?: string
  name: string
  description: string
  status: string
  subtasks: ServerSubTask[]
}

type ServerStatus = {
  id?: string
  name: string
  bg?: string
  tasks: ServerTask[]
}

export type ServerBoard = {
  id?: string
  name: string
  ownerId: string
  statuses: ServerStatus[]
}

type MockServerResponse = ServerBoard[]

type UiType = {
  boards: Board[]
  tasks: {
    [x: string]: Task[]
  }
}

const getSubtasks = (subtasks: ServerSubTask[]): SubTask[] =>
  subtasks.map((subTask) => ({
    id: subTask.id ? subTask.id : uuid4(),
    name: subTask?.name,
    done: subTask.done || subTask.done,
  }))

const getTasks = (boardTasks: ServerTask[] = [], statusId: string): Task[] => {
  return boardTasks.map((uiTask) => {
    const taskId = uiTask.id ? uiTask.id : uuid4()
    return {
      description: uiTask.description || '',
      id: taskId,
      name: uiTask?.name,
      statusId: statusId,
      subTasks: getSubtasks(uiTask.subtasks),
    }
  })
}

const getStatuseAndTasks = (
  boardStatuses: ServerStatus[]
): [BoardStatus[], Record<BoardStatus['id'], Task[]>] => {
  const statuses: BoardStatus[] = []
  const tasks: Record<BoardStatus['id'], Task[]> = {}

  boardStatuses.forEach((status, index) => {
    const color = ['#ffe259', 'green', '#ff75c3', '#cb356b', '#40e0d0']
    const columnId = status?.id ? status.id : uuid4()

    const bg = status.bg ? status.bg! : color[index]

    statuses.push({ name: status.name, id: columnId, bg })
    tasks[columnId] = status?.tasks
      ? getTasks(status?.tasks || [], columnId)
      : []
  })

  return [statuses, tasks]
}

export const UiBoardModel = (mockServerData: ServerBoard[]): UiType => {
  const uiData: UiType = {
    boards: [],
    tasks: {},
  }

  if (!mockServerData.length) {
    return uiData
  }

  for (const serverBoard of mockServerData) {
    const boardId = serverBoard?.id ? serverBoard.id : uuid4()

    const [statuses, tasks] = getStatuseAndTasks(serverBoard.statuses)

    const curentBoard: Board = {
      id: boardId,
      name: serverBoard.name,
      statuses: statuses,
    }

    uiData.boards = [...uiData.boards, curentBoard]
    uiData.tasks = {
      ...tasks,
      ...uiData.tasks,
    }
  }

  return uiData
}
