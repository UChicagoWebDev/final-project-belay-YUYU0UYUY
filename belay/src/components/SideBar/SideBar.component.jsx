import React from 'react'
import { Menu } from 'semantic-ui-react'
import './SideBar.css'
import UserInfo from './UserInfo.component'

export const SideBar = () => {
  return (
    <Menu vertical fixed="left" boarderless size="large" className="side_bar">
      <UserInfo />
    </Menu>
  )
}
