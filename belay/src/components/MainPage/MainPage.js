import './MainPage.css'
import { SideBar } from "../SideBar/SideBar.component"

function Main (props) {
  console.log(props)
  return (
    <div>
      <SideBar user={props.user} setUser={props.setUser} rooms={props.rooms} setRooms={props.setRooms} />
    </div>
  )
}

export default Main
