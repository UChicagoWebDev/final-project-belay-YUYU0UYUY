import React, { useEffect, useState } from 'react'

import './Channels.css'
import { Menu, Icon } from 'semantic-ui-react'

const Channels = (props) => {
  const channelList = props.rooms

  console.log(channelList)

  const api_key = localStorage.getItem('chengyu_auth_key')

  const displayChannels = () => {
    console.log(props.rooms.length)
    if (props.rooms.length > 0) {
      return props.rooms.map((channel) => {
        return (
          <Menu.Item key={channel.room_id} name={channel.room_name}></Menu.Item>
        )
      })
    }
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

  useEffect(() => {
    getChannels()
  }, [])

  return (
    <>
      <Menu.Menu>
        <Menu.Item style={{ fontSize: '17px' }}>
          <span>
            <Icon name="exchange" /> Channels
          </span>
          (0),
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
