import React, { useState } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react'

const MessageInput = (props) => {
  const [messageState, setMessageState] = useState('')

  const onSubmit = () => {
    if (messageState) {
    }
  }
  const onMessageChange = (e) => {
    const target = e.target
    setMessageState(target.value)
  }

  const createMessageInfo = () => {
    return {
      user: {
        user: {
          name: props.userName,
        },
        content: messageState,
      },
    }
  }

  const createActionButtons = () => {
    return (
      <>
        <Button icon="send" onClick={onSubmit} />

        <Button icon="upload" />
      </>
    )
  }

  return (
    <Segment>
      <Input
        onChange={onMessageChange}
        name="message"
        value={messageState}
        label={createActionButtons}
        labelPosition="right"></Input>
    </Segment>
  )
}

export default MessageInput
