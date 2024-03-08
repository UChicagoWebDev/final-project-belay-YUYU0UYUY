import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import MessageHeader from './ReplyHeader/ReplyHeader.component'
import MessageContent from './ReplyContent/ReplyContent.component'
import MessageInput from './ReplyInput/ReplyInput.component'
import { Segment, Comment } from 'semantic-ui-react'

const Messages = (props) => {
  let repliedId = useParams()['id']
  const api_key = localStorage.getItem('chengyu_auth_key')
  let userId = null
  if (props.user) {
    userId = window.sessionStorage.getItem('user_id')
  }

  const [repliesInRoom, setReplies] = useState([])

  const get_replies = () => {
    fetch(`/api/messages/${repliedId}/replies`, {
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
          setReplies(messages.messages)
        } else {
          setReplies([])
        }
      })
  }

  useEffect(() => {
    get_replies()
    displayMessages()

    const message_interval = setInterval(() => {
      get_replies()
    }, 500)
    return () => clearInterval(message_interval)
  }, [])

  const displayMessages = () => {
    if (repliesInRoom.length > 0) {
      return repliesInRoom.map((message) => {
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
      <Segment>
        <Comment.Group>{displayMessages()}</Comment.Group>
      </Segment>
      <MessageInput
        user={props.user}
        setUser={props.setUser}
        messagesInRoom={repliesInRoom}
        setMessageInRoom={setReplies}></MessageInput>
    </div>
  )
}

export default Messages
