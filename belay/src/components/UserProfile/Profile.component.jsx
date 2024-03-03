import React, { useState } from 'react'

import {
  Grid,
  Form,
  Segment,
  Header,
  Icon,
  Button,
  Message,
} from 'semantic-ui-react'

import './Profile.css'
import { Link, useNavigate } from 'react-router-dom'

const Profile = (props) => {
  let user = {
    userName: '',
    password: '',
    confirmPassword: '',
  }

  let errors = []
  const navigate = useNavigate()

  const [userState, setuserState] = useState(user)

  const [errorState, seterrorState] = useState(errors)

  const handleInput = (event) => {
    // get which part changed
    let target = event.target
    setuserState((currentState) => {
      let currentUser = { ...currentState }
      currentState[target.name] = target.value
      return currentUser
    })
  }

  const checkForm = () => {
    if (isPasswordEmpty()) {
      seterrorState((error) =>
        error.concat({ message: 'please fill in all fields' })
      )
      return false
    } else if (!checkPassword()) {
      seterrorState((error) => error.concat({ message: 'Password not match!' }))
      return false
    }
    return true
  }

  const isPasswordEmpty = () => {
    return !userState.password.length || !userState.confirmPassword.length
  }

  const checkPassword = () => {
    if (userState.password !== userState.confirmPassword) {
      return false
    }
    return true
  }

  const api_key = localStorage.getItem('chengyu_auth_key')

  const onSubmitUserName = (event) => {
    seterrorState([])
    if (userState.userName.length) {
      // Send user information to backend
      const userInfo = {
        userName: userState.userName,
        api_key: api_key,
      }

      fetch('/api/updateUserName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': api_key,
        },
        body: JSON.stringify(userInfo),
      })
        .then((response) => {
          return response.json() // Assuming the API returns JSON data
        })
        .then((user) => {
          console.log('Update successfully')
          if (user.update === true) {
            console.log('Set')
            props.setUser('null')
            props.setUser({
              userName: userState.userName,
              apiKey: localStorage.getItem('chengyu_auth_key'),
            })
            console.log(props)
          } else {
            seterrorState((error) =>
              error.concat({
                message: 'Please check userName and password again',
              })
            )
          }
        })
        .catch((error) => {
          console.error('There was a problem with your fetch operation:', error)
        })
    } else {
      console.log(errors)
    }
  }

  const onSubmitPassword = (event) => {
    seterrorState([])
    if (checkForm()) {
      // Send user information to backend
      const userInfo = {
        password: userState.password,
        api_key: api_key,
      }

      fetch('/api/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': api_key,
        },
        body: JSON.stringify(userInfo),
      })
        .then((response) => {
          return response.json() // Assuming the API returns JSON data
        })
        .then((user) => {
          console.log('Update successfully')
          if (user.update === true) {
            console.log('Password reset successfully')
          } else {
            seterrorState((error) =>
              error.concat({
                message: 'Please check userName and password again',
              })
            )
          }
        })
        .catch((error) => {
          console.error('There was a problem with your fetch operation:', error)
        })
    } else {
      console.log(errors)
    }
  }

  const formaterrors = () => {
    return errorState.map((error, index) => (
      <p key={index}> {error.message} </p>
    ))
  }

  return (
    <Grid centered className="grid-form ">
      <Grid.Column textAlign="center" style={{ maxWidth: '500px' }}>
        <Header icon as="h2">
          <Icon name="slack" onClick={() => navigate('/')} />
          Profile
        </Header>
        <Form>
          <Segment>
            <div className="container">
              <Form.Input // User Name Part
                name="userName"
                value={userState.userName}
                icon="user"
                iconPosition="left"
                onChange={handleInput}
                type="text"
                placeholder="User Name"
              />
              <Button onClick={onSubmitUserName}> Change user name </Button>
            </div>

            <div className="container">
              <div>
                <Form.Input // Password Part
                  name="password"
                  value={userState.password}
                  icon="lock"
                  iconPosition="left"
                  onChange={handleInput}
                  type="password"
                  placeholder="User password"
                />

                <Form.Input // Confirm Password Part
                  name="confirmPassword"
                  value={userState.confirmPassword}
                  icon="lock"
                  iconPosition="left"
                  onChange={handleInput}
                  type="password"
                  placeholder="User confirmPassword"
                />
              </div>
              <Button onClick={onSubmitPassword}> Change Password </Button>
            </div>
          </Segment>
        </Form>

        {errorState.length > 0 && (
          <Message error>
            <h3>Errors: </h3>
            {formaterrors()}
          </Message>
        )}

        <Message>
          Do not have an account? <Link to="/register"> Register </Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default Profile
