import './MainPage.css'
import { SideBar } from "../SideBar/SideBar.component"

function Main (props) {
  console.log(props)
  return (
    <div>
      <SideBar user={props.user} setUser={props.setUser} rooms={props.rooms} setRooms={props.setRooms} />
      <div class="ui placeholder segment" className='cool'>
        <div class="ui centered grid">
          <div class="middle aligned row" style={{ paddingTop: '40vh' }}>

            <div class="ui icon header" >
              <i class="massive home icon"></i>
              Choose a Channel
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Main
