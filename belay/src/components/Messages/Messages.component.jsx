import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MessageHeader from './MessageHeader/MessageHeader'
import MessageContent from './MessageContent/MessageContent'
import MessageInput from './MessageInput/MessageInput.component'
import { Segment, Comment } from 'semantic-ui-react'

const Messages = (props) => {
  let roomId = useParams()['id']
  const api_key = localStorage.getItem('chengyu_auth_key')

  const [messagesInRoom, setMessageInRoom] = useState([])

  const get_messages = () => {
    fetch(`/api/channel/${roomId}/messages`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
    })
      .then((response) => response.json())
      .then((messages) => {
        if (messages.success) {
          console.log(messages.messages)
          setMessageInRoom(messages.messages)
        }
      })
  }

  useEffect(() => {
    get_messages()
    displayMessages()
    const message_interval = setInterval(() => {
      get_messages()
    }, 500)
    return () => clearInterval(message_interval)
  }, [messagesInRoom.length, roomId])

  const displayMessages = () => {
    if (messagesInRoom.length > 0) {
      return messagesInRoom.map((message) => {
        return (
          <MessageContent
            key={message.m_id}
            user_name={message.user_name}
            m_body={message.m_body}></MessageContent>
        )
      })
    }
  }

  return (
    <div>
      <MessageHeader
        user={props.user}
        setUser={props.setUser}
        currentRoom={props.currentRoom}
        setCurrentRoom={props.setCurrentRoom}></MessageHeader>
      <Segment>
        <Comment.Group>{displayMessages()}</Comment.Group>
      </Segment>
      <MessageInput
        user={props.user}
        setUser={props.setUser}
        messagesInRoom={messagesInRoom}
        setMessageInRoom={setMessageInRoom}></MessageInput>
    </div>
  )
}

export default Messages
