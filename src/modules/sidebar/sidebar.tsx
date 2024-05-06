'use client'

import { FC, useState } from 'react'
import { Button, Text } from '@radix-ui/themes'
import cn from 'classnames'

import { Switcher } from '@/components/ui'
import { useAppContext } from '@/context/app.context'
import LightIcon from '@/assets/icon-light-theme.svg'
import DarkIcon from '@/assets/icon-dark-theme.svg'
import HideIcon from '@/assets/icon-hide-sidebar.svg'
import ShowIcon from '@/assets/icon-show-sidebar.svg'
import Modal from '@/components/ui/modal/modal'

import styles from './styles.module.sass'
import { ListItem } from './components/list-item/list-item'
import CreateBoardForm from '../forms/board/create/form-board-create'

const mockBoardList = [
  { text: 'Platform Launch' },
  { text: 'Marketing Plan' },
  { text: 'Roadmap' },
]

export const Sidebar: FC = () => {
  const lightThemeOff = useAppContext((state) => !state.lightTheme)
  const sidebarOpen = useAppContext((state) => state.sidebarOpen)
  const boards = useAppContext((state) => state.boards)
  const activeBoardID = useAppContext((state) => state.activeBoardId)

  const { setLightTheme, setSidebarOpen, setActiveBoard } =
    useAppContext.getState()

  const [isShow, setIsShow] = useState(false)

  const handleShowModal = () => {
    setIsShow((prev) => !prev)
  }

  const changeTheme = (name: string) => {
    setLightTheme()
  }

  const isBoardsExist = boards.length > 0

  return (
    <>
      <aside
        className={cn(styles.content, { [styles.content_hide]: !sidebarOpen })}
      >
        <div className={styles.wrapper}>
          {isBoardsExist && (
            <Text size={'1'} className={styles.label}>
              ALL BOARDS ({boards.length})
            </Text>
          )}
          <ul className={styles.list}>
            {boards.map((item, i) => (
              <ListItem
                key={i}
                isActive={item.id === activeBoardID}
                text={item.name}
                onClick={() => setActiveBoard(item.id)}
              />
            ))}
            <ListItem
              text={'+ Create New Board'}
              onClick={handleShowModal}
              className={styles.create}
            />
          </ul>
        </div>
        <div className={styles.footer}>
          <Switcher
            isOn={lightThemeOff}
            name={'theme'}
            onChange={changeTheme}
            prefix={<LightIcon />}
            postfix={<DarkIcon />}
          />
        </div>
        <ListItem
          text="Hide Sidebar"
          prefix={<HideIcon />}
          onClick={setSidebarOpen}
        />
      </aside>
      <div
        className={cn(styles.btnShow, { [styles.btnShow_hide]: !sidebarOpen })}
      >
        <Button onClick={setSidebarOpen} size={'4'}>
          <ShowIcon />
        </Button>
      </div>

      <Modal
        isOpen={isShow}
        title="Add New Board"
        onOpenChange={handleShowModal}
      >
        <CreateBoardForm onClose={handleShowModal} />
      </Modal>
    </>
  )
}
