import React, { useState, useEffect } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react'

import { useParams } from 'react-router-dom'

const MessageInput = (props) => {
  const repliedId = useParams()['id']
  const user = props.user
  let userId = ''
  if (user) {
    userId = props.user.userId
  }
  let roomId = useParams()['id']

  let MessageInfo = {
    user_id: userId,
    room_id: roomId,
    body: '',
  }
  let errors = []

  const api_key = localStorage.getItem('chengyu_auth_key')

  const [messageState, setMessageState] = useState(MessageInfo)
  const [errorState, seterrorState] = useState(errors)

  const handleInput = (event) => {
    // get which part changed
    let target = event.target
    setMessageState((currentState) => {
      let currentMessage = { ...currentState }
      currentState[target.name] = target.value
      return currentMessage
    })
  }
  const checkForm = () => {
    if (messageState.body.length === 0) {
      seterrorState((error) =>
        error.concat({ message: 'please fill in room name' })
      )
      return false
    }
    return true
  }

  const sendReplies = (event) => {
    seterrorState([])
    if (checkForm) {
      // Send user information to backend
      const messagePost = {
        user_id: userId,
        room_id: messageState.room_id,
        body: messageState.body,
      }
      fetch(`/api/message/${repliedId}/postReplies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': api_key,
        },
        body: JSON.stringify(messagePost),
      })
        .then((response) => {
          return response.json() // Assuming the API returns JSON data
        })
        .then((update) => {
          if (update.success === true) {
            console.log('Post successfully')
            console.log('success')
            props.setMessagesInroom((currentState) => {
              let currentChannel = { ...currentState }
              currentState.push(update.success)
              return currentChannel
            })
          }
        })
        .catch((error) => {
          console.error('There was a problem with your fetch operation:', error)
        })
    } else {
      console.log(errors)
    }
  }

  const createActionButtons = () => {
    return (
      <>
        <Button icon="send" onClick={sendReplies} />

        <Button icon="upload" />
      </>
    )
  }

  return (
    <Segment>
      <Input
        onChange={handleInput}
        name="body"
        value={messageState.body}
        label={createActionButtons}
        labelPosition="right"></Input>
    </Segment>
  )
}

export default MessageInput
