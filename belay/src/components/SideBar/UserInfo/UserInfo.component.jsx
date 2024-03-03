import React from 'react'
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'

import './UserInfo.css'

const UserInfo = (props) => {
  let user = props.user
  let userName = null
  if (user) {
    userName = user.userName
  }
  const navigate = useNavigate()

  const getDropDown = () => {
    return [
      {
        key: 'signinout',
        text: (
          <span
            onClick={() => {
              signinout()
            }}>
            {userName && 'Sign Out'}
            {!userName && 'Sign In'}
          </span>
        ),
      },
      {
        key: 'Profile',
        text: (
          <span
            onClick={() => {
              navigate('/profile')
            }}>
            Profile
          </span>
        ),
      },
    ]
  }

  const signinout = () => {
    if (userName) {
      window.localStorage.removeItem('chengyu_auth_key')
      props.setUser('null')
    } else {
      navigate('/login')
    }
  }

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row className="userinfo_grid_row">
          <Header inverted as="h1">
            <Icon name="slack" />
            <Header.Content>Belay</Header.Content>
          </Header>
          <Header inverted as="h3" className="userinfor_display_name">
            <Dropdown
              trigger={
                <span>
                  <Icon name="user" />
                  {userName && (
                    // userLogin
                    <Header.Content>{userName}</Header.Content>
                  )}

                  {!userName && (
                    // userLogin
                    <Header.Content>Please Log in</Header.Content>
                  )}
                </span>
              }
              options={getDropDown()}></Dropdown>
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}

export default UserInfo
