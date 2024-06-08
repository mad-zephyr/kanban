import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

import { CreateTaskModel } from '@/data/task'
import { taskService } from '@/common/services/task.service'
export type CreateTaskRequest = CreateTaskModel
export type UpdateTaskRequest =
  | {
      action: 'update'
      payload: CreateTaskModel
    }
  | {
      action: 'reorder'
      payload: CreateTaskModel
    }
export type UpdateTaskResponse = CreateTaskModel

export type ReorderTaskResponse = null

export const useCreateTask = (): UseMutationResult<
  unknown,
  unknown,
  CreateTaskRequest
> => {
  return useMutation<unknown, unknown, CreateTaskRequest>({
    mutationFn: (task: CreateTaskRequest) => taskService.add(task),
    onSuccess: (task) => {
      console.log('TASK CREATED: ', task)
    },
  })
}

export const useUpdateTask = (): UseMutationResult<
  AxiosResponse<UpdateTaskResponse>,
  AxiosError,
  UpdateTaskRequest
> => {
  return useMutation<
    AxiosResponse<UpdateTaskResponse>,
    AxiosError,
    UpdateTaskRequest
  >({
    mutationFn: (task: UpdateTaskRequest) => taskService.update(task),
    onSuccess: (task) => {
      console.log('TASK UPDATED TANK Stack: ', task?.data)
    },
    onError: (error) => {
      console.log('ERROR UPDATE TASK: ', error)
    },
  })
}
