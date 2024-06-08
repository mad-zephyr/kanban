import { useMutation, UseMutationResult } from '@tanstack/react-query'

import { UiBoardModel } from '@/common/models/board-model/ui-board-model'
import { CreateBoardResponse } from '@/common/types/api-type'
import { CreateBoardRequest, DeleteBoardRequest } from '@/common/types/ui-types'

export const useCreateBoard = (): UseMutationResult<
  CreateBoardResponse,
  unknown,
  CreateBoardRequest
> => {
  return useMutation<CreateBoardResponse, unknown, CreateBoardRequest>({
    mutationFn: (board: CreateBoardRequest) =>
      fetch('/api/board', { method: 'POST', body: JSON.stringify({ board }) }),
    onSuccess: (board) => {
      console.log('BOARD CREATED: ', board)
      const recievedBoard = UiBoardModel(board)
    },
    onError: (error) => {},
  })
}

export const useDeleteBoard = (): UseMutationResult<
  unknown,
  unknown,
  DeleteBoardRequest
> => {
  return useMutation<unknown, unknown, DeleteBoardRequest>({
    mutationFn: (board: DeleteBoardRequest) =>
      fetch('/api/board', {
        method: 'DELETE',
        body: JSON.stringify({ board }),
      }),
    onSuccess: (board) => {
      console.log('BOARD DELETED: ', board)
    },
    onError: (error) => {},
  })
}

export const useUpdateBoard = (): UseMutationResult<
  unknown,
  unknown,
  unknown
> => {
  return useMutation<unknown, unknown, unknown>({
    mutationFn: (board: unknown) => {
      return fetch('/api/board', {
        method: 'PATCH',
        body: JSON.stringify({ board }),
        cache: 'reload',
      })
    },
  })
}
