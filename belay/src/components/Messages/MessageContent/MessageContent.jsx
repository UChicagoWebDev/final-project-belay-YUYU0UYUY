import React from 'react'
import { Comment, Icon } from 'semantic-ui-react'

const MessageContent = (props) => {
  let userName = null
  if (props.user) {
    userName = props.user.userName
  }

  return (
    <Comment>
      <Icon name="person" />
      <Comment.Content>
        <Comment.Author>{userName}</Comment.Author>
        <Comment.Metadata>111111111</Comment.Metadata>
        <Comment.Content>11111111111111</Comment.Content>
      </Comment.Content>
    </Comment>
  )
}

export default MessageContent
