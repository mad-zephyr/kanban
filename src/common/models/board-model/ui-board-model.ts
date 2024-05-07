import { v4 as uuid4 } from 'uuid'

import { Board, BoardStatus, SubTask, Task } from '@/context/todo.context'

type ServerSubTask = {
  title: string
  isCompleted: boolean
}

type ServerTask = {
  title: string
  description: string
  status: string
  subtasks: ServerSubTask[]
}

type ServerStatus = {
  name: string
  tasks: ServerTask[]
}

export type ServerBoard = {
  name: string
  columns: ServerStatus[]
}

type MockServerResponse = ServerBoard[]

type UiType = {
  boards: Board[]
  tasks: {
    [x: string]: Task[]
  }
}

const getSubtasks = (subtasks: ServerSubTask[]): SubTask[] => {
  return subtasks.map((subTask) => ({
    id: uuid4(),
    name: subTask.title,
    done: subTask.isCompleted,
  }))
}

const getTasks = (serverTasks: ServerTask[], statusId: string): Task[] => {
  return serverTasks.map((uiTask) => ({
    description: uiTask.description || '',
    id: uuid4(),
    name: uiTask.title,
    statusID: statusId,
    subTasks: getSubtasks(uiTask.subtasks),
  }))
}

const getStatuseAndTasks = (
  columns: ServerStatus[]
): [BoardStatus[], Record<BoardStatus['id'], Task[]>] => {
  const statuses: BoardStatus[] = []
  const tasks: Record<BoardStatus['id'], Task[]> = {}

  columns.forEach((column, index) => {
    const color = ['#ffe259', 'green', '#ff75c3', '#cb356b', '#40e0d0']
    const columnId = uuid4()

    statuses.push({ name: column.name, id: columnId, bg: color[index] })
    tasks[columnId] = getTasks(column.tasks, columnId)
  })

  return [statuses, tasks]
}

export const UiBoardModel = (mockServerData: ServerBoard[]): UiType => {
  const uiData: UiType = {
    boards: [],
    tasks: {},
  }

  for (const serverBoard of mockServerData) {
    const boardId = uuid4()

    const [statuses, tasks] = getStatuseAndTasks(serverBoard.columns)

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
