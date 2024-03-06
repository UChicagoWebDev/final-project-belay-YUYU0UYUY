import React, { useEffect, useState } from 'react'

import './Channels.css'
import { Menu, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'

const Channels = (props) => {
  const navigate = useNavigate()
  const [unreadState, setUnreadState] = useState({})
  let userId = null
  if (props.user) {
    userId = props.user.userId
  }

  const api_key = localStorage.getItem('chengyu_auth_key')

  const displayChannels = () => {
    console.log(props.rooms.length)
    if (props.rooms.length > 0) {
      return props.rooms.map((channel) => {
        return (
          <Menu.Item
            key={channel.room_id}
            name={channel.room_name}
            onClick={() => navigate(`/channel/${channel.room_id}`)}>
            {channel.room_name}
            {unreadState[channel.room_id] > 0 && (
              <text className="unread">
                {'   '}
                Unread: {unreadState[channel.room_id]}{' '}
              </text>
            )}{' '}
          </Menu.Item>
        )
      })
    }
  }

  const getUnreadMessages = () => {
    fetch(`/api/users/${userId}/messages_count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((count) => {
        if (count.success) {
          const counts = count.unread_message_counts.reduce((acc, curr) => {
            acc[curr.channel_id] = curr.unread_message_count
            return acc
          }, {})
          setUnreadState(counts)
        } else {
          console.log('Do not get unread messages ')
          setUnreadState([])
        }
        console.log(unreadState)
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        )
        // setIsLoading(false);
      })
  }

  const getChannels = () => {
    fetch('/api/channels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        console.log('GetRooms', data)
        props.setRooms(data)
        // setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error
        )
        // setIsLoading(false);
      })
  }

  const createRooms = () => {
    fetch('/api/channels/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
    })
      .then((response) => {
        return response.json() // Assuming the API returns JSON data
      })
      .then((room) => {
        console.log('???')
        if (room.create) {
          // navigate()
          console.log(room)
          const newroom = {
            room_id: room.room_id,
            room_name: room.room_name,
          }
          console.log('create room successfully')
          props.setRooms((prevRooms) => [...prevRooms, newroom])
        } else {
          console.log('wrong')
        }
      })
      .catch((error) =>
        console.error('There was a problem with your fetch operation:', error)
      )
  }

  const getRoomsNum = () => {
    return props.rooms.length
  }

  useEffect(() => {
    getChannels()
    getUnreadMessages()
    const message_interval = setInterval(() => {
      getChannels()
      getUnreadMessages()
    }, 500)
    return () => clearInterval(message_interval)
  }, [props.Channels, props.currentRoom])

  return (
    <>
      <Menu.Menu>
        <Menu.Item style={{ fontSize: '17px' }}>
          <span>
            <Icon name="exchange" /> Channels
          </span>
          (Num: {getRoomsNum()})
        </Menu.Item>
        {displayChannels()}
        <Menu.Item>
          <span className="add" onClick={createRooms}>
            <Icon name="add" />
            Create Rooms
          </span>
        </Menu.Item>
      </Menu.Menu>
    </>
  )
}

export default Channels
