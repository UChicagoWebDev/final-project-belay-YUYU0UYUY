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

import './Login.css'
import { Link, useNavigate } from 'react-router-dom'

const Login = (props) => {
  let user = {
    userName: '',
    password: '',
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
    if (isFormEmpty()) {
      seterrorState((error) =>
        error.concat({ message: 'please fill in all fields' })
      )
      return false
    }
    return true
  }

  const isFormEmpty = () => {
    return !userState.userName.length || !userState.password.length
  }

  const onSubmit = (event) => {
    seterrorState([])
    if (checkForm()) {
      // Send user information to backend
      const userInfo = {
        userName: userState.userName,
        password: userState.password,
      }

      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      })
        .then((response) => {
          return response.json() // Assuming the API returns JSON data
        })
        .then((user) => {
          console.log(user)
          if (user.login === true) {
            window.localStorage.setItem('chengyu_auth_key', user.authKey)

            props.setUser({
              userName: user.userName,
              apiKey: user.authKey,
            })
            navigate('/')
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
          <Icon name="slack" />
          Sign in
        </Header>
        <Form onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input // User Name Part
              name="userName"
              value={userState.userName}
              icon="user"
              iconPosition="left"
              onChange={handleInput}
              type="text"
              placeholder="User Name"
            />
            <Form.Input // Password Part
              name="password"
              value={userState.password}
              icon="lock"
              iconPosition="left"
              onChange={handleInput}
              type="password"
              placeholder="User password"
            />
          </Segment>
          <Button>Sign in</Button>
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

export default Login
