import React from 'react'
import { Menu } from 'semantic-ui-react'
import './SideBar.css'
import UserInfo from './UserInfo/UserInfo.component'

export const SideBar = (props) => {
  return (
    <Menu vertical fixed="left" boarderless size="large" className="side_bar">
      <UserInfo user={props.user} setUser={props.setUser} />
    </Menu>
  )
}
