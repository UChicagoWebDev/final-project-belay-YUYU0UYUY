import React, { useEffect, useState } from 'react'
import { Comment, Icon } from 'semantic-ui-react'
import './ReplyContent.css'

const MessageContent = (props) => {
  let userName = null
  let messageId = null
  let userId = null
  if (props.user_name) {
    userName = props.user_name
    messageId = props.message_id
    userId = window.sessionStorage.getItem('user_id')
  }

  const [happyCount, setHappyCount] = useState(0)
  const [sadCount, setSadCount] = useState(0)

  const api_key = localStorage.getItem('chengyu_auth_key')

  const onClickSendEmoji = (emoji) => {
    const emojiInfo = {
      message_id: messageId,
      emoji_type: emoji,
      user_id: userId,
    }
    console.log(emojiInfo)
    fetch(`/api/message/${messageId}/postEmoji`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
      body: JSON.stringify(emojiInfo),
    })
      .then((response) => response.json())
      .then((success) => {
        if (success.success) {
          console.log('Post emoji successfully')
        } else {
          console.log('Delete emoji successfully')
        }
      })
  }

  const getEmojiCount = (emoji) => {
    fetch(`/api/message/${messageId}/getEmoji/${encodeURIComponent(emoji)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': api_key,
      },
    })
      .then((response) => response.json())
      .then((message) => {
        if (message.success) {
          console.log('Get emoji count')
          if (emoji === '😀') {
            setHappyCount(message.count)
          } else {
            setSadCount(message.count)
          }
        }
      })
  }

  useEffect(() => {
    getEmojiCount('😀')
    getEmojiCount('👎')
    const message_interval = setInterval(() => {
      getEmojiCount('😀')
      getEmojiCount('👎')
    }, 500)
    return () => clearInterval(message_interval)
  }, [props.message_id])

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
      <div className="subtext">
        <div className="replies-emojis-container">
          <div className="message-replies_count">Replies</div>
          <div className="message-emojis-left">
            <span>
              {' '}
              😀: {happyCount} 👎: {sadCount}{' '}
            </span>
          </div>
        </div>
        <div className="message-emojis">
          <button className="emoji" onClick={() => onClickSendEmoji('😀')}>
            😀
          </button>
          <button className="emoji" onClick={() => onClickSendEmoji('👎')}>
            👎
          </button>
        </div>
      </div>
    </Comment>
  )
}

export default MessageContent
