import { Task } from '../context/todo.context'

export function populateSubTaskWithTaskId(taskToUpdate: Task) {
  return {
    ...taskToUpdate,
    subTasks: taskToUpdate.subTasks.map((subTask) => ({
      ...subTask,
      taskId: taskToUpdate.id,
    })),
  }
}
