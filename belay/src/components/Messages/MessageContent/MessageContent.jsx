import React from 'react'
import { Comment, Icon } from 'semantic-ui-react'
import './MessageContent.css'

const MessageContent = (props) => {
  let userName = null
  if (props.user_name) {
    userName = props.user_name
  }
  return (
    <Comment>
      <Comment.Content>
        <div className="Poster">
          <i class="user icon"></i>
          <Comment.Author>{userName}</Comment.Author>
        </div>
        <div className="commentPart">
          <Comment.Text>{props.m_body}</Comment.Text>
        </div>
      </Comment.Content>
    </Comment>
  )
}

export default MessageContent
