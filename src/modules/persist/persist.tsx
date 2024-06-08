import { useCurrentSession } from '@/common/hooks/useCurrentSession'
import { DbBoardModel } from '@/common/models/board-model/db-board-model'
import { useAppContext } from '@/common/context/app.context'

export const Persist = () => {
  const boards = useAppContext((state) => state.boards)
  const tasks = useAppContext((state) => state.tasks)
  const { session } = useCurrentSession()
  const user = session?.user

  if (user && user.id) {
    const transformedData = DbBoardModel({ boards, tasks, ownerId: user.id })

    console.log('DATA: ', transformedData)
  }

  return <></>
}
