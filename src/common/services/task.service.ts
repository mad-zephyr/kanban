import { AxiosResponse } from 'axios'

import {
  CreateTaskRequest,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from '../hooks/query/useTaskQuery'
import { API } from './api.service'

type Cookies = Record<string, string>

export const taskService = {
  get: async (cookies?: Cookies) => {
    try {
      const response = await API().get('/task')

      console.log('GET ALL >>>>>>>', response)
    } catch (error) {
      return Promise.reject(error)
    }
  },

  add: async (task: CreateTaskRequest): Promise<CreateTaskRequest> => {
    try {
      console.log('TASK SERVICE: ', task)
      return await API().post('/task', { task })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  update: async (
    task: UpdateTaskRequest
  ): Promise<AxiosResponse<UpdateTaskResponse>> => {
    try {
      console.log('TASK UPDATE SERVICE: ', task)
      return await API().patch('/task', { task })
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
