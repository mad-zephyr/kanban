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
  statusId: string
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

export type Tasks = Record<BoardStatus['id'], Task[]>

export type TodoSliceContext = {
  boards: Board[]
  editedTask?: Task
  activeBoardId: string
  tasks: Tasks
}

export type TodoSliceAction = {
  addBoard: (board: Board) => void
  updateBoard: (board: Board) => void
  updateBoards: (boards: Board[]) => void
  removeBoard: (boardId: string) => void

  createTask: (task: Task) => void
  updateTask: (task: Task) => void
  reorderTask: (updatedTask: Task, previousStatusId: string) => void
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

  updateBoards: (boards: Board[]) => set((state) => ({ boards })),

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
      const currentTasks = state.tasks[task.statusId]
      const updTasks = currentTasks?.length ? [...currentTasks, task] : [task]

      return {
        tasks: {
          ...state.tasks,
          [task.statusId]: updTasks,
        },
      }
    }),

  updateTask: (updatedTask: Task) =>
    set((state) => {
      const destinationTasks = state.tasks[updatedTask.statusId]

      const destinationTaskIndex = destinationTasks.findIndex(
        (task) => task.id === updatedTask.id
      )

      destinationTasks.splice(destinationTaskIndex, 1, updatedTask)

      return {
        tasks: {
          ...state.tasks,
          [updatedTask.statusId]: destinationTasks,
        },
      }
    }),

  reorderTask: (updatedTask: Task, previousStatusId: string) =>
    set((state) => {
      const destinationTasks = state.tasks[updatedTask.statusId]
      const sourceTasks = state.tasks[previousStatusId]

      const sourceTaskIndex = sourceTasks.findIndex(
        (task) => task.id === updatedTask.id
      )

      sourceTasks.splice(sourceTaskIndex, 1)

      destinationTasks.push(updatedTask)

      return {
        tasks: {
          ...state.tasks,
          [updatedTask.statusId]: destinationTasks,
          [previousStatusId]: sourceTasks,
        },
      }
    }),
  // reorderTask: (reorderedTasks: ReorderedTasks) =>
  //   set((state) => {
  //     const { destinationTasks, sourceTasks } = reorderedTasks

  //     return {
  //       tasks: {
  //         ...state.tasks,
  //         [destinationTasks[0].destinationStatusId]: destinationTasks[1],
  //         [sourceTasks[0].sourceStatusId]: sourceTasks[1],
  //       },
  //     }
  //   }),

  updateTasks: (updatedTasks: Tasks) =>
    set((state) => ({ tasks: updatedTasks })),

  deleteTask: (taskToDelete: Task) =>
    set((state) => {
      const currentTasks = state.tasks[taskToDelete.statusId]
      const taskIndexToDelete = currentTasks.findIndex(
        (task) => task.id === taskToDelete.id
      )

      const updatedTasks = currentTasks.toSpliced(taskIndexToDelete, 1)

      return {
        tasks: {
          ...state.tasks,
          [taskToDelete.statusId]: updatedTasks,
        },
      }
    }),

  setEditedTask: (task?: Task) => set((state) => ({ editedTask: task })),
})
