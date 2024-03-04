import React from 'react'

import MessageHeader from './MessageHeader/MessageHeader'
import MessageContent from './MessageContent/MessageContent'
import MessageInput from './MessageInput/MessageInput.component'

const Messages = (props) => {
  return (
    <div>
      <MessageHeader
        user={props.user}
        setUser={props.setUser}
        currentRoom={props.currentRoom}
        setCurrentRoom={props.setCurrentRoom}></MessageHeader>
      <MessageContent
        user={props.user}
        setUser={props.setUser}></MessageContent>
      <MessageInput user={props.user} setUser={props.setUser}></MessageInput>
    </div>
  )
}

export default Messages
