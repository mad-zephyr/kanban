import { FC, useState } from 'react'
import { Button } from '@radix-ui/themes'

import { useAppContext } from '@/context/app.context'
import Modal from '@/components/ui/modal/modal'
import CreateTaskStatusesForm from '@/modules/forms/status/create/form-status-create'

import styles from './styles.module.sass'

export const BoardColumn: FC = () => {
  const activeBoard = useAppContext((state) =>
    state.boards.find((board) => board.id === state.activeBoardID)
  )
  const [showCreateStatusModal, setShowCreateStatusModal] = useState(false)
  const handleCloseModal = () => {
    setShowCreateStatusModal((prev) => !prev)
  }

  const handleAddStatus = () => {
    handleCloseModal()
  }

  const statusesQty = activeBoard?.statuses.length

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
          <span className={styles.text}>
            This board is empty. Create a new column to get started.
          </span>
          <Button onClick={handleAddStatus} size={'4'} className={styles.btn}>
            + Add New Column
          </Button>
        </div>
      )}

      <Modal isOpen={showCreateStatusModal} onOpenChange={handleCloseModal}>
        <CreateTaskStatusesForm onClose={handleCloseModal} />
      </Modal>
    </>
  )
}
