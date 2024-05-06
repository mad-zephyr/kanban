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
  subTasks: SubTask[]
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

type Tasks = Record<BoardStatus['id'], Task[]>

export type TodoSliceContext = {
  boards: Board[]
  editedTask?: Task
  activeBoardId: string
  tasks: Tasks
}

export type TodoSliceAction = {
  addBoard: (board: Board) => void
  updateBoard: (board: Board) => void
  removeBoard: (boardId: string) => void

  createTask: (task: Task) => void
  updateTask: (task: Task, previousStatusId: string) => void
  deleteTask: (task: Task) => void

  updateTasks: (tasks: Tasks) => void

  setActiveBoard: (boardId: string) => void
  setEditedTask: (task?: Task) => void
}

export type TodoContext = TodoSliceContext & TodoSliceAction

export const todoContext = (
  set: StoreApi<TodoContext>['setState'],
  get: StoreApi<TodoContext>['getState']
) => ({
  activeBoardId: '',
  boards: [],
  tasks: {},

  addBoard: (board: Board) =>
    set((state) => ({
      boards: state.boards.length ? [...state.boards, board] : [board],
      activeBoardId: board.id,
    })),

  updateBoard: (board: Board) =>
    set((state) => {
      const boardIndexToReplace = state.boards.findIndex(
        (eachBoard) => eachBoard.id === board.id
      )
      return { boards: state.boards.toSpliced(boardIndexToReplace, 1, board) }
    }),

  setActiveBoard: (boardID: string) =>
    set((state) => {
      return {
        activeBoardId: boardID,
      }
    }),

  removeBoard: (boardID: string) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== boardID),
      activeBoardId: undefined,
    })),

  createTask: (task: Task) =>
    set((state) => {
      const currentTasks = state.tasks[task.statusID]
      const updTasks = currentTasks?.length ? [...currentTasks, task] : [task]

      return {
        tasks: {
          ...state.tasks,
          [task.statusID]: updTasks,
        },
      }
    }),

  updateTask: (updatedTask: Task, previousStatusId: string) =>
    set((state) => {
      const sourceTasks = state.tasks[previousStatusId]
      const destinationTasks = state.tasks[updatedTask.statusID]?.length
        ? state.tasks[updatedTask.statusID]
        : []

      const sourceTaskIndex = sourceTasks.findIndex(
        (task) => task.id === updatedTask.id
      )

      sourceTasks.splice(sourceTaskIndex, 1)

      const taskIndexToUpdate = destinationTasks.findIndex(
        (task) => task.id === updatedTask.id
      )

      const updatedTasks =
        taskIndexToUpdate < 0
          ? [...destinationTasks, updatedTask]
          : destinationTasks.toSpliced(taskIndexToUpdate, 1, updatedTask)

      return {
        tasks: {
          ...state.tasks,
          [updatedTask.statusID]: updatedTasks,
          [previousStatusId]: sourceTasks,
        },
      }
    }),

  updateTasks: (updatedTasks: Tasks) =>
    set((state) => ({ tasks: updatedTasks })),

  deleteTask: (taskToDelete: Task) =>
    set((state) => {
      const currentTasks = state.tasks[taskToDelete.statusID]
      const taskIndexToDelete = currentTasks.findIndex(
        (task) => task.id === taskToDelete.id
      )

      const updatedTasks = currentTasks.toSpliced(taskIndexToDelete, 1)

      return {
        tasks: {
          ...state.tasks,
          [taskToDelete.statusID]: updatedTasks,
        },
      }
    }),

  setEditedTask: (task?: Task) => set((state) => ({ editedTask: task })),
})
