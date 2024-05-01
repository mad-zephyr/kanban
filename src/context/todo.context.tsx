import { StoreApi } from 'zustand'

export type SubTask = {
  id: string
  name: string
  done: boolean
}

export type Task = {
  id: string
  name: string
  description: string
  statusID: string
  subTasks: SubTask[] | []
}

export type BoardStatus = {
  id: string
  name: string
  bg: string
}

export type Board = {
  id: string
  name: string
  statuses: BoardStatus[]
}

export type TodoSliceContext = {
  tasks: Task[]
  editedTask?: Task
  boards: Board[]
  activeBoardID: string
}

export type TodoSliceAction = {
  createTask: (task: Task) => void
  updateTask: (task: Task) => void
  deleteTask: (taskId: string) => void
  setEditedTask: (task?: Task) => void

  addBoard: (board: Board) => void
  updateBoard: (board: Board) => void
  setActiveBoard: (boardId: string) => void
  removeBoard: (boardId: string) => void

  // TO DO
  // addBoard: (board: Board) => void
}

export type TodoContext = TodoSliceContext & TodoSliceAction

export const todoContext = (
  set: StoreApi<TodoContext>['setState'],
  get: StoreApi<TodoContext>['getState']
) => ({
  boards: [],
  tasks: [],
  editedTask: undefined,
  activeBoardID: '',

  addBoard: (board: Board) =>
    set((state) => ({
      boards: state?.boards ? [...state.boards, board] : [board],
      activeBoardID: board.id,
    })),

  updateBoard: (board: Board) =>
    set((state) => {
      const boardIndexToReplace = state.boards.findIndex(
        (eachBoard) => eachBoard.id === board.id
      )
      return { boards: state.boards.toSpliced(boardIndexToReplace, 1, board) }
    }),

  setActiveBoard: (boardID: string) =>
    set((state) => ({
      activeBoardID: boardID,
    })),

  removeBoard: (boardID: string) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardID),
    })),

  createTask: (task: Task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (updatedTask: Task) =>
    set((state) => {
      const taskIndexToUpdate = state.tasks.findIndex(
        (task) => task.id === updatedTask.id
      )

      return { tasks: state.tasks.toSpliced(taskIndexToUpdate, 1, updatedTask) }
    }),

  deleteTask: (taskId: string) =>
    set((state) => {
      const taskIndex = state.tasks.findIndex((task) => task.id === taskId)

      return { tasks: state.tasks.toSpliced(taskIndex, 1) }
    }),

  setEditedTask: (task?: Task) => set((state) => ({ editedTask: task })),
})
