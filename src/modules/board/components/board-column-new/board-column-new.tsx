import { FC, useState } from 'react'
import { Button } from '@radix-ui/themes'

import { useAppContext } from '@/common/context/app.context'
import Modal from '@/components/ui/modal/modal'
import CreateTaskStatusesForm from '@/modules/forms/status/create/form-status-create'

import styles from './styles.module.sass'

export const BoardColumnNew: FC = () => {
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardId)
  )

  const boardStatuses =
    !!activeBoard?.statuses && !!activeBoard?.statuses.length
      ? activeBoard.statuses
      : []

  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false)
  const handleCloseModal = () => {
    setShowCreateStatusModal((prev) => !prev)
  }

  const handleAddStatus = () => {
    handleCloseModal()
  }

  const statusesQty = boardStatuses?.length

  return (
    <>
      {statusesQty ? (
        <div className={styles.main}>
          <span onClick={handleAddStatus} className={styles.text}>
            + New Column
          </span>
        </div>
      ) : (
        <div className={styles.main_expanded}>
          {!!activeBoard ? (
            <>
              <span className={styles.text}>
                This board is empty. Create a new column to get started.
              </span>
              <Button
                onClick={handleAddStatus}
                size={'4'}
                className={styles.btn}
              >
                + Add New Column
              </Button>
            </>
          ) : (
            <span className={styles.text}>
              Select an existing board or create a new one
            </span>
          )}
        </div>
      )}

      <Modal
        title="Create new status"
        isOpen={showCreateStatusModal}
        onOpenChange={handleCloseModal}
      >
        <CreateTaskStatusesForm onClose={handleCloseModal} />
      </Modal>
    </>
  )
}
