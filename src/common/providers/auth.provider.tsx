import { FC, ReactElement, useCallback, useEffect, useMemo } from 'react'

import { useCurrentSession } from '@/common/hooks/useCurrentSession'
import { useAppContext } from '@/common/context/app.context'
import { UiBoardModel } from '@/common/models/board-model/ui-board-model'
import { serverMock } from '@/mock_data'

import { boardService } from '../services/board.service'

type TAuthProvider = {
  children: ReactElement | ReactElement[]
}

export const AuthProvider: FC<TAuthProvider> = ({ children }) => {
  const { session, status } = useCurrentSession()
  const { updateTasks, updateBoards, setActiveBoard } = useAppContext.getState()

  const userId = useMemo(() => session?.user.id, [session])

  const updateBoardStore = useCallback(() => {
    switch (status) {
      case 'loading': {
        updateTasks({})
        updateBoards([])
      }

      case 'authenticated': {
        if (userId) {
          boardService.get().then(({ data }) => {
            const { boards, tasks } = UiBoardModel(data)

            updateTasks(tasks)
            updateBoards(boards)
            setActiveBoard(boards[0]?.id || '')
          })
        }
      }

      case 'unauthenticated': {
        const { boards, tasks } = UiBoardModel(serverMock)

        updateTasks(tasks)
        updateBoards(boards)
        setActiveBoard(boards[0]?.id || '')
      }
    }
  }, [setActiveBoard, status, updateBoards, updateTasks, userId])

  useEffect(() => {
    updateBoardStore()
  }, [updateBoardStore])

  return <>{children}</>
}
