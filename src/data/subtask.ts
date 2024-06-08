import { Subtask } from '@prisma/client'

import { db } from '@/lib/db'

export type CreateSubTaskModel = Pick<
  Subtask,
  'id' | 'name' | 'taskId' | 'done'
>
export type UpdateSubTask = Pick<Subtask, 'id' | 'name' | 'taskId' | 'done'>

export const createSubtask = async (
  subtask: CreateSubTaskModel
): Promise<null> => {
  try {
    await db.subtask.create({
      data: {
        id: subtask.id,
        name: subtask.name,
        done: false,
        taskId: subtask.taskId,
      },
    })
    return null
  } catch (error) {
    return null
  }
}

export const createSubtasks = async (
  subtasks: CreateSubTaskModel[]
): Promise<boolean> => {
  try {
    console.log('CREATE SUBTASKS: ', subtasks)

    const result = await db.subtask.createMany({
      data: subtasks,
    })
    return result.count === subtasks.length
  } catch (error) {
    console.log('CREATE SUBTASKS ERROR: ', error)
    return false
  }
}

export const deleteSubtasks = async (subtaskId: string) => {
  try {
    await db.subtask.deleteMany({
      where: { id: subtaskId },
    })
  } catch (error) {}
}

export const updateSubtask = async (subtask: UpdateSubTask, taskId: string) => {
  try {
    return await db.subtask.update({
      where: { id: subtask.id },
      data: {
        done: subtask.done,
        name: subtask.name,
        taskId: taskId,
      },
    })
  } catch (error) {
    console.error('UPDATE SUBTASK DB: ', error)
    return Promise.reject(error)
  }
}

export const updateSubtasks = async (
  subtasks: UpdateSubTask[],
  taskId: string
) => {
  console.log('UPDATE SUBTASK: ', subtasks)
  try {
    return await db.subtask.updateMany({
      where: { taskId: taskId },
      data: subtasks,
    })
  } catch (error) {
    return Promise.reject(error)
  }
}
