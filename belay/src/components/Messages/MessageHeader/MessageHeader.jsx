import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  Segment,
  Header,
  Input,
  Icon,
  Message,
  Button,
} from 'semantic-ui-react'

const MessageHeader = (props) => {
  let roomId = useParams()['id']
  let chanelInfo = {
    name: '',
    id: roomId,
    StoreName: '',
  }
  let errors = []

  const api_key = localStorage.getItem('chengyu_auth_key')

  const [channelState, setChannelState] = useState(chanelInfo)
  const [errorState, seterrorState] = useState(errors)

  const handleInput = (event) => {
    // get which part changed
    let target = event.target
    setChannelState((currentState) => {
      let currentChannel = { ...currentState }
      currentState[target.name] = target.value
      return currentChannel
    })
  }
  const checkForm = () => {
    if (channelState.name.length === 0) {
      seterrorState((error) =>
        error.concat({ message: 'please fill in room name' })
      )
      return false
    }
    return true
  }

  const getChannelInfo = () => {
    fetch(`/api/channel/${roomId}/channelInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
    })
      .then((response) => {
        return response.json() // Assuming the API returns JSON data
      })
      .then((channel) => {
        if (channel.success === true) {
          setChannelState({
            name: '',
            id: roomId,
            StoreName: channel.room_name,
          })
        }
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error)
      })
  }

  const updateChannelName = (event) => {
    seterrorState([])
    if (checkForm) {
      // Send user information to backend
      const roomName = {
        name: channelState.name,
      }
      fetch(`/api/channel/${roomId}/changeRoomName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': api_key,
        },
        body: JSON.stringify(roomName),
      })
        .then((response) => {
          return response.json() // Assuming the API returns JSON data
        })
        .then((update) => {
          console.log('Update room name successfully')
          if (update.success === true) {
            getChannelInfo()
          }
          props.setCurrentRoom((currentState) => {
            let currentChannel = { ...currentState }
            currentState['name'] = channelState.name
            return currentChannel
          })
        })
        .catch((error) => {
          console.error('There was a problem with your fetch operation:', error)
        })
    } else {
      console.log(errors)
    }
  }

  const formaterrors = () => {
    return errorState.map((error, index) => (
      <p key={index}> {error.message} </p>
    ))
  }

  useEffect(() => {
    getChannelInfo()
  }, [roomId, channelState.StoreName])

  return (
    <Segment clearing>
      <Header floated="left" fluid="true" as="h2">
        <span>
          ...
          {channelState.StoreName}
          <Icon name="star outline"></Icon>
        </span>
        <Header.Subheader> Update channel name </Header.Subheader>
      </Header>

      <Header floated="right">
        <Input
          name="name"
          icon="search"
          value={channelState.name}
          placeholder="Update Channel Name"
          size="mini"
          type="text"
          onChange={handleInput}></Input>
        <Button floated="right" onClick={updateChannelName}>
          {' '}
          Change{' '}
        </Button>
        {errorState.length > 0 && (
          <Message error>
            <h3>Errors: </h3>
            {formaterrors()}
          </Message>
        )}
      </Header>
    </Segment>
  )
}
export default MessageHeader
