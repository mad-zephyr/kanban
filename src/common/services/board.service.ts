import { API } from './api.service'

type Cookies = Record<string, string>

export const boardService = {
  get: async (cookies?: Cookies) => {
    try {
      const response = await API().get('/board')

      return response
    } catch (error) {
      return Promise.reject(error)
    }
  },
}
