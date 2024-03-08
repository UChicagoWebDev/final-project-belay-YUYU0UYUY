import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Segment, Header, Comment } from 'semantic-ui-react'

const MessageHeader = (props) => {
  const messageId = useParams()['id']

  let messageInfo = {
    content: '',
    user_name: '',
    user_id: '',
    message_id: messageId,
  }

  const [messageState, setMessageState] = useState(messageInfo)

  const api_key = localStorage.getItem('chengyu_auth_key')

  const getMessageReplied = () => {
    fetch(`/api/messages/${messageId}/repliesHeader`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
    })
      .then((response) => {
        return response.json() // Assuming the API returns JSON data
      })
      .then((message) => {
        if (message.success === true) {
          setMessageState({
            content: message.message.content,
            user_name: message.message.user_name,
            user_id: message.message.user_id,
            message_id: message.message.message_id,
          })
        }
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error)
      })
  }

  useEffect(() => {
    getMessageReplied()
  }, [])

  return (
    <Segment clearing>
      <Header floated="left" fluid="true" as="h2">
        <span>
          <div className="Poster">
            <i class="user icon"></i>
            <Comment.Author>{messageState.user_name}</Comment.Author>
          </div>
          <div className="commentPart">
            <Comment.Text>{messageState.content}</Comment.Text>
          </div>
        </span>
        <Header.Subheader>Replies</Header.Subheader>
      </Header>
    </Segment>
  )
}
export default MessageHeader
