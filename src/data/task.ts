import { Task } from '@prisma/client'

import { db } from '@/lib/db'
import { UpdateTaskResponse } from '@/common/hooks/query/useTaskQuery'

import {
  type CreateSubTaskModel,
  createSubtasks,
  updateSubtask,
} from './subtask'

export type CreateTaskModel = Pick<
  Task,
  'id' | 'name' | 'description' | 'statusId'
> & { subTasks: CreateSubTaskModel[] }

export type UpdateTaskModel = Pick<
  Task,
  'id' | 'name' | 'description' | 'statusId'
> & { subTasks: CreateSubTaskModel[] }

export const createTask = async (
  task: CreateTaskModel
): Promise<CreateTaskModel | null> => {
  try {
    await db.task.create({
      data: {
        id: task.id,
        name: task.name,
        description: task.description,
        statusId: task.statusId,
      },
    })

    await createSubtasks(task.subTasks)

    return await getTaskById(task.id)
  } catch (error) {
    console.log('CREATE TASK ERROR: ', error)
    return Promise.reject(error)
  }
}

export const updateTask = async (
  task: UpdateTaskModel
): Promise<UpdateTaskResponse> => {
  console.log('TASK ID TO UPDATE: ', task.id)

  try {
    Promise.all(task.subTasks.map((subTask) => updateSubtask(subTask, task.id)))

    return (await db.task.update({
      where: { id: task.id },
      data: {
        id: task.id,
        description: task.description,
        name: task.name,
        status: {
          connect: { id: task.statusId },
        },
      },
      include: { subtasks: true },
    })) as unknown as UpdateTaskResponse
  } catch (error) {
    console.error('UPDATE TASK DB: ', error)
    return Promise.reject(error)
  }
}

export const reorderTask = async (task: CreateTaskModel) => {
  try {
    return await db.task.update({
      where: { id: task.id },
      data: {
        statusId: task.statusId,
      },
      include: { subtasks: true },
    })
  } catch (error) {
    console.error('UPDATE TASK DB: ', error)
    return Promise.reject(error)
  }
}

export const getTaskById = async (
  taskId: string
): Promise<CreateTaskModel | null> => {
  return (await db.task.findFirst({
    where: { id: taskId },
    include: {
      subtasks: true,
    },
  })) as unknown as CreateTaskModel
}
