import React from 'react'
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react'

import './UserInfo.css'

const UserInfo = () => {
  let userName = window.localStorage.getItem('userName')

  const getDropDownOptions = () => {
    return [
      {
        key: 'signout',
        text: (
          <span
            onClick={() => {
              signout()
              const state = { path: '/login' }
              const url = '/login'
              window.history.pushState(state, '', url)
              window.dispatchEvent(new Event('popstate'))
            }}>
            Sign Out
          </span>
        ),
      },
    ]
  }

  const signout = () => {
    window.localStorage.removeItem('userName')
    window.localStorage.removeItem('chengyu_auth_key')
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
                    <Header.Content>
                      {window.localStorage.getItem('userName')}
                    </Header.Content>
                  )}

                  {!userName && (
                    // userNotLogin
                    <Header.Content>Please Log in</Header.Content>
                  )}
                </span>
              }
              options={getDropDownOptions()}></Dropdown>
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}

export default UserInfo
