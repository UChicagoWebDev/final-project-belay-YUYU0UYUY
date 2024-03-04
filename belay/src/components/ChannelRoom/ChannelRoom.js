import './ChannelRoom.css'
import { SideBar } from "../SideBar/SideBar.component"
import Messages from '../Messages/Messages.component'

function ChannelRoom (props) {
  console.log(props)
  return (
    <div>
      <SideBar user={props.user}
        setUser={props.setUser}
        rooms={props.rooms}
        setRooms={props.setRooms}
        currentRoom={props.currentRoom}
        setCurrentRoom={props.setCurrentRoom} />
      <div style={{ paddingLeft: '350px' }}>
        <Messages user={props.user}
          setUser={props.setUser}
          currentRoom={props.currentRoom}
          setCurrentRoom={props.setCurrentRoom} />
      </div>
    </div>
  )
}

export default ChannelRoom
