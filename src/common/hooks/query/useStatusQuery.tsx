// createStatus

import { useMutation, type UseMutationResult } from '@tanstack/react-query'

type CreateStatusRequest = {
  id: string
  name: string
  bg: string
  boardId: string
}

export const useCreateSatus = (): UseMutationResult<
  unknown,
  // AxiosError
  unknown,
  CreateStatusRequest[]
> => {
  return useMutation<unknown, unknown, CreateStatusRequest[]>({
    mutationFn: (statuses: CreateStatusRequest[]) =>
      fetch('/api/board/status', {
        method: 'POST',
        body: JSON.stringify({ statuses }),
      }),
    onSuccess: (status) => {
      console.log('BOARD CREATED: ', status)
    },
    onError: (error) => {},
  })
}
