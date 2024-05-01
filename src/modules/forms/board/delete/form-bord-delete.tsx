import { Button, Text } from '@radix-ui/themes'
import cn from 'classnames'
import { FC } from 'react'

import { useAppContext } from '@/context/app.context'

import styles from './styles.module.sass'

type TDeleteBoardForm = {
  onClose: () => void
}

export const DeleteBoardForm: FC<TDeleteBoardForm> = ({ onClose }) => {
  const removeBoard = useAppContext.getState().removeBoard
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardID)
  )

  const handleDelete = () => {
    removeBoard(activeBoard?.id || '')
    onClose()
  }

  return (
    <>
      <Text>
        {`Are you sure you want to delete the ${activeBoard?.name} board? This
              action will remove all columns and tasks and cannot be reversed.`}
      </Text>
      <div className={styles.controlls}>
        <Button
          onClick={handleDelete}
          className={cn(styles.btn, styles.btn_ok)}
        >
          Delete
        </Button>
        <Button onClick={onClose} className={cn(styles.btn, styles.btn_cancel)}>
          Cancel
        </Button>
      </div>
    </>
  )
}
