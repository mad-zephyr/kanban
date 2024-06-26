'use client'

import { Button, Flex, FlexProps, Heading, IconButton } from '@radix-ui/themes'
import { FC, Suspense, useState } from 'react'
import cn from 'classnames'
import { Item } from '@radix-ui/react-dropdown-menu'
import { DotsVerticalIcon } from '@radix-ui/react-icons'

import { DropDown } from '@/components/ui'
import { useAppContext } from '@/common/context/app.context'
import LogoDark from '@/assets/logo-light.svg'
import LogoLight from '@/assets/logo-dark.svg'
import Modal from '@/components/ui/modal/modal'

import styles from './styles.module.sass'
import { DeleteBoardForm, EditBoardForm, FormTaskCreate } from '../forms'
import { AuthModule } from '../auth/auth'

const flexPropsStyle: FlexProps = {
  gap: '3',
  justify: 'between',
  align: 'center',
  p: '4',
  pr: '6',
  pb: '5',
  flexGrow: '1',
}

export const Header: FC = () => {
  const [dropDownContainer, setDropDownContainer] =
    useState<HTMLElement | null>(null)

  const lightTheme = useAppContext((state) => state.lightTheme)
  const sidebarOpen = useAppContext((state) => state.sidebarOpen)

  const [isShowEditModal, setIsShowEditModal] = useState(false)
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isShowAddTaskModal, setIsShowAddTaskModal] = useState(false)

  const currentBoard = useAppContext((state) =>
    state.boards?.find((board) => board.id === state.activeBoardId)
  )

  const canAddTask = !!currentBoard?.statuses.length

  const handleShowModal = () => {
    setIsShowEditModal((prev) => !prev)
  }
  const handleShowAddTaskModal = () => {
    setIsShowAddTaskModal((prev) => !prev)
  }

  const handleShowDeleteModal = () => {
    setIsShowDeleteModal((prev) => !prev)
  }

  return (
    <>
      <div
        className={cn(styles.logo, { [styles.logo_expanded]: sidebarOpen })}
        ref={setDropDownContainer}
      >
        {lightTheme ? <LogoLight /> : <LogoDark />}
      </div>
      <Flex {...flexPropsStyle} className={styles.content}>
        {currentBoard && (
          <Heading as="h3" size="6">
            {currentBoard.name}
          </Heading>
        )}
        <div className={styles.right}>
          <Button
            onClick={handleShowAddTaskModal}
            variant={'soft'}
            radius="full"
            size={'4'}
            disabled={!canAddTask}
          >
            + Add New Task
          </Button>

          {currentBoard && (
            <DropDown
              className={styles.dropdown}
              container={dropDownContainer}
              triger={
                <IconButton variant="ghost" size={'4'}>
                  <DotsVerticalIcon />
                </IconButton>
              }
              content={
                <>
                  <Item onClick={handleShowModal} className="DropdownMenuItem">
                    Edit Board
                  </Item>
                  <Item
                    onClick={handleShowDeleteModal}
                    className={cn('DropdownMenuItem', styles.itemDelete)}
                  >
                    Delete Board
                  </Item>
                </>
              }
            />
          )}
          <Suspense>
            <AuthModule />
          </Suspense>
        </div>
        <Modal
          isOpen={isShowAddTaskModal}
          title="Add New Task"
          onOpenChange={handleShowAddTaskModal}
        >
          <FormTaskCreate onClose={handleShowAddTaskModal} />
        </Modal>
        <Modal
          isOpen={isShowEditModal}
          title="Edit Board"
          onOpenChange={handleShowModal}
        >
          <EditBoardForm onClose={handleShowModal} />
        </Modal>
        <Modal
          isOpen={isShowDeleteModal}
          title="Delete this board?"
          onOpenChange={handleShowDeleteModal}
        >
          <DeleteBoardForm onClose={handleShowDeleteModal} />
        </Modal>
      </Flex>
    </>
  )
}
