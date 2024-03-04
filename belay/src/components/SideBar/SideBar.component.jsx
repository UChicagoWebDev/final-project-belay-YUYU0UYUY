import React from 'react'
import { Menu } from 'semantic-ui-react'
import './SideBar.css'
import UserInfo from './UserInfo/UserInfo.component'
import Channels from './Channels/Channels.component'

export const SideBar = (props) => {
  return (
    <Menu vertical fixed="left" boarderless size="large" className="side_bar">
      <UserInfo
        user={props.user}
        setUser={props.setUser}
        rooms={props.rooms}
        setRooms={props.setRooms}
      />
      <Channels
        user={props.user}
        setUser={props.setUser}
        rooms={props.rooms}
        setRooms={props.setRooms}></Channels>
    </Menu>
  )
}
