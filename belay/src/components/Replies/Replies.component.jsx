import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MessageHeader from './ReplyHeader/ReplyHeader.component'
import MessageContent from './ReplyContent/ReplyContent.component'
import MessageInput from './ReplyInput/ReplyInput.component'
import { Segment, Comment } from 'semantic-ui-react'

const Messages = (props) => {
  let roomId = useParams()['id']
  const api_key = localStorage.getItem('chengyu_auth_key')
  let userId = null
  if (props.user) {
    userId = window.sessionStorage.getItem('user_id')
  }

  const [messagesInRoom, setMessageInRoom] = useState([])

  const update_message_seen = (lastMessageId) => {
    const messageInfo = {
      last_id: lastMessageId,
      user_id: userId,
    }
    fetch(`/api/channel/${roomId}/messages/last_seen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
      body: JSON.stringify(messageInfo),
    })
      .then((response) => response.json())
      .then((success) => {
        if (success.success) {
          console.log('Last message update')
        }
      })
  }

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

          const lastMessageId = messages.messages.reduce(
            (maxId, message) => Math.max(maxId, message.m_id),
            0
          )
          console.log('maxMessageId: ', lastMessageId)
          update_message_seen(lastMessageId)
        } else {
          setMessageInRoom([])
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
            message_id={message.m_id}
            m_body={message.m_body}
            user_id={message.user_id}></MessageContent>
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
    </div>
  )
}

export default Messages
